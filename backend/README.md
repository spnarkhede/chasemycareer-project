# ChaseMyCareer Backend

Supabase-powered backend for the ChaseMyCareer job search platform.

## 🚀 Quick Start

```bash
# Install Supabase CLI
npm install

# Start local Supabase
npx supabase start

# Apply migrations
npx supabase db push
```

## 📋 Prerequisites

- Docker Desktop (for local Supabase)
- Node.js 18 or higher
- Supabase account (for cloud deployment)

## 🛠️ Installation

### 1. Install Dependencies

```bash
npm install
```

This installs:
- Supabase CLI
- Edge function dependencies
- Development tools

### 2. Configure Environment

Create `.env` file:

```env
# Supabase Project
SUPABASE_PROJECT_REF=your-project-ref
SUPABASE_DB_PASSWORD=your-db-password
SUPABASE_ACCESS_TOKEN=your-access-token

# Local Development (optional)
SUPABASE_DB_PORT=54322
SUPABASE_STUDIO_PORT=54323
SUPABASE_API_PORT=54321
```

### 3. Initialize Supabase

```bash
# Initialize (first time only)
npx supabase init

# Start local instance
npx supabase start
```

## 📁 Project Structure

```
backend/
├── supabase/
│   ├── functions/           # Edge functions
│   │   └── hello-world/     # Example function
│   ├── migrations/          # Database migrations
│   │   ├── 00001_create_profiles_table.sql
│   │   ├── 00002_create_job_tracker_schema.sql
│   │   ├── 00003_create_auth_security_tables.sql
│   │   ├── 00004_create_oauth_tokens_table.sql
│   │   ├── 00005_add_user_preferences.sql
│   │   └── 00099_create_test_users.sql
│   ├── config.toml          # Supabase configuration
│   └── seed.sql             # Seed data (optional)
├── .env                     # Environment variables (create this)
├── package.json             # Dependencies
└── README.md                # This file
```

## 🗄️ Database

### Schema Overview

#### Core Tables
- **profiles** - User profile information
- **user_onboarding** - Onboarding progress
- **daily_tasks** - 50-day program tasks
- **job_applications** - Job application tracking
- **interviews** - Interview scheduling
- **documents** - Resume and cover letters
- **networking_contacts** - Professional contacts
- **networking_messages** - Message templates
- **interview_questions** - Practice questions
- **interview_practice_sessions** - Practice history

#### Auth Tables
- **user_preferences** - User settings
- **oauth_tokens** - OAuth credentials
- **password_reset_tokens** - Password reset flow

### Running Migrations

```bash
# Apply all migrations
npx supabase db push

# Create new migration
npx supabase migration new migration_name

# Reset database (caution: deletes all data)
npx supabase db reset

# Pull remote schema
npx supabase db pull
```

### Migration Best Practices

1. **Always use migrations** for schema changes
2. **Test locally** before pushing to production
3. **Use descriptive names** for migrations
4. **Include rollback logic** when possible
5. **Never edit existing migrations** after deployment

### Example Migration

```sql
-- Create new table
CREATE TABLE IF NOT EXISTS public.example (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.example ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can view own data"
  ON public.example
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create index
CREATE INDEX idx_example_user_id ON public.example(user_id);
```

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with policies:

### Common Policy Patterns

```sql
-- Users can view own data
CREATE POLICY "view_own" ON table_name
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert own data
CREATE POLICY "insert_own" ON table_name
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update own data
CREATE POLICY "update_own" ON table_name
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete own data
CREATE POLICY "delete_own" ON table_name
  FOR DELETE USING (auth.uid() = user_id);

-- Public read access
CREATE POLICY "public_read" ON table_name
  FOR SELECT USING (true);
```

## ⚡ Edge Functions

### Creating Edge Functions

```bash
# Create new function
npx supabase functions new function-name

# Serve locally
npx supabase functions serve

# Deploy to cloud
npx supabase functions deploy function-name
```

### Example Edge Function

```typescript
// supabase/functions/hello-world/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    // Get Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Your logic here
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .limit(1)

    if (error) throw error

    return new Response(
      JSON.stringify({ data }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

### Edge Function Best Practices

1. **Handle CORS** properly
2. **Validate input** data
3. **Use environment variables** for secrets
4. **Implement error handling**
5. **Keep functions small** and focused
6. **Test locally** before deploying

## 🧪 Testing

### Database Testing

```bash
# Test connection
npx supabase db ping

# Validate migrations
npx supabase db lint

# Check database status
npx supabase status
```

### Edge Function Testing

```bash
# Serve functions locally
npx supabase functions serve

# Test with curl
curl -i --location --request POST 'http://localhost:54321/functions/v1/hello-world' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"name":"Functions"}'
```

## 📜 Available Scripts

### Supabase Management

```bash
# Start local Supabase
npx supabase start

# Stop local Supabase
npx supabase stop

# Check status
npx supabase status

