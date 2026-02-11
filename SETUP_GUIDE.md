# 🎯 ChaseMyCareer - Complete Project Guide

## Separate Frontend & Backend Architecture

This project has been refactored into **completely independent** frontend and backend repositories that communicate via REST API.

---

## 📁 Repository Structure

```
/workspace/chasemycareer/
├── frontend/                    # React + Vite Frontend (Port 5173)
│   ├── src/
│   │   ├── services/
│   │   │   └── api.ts          # ⭐ Centralized API Service
│   │   ├── pages/              # All page components
│   │   ├── components/         # Reusable components
│   │   └── ...
│   ├── .env                    # Frontend environment variables
│   ├── package.json
│   └── README.md               # Frontend documentation
│
├── backend-api/                # Node.js + Express Backend (Port 5000)
│   ├── src/
│   │   ├── controllers/        # Business logic
│   │   ├── routes/             # API endpoints
│   │   ├── middleware/         # Auth, CORS, errors
│   │   ├── config/             # Supabase config
│   │   └── index.ts            # Main server file
│   ├── .env                    # Backend environment variables
│   ├── package.json
│   └── README.md               # Backend documentation
│
├── backend/                    # Legacy Supabase migrations
│   └── supabase/
│       └── migrations/         # Database schema
│
├── docs/                       # Project documentation
│   └── ...                     # 108 documentation files
│
├── SETUP_GUIDE.md             # ⭐ This file
└── README.md                   # Project overview
```

---

## 🚀 Quick Start (Both Repositories)

### Prerequisites

- Node.js 18+ installed
- npm 9+ installed
- Terminal/Command line access

### Step 1: Start Backend API

```bash
# Navigate to backend
cd /workspace/chasemycareer/backend-api

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Backend will run on:** http://localhost:5000

**Verify it's running:**
```bash
curl http://localhost:5000/health
```

### Step 2: Start Frontend (New Terminal)

```bash
# Navigate to frontend
cd /workspace/chasemycareer/frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Frontend will run on:** http://localhost:5173

### Step 3: Test the Connection

1. Open browser: http://localhost:5173
2. Click "Sign Up" or "Login"
3. Check browser console - you should see API calls to http://localhost:5000
4. Check backend terminal - you should see incoming requests

---

## 🔌 How Frontend & Backend Communicate

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Frontend (React + Vite)                                    │
│  http://localhost:5173                                      │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  src/services/api.ts                                 │  │
│  │  - Centralized API service                           │  │
│  │  - Handles all HTTP requests                         │  │
│  │  - Manages authentication tokens                     │  │
│  │  - Error handling                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                  │
│                          │ HTTP Requests                    │
│                          │ (JSON)                           │
│                          ▼                                  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                          │                                  │
│  Backend API (Node.js + Express)                           │
│  http://localhost:5000/api/v1                              │
│                          │                                  │
│  ┌───────────────────────▼──────────────────────────────┐  │
│  │  Routes                                              │  │
│  │  /api/v1/auth      - Authentication                 │  │
│  │  /api/v1/users     - User management                │  │
│  │  /api/v1/tasks     - Daily tasks                    │  │
│  │  /api/v1/applications - Job applications            │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                  │
│  ┌───────────────────────▼──────────────────────────────┐  │
│  │  Controllers                                         │  │
│  │  - Business logic                                    │  │
│  │  - Data validation                                   │  │
│  │  - Database operations                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                  │
│                          ▼                                  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                          │                                  │
│  Database (Supabase PostgreSQL)                            │
│  https://itazzlbcxisavqxvkmoe.supabase.co                  │
│                          │                                  │
│  ┌───────────────────────▼──────────────────────────────┐  │
│  │  Tables                                              │  │
│  │  - profiles                                          │  │
│  │  - daily_tasks                                       │  │
│  │  - job_applications                                  │  │
│  │  - interviews                                        │  │
│  │  - networking_contacts                               │  │
│  │  - ... (20 tables total)                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### API Request Flow Example

**User clicks "Login" button:**

1. **Frontend** (`LoginPage.tsx`):
```typescript
import { authApi } from '@/services/api';

const handleLogin = async () => {
  const response = await authApi.login(email, password);
  // Response contains user data and tokens
};
```

2. **API Service** (`src/services/api.ts`):
```typescript
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    // Store tokens in localStorage
    localStorage.setItem('access_token', response.data.session.access_token);
    return response;
  },
};
```

3. **Backend API** (`backend-api/src/routes/authRoutes.ts`):
```typescript
router.post('/login', login);
```

