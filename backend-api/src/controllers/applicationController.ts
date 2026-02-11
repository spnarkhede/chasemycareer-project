import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';
import { AppError, asyncHandler } from '../middleware/errorHandler';

// GET /api/applications - Get all job applications for current user
export const getApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authenticated', 401);

  const { status } = req.query;

  let query = supabase
    .from('job_applications')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw new AppError(error.message, 400);

  res.json({
    status: 'success',
    data: {
      applications: data || [],
      count: data?.length || 0,
    },
  });
});

// GET /api/applications/:id - Get application by ID
export const getApplicationById = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authenticated', 401);

  const { id } = req.params;

  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .eq('id', id)
    .eq('user_id', req.user.id)
    .maybeSingle();

  if (error) throw new AppError(error.message, 400);
  if (!data) throw new AppError('Application not found', 404);

  res.json({
    status: 'success',
    data: {
      application: data,
    },
  });
});

// POST /api/applications - Create new job application
export const createApplication = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authenticated', 401);

  const applicationData = {
    ...req.body,
    user_id: req.user.id,
  };

  const { data, error } = await supabase
    .from('job_applications')
    .insert(applicationData)
    .select()
    .maybeSingle();

  if (error) throw new AppError(error.message, 400);

  res.status(201).json({
    status: 'success',
    data: {
      application: data,
    },
  });
});

// PATCH /api/applications/:id - Update job application
export const updateApplication = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authenticated', 401);

  const { id } = req.params;

  const { data, error } = await supabase
    .from('job_applications')
    .update(req.body)
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()
    .maybeSingle();

  if (error) throw new AppError(error.message, 400);
  if (!data) throw new AppError('Application not found', 404);

  res.json({
    status: 'success',
    data: {
      application: data,
    },
  });
});

// DELETE /api/applications/:id - Delete job application
export const deleteApplication = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authenticated', 401);

  const { id } = req.params;

  const { error } = await supabase
    .from('job_applications')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id);

  if (error) throw new AppError(error.message, 400);

  res.status(204).send();
});

// GET /api/applications/stats - Get application statistics
export const getApplicationStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authenticated', 401);

  const { data, error } = await supabase
    .from('job_applications')
    .select('status')
    .eq('user_id', req.user.id);

  if (error) throw new AppError(error.message, 400);

  const stats = {
    total: data?.length || 0,
    applied: data?.filter(app => app.status === 'applied').length || 0,
    interviewing: data?.filter(app => app.status === 'interviewing').length || 0,
    offered: data?.filter(app => app.status === 'offered').length || 0,
    rejected: data?.filter(app => app.status === 'rejected').length || 0,
  };

  res.json({
    status: 'success',
    data: {
      stats,
    },
  });
});
