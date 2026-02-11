import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

// Import routes
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import applicationRoutes from './routes/applicationRoutes';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';

// Define environment bindings
export interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_KEY: string;
  JWT_SECRET: string;
  FRONTEND_URL: string;
  NODE_ENV: string;
  API_VERSION: string;
  JWT_EXPIRES_IN: string;
}

// Create Hono app
const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use('*', logger());
app.use('*', prettyJSON());

// CORS middleware
app.use('*', async (c, next) => {
  const corsMiddleware = cors({
    origin: (origin) => {
      const allowedOrigins = [
        c.env.FRONTEND_URL,
        'http://localhost:5173',
        'http://localhost:3000',
      ].filter(Boolean);
      
      return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  });
  
  return corsMiddleware(c, next);
});

// Rate limiting
app.use('/api/*', rateLimiter);

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'success',
    message: 'ChaseMyCareer API is running on Cloudflare Workers',
    timestamp: new Date().toISOString(),
    version: c.env.API_VERSION || 'v1',
    environment: c.env.NODE_ENV || 'production',
  });
});

// API routes
const apiVersion = 'v1';
app.route(`/api/${apiVersion}/auth`, authRoutes);
app.route(`/api/${apiVersion}/users`, userRoutes);
app.route(`/api/${apiVersion}/tasks`, taskRoutes);
app.route(`/api/${apiVersion}/applications`, applicationRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({
    status: 'error',
    message: 'Route not found',
    path: c.req.path,
  }, 404);
});

// Error handler
app.onError(errorHandler);

// Export for Cloudflare Workers
export default app;
