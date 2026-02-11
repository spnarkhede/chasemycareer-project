import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';
import { AppError, asyncHandler } from '../middleware/errorHandler';

// GET /api/users - Get all users (admin only)
export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url, role, created_at')
    .order('created_at', { ascending: false });

  if (error) throw new AppError(error.message, 400);

  res.json({
    status: 'success',
    data: {
      users: data || [],
      count: data?.length || 0,
    },
  });
});

// GET /api/users/:id - Get user by ID
export const getUserById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url, role, created_at, updated_at')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new AppError(error.message, 400);
  if (!data) throw new AppError('User not found', 404);

  res.json({
    status: 'success',
    data: {
      user: data,
    },
  });
});

// GET /api/users/me - Get current user profile
export const getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authenticated', 401);

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .maybeSingle();

  if (error) throw new AppError(error.message, 400);
  if (!data) throw new AppError('Profile not found', 404);

  res.json({
    status: 'success',
    data: {
      user: data,
    },
  });
});

// PATCH /api/users/me - Update current user profile
export const updateCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authenticated', 401);

  const { full_name, avatar_url } = req.body;

  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name,
      avatar_url,
      updated_at: new Date().toISOString(),
    })
    .eq('id', req.user.id)
    .select()
    .maybeSingle();

  if (error) throw new AppError(error.message, 400);

  res.json({
    status: 'success',
    data: {
      user: data,
    },
  });
});
