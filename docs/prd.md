# ChaseMyCareer - Refactored Requirements Document (Frontend-Backend Separation)

## 1. Application Overview

### 1.1 Application Name
ChaseMyCareer

### 1.2 Application Description
A comprehensive 50-day job search acceleration platform that guides users through a structured career development program. The platform features dual-role access (User & Admin), OAuth authentication, progress tracking, application management, resume/cover letter builders, and administrative oversight capabilities.

**Architecture Update**: The application is now structured as two independent repositories:
- **Frontend Repository**: React + Vite + TypeScript application
- **Backend Repository**: Node.js + Express + TypeScript API server

Both repositories can be developed, tested, and deployed independently while communicating via REST API.

### 1.3 Core Features
- **Authentication System**: Google OAuth, LinkedIn OAuth, Email/Password registration and login
- **User Dashboard**: 50-day progress tracker, application management, resume builder, cover letter generator
- **Admin Dashboard**: User management, participant analytics, account access, messaging system
- **Database**: Cloudflare D1 (primary) + Supabase (supplementary storage)
- **Progress Tracking**: Day-by-day curriculum with specific topics and completion status
- **Testing Suite**: Unit tests, integration tests, manual testing procedures
- **CI/CD Pipeline**: GitHub Actions automated deployment

---

## 2. Project Structure Overview

### 2.1 Repository Architecture

The project is split into two independent repositories:

**Frontend Repository Structure:**
```
frontend/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── README.md
├── public/
│   └── assets/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── vite-env.d.ts
│   ├── api/
│   │   ├── api.ts
│   │   ├── auth.api.ts
│   │   ├── tasks.api.ts
│   │   ├── applications.api.ts
│   │   ├── resumes.api.ts
│   │   ├── coverLetters.api.ts
│   │   └── admin.api.ts
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── OAuthButtons.tsx
│   │   ├── dashboard/
│   │   │   ├── DayCalendar.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── applications/
│   │   │   ├── ApplicationList.tsx
│   │   │   └── ApplicationForm.tsx
│   │   ├── resume/
│   │   │   └── ResumeBuilder.tsx
│   │   ├── coverLetter/
│   │   │   └── CoverLetterBuilder.tsx
│   │   └── admin/
│   │       ├── StatsOverview.tsx
│   │       ├── UserTable.tsx
│   │       ├── UserDetailModal.tsx
│   │       ├── MessageComposer.tsx
│   │       └── AnalyticsCharts.tsx
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Applications.tsx
│   │   ├── Resume.tsx
│   │   ├── CoverLetter.tsx
│   │   ├── Profile.tsx
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       ├── UserManagement.tsx
│   │       ├── Messaging.tsx
│   │       └── Analytics.tsx
│   ├── routes/
│   │   └── AppRoutes.tsx
│   ├── types/
│   │   ├── user.types.ts
│   │   ├── task.types.ts
│   │   ├── application.types.ts
│   │   └── api.types.ts
│   ├── utils/
│   │   ├── auth.utils.ts
│   │   └── validation.utils.ts
│   └── styles/
│       └── global.css
└── tests/
    └── unit/
```

**Backend Repository Structure:**
```
backend/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
├── schema.sql
├── src/
│   ├── index.ts
│   ├── config/
│   │   ├── database.ts
│   │   ├── supabase.ts
│   │   └── env.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── cors.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   └── validation.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── tasks.routes.ts
│   │   ├── applications.routes.ts
│   │   ├── resumes.routes.ts
│   │   ├── coverLetters.routes.ts
│   │   └── admin.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── tasks.controller.ts
│   │   ├── applications.controller.ts
│   │   ├── resumes.controller.ts
│   │   ├── coverLetters.controller.ts
│   │   └── admin.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── tasks.service.ts
│   │   ├── applications.service.ts
│   │   ├── resumes.service.ts
│   │   ├── coverLetters.service.ts
│   │   └── admin.service.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── task.model.ts
│   │   ├── application.model.ts
│   │   └── resume.model.ts
│   ├── utils/
│   │   ├── jwt.utils.ts
│   │   ├── password.utils.ts
│   │   ├── validation.utils.ts
│   │   └── curriculum.utils.ts
│   └── types/
│       ├── express.d.ts
│       └── api.types.ts
└── tests/
    ├── unit/
    └── integration/
```