# View logs
npx supabase logs
```

### Database Operations

```bash
# Apply migrations
npx supabase db push

# Create migration
npx supabase migration new <name>

# Reset database
npx supabase db reset

# Dump database
npx supabase db dump -f backup.sql

# Restore database
psql -h localhost -p 54322 -U postgres -d postgres -f backup.sql
```

### Edge Functions

```bash
# Create function
npx supabase functions new <name>

# Serve locally
npx supabase functions serve

# Deploy function
npx supabase functions deploy <name>

# Delete function
npx supabase functions delete <name>
```

## 🔧 Configuration

### Supabase Config (`config.toml`)

```toml
[api]
port = 54321
schemas = ["public", "storage"]
max_rows = 1000

[db]
port = 54322
major_version = 15

[studio]
port = 54323

[auth]
site_url = "http://localhost:5173"
additional_redirect_urls = ["http://localhost:3000"]
jwt_expiry = 3600
enable_signup = true

[auth.email]
enable_signup = true
double_confirm_changes = true
enable_confirmations = false
```

### Environment Variables

```env
# Project
SUPABASE_PROJECT_REF=xxxxx
SUPABASE_DB_PASSWORD=xxxxx
SUPABASE_ACCESS_TOKEN=xxxxx

# Local Ports
SUPABASE_DB_PORT=54322
SUPABASE_STUDIO_PORT=54323
SUPABASE_API_PORT=54321
SUPABASE_INBUCKET_PORT=54324

# JWT Secret (local only)
SUPABASE_JWT_SECRET=xxxxx
```

## 🌐 Accessing Services

### Local Development

- **Supabase Studio:** http://localhost:54323
- **API Gateway:** http://localhost:54321
- **Database:** postgresql://postgres:postgres@localhost:54322/postgres
- **Inbucket (Email):** http://localhost:54324

### Cloud Production

- **Supabase Dashboard:** https://supabase.com/dashboard
- **API:** https://your-project.supabase.co
- **Database:** Connection string from dashboard

## 🔐 Security

### Best Practices

1. **Enable RLS** on all tables
2. **Use policies** for access control
3. **Validate input** in edge functions
4. **Store secrets** in environment variables
5. **Use service role** key only in backend
6. **Rotate keys** regularly
7. **Monitor logs** for suspicious activity

### Service Role vs Anon Key

- **Anon Key:** Public, used in frontend, respects RLS
- **Service Role:** Private, bypasses RLS, backend only

```typescript
// Frontend (anon key)
const supabase = createClient(url, anonKey)

// Backend (service role)
const supabase = createClient(url, serviceRoleKey)
```

## 📊 Monitoring

### Database Metrics

```bash
# Check database size
npx supabase db size

# View active connections
npx supabase db connections

# Check slow queries
npx supabase db slow-queries
```

### Logs

```bash
# View all logs
npx supabase logs

# View API logs
npx supabase logs api

# View database logs
npx supabase logs db

# View function logs
npx supabase logs functions
```

## 🚀 Deployment

### Deploy to Cloud

```bash
# Link to cloud project
npx supabase link --project-ref your-project-ref

# Push migrations
npx supabase db push

# Deploy functions
npx supabase functions deploy

# Verify deployment
npx supabase db remote status
```

### CI/CD Integration

```yaml
# .github/workflows/deploy.yml
name: Deploy to Supabase

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        
      - name: Link project
        run: npx supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
        
      - name: Push migrations
        run: npx supabase db push
        
      - name: Deploy functions
        run: npx supabase functions deploy
```

## 🐛 Troubleshooting

### Common Issues

**Docker not running:**
```bash
# Start Docker Desktop
# Then restart Supabase
npx supabase stop
npx supabase start
```

**Port conflicts:**
```bash
# Change ports in config.toml
[db]
port = 54322  # Change if needed
```

**Migration errors:**
```bash
# Check syntax
npx supabase db lint

# Reset and reapply
npx supabase db reset
```

**Function deployment fails:**
```bash
# Check function logs
npx supabase functions logs function-name

# Verify Deno imports
deno cache --reload supabase/functions/function-name/index.ts
```

### Debug Mode

```bash
# Enable debug logging
export SUPABASE_DEBUG=true
npx supabase start
```

## 📚 Resources

### Documentation
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Deno Docs](https://deno.land/manual)

### Project Docs
- [Local Development Guide](../LOCAL_DEVELOPMENT_GUIDE.md)
- [Frontend README](../frontend/README.md)

## 🤝 Contributing

1. Create feature branch
2. Create migration: `npx supabase migration new feature_name`
3. Test locally: `npx supabase db reset`
4. Validate: `npx supabase db lint`
5. Submit pull request

## 📄 License

See main project LICENSE file.

---

**Need help?** Check the [Local Development Guide](../LOCAL_DEVELOPMENT_GUIDE.md) or [Troubleshooting](#-troubleshooting) section.
