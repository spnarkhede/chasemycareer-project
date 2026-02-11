import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { getSupabaseClient } from '../config/supabase';

export const getTasks = async (c: Context) => {
  try {
    const user = c.get('user');
    const supabase = getSupabaseClient(c.env);

    const { data, error } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('user_id', user.userId)
      .order('day_number', { ascending: true });

    if (error) {
      throw new HTTPException(400, { message: error.message });
    }

    return c.json({
      status: 'success',
      data,
    });
  } catch (error) {
    throw error;
  }
};

export const getTask = async (c: Context) => {
  try {
    const user = c.get('user');
    const taskId = c.req.param('id');
    const supabase = getSupabaseClient(c.env);

    const { data, error } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('id', taskId)
      .eq('user_id', user.userId)
      .single();

    if (error) {
      throw new HTTPException(404, { message: 'Task not found' });
    }

    return c.json({
      status: 'success',
      data,
    });
  } catch (error) {
    throw error;
  }
};

export const updateTask = async (c: Context) => {
  try {
    const user = c.get('user');
    const taskId = c.req.param('id');
    const updates = await c.req.json();
    const supabase = getSupabaseClient(c.env);

    const { data, error } = await supabase
      .from('daily_tasks')
      .update(updates)
      .eq('id', taskId)
      .eq('user_id', user.userId)
      .select()
      .single();

    if (error) {
      throw new HTTPException(400, { message: error.message });
    }

    return c.json({
      status: 'success',
      message: 'Task updated successfully',
      data,
    });
  } catch (error) {
    throw error;
  }
};

export const completeTask = async (c: Context) => {
  try {
    const user = c.get('user');
    const taskId = c.req.param('id');
    const supabase = getSupabaseClient(c.env);

    const { data, error } = await supabase
      .from('daily_tasks')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .eq('user_id', user.userId)
      .select()
      .single();

    if (error) {
      throw new HTTPException(400, { message: error.message });
    }

    return c.json({
      status: 'success',
      message: 'Task marked as complete',
      data,
    });
  } catch (error) {
    throw error;
  }
};