---

## 3. Frontend Repository Setup

### 3.1 Initial Frontend Project Creation

**Step 1: Create React + Vite + TypeScript Project**
```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
```

**Step 2: Install Dependencies**
```bash
npm install react-router-dom axios
npm install --save-dev @types/react-router-dom
```

### 3.2 Frontend Configuration Files

**package.json**
```json
{
  \"name\": \"chasemycareer-frontend\",
  \"description\": \"ChaseMyCareer Frontend - React Application\",
  \"version\": \"1.0.0\",
  \"type\": \"module\",
  \"scripts\": {
    \"dev\": \"vite\",
    \"build\": \"tsc && vite build\",
    \"preview\": \"vite preview\",
    \"lint\": \"eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0\",
    \"test\": \"vitest run\",
    \"test:watch\": \"vitest watch\"
  },
  \"dependencies\": {
    \"react\": \"^18.2.0\",
    \"react-dom\": \"^18.2.0\",
    \"react-router-dom\": \"^6.20.0\",
    \"axios\": \"^1.6.0\"
  },
  \"devDependencies\": {
    \"@types/react\": \"^18.2.43\",
    \"@types/react-dom\": \"^18.2.17\",
    \"@types/react-router-dom\": \"^5.3.3\",
    \"@typescript-eslint/eslint-plugin\": \"^6.14.0\",
    \"@typescript-eslint/parser\": \"^6.14.0\",
    \"@vitejs/plugin-react\": \"^4.2.1\",
    \"eslint\": \"^8.55.0\",
    \"eslint-plugin-react-hooks\": \"^4.6.0\",
    \"eslint-plugin-react-refresh\": \"^0.4.5\",
    \"typescript\": \"^5.2.2\",
    \"vite\": \"^5.0.8\",
    \"vitest\": \"^1.0.0\"
  }
}
```

**tsconfig.json**
```json
{
  \"compilerOptions\": {
    \"target\": \"ES2020\",
    \"useDefineForClassFields\": true,
    \"lib\": [\"ES2020\", \"DOM\", \"DOM.Iterable\"],
    \"module\": \"ESNext\",
    \"skipLibCheck\": true,
    \"moduleResolution\": \"bundler\",
    \"allowImportingTsExtensions\": true,
    \"resolveJsonModule\": true,
    \"isolatedModules\": true,
    \"noEmit\": true,
    \"jsx\": \"react-jsx\",
    \"strict\": true,
    \"noUnusedLocals\": true,
    \"noUnusedParameters\": true,
    \"noFallthroughCasesInSwitch\": true,
    \"baseUrl\": \".\",
    \"paths\": {
      \"@/*\": [\"./src/*\"]
    }
  },
  \"include\": [\"src\"],
  \"references\": [{ \"path\": \"./tsconfig.node.json\" }]
}
```

**vite.config.ts**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

**.env.example**
```
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_KEY=your-supabase-anon-key
```

### 3.3 Frontend API Service Layer

**src/api/api.ts** (Centralized API Client)
```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public get<T>(url: string, params?: any): Promise<T> {
    return this.client.get<T>(url, { params }).then((res) => res.data);
  }

  public post<T>(url: string, data?: any): Promise<T> {
    return this.client.post<T>(url, data).then((res) => res.data);
  }

  public put<T>(url: string, data?: any): Promise<T> {
    return this.client.put<T>(url, data).then((res) => res.data);
  }

  public delete<T>(url: string): Promise<T> {
    return this.client.delete<T>(url).then((res) => res.data);
  }
}

export const apiClient = new ApiClient();
```

**src/api/auth.api.ts**
```typescript
import { apiClient } from './api';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/api.types';

export const authApi = {
  register: (credentials: RegisterCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/api/auth/register', credentials);
  },

  login: (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/api/auth/login', credentials);
  },

  googleAuth: (): void => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  },

  linkedinAuth: (): void => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/linkedin`;
  },

  getCurrentUser: (): Promise<User> => {
    return apiClient.get<User>('/api/auth/me');
  },
};
```

**src/api/tasks.api.ts**
```typescript
import { apiClient } from './api';
import { Task, UpdateTaskRequest } from '@/types/api.types';

