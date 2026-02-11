import { supabase } from '@/db/supabase';

export class OAuthService {
  private static readonly GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
  private static readonly GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
  
  private static readonly SCOPES = [
    'openid',
    'email',
    'profile',
    'https://www.googleapis.com/auth/calendar.events'
  ];

  private static generateRandomString(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    return Array.from(randomValues)
      .map(v => charset[v % charset.length])
      .join('');
  }

  private static async sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return await crypto.subtle.digest('SHA-256', data);
  }

  private static base64UrlEncode(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  static async generatePKCEChallenge(): Promise<{ verifier: string; challenge: string }> {
    const verifier = this.generateRandomString(128);
    const hashed = await this.sha256(verifier);
    const challenge = this.base64UrlEncode(hashed);
    
    sessionStorage.setItem('pkce_verifier', verifier);
    
    return { verifier, challenge };
  }

  static async initiateGoogleOAuth(): Promise<string> {
    const { challenge } = await this.generatePKCEChallenge();
    const state = this.generateRandomString(32);
    
    sessionStorage.setItem('oauth_state', state);
    
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;
    
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: this.SCOPES.join(' '),
      state: state,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      access_type: 'offline',
      prompt: 'consent'
    });

    return `${this.GOOGLE_AUTH_URL}?${params.toString()}`;
  }

  static validateCallback(state: string, code: string): boolean {
    const storedState = sessionStorage.getItem('oauth_state');
    
    if (!storedState || storedState !== state) {
      console.error('State mismatch - possible CSRF attack');
      return false;
    }
    
    if (!code) {
      console.error('No authorization code received');
      return false;
    }
    
    return true;
  }

  static getStoredVerifier(): string | null {
    return sessionStorage.getItem('pkce_verifier');
  }

  static clearOAuthSession(): void {
    sessionStorage.removeItem('pkce_verifier');
    sessionStorage.removeItem('oauth_state');
  }

  static async storeTokens(
    accessToken: string,
    refreshToken: string | null,
    expiresIn: number,
    scopes: string[]
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No authenticated user');
    }

    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    const { error } = await supabase
      .from('oauth_tokens')
      .upsert({
        user_id: user.id,
        provider: 'google',
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'Bearer',
        expires_at: expiresAt,
        scopes: scopes,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,provider'
      });

    if (error) {
      throw error;
    }
  }

  static async getStoredToken(): Promise<{ accessToken: string; expiresAt: string } | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('oauth_tokens')
      .select('access_token, expires_at, refresh_token')
      .eq('user_id', user.id)
      .eq('provider', 'google')
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const expiresAt = new Date(data.expires_at);
    const now = new Date();

    if (expiresAt <= now && data.refresh_token) {
      return await this.refreshAccessToken(data.refresh_token);
    }

    return {
      accessToken: data.access_token,
      expiresAt: data.expires_at
    };
  }

  static async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; expiresAt: string } | null> {
    try {
      const { data, error } = await supabase.functions.invoke('refresh-google-token', {
        body: { refresh_token: refreshToken }
      });

      if (error) {
        const errorMsg = await error?.context?.text();
        console.error('Token refresh error:', errorMsg);
        return null;
      }

      if (data?.access_token && data?.expires_in) {
        await this.storeTokens(
          data.access_token,
          refreshToken,
          data.expires_in,
          this.SCOPES
        );

        return {
          accessToken: data.access_token,
          expiresAt: new Date(Date.now() + data.expires_in * 1000).toISOString()
        };
      }

      return null;
    } catch (err) {
      console.error('Failed to refresh token:', err);
      return null;
    }
  }

  static async revokeAccess(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return;
    }

    await supabase
      .from('oauth_tokens')
      .delete()
      .eq('user_id', user.id)
      .eq('provider', 'google');
  }
}