4. **Controller** (`backend-api/src/controllers/authController.ts`):
```typescript
export const login = async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabaseAnon.auth.signInWithPassword({
    email,
    password,
  });
  res.json({ status: 'success', data });
};
```

5. **Database** (Supabase):
   - Validates credentials
   - Returns user data and session tokens

---

## 📋 Environment Variables

### Frontend (.env)

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:5000/api/v1

# Optional: Direct Supabase access
VITE_SUPABASE_URL=https://itazzlbcxisavqxvkmoe.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Application
VITE_APP_ID=chasemycareer
VITE_API_ENV=development
```

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://itazzlbcxisavqxvkmoe.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# API
API_VERSION=v1
```

---

## 🔧 Development Workflow

### Making Changes to Frontend

1. **Edit files** in `frontend/src/`
2. **Hot reload** automatically updates browser
3. **API calls** go through `src/services/api.ts`
4. **Test** in browser at http://localhost:5173

### Making Changes to Backend

1. **Edit files** in `backend-api/src/`
2. **Server restarts** automatically (tsx watch)
3. **Test** with curl or Postman
4. **Check logs** in terminal

### Adding New API Endpoint

**Backend:**
1. Create controller in `backend-api/src/controllers/`
2. Create route in `backend-api/src/routes/`
3. Register route in `backend-api/src/index.ts`

**Frontend:**
1. Add method to `frontend/src/services/api.ts`
2. Use method in your component

**Example:**

```typescript
// Backend: backend-api/src/controllers/exampleController.ts
export const getExample = async (req, res) => {
  const data = await supabase.from('table').select('*');
  res.json({ status: 'success', data });
};

// Backend: backend-api/src/routes/exampleRoutes.ts
router.get('/', authenticate, getExample);

// Frontend: frontend/src/services/api.ts
export const exampleApi = {
  getExample: async () => {
    return apiClient.get('/example');
  },
};

// Frontend: Use in component
import { exampleApi } from '@/services/api';
const data = await exampleApi.getExample();
```

---

## 🧪 Testing

### Test Backend API

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

### Test Frontend

1. Open http://localhost:5173
2. Open browser DevTools (F12)
3. Go to Network tab
4. Perform actions (login, create task, etc.)
5. Check API calls in Network tab
6. Check console for errors

---

## 📦 Building for Production

### Build Frontend

```bash
cd frontend
npm run build
# Output: frontend/dist/
```

### Build Backend

```bash
cd backend-api
npm run build
# Output: backend-api/dist/
```

---

## 🚀 Deployment

### Deploy Backend

**Options:**
- **Vercel** - Serverless functions
- **Railway** - Container deployment
- **Render** - Web service
- **Heroku** - Platform as a service
- **AWS/GCP/Azure** - Cloud platforms

