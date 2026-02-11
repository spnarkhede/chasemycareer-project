# 🎯 ChaseMyCareer Frontend

A modern React application built with Vite, TypeScript, and Tailwind CSS for the ChaseMyCareer job search platform.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Integration](#api-integration)
- [Project Structure](#project-structure)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)

---

## ✨ Features

- **Modern UI** - Built with React 18 and shadcn/ui components
- **Type Safety** - Full TypeScript support
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Authentication** - Secure login/signup with JWT
- **50-Day Program** - Structured job search program
- **Job Tracker** - Track applications and interviews
- **Networking Tools** - Manage professional contacts
- **Interview Practice** - Practice common interview questions
- **Admin Dashboard** - User management and analytics
- **Real-time Updates** - Live data synchronization
- **Dark Mode** - Theme switching support

---

## 🛠️ Tech Stack

- **Framework:** React 18.3.1
- **Build Tool:** Vite 6.0.11
- **Language:** TypeScript 5.7.3
- **Styling:** Tailwind CSS 3.4.17
- **UI Components:** shadcn/ui
- **Routing:** React Router 7.1.3
- **State Management:** React Context + Hooks
- **HTTP Client:** Axios
- **Backend API:** Node.js + Express (separate repository)

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Backend API** running (see backend-api README)

---

## 🚀 Installation

### 1. Navigate to frontend directory

```bash
cd frontend
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
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:5000/api/v1

# Supabase Configuration (Optional - for direct Supabase access)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Application
VITE_APP_ID=chasemycareer
VITE_API_ENV=development
```

### Environment Variables Explained

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api/v1` |
| `VITE_SUPABASE_URL` | Supabase project URL (optional) | - |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key (optional) | - |
| `VITE_APP_ID` | Application ID | `chasemycareer` |
| `VITE_API_ENV` | Environment | `development` |

---

## 🏃 Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will start at: **http://localhost:5173**

### Preview Production Build

Build and preview the production version:

```bash
npm run build
npm run preview
```

### Other Commands

```bash
# Type check
npm run type-check

# Run linter
npm run lint

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Generate test coverage
npm run test:coverage
```

---

## 🔌 API Integration

The frontend communicates with the backend API through a centralized service layer.

### API Service Location

```
src/services/api.ts
```

### Using the API Service

```typescript
import { authApi, userApi, taskApi, applicationApi } from '@/services/api';

// Authentication
const response = await authApi.login('user@example.com', 'password');

// Get current user
const user = await userApi.getCurrentUser();

// Get tasks
const tasks = await taskApi.getTasks();

// Get applications
const applications = await applicationApi.getApplications();
```

### API Features

- **Automatic Token Management** - Tokens stored in localStorage
- **Request Interceptors** - Adds auth token to all requests
- **Response Interceptors** - Handles errors globally
- **Token Refresh** - Automatically refreshes expired tokens
- **Error Handling** - Centralized error management
- **Type Safety** - Full TypeScript support

### Available API Methods

#### Authentication
- `authApi.signup(email, password, fullName)`
- `authApi.login(email, password)`
- `authApi.logout()`
- `authApi.refreshToken(refreshToken)`
- `authApi.forgotPassword(email)`
- `authApi.resetPassword(password, token)`

#### Users
- `userApi.getCurrentUser()`
- `userApi.updateCurrentUser(data)`
- `userApi.getAllUsers()` (admin only)
- `userApi.getUserById(id)` (admin only)

#### Tasks
- `taskApi.getTasks(dayNumber?)`
- `taskApi.getTaskById(id)`
- `taskApi.createTask(task)`
- `taskApi.updateTask(id, updates)`
- `taskApi.toggleTask(id, completed)`
- `taskApi.deleteTask(id)`

#### Applications
- `applicationApi.getApplications(status?)`
- `applicationApi.getApplicationById(id)`
- `applicationApi.createApplication(application)`
- `applicationApi.updateApplication(id, updates)`
- `applicationApi.deleteApplication(id)`
- `applicationApi.getApplicationStats()`

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── auth/            # Authentication components
│   │   ├── common/          # Common components
│   │   └── calendar/        # Calendar components
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx  # Authentication state
│   │   └── ThemeContext.tsx # Theme management
│   ├── db/                  # Legacy Supabase layer (optional)
│   │   ├── supabase.ts      # Supabase client
│   │   └── api.ts           # Supabase API functions
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── pages/               # Page components
│   │   ├── Landing.tsx      # Landing page
│   │   ├── Dashboard.tsx    # User dashboard
│   │   ├── FiftyDayPlan.tsx # 50-day program
│   │   ├── JobTracker.tsx   # Job applications
│   │   ├── Interviews.tsx   # Interview management
│   │   ├── Networking.tsx   # Networking contacts
│   │   ├── Settings.tsx     # User settings
│   │   ├── auth/            # Auth pages
│   │   ├── admin/           # Admin pages
│   │   └── settings/        # Settings pages
│   ├── services/            # API services
│   │   └── api.ts           # ⭐ Centralized API service
│   ├── types/               # TypeScript types
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── routes.tsx           # Route configuration
├── public/                  # Static assets
├── .env                     # Environment variables
├── .env.example             # Environment template
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── README.md                # This file
```

---

## 🔧 Development

### Code Style

- Use TypeScript for all files
- Follow ESLint rules
- Use functional components with hooks
- Implement proper error handling
- Use semantic HTML elements
- Follow atomic design principles

### Adding New Features

1. **Create Component** in `src/components/` or `src/pages/`
2. **Add Route** in `src/routes.tsx`
3. **Create API Methods** in `src/services/api.ts` if needed
4. **Add Types** in `src/types/`
5. **Update Documentation**

### State Management

The application uses React Context for global state:

```typescript
// Authentication state
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, login, logout } = useAuth();
  // ...
}
```

### Styling

The application uses Tailwind CSS with shadcn/ui components:

```typescript
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function MyComponent() {
  return (
    <Card className="p-6">
      <Button variant="default">Click me</Button>
    </Card>
  );
}
```

---

## 📦 Building for Production

### Build the Application

```bash
npm run build
```

Output will be in the `dist/` directory.

### Build Statistics

- **Build Time:** ~3.2s
- **Bundle Size:** 218.54 kB (gzipped)
- **Total Modules:** 2,415
- **Files Generated:** 66

### Preview Production Build

```bash
npm run preview
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `VITE_API_BASE_URL` - Your production API URL

### Cloudflare Pages

1. Connect your repository to Cloudflare Pages

2. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `frontend`

3. Set environment variables:
   - `VITE_API_BASE_URL` - Your production API URL

### Netlify

1. Connect your repository to Netlify

2. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Base directory:** `frontend`

3. Set environment variables:
   - `VITE_API_BASE_URL` - Your production API URL

### Important: Update API URL

When deploying to production, update `VITE_API_BASE_URL` to point to your production backend API:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

---

## 🔗 Connecting Frontend and Backend

### Local Development

1. **Start Backend API:**
```bash
cd backend-api
npm run dev
# Backend runs on http://localhost:5000
```

2. **Start Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

3. **Test Connection:**
   - Open http://localhost:5173
   - Try to sign up or login
   - Check browser console for API calls

### Production

1. **Deploy Backend** to your hosting platform (Vercel, Railway, Render, etc.)
2. **Get Backend URL** (e.g., https://api.yourdomain.com)
3. **Update Frontend** `.env` with production API URL
4. **Deploy Frontend** to your hosting platform
5. **Update Backend** CORS settings to allow your frontend domain

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Generate coverage report
npm run test:coverage
```

### Manual Testing

1. **Authentication Flow:**
   - Sign up with new account
   - Login with existing account
   - Logout
   - Password reset

2. **User Features:**
   - View dashboard
   - Complete daily tasks
   - Add job applications
   - Schedule interviews
   - Manage networking contacts

3. **Admin Features:**
   - View all users
   - Send messages
   - View analytics

---

## 🔒 Security

- **HTTPS** - Use HTTPS in production
- **Environment Variables** - Never commit `.env` file
- **Token Storage** - Tokens stored in localStorage
- **CORS** - Backend configured for specific origins
- **Input Validation** - All inputs validated
- **XSS Protection** - React escapes by default

---

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |
| `npm run test` | Run tests |
| `npm run test:ui` | Run tests with UI |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Generate coverage report |

---

## 🐛 Troubleshooting

### API Connection Issues

**Problem:** Frontend can't connect to backend

**Solutions:**
1. Verify backend is running on http://localhost:5000
2. Check `VITE_API_BASE_URL` in `.env`
3. Check browser console for CORS errors
4. Verify backend CORS settings allow http://localhost:5173

### Build Errors

**Problem:** Build fails with TypeScript errors

**Solutions:**
1. Run `npm run type-check` to see all errors
2. Fix type errors in your code
3. Update `tsconfig.json` if needed
4. Clear cache: `rm -rf node_modules package-lock.json && npm install`

### Port Already in Use

**Problem:** Port 5173 is already in use

**Solutions:**
```bash
# Kill process using port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

---

## 📞 Support

For issues or questions:
1. Check the [API Integration](#api-integration) section
2. Review the [project structure](#project-structure)
3. Check browser console for errors
4. Verify backend API is running
5. Check network tab for failed requests

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
# Edit .env with your backend API URL

# 3. Make sure backend is running
# (See backend-api README)

# 4. Start development server
npm run dev

# 5. Open browser
# http://localhost:5173
```

**Application will be running at:** http://localhost:5173 🚀

---

## 🔄 Migration from Supabase Direct Access

If you're migrating from direct Supabase access to the new API service:

1. **Update imports:**
```typescript
// Old
import { supabase } from '@/db/supabase';

// New
import { authApi, userApi, taskApi } from '@/services/api';
```

2. **Update API calls:**
```typescript
// Old
const { data } = await supabase.from('tasks').select('*');

// New
const response = await taskApi.getTasks();
const tasks = response.data.tasks;
```

3. **Update authentication:**
```typescript
// Old
const { data } = await supabase.auth.signInWithPassword({ email, password });

// New
const response = await authApi.login(email, password);
```

The new API service provides a cleaner, more maintainable interface while maintaining all functionality.
