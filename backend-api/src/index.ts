import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import applicationRoutes from './routes/applicationRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Security middleware
app.use(helmet());

// CORS middleware
app.use(corsMiddleware);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(`/api/${API_VERSION}`, limiter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'ChaseMyCareer API is running',
    timestamp: new Date().toISOString(),
    version: API_VERSION,
  });
});

// API routes
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/tasks`, taskRoutes);
app.use(`/api/${API_VERSION}/applications`, applicationRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 ChaseMyCareer Backend API                           ║
║                                                           ║
║   Environment: ${process.env.NODE_ENV?.toUpperCase() || 'DEVELOPMENT'}                                    ║
║   Port: ${PORT}                                              ║
║   API Version: ${API_VERSION}                                        ║
║                                                           ║
║   Endpoints:                                              ║
║   • Health: http://localhost:${PORT}/health                  ║
║   • API: http://localhost:${PORT}/api/${API_VERSION}                  ║
║                                                           ║
║   Routes:                                                 ║
║   • /api/${API_VERSION}/auth      - Authentication                ║
║   • /api/${API_VERSION}/users     - User management               ║
║   • /api/${API_VERSION}/tasks     - Daily tasks                   ║
║   • /api/${API_VERSION}/applications - Job applications          ║
║                                                           ║
║   Status: ✅ READY                                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
