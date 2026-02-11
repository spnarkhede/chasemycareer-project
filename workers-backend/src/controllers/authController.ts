import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import jwt from '@tsndr/cloudflare-worker-jwt';
import bcrypt from 'bcryptjs';
import { getSupabaseClient, getSupabaseAdmin } from '../config/supabase';

export const signup = async (c: Context) => {
  try {
    const { email, password, fullName } = await c.req.json();

    if (!email || !password) {
      throw new HTTPException(400, { message: 'Email and password are required' });
    }

    const supabase = getSupabaseAdmin(c.env);

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      throw new HTTPException(400, { message: authError.message });
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name: fullName || null,
        role: 'user',
      });

    if (profileError) {
      throw new HTTPException(400, { message: profileError.message });
    }

    // Generate JWT token
    const token = await jwt.sign(
      {
        userId: authData.user.id,
        email: authData.user.email,
        role: 'user',
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
      },
      c.env.JWT_SECRET
    );

    return c.json({
      status: 'success',
      message: 'User created successfully',
      data: {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          fullName,
          role: 'user',
        },
        token,
      },
    }, 201);
  } catch (error) {
    throw error;
  }
};

export const login = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      throw new HTTPException(400, { message: 'Email and password are required' });
    }

    const supabase = getSupabaseClient(c.env);

    // Sign in with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      throw new HTTPException(401, { message: 'Invalid credentials' });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      throw new HTTPException(404, { message: 'User profile not found' });
    }

    // Generate JWT token
    const token = await jwt.sign(
      {
        userId: authData.user.id,
        email: authData.user.email,
        role: profile.role,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
      },
      c.env.JWT_SECRET
    );

    return c.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name,
          role: profile.role,
        },
        token,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const logout = async (c: Context) => {
  return c.json({
    status: 'success',
    message: 'Logout successful',
  });
};

export const refreshToken = async (c: Context) => {
  try {
    const { refreshToken } = await c.req.json();

    if (!refreshToken) {
      throw new HTTPException(400, { message: 'Refresh token is required' });
    }

    const supabase = getSupabaseClient(c.env);

    // Refresh session with Supabase
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      throw new HTTPException(401, { message: 'Invalid refresh token' });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    // Generate new JWT token
    const token = await jwt.sign(
      {
        userId: data.user.id,
        email: data.user.email,
        role: profile?.role || 'user',
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
      },
      c.env.JWT_SECRET
    );

    return c.json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: {
        token,
        refreshToken: data.session?.refresh_token,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (c: Context) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      throw new HTTPException(400, { message: 'Email is required' });
    }

    const supabase = getSupabaseClient(c.env);

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${c.env.FRONTEND_URL}/reset-password`,
    });

    if (error) {
      throw new HTTPException(400, { message: error.message });
    }

    return c.json({
      status: 'success',
      message: 'Password reset email sent',
    });
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (c: Context) => {
  try {
    const { token, password } = await c.req.json();

    if (!token || !password) {
      throw new HTTPException(400, { message: 'Token and password are required' });
    }

    const supabase = getSupabaseClient(c.env);

    // Update password
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw new HTTPException(400, { message: error.message });
    }

    return c.json({
      status: 'success',
      message: 'Password reset successful',
    });
  } catch (error) {
    throw error;
  }
};