export const tasksApi = {
  getAllTasks: (): Promise<Task[]> => {
    return apiClient.get<Task[]>('/api/tasks');
  },

  updateTask: (taskId: string, data: UpdateTaskRequest): Promise<Task> => {
    return apiClient.put<Task>(`/api/tasks/${taskId}`, data);
  },
};
```

**src/api/applications.api.ts**
```typescript
import { apiClient } from './api';
import { Application, CreateApplicationRequest, UpdateApplicationRequest } from '@/types/api.types';

export const applicationsApi = {
  getApplications: (params?: { page?: number; limit?: number; status?: string }): Promise<Application[]> => {
    return apiClient.get<Application[]>('/api/applications', params);
  },

  createApplication: (data: CreateApplicationRequest): Promise<Application> => {
    return apiClient.post<Application>('/api/applications', data);
  },

  updateApplication: (id: string, data: UpdateApplicationRequest): Promise<Application> => {
    return apiClient.put<Application>(`/api/applications/${id}`, data);
  },

  deleteApplication: (id: string): Promise<void> => {
    return apiClient.delete<void>(`/api/applications/${id}`);
  },
};
```

### 3.4 Frontend Type Definitions

**src/types/api.types.ts**
```typescript
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Task {
  id: string;
  user_id: string;
  day_number: number;
  topic: string;
  description: string;
  completed: number;
  completed_at: string | null;
}

export interface UpdateTaskRequest {
  completed: boolean;
}

export interface Application {
  id: string;
  user_id: string;
  company_name: string;
  position_title: string;
  job_url: string;
  status: string;
  applied_date: string;
  notes: string;
  created_at: string;
}

export interface CreateApplicationRequest {
  company_name: string;
  position_title: string;
  job_url?: string;
  status: string;
  notes?: string;
}

