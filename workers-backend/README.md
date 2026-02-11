# Welcome to Your Miaoda Project
Miaoda Application Link URL
    URL:https://medo.dev/projects/app-80an9ymym5mp

# Cloudflare Workers Backend

This directory contains a Cloudflare Workers version of the ChaseMyCareer backend API.

## Features

- ✅ Built with Hono framework (Express-like API)
- ✅ All existing routes and controllers
- ✅ Supabase integration
- ✅ JWT authentication
- ✅ CORS handling
- ✅ Rate limiting
- ✅ Error handling
- ✅ TypeScript support

## Structure

```
workers-backend/
├── src/
│   ├── index.ts              # Main Workers entry point
│   ├── config/
│   │   └── supabase.ts       # Supabase client
│   ├── middleware/
│   │   ├── auth.ts           # JWT authentication
│   │   ├── cors.ts           # CORS handling
│   │   └── errorHandler.ts  # Error handling
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── taskController.ts
│   │   └── applicationController.ts
│   └── routes/
│       ├── authRoutes.ts
│       ├── userRoutes.ts
│       ├── taskRoutes.ts
│       └── applicationRoutes.ts
├── wrangler.toml             # Cloudflare Workers config
├── package.json
└── tsconfig.json
```

## Deployment

### Prerequisites

1. Cloudflare account (free)
2. Node.js 18+ installed
3. Wrangler CLI installed

### Steps

1. **Install dependencies:**
   ```bash
   cd workers-backend
   npm install
   ```

2. **Configure wrangler.toml:**
   - Update `account_id` with your Cloudflare Account ID
   - Get it from: https://dash.cloudflare.com → Workers & Pages

3. **Set environment variables:**
   ```bash
   npx wrangler secret put SUPABASE_URL
   npx wrangler secret put SUPABASE_ANON_KEY
   npx wrangler secret put SUPABASE_SERVICE_KEY
   npx wrangler secret put JWT_SECRET
   ```

4. **Deploy:**
   ```bash
   npx wrangler deploy
   ```

5. **Get your URL:**
   - Your API will be available at: `https://chasemycareer-api.your-subdomain.workers.dev`

## Environment Variables

Required secrets (set via `wrangler secret put`):

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_KEY` - Supabase service role key
- `JWT_SECRET` - Secret for JWT signing
- `FRONTEND_URL` - Your frontend URL (for CORS)

## API Endpoints

All endpoints are prefixed with `/api/v1`:

### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `GET /api/v1/users` - Get all users (admin only)

### Tasks
- `GET /api/v1/tasks` - Get user's tasks
- `GET /api/v1/tasks/:id` - Get specific task
- `PUT /api/v1/tasks/:id` - Update task
- `POST /api/v1/tasks/:id/complete` - Mark task complete

### Applications
- `GET /api/v1/applications` - Get user's applications
- `POST /api/v1/applications` - Create application
- `GET /api/v1/applications/:id` - Get specific application
- `PUT /api/v1/applications/:id` - Update application
- `DELETE /api/v1/applications/:id` - Delete application

### Health
- `GET /health` - Health check endpoint

## Development

### Local Development

```bash
npm run dev
```

This starts a local development server at `http://localhost:8787`

### Build

```bash
npm run build
```

### Deploy

```bash
npm run deploy
```

## Differences from Express Version

1. **Framework:** Uses Hono instead of Express
2. **Middleware:** Adapted for Workers environment
3. **Environment:** Runs on Cloudflare's edge network
4. **Deployment:** Single command deployment
5. **Cost:** Completely free (100,000 requests/day)

## Benefits

- ✅ **Free:** 100,000 requests/day on free plan
- ✅ **Fast:** Runs on Cloudflare's global edge network
- ✅ **No Sleep:** Always on, no cold starts
- ✅ **Scalable:** Automatic scaling
- ✅ **Simple:** Single command deployment

## Troubleshooting

### Issue: "account_id" error
- Update `account_id` in `wrangler.toml` with your actual Cloudflare Account ID

### Issue: Environment variables not working
- Set secrets using `npx wrangler secret put SECRET_NAME`
- Don't use `.env` file for production secrets

### Issue: CORS errors
- Update `FRONTEND_URL` secret with your frontend URL
- Check CORS middleware configuration

## Support

For issues or questions:
1. Check wrangler logs: `npx wrangler tail`
2. View deployment logs in Cloudflare Dashboard
3. Refer to main documentation in parent directory

## License

MIT License - Same as main project
