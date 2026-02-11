import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';

export const errorHandler = (err: Error, c: Context) => {
  console.error('Error:', err);

  if (err instanceof HTTPException) {
    return c.json({
      status: 'error',
      message: err.message,
    }, err.status);
  }

  // Handle specific error types
  if (err.message.includes('JWT')) {
    return c.json({
      status: 'error',
      message: 'Invalid or expired token',
    }, 401);
  }

  if (err.message.includes('not found')) {
    return c.json({
      status: 'error',
      message: err.message,
    }, 404);
  }

  // Default error response
  return c.json({
    status: 'error',
    message: c.env?.NODE_ENV === 'development' ? err.message : 'Internal server error',
    ...(c.env?.NODE_ENV === 'development' && { stack: err.stack }),
  }, 500);
};
