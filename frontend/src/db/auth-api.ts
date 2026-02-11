import { supabase } from './supabase';
import type { SignUpData, SignInData, Profile, MfaEnrollmentData, BackupCodesData } from '@/types';
import bcrypt from 'bcryptjs';
import QRCode from 'qrcode';

const getClientIP = async (): Promise<string> => {
  try {
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const response = await fetch('https://api.ipify.org?format=json', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn('Failed to get client IP:', error);
    return 'unknown';
  }
};

const getDeviceInfo = (): string => {
  return navigator.userAgent;
};

export const authApi = {
  async checkRateLimit(email: string): Promise<boolean> {
    try {
      const ip = await getClientIP();
      const { data, error } = await supabase.rpc('check_rate_limit', {
        check_email: email,
        check_ip: ip
      });

      if (error) {
        console.error('Rate limit check error:', error);
        // Don't block login if rate limit check fails
        return false;
      }

      return data as boolean;
    } catch (error) {
      console.error('Rate limit check exception:', error);
      // Don't block login if rate limit check fails
      return false;
    }
  },

  async recordLoginAttempt(email: string, success: boolean): Promise<void> {
    try {
      const ip = await getClientIP();
      const { error } = await supabase.rpc('record_login_attempt', {
        attempt_email: email,
        attempt_ip: ip,
        attempt_success: success
      });

      if (error) {
        console.error('Failed to record login attempt:', error);
      }
    } catch (error) {
      console.error('Login attempt recording exception:', error);
      // Don't block login if recording fails
    }
  },

  async signUp(data: SignUpData): Promise<{ user: any; error: any }> {
    const isRateLimited = await this.checkRateLimit(data.email);
    if (isRateLimited) {
      return {
        user: null,
        error: { message: 'Too many failed attempts. Please try again in 15 minutes.' }
      };
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName || '',
        },
        emailRedirectTo: window.location.origin
      }
    });

    if (error) {
      await this.recordLoginAttempt(data.email, false);
      return { user: null, error };
    }

    await this.recordLoginAttempt(data.email, true);
    return { user: authData.user, error: null };
  },

  async signIn(data: SignInData): Promise<{ user: any; error: any }> {
    console.log('Starting sign-in process for:', data.email);
    
    const isRateLimited = await this.checkRateLimit(data.email);
    if (isRateLimited) {
      console.log('Rate limited:', data.email);
      return {
        user: null,
        error: { message: 'Too many failed attempts. Please try again in 15 minutes.' }
      };
    }

    console.log('Calling Supabase auth...');
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    });

    if (error) {
      console.error('Sign-in error:', error);
      await this.recordLoginAttempt(data.email, false);
      return { user: null, error };
    }

    console.log('Sign-in successful, recording session...');
    await this.recordLoginAttempt(data.email, true);

    // Record session (non-blocking)
    try {
      const ip = await getClientIP();
      const deviceInfo = getDeviceInfo();
      await supabase.from('user_sessions').insert({
        user_id: authData.user.id,
        device_info: deviceInfo,
        ip_address: ip
      });
      console.log('Session recorded successfully');
    } catch (error) {
      console.error('Failed to record session:', error);
      // Don't block login if session recording fails
    }

    console.log('Sign-in complete, returning user');
    return { user: authData.user, error: null };
  },

  async signInWithGoogle(): Promise<{ url: string | null; error: any }> {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    });

    if (error) {
      return { url: null, error };
    }

    return { url: data.url, error: null };
  },

  async signOut(): Promise<{ error: any }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser(): Promise<{ user: any; profile: Profile | null; error: any }> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { user: null, profile: null, error: userError };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    return { user, profile, error: profileError };
  },

  async updatePassword(newPassword: string): Promise<{ error: any }> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    return { error };
  },

  async updateEmail(newEmail: string): Promise<{ error: any }> {
    const { error } = await supabase.auth.updateUser({
      email: newEmail
    });

    return { error };
  },

  async reauthenticate(password: string): Promise<{ success: boolean; error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return { success: false, error: { message: 'No user found' } };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: password
    });

    return { success: !error, error };
  },

  async enrollMfa(): Promise<{ data: MfaEnrollmentData | null; error: any }> {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp'
    });

    if (error || !data) {
      return { data: null, error };
    }

    const qrCode = await QRCode.toDataURL(data.totp.uri);

    return {
      data: {
        qrCode,
        secret: data.totp.secret
      },
      error: null
    };
  },

  async verifyMfaEnrollment(code: string, factorId: string): Promise<{ success: boolean; error: any }> {
    const { data, error } = await supabase.auth.mfa.challenge({
      factorId
    });

    if (error || !data) {
      return { success: false, error };
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: data.id,
      code
    });

    return { success: !verifyError, error: verifyError };
  },

  async verifyMfa(code: string, factorId: string): Promise<{ success: boolean; error: any }> {
    const { data, error } = await supabase.auth.mfa.challenge({
      factorId
    });

    if (error || !data) {
      return { success: false, error };
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: data.id,
      code
    });

    return { success: !verifyError, error: verifyError };
  },

  async unenrollMfa(factorId: string): Promise<{ error: any }> {
    const { error } = await supabase.auth.mfa.unenroll({
      factorId
    });

    return { error };
  },

  async getMfaFactors(): Promise<{ factors: any[]; error: any }> {
    const { data, error } = await supabase.auth.mfa.listFactors();

    if (error) {
      return { factors: [], error };
    }

    return { factors: data.totp || [], error: null };
  },

  async generateBackupCodes(): Promise<{ data: BackupCodesData | null; error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: { message: 'No user found' } };
    }

    const codes: string[] = [];
    const codeHashes: string[] = [];

    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
      const hash = await bcrypt.hash(code, 10);
      codeHashes.push(hash);
    }

    const backupCodes = codeHashes.map(hash => ({
      user_id: user.id,
      code_hash: hash,
      used: false
    }));

    const { error } = await supabase
      .from('mfa_backup_codes')
      .insert(backupCodes);

    if (error) {
      return { data: null, error };
    }

    return { data: { codes }, error: null };
  },

  async verifyBackupCode(code: string): Promise<{ success: boolean; error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: { message: 'No user found' } };
    }

    const { data: backupCodes, error: fetchError } = await supabase
      .from('mfa_backup_codes')
      .select('*')
      .eq('user_id', user.id)
      .eq('used', false);

    if (fetchError || !backupCodes) {
      return { success: false, error: fetchError };
    }

    for (const backupCode of backupCodes) {
      const isValid = await bcrypt.compare(code, backupCode.code_hash);
      if (isValid) {
        const { error: updateError } = await supabase
          .from('mfa_backup_codes')
          .update({ used: true, used_at: new Date().toISOString() })
          .eq('id', backupCode.id);

        if (updateError) {
          return { success: false, error: updateError };
        }

        return { success: true, error: null };
      }
    }

    return { success: false, error: { message: 'Invalid backup code' } };
  },

  async getUserSessions(): Promise<{ sessions: any[]; error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { sessions: [], error: { message: 'No user found' } };
    }

    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('last_activity', { ascending: false });

    return { sessions: Array.isArray(data) ? data : [], error };
  },

  async deleteSession(sessionId: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('user_sessions')
      .delete()
      .eq('id', sessionId);

    return { error };
  },

  async deleteAccount(): Promise<{ error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: { message: 'No user found' } };
    }

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (error) {
      return { error };
    }

    const { error: signOutError } = await supabase.auth.signOut();
    return { error: signOutError };
  },

  async getRecentLoginAttempts(): Promise<{ attempts: any[]; error: any }> {
    const { data, error } = await supabase.rpc('get_recent_login_attempts', {
      limit_count: 100
    });

    if (error) {
      return { attempts: [], error };
    }

    return { attempts: Array.isArray(data) ? data : [], error: null };
  },

  async updateProfile(updates: Partial<Profile>): Promise<{ error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: { message: 'No user found' } };
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    return { error };
  },

  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<{ error: any }> {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    return { error };
  },

  async getAllProfiles(): Promise<{ profiles: Profile[]; error: any }> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    return { profiles: Array.isArray(data) ? data : [], error };
  },

  async requestPasswordReset(email: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Password reset request error:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Password reset request exception:', error);
      return { error };
    }
  },

  async resetPassword(newPassword: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Password reset error:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Password reset exception:', error);
      return { error };
    }
  },

  async verifyPasswordResetToken(): Promise<{ valid: boolean; error: any }> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        return { valid: false, error: error || new Error('No valid session') };
      }

      return { valid: true, error: null };
    } catch (error) {
      console.error('Token verification exception:', error);
      return { valid: false, error };
    }
  }
};