export interface UpdateApplicationRequest {
  status?: string;
  notes?: string;
}
```

### 3.5 Frontend Example Component

**src/pages/Dashboard.tsx**
```typescript
import React, { useEffect, useState } from 'react';
import { tasksApi } from '@/api/tasks.api';
import { Task } from '@/types/api.types';
import TaskCard from '@/components/dashboard/TaskCard';
import ProgressBar from '@/components/dashboard/ProgressBar';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksApi.getAllTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    try {
      await tasksApi.updateTask(taskId, { completed });
      fetchTasks();
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const completedCount = tasks.filter((t) => t.completed === 1).length;
  const progressPercentage = (completedCount / 50) * 100;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className=\"dashboard\">
      <h1>50-Day Career Development Program</h1>
      <ProgressBar percentage={progressPercentage} />
      <div className=\"tasks-grid\">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onToggle={handleTaskToggle} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
```

### 3.6 Frontend README.md

```markdown
# ChaseMyCareer Frontend

React + Vite + TypeScript frontend application for ChaseMyCareer platform.

## Prerequisites

- Node.js 18+
- npm or yarn

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <frontend-repo-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your backend API URL:
   ```
   VITE_API_URL=http://localhost:5000
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_KEY=your-supabase-anon-key
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

6. Open browser at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run test` - Run tests

## Project Structure

- `src/api/` - API service layer
- `src/components/` - React components
- `src/pages/` - Page components
- `src/routes/` - Routing configuration
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions

## Deployment

### Vercel
```bash
vercel --prod
```

### Cloudflare Pages
```bash
npm run build
npx wrangler pages deploy dist --project-name=chasemycareer-frontend
```

## Environment Variables

- `VITE_API_URL` - Backend API base URL
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_KEY` - Supabase anon key
```

---

## 4. Backend Repository Setup

### 4.1 Initial Backend Project Creation

**Step 1: Create Node.js + TypeScript Project**
```bash
mkdir backend
cd backend
npm init -y
```

**Step 2: Install Dependencies**
```bash
npm install express cors dotenv bcryptjs jsonwebtoken @supabase/supabase-js
npm install --save-dev typescript @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken ts-node nodemon
```

### 4.2 Backend Configuration Files

**package.json**
```json
{
  \"name\": \"chasemycareer-backend\",
  \"version\": \"1.0.0\",
  \"description\": \"ChaseMyCareer Backend API\",
  \"main\": \"dist/index.js\",
  \"scripts\": {
    \"dev\": \"nodemon --exec ts-node src/index.ts\",
    \"build\": \"tsc\",
    \"start\": \"node dist/index.js\",
    \"test\": \"jest\",
    \"lint\": \"eslint . --ext .ts\"
  },
  \"dependencies\": {
    \"express\": \"^4.18.2\",
    \"cors\": \"^2.8.5\",
    \"dotenv\": \"^16.3.1\",
    \"bcryptjs\": \"^2.4.3\",
    \"jsonwebtoken\": \"^9.0.2\",
    \"@supabase/supabase-js\": \"^2.38.0\"
  },
  \"devDependencies\": {
    \"typescript\": \"^5.2.2\",
    \"@types/node\": \"^20.10.0\",
    \"@types/express\": \"^4.17.21\",
    \"@types/cors\": \"^2.8.17\",
    \"@types/bcryptjs\": \"^2.4.6\",
    \"@types/jsonwebtoken\": \"^9.0.5\",
    \"ts-node\": \"^10.9.1\",
    \"nodemon\": \"^3.0.2\"
  }
}
```

**tsconfig.json**
```json
{
  \"compilerOptions\": {
    \"target\": \"ES2020\",
    \"module\": \"commonjs\",
    \"lib\": [\"ES2020\"],
    \"outDir\": \"./dist\",
    \"rootDir\": \"./src\",
    \"strict\": true,
    \"esModuleInterop\": true,
    \"skipLibCheck\": true,
    \"forceConsistentCasingInFileNames\": true,
    \"resolveJsonModule\": true,
    \"moduleResolution\": \"node\",
    \"declaration\": true,
    \"declarationMap\": true,
    \"sourceMap\": true
  },
  \"include\": [\"src/**/*\"],
  \"exclude\": [\"node_modules\", \"dist\"]
}
```

**.env.example**
```
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-jwt-secret-key

# Database (Cloudflare D1 - configured via wrangler)
DATABASE_ID=your-d1-database-id

# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# CORS
FRONTEND_URL=http://localhost:5173
```

### 4.3 Backend Entry Point

**src/index.ts**
```typescript
import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { corsMiddleware } from './middleware/cors.middleware';
import { errorHandler } from './middleware/errorHandler.middleware';
import authRoutes from './routes/auth.routes';
import tasksRoutes from './routes/tasks.routes';
import applicationsRoutes from './routes/applications.routes';
import resumesRoutes from './routes/resumes.routes';
import coverLettersRoutes from './routes/coverLetters.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ChaseMyCareer API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/resumes', resumesRoutes);
app.use('/api/cover-letters', coverLettersRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 4.4 Backend Middleware

**src/middleware/cors.middleware.ts**
```typescript
import cors from 'cors';

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL || '',
];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

**src/middleware/auth.middleware.ts**
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
```

**src/middleware/errorHandler.middleware.ts**
```typescript
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
```

### 4.5 Backend Example Routes and Controllers

**src/routes/auth.routes.ts**
```typescript
import { Router } from 'express';
import { register, login, googleAuth, googleCallback, linkedinAuth, linkedinCallback, getCurrentUser } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.get('/linkedin', linkedinAuth);
router.get('/linkedin/callback', linkedinCallback);
router.get('/me', authMiddleware, getCurrentUser);

export default router;
```

**src/controllers/auth.controller.ts**
```typescript
import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, full_name } = req.body;
    const result = await authService.register(email, password, full_name);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const googleAuth = (req: Request, res: Response) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.FRONTEND_URL}/auth/google/callback&response_type=code&scope=email profile`;
  res.redirect(googleAuthUrl);
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    const result = await authService.googleCallback(code as string);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${result.token}`);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const linkedinAuth = (req: Request, res: Response) => {
  const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.FRONTEND_URL}/auth/linkedin/callback&response_type=code&scope=r_liteprofile r_emailaddress`;
  res.redirect(linkedinAuthUrl);
};

export const linkedinCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    const result = await authService.linkedinCallback(code as string);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${result.token}`);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await authService.getUserById(req.user!.userId);
    res.json(user);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
