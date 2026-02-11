import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { getSupabaseClient } from '../config/supabase';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// Extend Context to include user
declare module 'hono' {
  interface ContextVariableMap {
    user: JWTPayload;
  }
}

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HTTPException(401, { message: 'No token provided' });
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    const isValid = await jwt.verify(token, c.env.JWT_SECRET);
    
    if (!isValid) {
      throw new HTTPException(401, { message: 'Invalid token' });
    }

    const decoded = jwt.decode(token);
    
    if (!decoded || !decoded.payload) {
      throw new HTTPException(401, { message: 'Invalid token payload' });
    }

    const payload = decoded.payload as JWTPayload;

    // Verify user exists in Supabase
    const supabase = getSupabaseClient(c.env);
    const { data: user, error } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('id', payload.userId)
      .single();

    if (error || !user) {
      throw new HTTPException(401, { message: 'User not found' });
    }

    // Set user in context
    c.set('user', {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await next();
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    throw new HTTPException(401, { message: 'Authentication failed' });
  }
};

export const adminMiddleware = async (c: Context, next: Next) => {
  const user = c.get('user');

  if (!user || user.role !== 'admin') {
    throw new HTTPException(403, { message: 'Admin access required' });
  }

  await next();
};
