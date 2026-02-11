# 🚀 Deploy Backend to Cloudflare Workers - Complete Guide

## Overview

I've created a complete Cloudflare Workers version of your backend using the Hono framework (Express-like API). This version is:

- ✅ **100% Free** - 100,000 requests/day on free plan
- ✅ **No Sleep** - Always on, instant response
- ✅ **Fast** - Runs on Cloudflare's global edge network
- ✅ **Same Features** - All routes and functionality preserved
- ✅ **Easy Deploy** - Single command deployment

---

## 📁 Project Structure

```
workers-backend/
├── src/
│   ├── index.ts                    # Main entry point (Hono app)
│   ├── config/
│   │   └── supabase.ts             # Supabase client setup
│   ├── middleware/
│   │   ├── auth.ts                 # JWT authentication
│   │   ├── errorHandler.ts         # Error handling
│   │   └── rateLimiter.ts          # Rate limiting
│   ├── controllers/
│   │   ├── authController.ts       # Auth logic
│   │   ├── userController.ts       # User management
│   │   ├── taskController.ts       # Task management
│   │   └── applicationController.ts # Job applications
│   └── routes/
│       ├── authRoutes.ts           # Auth endpoints
│       ├── userRoutes.ts           # User endpoints
│       ├── taskRoutes.ts           # Task endpoints
│       └── applicationRoutes.ts    # Application endpoints
├── wrangler.toml                   # Cloudflare config
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎯 Step-by-Step Deployment

### Step 1: Get Your Cloudflare Account ID

1. Go to https://dash.cloudflare.com
2. Click "Workers & Pages" in the left sidebar
3. Your **Account ID** is shown in the right sidebar
4. Copy it (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### Step 2: Update Configuration

Edit `workers-backend/wrangler.toml`:

```toml
# Replace this line:
account_id = "YOUR_CLOUDFLARE_ACCOUNT_ID"

# With your actual Account ID:
account_id = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
```

### Step 3: Install Dependencies

```bash
cd workers-backend
npm install
```

### Step 4: Set Environment Secrets

Run these commands one by one (you'll be prompted to enter each value):

```bash
# Supabase URL
npx wrangler secret put SUPABASE_URL
# Enter: https://itazzlbcxisavqxvkmoe.supabase.co

# Supabase Anon Key
npx wrangler secret put SUPABASE_ANON_KEY
# Enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0YXp6bGJjeGlzYXZxeHZrbW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4ODA4MjEsImV4cCI6MjA4MDQ1NjgyMX0.Ui25zCnqsLlRRipioBhNULvfjvFLHrz3TozSgSsKWHo

# Supabase Service Key (get from Supabase dashboard)
npx wrangler secret put SUPABASE_SERVICE_KEY
# Enter: your_service_role_key

# JWT Secret (create a random string)
npx wrangler secret put JWT_SECRET
# Enter: your-super-secret-jwt-key-12345

# Frontend URL
npx wrangler secret put FRONTEND_URL
# Enter: https://chasemycareer.vercel.app
```

### Step 5: Deploy to Cloudflare

```bash
npx wrangler deploy
```

Wait for deployment (about 30 seconds).

### Step 6: Get Your API URL

After deployment, you'll see output like:

```
Published chasemycareer-api (1.23 sec)
  https://chasemycareer-api.your-subdomain.workers.dev
```

**Copy this URL** - this is your backend API!

### Step 7: Test Your API

```bash
# Test health endpoint
curl https://chasemycareer-api.your-subdomain.workers.dev/health
```

Should return:
```json
{
  "status": "success",
  "message": "ChaseMyCareer API is running on Cloudflare Workers",
  "timestamp": "2026-01-02T...",
  "version": "v1",
  "environment": "production"
}
```

### Step 8: Update Frontend

Update `frontend/.env`:

```env
VITE_API_BASE_URL=https://chasemycareer-api.your-subdomain.workers.dev/api/v1
```

### Step 9: Redeploy Frontend

```bash
cd frontend
vercel --prod
```

### Step 10: Test Complete Application

1. Open your Vercel URL
2. Login with test user:
   - Email: `user@jobtracker.test`
   - Password: `UserTest123!@#`
3. Verify everything works!

---

## 🎉 Success!

Your backend is now running on Cloudflare Workers:

- **Backend API:** https://chasemycareer-api.your-subdomain.workers.dev
- **Frontend:** https://chasemycareer.vercel.app
- **Database:** Supabase (already configured)

---

## 📊 API Endpoints

All endpoints are prefixed with `/api/v1`:

### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### Users (Protected)
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `GET /api/v1/users` - Get all users (admin only)

### Tasks (Protected)
- `GET /api/v1/tasks` - Get user's tasks
- `GET /api/v1/tasks/:id` - Get specific task
- `PUT /api/v1/tasks/:id` - Update task
- `POST /api/v1/tasks/:id/complete` - Mark task complete