```

**src/routes/tasks.routes.ts**
```typescript
import { Router } from 'express';
import { getAllTasks, updateTask } from '../controllers/tasks.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getAllTasks);
router.put('/:taskId', updateTask);

export default router;
```

**src/controllers/tasks.controller.ts**
```typescript
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { tasksService } from '../services/tasks.service';

export const getAllTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await tasksService.getUserTasks(req.user!.userId);
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { completed } = req.body;
    const task = await tasksService.updateTask(taskId, req.user!.userId, completed);
    res.json(task);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
```

### 4.6 Backend README.md

```markdown
# ChaseMyCareer Backend

Node.js + Express + TypeScript backend API for ChaseMyCareer platform.

## Prerequisites

- Node.js 18+
- npm or yarn
- Cloudflare account (for D1 database)
- Supabase account

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <backend-repo-url>
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your credentials:
   ```
   PORT=5000
   JWT_SECRET=your-secret-key
   SUPABASE_URL=your-supabase-url
   SUPABASE_KEY=your-supabase-key
   FRONTEND_URL=http://localhost:5173
   ```

5. Initialize database:
   ```bash
   npx wrangler d1 create chasemycareer-db
   npx wrangler d1 execute chasemycareer-db --local --file=./schema.sql
   ```

6. Start development server:
   ```bash
   npm run dev
   ```

7. Server runs at `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Lint code
- `npm test` - Run tests

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/linkedin` - LinkedIn OAuth
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all user tasks
- `PUT /api/tasks/:taskId` - Update task completion

### Applications
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Create application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users
- `POST /api/admin/messages` - Send message

## Database Setup

See `schema.sql` for complete database schema.

## Deployment

### Cloudflare Workers
```bash
npm run build
npx wrangler deploy
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT tokens
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase anon key
- `FRONTEND_URL` - Frontend application URL
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `LINKEDIN_CLIENT_ID` - LinkedIn OAuth client ID
- `LINKEDIN_CLIENT_SECRET` - LinkedIn OAuth client secret
```

---

## 5. Local Development Workflow

### 5.1 Running Both Projects Locally

**Terminal 1 - Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with backend URL
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

### 5.2 Testing API Connection

**Test from Frontend:**
1. Open browser at http://localhost:5173
2. Open browser console
3. Run:
```javascript
fetch('http://localhost:5000/api/health')
  .then(res => res.json())
  .then(data => console.log(data));
```

**Expected Response:**
```json
{
  \"status\": \"ok\",
  \"message\": \"ChaseMyCareer API is running\"
}
```

---

## 6. Deployment Strategy

### 6.1 Frontend Deployment (Vercel)

**Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

**Step 2: Deploy**
```bash
cd frontend
vercel --prod
```

**Step 3: Set Environment Variables**
In Vercel dashboard:
- `VITE_API_URL` = https://your-backend-url.com
- `VITE_SUPABASE_URL` = your-supabase-url
- `VITE_SUPABASE_KEY` = your-supabase-key

### 6.2 Backend Deployment (Cloudflare Workers)

**Step 1: Build Project**
```bash
cd backend
npm run build
```

**Step 2: Deploy**
```bash
npx wrangler deploy
```

**Step 3: Set Secrets**
```bash
wrangler secret put JWT_SECRET
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_KEY
```

---

## 7. Database Schema (Unchanged)

The database schema remains the same as in the original requirements document. See Section 2.2 for complete schema.sql file.

---

## 8. Authentication System (Unchanged)

The authentication system remains the same as in the original requirements document. See Section 3 for complete authentication flow.

---

## 9. 50-Day Career Development Curriculum (Unchanged)

The 50-day curriculum remains the same as in the original requirements document. See Section 6 for complete day-by-day topics.

---

## 10. Testing Implementation

### 10.1 Frontend Testing

