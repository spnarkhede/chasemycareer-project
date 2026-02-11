import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

// Simple in-memory rate limiter for Workers
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = async (c: Context, next: Next) => {
  const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;

  // Clean up old entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }

  // Get or create rate limit entry
  let entry = rateLimitStore.get(ip);
  
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(ip, entry);
  }

  // Increment count
  entry.count++;

  // Check if limit exceeded
  if (entry.count > maxRequests) {
    throw new HTTPException(429, {
      message: 'Too many requests from this IP, please try again later.',
    });
  }

  // Set rate limit headers
  c.header('X-RateLimit-Limit', maxRequests.toString());
  c.header('X-RateLimit-Remaining', Math.max(0, maxRequests - entry.count).toString());
  c.header('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());

  await next();
};