### Applications (Protected)
- `GET /api/v1/applications` - Get user's applications
- `POST /api/v1/applications` - Create application
- `GET /api/v1/applications/:id` - Get specific application
- `PUT /api/v1/applications/:id` - Update application
- `DELETE /api/v1/applications/:id` - Delete application

### Health
- `GET /health` - Health check endpoint

---

## 🔧 Local Development

### Run Locally

```bash
cd workers-backend
npm run dev
```

This starts a local development server at `http://localhost:8787`

### Test Locally

```bash
# Health check
curl http://localhost:8787/health

# Login
curl -X POST http://localhost:8787/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@jobtracker.test","password":"UserTest123!@#"}'
```

---

## 🐛 Troubleshooting

### Issue: "account_id" error

**Solution:**
1. Get your Account ID from https://dash.cloudflare.com
2. Update `wrangler.toml` with your actual Account ID

### Issue: "Secret not found"

**Solution:**
```bash
# List all secrets
npx wrangler secret list

# Add missing secret
npx wrangler secret put SECRET_NAME
```

### Issue: CORS errors

**Solution:**
1. Update `FRONTEND_URL` secret:
   ```bash
   npx wrangler secret put FRONTEND_URL
   # Enter your Vercel URL
   ```
2. Redeploy:
   ```bash
   npx wrangler deploy
   ```

### Issue: Authentication not working

**Solution:**
1. Verify `JWT_SECRET` is set:
   ```bash
   npx wrangler secret list
   ```
2. Check Supabase credentials are correct
3. View logs:
   ```bash
   npx wrangler tail
   ```

---

## 📝 Environment Variables

### Required Secrets (set via `wrangler secret put`)

| Secret | Description | Example |
|--------|-------------|---------|
| `SUPABASE_URL` | Supabase project URL | https://xxx.supabase.co |
| `SUPABASE_ANON_KEY` | Supabase anon key | eyJhbGciOiJIUzI1NiIs... |
| `SUPABASE_SERVICE_KEY` | Supabase service key | eyJhbGciOiJIUzI1NiIs... |
| `JWT_SECRET` | JWT signing secret | your-secret-key-123 |
| `FRONTEND_URL` | Frontend URL for CORS | https://xxx.vercel.app |

### Public Variables (in wrangler.toml)

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | production | Environment |
| `API_VERSION` | v1 | API version |
| `JWT_EXPIRES_IN` | 7d | Token expiry |

---

## 🔄 Update Deployment

### Update Code

```bash
cd workers-backend
npm run deploy
```

### Update Secrets

```bash
npx wrangler secret put SECRET_NAME
```

### View Logs

```bash
npx wrangler tail
```

---

## 💰 Cost & Limits

### Free Plan

- **Requests:** 100,000 per day
- **CPU Time:** 10ms per request
- **Memory:** 128 MB
- **Storage:** None (using Supabase)

### Paid Plan (if needed)

- **Cost:** $5/month
- **Requests:** 10 million per month
- **CPU Time:** 50ms per request
- **Memory:** 128 MB

**For your use case, the free plan is more than enough!**

---

## 📊 Monitoring

### View Logs

```bash
npx wrangler tail
```

### View Analytics

1. Go to https://dash.cloudflare.com
2. Click "Workers & Pages"
3. Click on "chasemycareer-api"
4. View metrics and logs

---

## ✅ Advantages of Cloudflare Workers

1. **Free:** 100,000 requests/day
2. **Fast:** Global edge network
3. **No Sleep:** Always on, instant response
4. **Scalable:** Automatic scaling
5. **Simple:** Single command deployment
6. **Reliable:** 99.99% uptime
7. **Secure:** Built-in DDoS protection

---

## 🆚 Comparison with Other Options

| Feature | Cloudflare Workers | Railway | Render | Vercel |
|---------|-------------------|---------|--------|--------|
| **Free Tier** | 100k req/day | $5 credit | 750h/mo | Unlimited |
| **Sleep** | No | No | Yes (15min) | No |
| **Cold Start** | <1ms | Fast | 30-60s | <1s |
| **Setup** | Medium | Easy | Easy | Medium |
| **Cost** | Free | $5/mo | Free | Free |

---

## 🎯 Next Steps

1. ✅ Deploy backend to Cloudflare Workers
2. ✅ Update frontend with Workers URL
3. ✅ Redeploy frontend to Vercel
4. ✅ Test complete application
5. ✅ Monitor logs and analytics
6. ✅ Share your deployed app!

---

## 📞 Support

### View Logs

```bash
npx wrangler tail
```

### Check Deployment

```bash
npx wrangler deployments list
```

### Get Help

```bash
npx wrangler --help
```

---

**Status:** ✅ Ready to Deploy  
**Time:** 10 minutes  
**Cost:** $0/month (free tier)  
**Difficulty:** Medium

---

**Last Updated:** January 2, 2026  
**Project:** ChaseMyCareer  
**Backend:** Cloudflare Workers + Hono  
**Database:** Supabase PostgreSQL