**Install Testing Dependencies:**
```bash
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Example Test: src/api/auth.api.test.ts**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { authApi } from './auth.api';
import { apiClient } from './api';

vi.mock('./api');

describe('authApi', () => {
  it('should call register endpoint', async () => {
    const mockResponse = { token: 'test-token', user: { id: '1', email: 'test@example.com' } };
    vi.spyOn(apiClient, 'post').mockResolvedValue(mockResponse);

    const result = await authApi.register({ email: 'test@example.com', password: 'password', full_name: 'Test User' });
    
    expect(apiClient.post).toHaveBeenCalledWith('/api/auth/register', { email: 'test@example.com', password: 'password', full_name: 'Test User' });
    expect(result).toEqual(mockResponse);
  });
});
```

### 10.2 Backend Testing

**Install Testing Dependencies:**
```bash
cd backend
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

**Example Test: src/controllers/auth.controller.test.ts**
```typescript
import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth.routes';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Controller', () => {
  it('should register new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'TestPass123!',
        full_name: 'Test User'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe('test@example.com');
  });
});
```

---

## 11. CI/CD Pipeline (Updated)

### 11.1 Frontend GitHub Actions

**frontend/.github/workflows/deploy.yml**
```yaml
name: Frontend CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 11.2 Backend GitHub Actions

**backend/.github/workflows/deploy.yml**
```yaml
name: Backend CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Cloudflare Workers
        run: npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

---

## 12. Complete Deployment Checklist

**Frontend Deployment:**
- [ ] Repository created and code pushed
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Deployed to Vercel/Cloudflare Pages
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] API connection verified

**Backend Deployment:**
- [ ] Repository created and code pushed
- [ ] Dependencies installed
- [ ] Database initialized
- [ ] Environment variables/secrets configured
- [ ] Build successful
- [ ] Deployed to Cloudflare Workers
- [ ] API endpoints responding
- [ ] CORS configured correctly
- [ ] OAuth callbacks working

**Integration Testing:**
- [ ] Frontend can fetch data from backend
- [ ] Authentication flow working
- [ ] User registration working
- [ ] Task management working
- [ ] Application tracking working
- [ ] Admin dashboard accessible

---

## 13. Migration Notes

### 13.1 Key Changes from Original Architecture

1. **Separation of Concerns**: Frontend and backend are now completely independent repositories
2. **API Communication**: All frontend-backend communication happens via REST API
3. **Environment Variables**: Each repository has its own environment configuration
4. **Independent Deployment**: Frontend and backend can be deployed separately
5. **TypeScript Throughout**: Both frontend and backend use TypeScript
6. **Centralized API Layer**: Frontend has a dedicated API service layer
7. **CORS Configuration**: Backend explicitly handles CORS for frontend domains

### 13.2 Preserved Features

- All original features remain intact
- Database schema unchanged
- Authentication flows unchanged
- 50-day curriculum unchanged
- Admin dashboard functionality unchanged
- Testing strategy enhanced but compatible

---

## 14. Troubleshooting

### 14.1 CORS Issues

**Problem**: Frontend cannot connect to backend

**Solution**:
1. Verify backend CORS middleware includes frontend URL
2. Check `.env` files have correct URLs
3. Ensure backend is running on correct port
4. Clear browser cache and restart both servers

### 14.2 API Connection Failures

**Problem**: API calls return 404 or connection refused

**Solution**:
1. Verify backend is running: `curl http://localhost:5000/api/health`
2. Check `VITE_API_URL` in frontend `.env`
3. Verify API routes are correctly defined
4. Check network tab in browser DevTools

### 14.3 Authentication Issues

**Problem**: JWT token not being sent or validated

**Solution**:
1. Verify token is stored in localStorage
2. Check Authorization header in API requests
3. Verify JWT_SECRET matches between environments
4. Check token expiration

---

## Appendix A: Quick Start Commands

**Clone and Setup Both Repositories:**
```bash
# Backend
git clone <backend-repo-url>
cd backend
npm install
cp .env.example .env
# Edit .env
npm run dev

# Frontend (new terminal)
git clone <frontend-repo-url>
cd frontend
npm install
cp .env.example .env
# Edit .env
npm run dev
```

**Verify Setup:**
```bash
# Test backend
curl http://localhost:5000/api/health

# Test frontend
open http://localhost:5173
```

---

## Appendix B: Environment Variables Reference

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_KEY=your-supabase-anon-key
```

**Backend (.env):**
```
PORT=5000
JWT_SECRET=your-jwt-secret
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
FRONTEND_URL=http://localhost:5173
```