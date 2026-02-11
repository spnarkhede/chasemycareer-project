import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';
import { AppError, asyncHandler } from '../middleware/errorHandler';

// GET /api/tasks - Get all tasks for current user
export const getTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authenticated', 401);

  const { day_number } = req.query;

  let query = supabase
    .from('daily_tasks')
    .select('*')
    .eq('user_id', req.user.id)
    .order('day_number', { ascending: true });

  if (day_number) {
    query = query.eq('day_number', Number(day_number));
  }

  const { data, error } = await query;

  if (error) throw new AppError(error.message, 400);

  res.json({
    status: 'success',
    data: {
      tasks: data || [],
      count: data?.length || 0,
    },
  });
});

// GET /api/tasks/:id - Get task by ID
export const getTaskById = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authenticated', 401);

  const { id } = req.params;

  const { data, error } = await supabase
    .from('daily_tasks')
    .select('*')
    .eq('id', id)
    .eq('user_id', req.user.id)
    .maybeSingle();

  if (error) throw new AppError(error.message, 400);
  if (!data) throw new AppError('Task not found', 404);

  res.json({
    status: 'success',
    data: {
      task: data,
    },
  });
});

// POST /api/tasks - Create new task
export const createTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authenticated', 401);

  const taskData = {
    ...req.body,
    user_id: req.user.id,
  };

  const { data, error } = await supabase
    .from('daily_tasks')
    .insert(taskData)
    .select()
    .maybeSingle();

  if (error) throw new AppError(error.message, 400);

  res.status(201).json({
    status: 'success',
    data: {
      task: data,
    },
  });
});

// PATCH /api/tasks/:id - Update task
export const updateTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authenticated', 401);

  const { id } = req.params;

  const { data, error } = await supabase
    .from('daily_tasks')
    .update(req.body)
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()
    .maybeSingle();

  if (error) throw new AppError(error.message, 400);
  if (!data) throw new AppError('Task not found', 404);

  res.json({
    status: 'success',
    data: {
      task: data,
    },
  });
});

// PATCH /api/tasks/:id/toggle - Toggle task completion
export const toggleTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authenticated', 401);

  const { id } = req.params;
  const { completed } = req.body;

  const { data, error } = await supabase
    .from('daily_tasks')
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()
    .maybeSingle();

  if (error) throw new AppError(error.message, 400);
  if (!data) throw new AppError('Task not found', 404);

  res.json({
    status: 'success',
    data: {
      task: data,
    },
  });
});

// DELETE /api/tasks/:id - Delete task
export const deleteTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new AppError('Not authenticated', 401);

  const { id } = req.params;

  const { error } = await supabase
    .from('daily_tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id);

  if (error) throw new AppError(error.message, 400);

  res.status(204).send();
});
