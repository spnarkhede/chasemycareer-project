import { Request, Response } from 'express';
import { supabaseAnon } from '../config/supabase';
import { AppError, asyncHandler } from '../middleware/errorHandler';

// POST /api/auth/signup - Register new user
export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, full_name } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const { data, error } = await supabaseAnon.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: full_name || '',
      },
    },
  });

  if (error) throw new AppError(error.message, 400);

  res.status(201).json({
    status: 'success',
    data: {
      user: data.user,
      session: data.session,
    },
  });
});

// POST /api/auth/login - Login user
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const { data, error } = await supabaseAnon.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new AppError(error.message, 401);

  res.json({
    status: 'success',
    data: {
      user: data.user,
      session: data.session,
    },
  });
});

// POST /api/auth/logout - Logout user
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    await supabaseAnon.auth.signOut();
  }

  res.json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

// POST /api/auth/refresh - Refresh access token
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    throw new AppError('Refresh token is required', 400);
  }

  const { data, error } = await supabaseAnon.auth.refreshSession({
    refresh_token,
  });

  if (error) throw new AppError(error.message, 401);

  res.json({
    status: 'success',
    data: {
      session: data.session,
    },
  });
});

// POST /api/auth/forgot-password - Send password reset email
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  const { error } = await supabaseAnon.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
  });

  if (error) throw new AppError(error.message, 400);

  res.json({
    status: 'success',
    message: 'Password reset email sent',
  });
});

// POST /api/auth/reset-password - Reset password with token
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { password } = req.body;
  const authHeader = req.headers.authorization;

  if (!password) {
    throw new AppError('New password is required', 400);
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Reset token is required', 401);
  }

  const token = authHeader.split(' ')[1];

  const { error } = await supabaseAnon.auth.updateUser({
    password,
  });

  if (error) throw new AppError(error.message, 400);

  res.json({
    status: 'success',
    message: 'Password reset successfully',
  });
});
