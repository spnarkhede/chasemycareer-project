# Welcome to Your Miaoda Project
Miaoda Application Link URL
    URL:https://medo.dev/projects/chasemycareer

# 🚀 ChaseMyCareer Backend API

A RESTful API built with Node.js, Express, and TypeScript for the ChaseMyCareer job search platform.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the API](#running-the-api)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)

---

## ✨ Features

- **RESTful API** - Clean, predictable REST endpoints
- **TypeScript** - Full type safety and IntelliSense
- **Authentication** - JWT-based auth with Supabase
- **Authorization** - Role-based access control (User/Admin)
- **Security** - Helmet, CORS, rate limiting
- **Error Handling** - Centralized error management
- **Validation** - Request validation with Zod
- **Logging** - Morgan for HTTP request logging
- **Database** - Supabase PostgreSQL integration

---

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Security:** Helmet, CORS, express-rate-limit
- **Logging:** Morgan
- **Dev Tools:** tsx (TypeScript execution)

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Supabase account** (free tier works)

---

## 🚀 Installation

### 1. Clone the repository

```bash
cd backend-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Configuration](#configuration) section).

---

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-role-key

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# API Configuration
API_VERSION=v1
```

### Environment Variables Explained

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `SUPABASE_URL` | Your Supabase project URL | Required |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Required |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Required |
| `JWT_SECRET` | Secret for JWT signing | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:5173` |
| `ALLOWED_ORIGINS` | Comma-separated allowed origins | See above |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `API_VERSION` | API version prefix | `v1` |

---

## 🏃 Running the API

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The API will start at: **http://localhost:5000**

### Production Build

Build the TypeScript code:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Other Commands

```bash
# Type check without building
npm run type-check

# Run linter
npm run lint
```

---

## 📡 API Endpoints

### Base URL

```
http://localhost:5000/api/v1
```

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "success",
  "message": "ChaseMyCareer API is running",
  "timestamp": "2026-01-02T12:00:00.000Z",
  "version": "v1"
}
```

---

### Authentication Endpoints

#### Sign Up

```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "John Doe"
}
```

#### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": { ... },
    "session": {
      "access_token": "eyJhbGc...",
      "refresh_token": "...",
      "expires_in": 3600
    }
  }
}
```

#### Logout

```http
POST /api/v1/auth/logout
Authorization: Bearer {access_token}
```

#### Refresh Token

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "your-refresh-token"
}
```

#### Forgot Password

```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Reset Password

```http
POST /api/v1/auth/reset-password
Authorization: Bearer {reset_token}
Content-Type: application/json

{
  "password": "newSecurePassword123"
}
```

---

### User Endpoints

#### Get Current User

```http
GET /api/v1/users/me
Authorization: Bearer {access_token}
```

#### Update Current User

```http
PATCH /api/v1/users/me
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "full_name": "Jane Doe",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

#### Get All Users (Admin Only)

```http
GET /api/v1/users
Authorization: Bearer {admin_access_token}
```

#### Get User by ID (Admin Only)

```http
GET /api/v1/users/:id
Authorization: Bearer {admin_access_token}
```

---

### Task Endpoints

#### Get All Tasks

```http
GET /api/v1/tasks
Authorization: Bearer {access_token}

# Optional query parameters:
# ?day_number=1
```

#### Get Task by ID

```http
GET /api/v1/tasks/:id
Authorization: Bearer {access_token}
```

#### Create Task

```http
POST /api/v1/tasks
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "day_number": 1,
  "title": "Update Resume",
  "description": "Review and update resume",
  "category": "preparation"
}
```

#### Update Task

```http
PATCH /api/v1/tasks/:id
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Updated Title",
  "completed": true
}
```

#### Toggle Task Completion

```http
PATCH /api/v1/tasks/:id/toggle
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "completed": true
}
```

#### Delete Task

```http
DELETE /api/v1/tasks/:id
Authorization: Bearer {access_token}
```

---

### Job Application Endpoints

#### Get All Applications

```http
GET /api/v1/applications
Authorization: Bearer {access_token}

# Optional query parameters:
# ?status=applied
```

#### Get Application by ID

```http
GET /api/v1/applications/:id
Authorization: Bearer {access_token}
```

#### Create Application