**Steps:**
1. Deploy backend to your platform
2. Get production URL (e.g., https://api.yourdomain.com)
3. Update environment variables on platform
4. Test API endpoints

### Deploy Frontend

**Options:**
- **Vercel** - Recommended for React
- **Cloudflare Pages** - Fast global CDN
- **Netlify** - Easy deployment
- **AWS S3 + CloudFront** - Scalable hosting

**Steps:**
1. Update `VITE_API_BASE_URL` to production backend URL
2. Build frontend: `npm run build`
3. Deploy `dist/` folder to your platform
4. Configure custom domain (optional)

### Update CORS

After deploying frontend, update backend CORS settings:

```env
# backend-api/.env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## 📚 Documentation

### Frontend Documentation
- **Location:** `frontend/README.md`
- **Topics:** Installation, API integration, components, deployment

### Backend Documentation
- **Location:** `backend-api/README.md`
- **Topics:** Installation, API endpoints, controllers, deployment

### Project Documentation
- **Location:** `docs/`
- **Files:** 108 numbered documentation files
- **Index:** `docs/COMPLETE_INDEX.md`

---

## 🔒 Security Checklist

### Frontend
- [ ] Use HTTPS in production
- [ ] Never commit `.env` file
- [ ] Validate all user inputs
- [ ] Sanitize data before display
- [ ] Use secure token storage
- [ ] Implement CSP headers

### Backend
- [ ] Use environment variables for secrets
- [ ] Enable CORS for specific origins only
- [ ] Implement rate limiting
- [ ] Validate all inputs
- [ ] Use parameterized queries
- [ ] Enable HTTPS
- [ ] Set secure headers (Helmet)
- [ ] Implement proper error handling

---

## 🐛 Common Issues & Solutions

### Issue: Frontend can't connect to backend

**Symptoms:**
- Network errors in browser console
- "Failed to fetch" errors
- CORS errors

**Solutions:**
1. Verify backend is running: `curl http://localhost:5000/health`
2. Check `VITE_API_BASE_URL` in frontend `.env`
3. Check backend CORS settings in `backend-api/src/middleware/cors.ts`
4. Verify `ALLOWED_ORIGINS` includes `http://localhost:5173`

### Issue: Authentication not working

**Symptoms:**
- Login fails
- 401 Unauthorized errors
- Token not being sent

**Solutions:**
1. Check browser localStorage for `access_token`
2. Verify token is being added to requests (Network tab)
3. Check backend auth middleware
4. Verify Supabase credentials in backend `.env`

### Issue: Port already in use

**Symptoms:**
- "Port 5000 is already in use"
- "Port 5173 is already in use"

**Solutions:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different ports
# Backend: PORT=5001 npm run dev
# Frontend: npm run dev -- --port 3000
```

### Issue: Database connection errors

**Symptoms:**
- "Failed to connect to database"
- Supabase errors

**Solutions:**
1. Verify Supabase credentials in backend `.env`
2. Check Supabase project is active
3. Verify internet connection
4. Check Supabase dashboard for issues

---

## 📊 Project Statistics

### Frontend
- **Framework:** React 18.3.1
- **Build Tool:** Vite 6.0.11
- **Language:** TypeScript 5.7.3
- **Bundle Size:** 218.54 kB (gzipped)
- **Build Time:** ~3.2s
- **Components:** 50+
- **Pages:** 20+

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript 5.3.3
- **Endpoints:** 25+
- **Controllers:** 4
- **Middleware:** 3

### Database
- **Platform:** Supabase (PostgreSQL)
- **Tables:** 20
- **Tasks:** 50 (50-day program)
- **Users:** 4 (test users)

---

## 🎯 Next Steps

### For Development
1. ✅ Both repositories set up
2. ✅ API communication working
3. ⬜ Add more features
4. ⬜ Write tests
5. ⬜ Optimize performance

### For Production
1. ⬜ Deploy backend to hosting platform
2. ⬜ Deploy frontend to hosting platform
3. ⬜ Configure custom domain
4. ⬜ Set up monitoring
5. ⬜ Configure CI/CD

---

## 💡 Tips

### Development
- Keep both terminals open (frontend + backend)
- Use browser DevTools Network tab to debug API calls
- Check backend terminal for request logs
- Use Postman/Insomnia for API testing

### Code Organization
- Frontend: One component per file
- Backend: One controller per resource
- Use TypeScript for type safety
- Follow existing code patterns

### Git Workflow
- Commit frontend and backend changes separately
- Use meaningful commit messages
- Create feature branches
- Test before committing

---

## 📞 Support

### Documentation
- Frontend: `frontend/README.md`
- Backend: `backend-api/README.md`
- Project: `docs/COMPLETE_INDEX.md`

### Debugging
1. Check browser console (F12)
2. Check Network tab for API calls
3. Check backend terminal for logs
4. Verify environment variables
5. Test API with curl/Postman

---

## ✅ Verification Checklist

Before considering setup complete:

### Backend
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured
- [ ] Server starts without errors
- [ ] Health endpoint responds: `curl http://localhost:5000/health`
- [ ] Can create user via API
- [ ] Can login via API

### Frontend
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured
- [ ] App starts without errors
- [ ] Can access http://localhost:5173
- [ ] Can sign up
- [ ] Can login
- [ ] Can view dashboard
- [ ] API calls visible in Network tab

### Integration
- [ ] Frontend can call backend API
- [ ] No CORS errors
- [ ] Authentication works end-to-end
- [ ] Data flows from frontend → backend → database
- [ ] Tokens stored and used correctly

---

## 🎉 Success!

If you've completed all the steps above, you now have:

✅ **Separate Frontend & Backend** - Fully independent repositories  
✅ **REST API Communication** - Clean API layer  
✅ **Type Safety** - Full TypeScript support  
✅ **Authentication** - Secure JWT-based auth  
✅ **Database** - Supabase PostgreSQL  
✅ **Ready to Deploy** - Both can deploy independently  

---

**Project:** ChaseMyCareer  
**Architecture:** Separate Frontend & Backend  
**Status:** ✅ READY FOR DEVELOPMENT  
**Last Updated:** January 2, 2026

---

## 🚀 Start Developing

```bash
# Terminal 1: Backend
cd backend-api && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Browser
open http://localhost:5173
```

**Happy coding! 🎯**
