import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { getSupabaseClient } from '../config/supabase';

export const getProfile = async (c: Context) => {
  try {
    const user = c.get('user');
    const supabase = getSupabaseClient(c.env);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.userId)
      .single();

    if (error) {
      throw new HTTPException(404, { message: 'Profile not found' });
    }

    return c.json({
      status: 'success',
      data,
    });
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (c: Context) => {
  try {
    const user = c.get('user');
    const updates = await c.req.json();
    const supabase = getSupabaseClient(c.env);

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.userId)
      .select()
      .single();

    if (error) {
      throw new HTTPException(400, { message: error.message });
    }

    return c.json({
      status: 'success',
      message: 'Profile updated successfully',
      data,
    });
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async (c: Context) => {
  try {
    const supabase = getSupabaseClient(c.env);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

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