```http
POST /api/v1/applications
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "company_name": "Tech Corp",
  "position": "Software Engineer",
  "status": "applied",
  "application_date": "2026-01-02",
  "job_url": "https://example.com/job"
}
```

#### Update Application

```http
PATCH /api/v1/applications/:id
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "status": "interviewing",
  "notes": "Phone screen scheduled"
}
```

#### Delete Application

```http
DELETE /api/v1/applications/:id
Authorization: Bearer {access_token}
```

#### Get Application Statistics

```http
GET /api/v1/applications/stats
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "stats": {
      "total": 25,
      "applied": 10,
      "interviewing": 8,
      "offered": 2,
      "rejected": 5
    }
  }
}
```

---

## 📁 Project Structure

```
backend-api/
├── src/
│   ├── config/
│   │   └── supabase.ts          # Supabase client configuration
│   ├── controllers/
│   │   ├── authController.ts    # Authentication logic
│   │   ├── userController.ts    # User management logic
│   │   ├── taskController.ts    # Task management logic
│   │   └── applicationController.ts # Job application logic
│   ├── middleware/
│   │   ├── auth.ts              # Authentication middleware
│   │   ├── cors.ts              # CORS configuration
│   │   └── errorHandler.ts     # Error handling
│   ├── routes/
│   │   ├── authRoutes.ts        # Auth endpoints
│   │   ├── userRoutes.ts        # User endpoints
│   │   ├── taskRoutes.ts        # Task endpoints
│   │   └── applicationRoutes.ts # Application endpoints
│   └── index.ts                 # Main application entry
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

---

## 🔧 Development

### Code Style

- Use TypeScript for all files
- Follow ESLint rules
- Use async/await for asynchronous operations
- Implement proper error handling
- Add JSDoc comments for complex functions

### Adding New Endpoints

1. **Create Controller** in `src/controllers/`
2. **Create Routes** in `src/routes/`
3. **Register Routes** in `src/index.ts`
4. **Add Middleware** if needed
5. **Update Documentation**

### Error Handling

All errors are handled by the centralized error handler:

```typescript
import { AppError } from '../middleware/errorHandler';

// Throw operational errors
throw new AppError('Resource not found', 404);
```

### Authentication

Protected routes use the `authenticate` middleware:

```typescript
import { authenticate } from '../middleware/auth';

router.get('/protected', authenticate, controller);
```

Admin routes use both `authenticate` and `requireAdmin`:

```typescript
import { authenticate, requireAdmin } from '../middleware/auth';

router.get('/admin', authenticate, requireAdmin, controller);
```

---

## 🚀 Deployment

### Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Railway

1. Install Railway CLI:
```bash
npm i -g @railway/cli
```

2. Deploy:
```bash
railway up
```

### Render

1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: chasemycareer-api
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
```

2. Connect to Render and deploy

### Environment Variables

Remember to set all environment variables in your deployment platform:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `JWT_SECRET`
- `FRONTEND_URL`
- `ALLOWED_ORIGINS`

---

## 🔒 Security

- **Helmet** - Sets security HTTP headers
- **CORS** - Configured for specific origins
- **Rate Limiting** - Prevents abuse
- **JWT** - Secure token-based authentication
- **Input Validation** - Validates all inputs
- **SQL Injection Protection** - Supabase handles this
- **XSS Protection** - Helmet provides headers

---

## 📝 API Response Format

### Success Response

```json
{
  "status": "success",
  "data": {
    "key": "value"
  }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error description"
}
```

---

## 🧪 Testing

### Manual Testing

Use tools like:
- **Postman** - API testing
- **Insomnia** - REST client
- **curl** - Command line testing

### Example curl Request

```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get tasks (with auth)
curl http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📞 Support

For issues or questions:
1. Check the [API documentation](#api-endpoints)
2. Review the [project structure](#project-structure)
3. Check server logs for errors
4. Verify environment variables

---

## 📄 License

MIT License - see LICENSE file for details

---

**Status:** ✅ READY TO USE  
**Version:** 1.0.0  
**Last Updated:** January 2, 2026

---

## 🎯 Quick Start Summary

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 3. Start development server
npm run dev

# 4. Test the API
curl http://localhost:5000/health
```

**API will be running at:** http://localhost:5000 🚀
