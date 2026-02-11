import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { getSupabaseClient } from '../config/supabase';

export const getApplications = async (c: Context) => {
  try {
    const user = c.get('user');
    const supabase = getSupabaseClient(c.env);

    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', user.userId)
      .order('applied_date', { ascending: false });

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

export const createApplication = async (c: Context) => {
  try {
    const user = c.get('user');
    const applicationData = await c.req.json();
    const supabase = getSupabaseClient(c.env);

    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        ...applicationData,
        user_id: user.userId,
      })
      .select()
      .single();

    if (error) {
      throw new HTTPException(400, { message: error.message });
    }

    return c.json({
      status: 'success',
      message: 'Application created successfully',
      data,
    }, 201);
  } catch (error) {
    throw error;
  }
};

export const getApplication = async (c: Context) => {
  try {
    const user = c.get('user');
    const applicationId = c.req.param('id');
    const supabase = getSupabaseClient(c.env);

    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('id', applicationId)
      .eq('user_id', user.userId)
      .single();

    if (error) {
      throw new HTTPException(404, { message: 'Application not found' });
    }

    return c.json({
      status: 'success',
      data,
    });
  } catch (error) {
    throw error;
  }
};

export const updateApplication = async (c: Context) => {
  try {
    const user = c.get('user');
    const applicationId = c.req.param('id');
    const updates = await c.req.json();
    const supabase = getSupabaseClient(c.env);

    const { data, error } = await supabase
      .from('job_applications')
      .update(updates)
      .eq('id', applicationId)
      .eq('user_id', user.userId)
      .select()
      .single();

    if (error) {
      throw new HTTPException(400, { message: error.message });
    }

    return c.json({
      status: 'success',
      message: 'Application updated successfully',
      data,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteApplication = async (c: Context) => {
  try {
    const user = c.get('user');
    const applicationId = c.req.param('id');
    const supabase = getSupabaseClient(c.env);

    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', applicationId)
      .eq('user_id', user.userId);

    if (error) {
      throw new HTTPException(400, { message: error.message });
    }

    return c.json({
      status: 'success',
      message: 'Application deleted successfully',
    });
  } catch (error) {
    throw error;
  }
};
