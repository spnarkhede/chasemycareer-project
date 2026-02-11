#!/bin/bash

# CareerPath50 Project Restructuring Script
# This script reorganizes the project into frontend and backend folders

set -e  # Exit on error

echo "🚀 CareerPath50 Project Restructuring Script"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  This script will reorganize your project structure.${NC}"
echo -e "${YELLOW}   Make sure you have committed your changes before proceeding.${NC}"
echo ""
read -p "Do you want to continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo "📁 Step 1: Creating directory structure..."

# Create main directories
mkdir -p frontend
mkdir -p backend
mkdir -p docs

echo -e "${GREEN}✓${NC} Directories created"

echo ""
echo "📦 Step 2: Moving frontend files..."

# Move frontend source code
if [ -d "src" ]; then
    mv src frontend/ 2>/dev/null || echo "  src already moved"
fi

if [ -d "public" ]; then
    mv public frontend/ 2>/dev/null || echo "  public already moved"
fi

# Move frontend configuration files
for file in vite.config.ts vite.config.dev.ts tailwind.config.js postcss.config.js \
            tsconfig.json tsconfig.app.json tsconfig.node.json tsconfig.check.json \
            components.json biome.json index.html; do
    if [ -f "$file" ]; then
        mv "$file" frontend/ 2>/dev/null || echo "  $file already moved"
    fi
done

# Move .rules directory if it exists
if [ -d ".rules" ]; then
    mv .rules frontend/ 2>/dev/null || echo "  .rules already moved"
fi

echo -e "${GREEN}✓${NC} Frontend files moved"

echo ""
echo "🗄️  Step 3: Moving backend files..."

# Move Supabase directory
if [ -d "supabase" ]; then
    mv supabase backend/ 2>/dev/null || echo "  supabase already moved"
fi

echo -e "${GREEN}✓${NC} Backend files moved"

echo ""
echo "📝 Step 4: Creating package.json files..."

# Create frontend package.json
cat > frontend/package.json << 'EOF'
{
  "name": "careerpath50-frontend",
  "version": "1.0.0",
  "type": "module",
  "description": "CareerPath50 Frontend - React Application",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "tsgo -p tsconfig.check.json && npx biome lint && npx tailwindcss -i ./src/index.css -o /dev/null 2>&1 | grep -E '^(CssSyntaxError|Error):.*' || true",
    "type-check": "tsc --noEmit",
    "format": "npx biome format --write ."
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-icons": "^1.3.2",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.16",
    "@radix-ui/react-navigation-menu": "^1.2.14",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toast": "^1.2.15",
    "@radix-ui/react-toggle": "^1.1.10",
    "@radix-ui/react-toggle-group": "^1.1.11",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@react-oauth/google": "^0.12.2",
    "@supabase/supabase-js": "^2.76.1",
    "@types/bcryptjs": "^3.0.0",
    "axios": "^1.13.1",
    "bcryptjs": "^3.0.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.6.0",
    "eventsource-parser": "^3.0.6",
    "input-otp": "^1.4.2",
    "jwt-decode": "^4.0.0",
    "ky": "^1.13.0",
    "lucide-react": "^0.553.0",
    "miaoda-auth-react": "2.0.6",
    "miaoda-sc-plugin": "1.0.51",
    "next-themes": "^0.4.6",
    "qrcode": "^1.5.4",
    "react": "^18.0.0",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.0.0",
    "react-dropzone": "^14.3.8",
    "react-helmet-async": "^2.0.5",
    "react-hook-form": "^7.66.0",
    "react-resizable-panels": "^2.1.8",
    "react-router": "^7.9.5",
    "react-router-dom": "^7.9.5",
    "recharts": "^2.15.3",
    "sonner": "^2.0.7",
    "streamdown": "^1.4.0",
    "tailwind-merge": "^3.3.1",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^1.1.2",
    "video-react": "^0.16.0",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@biomejs/biome": "2.3.4",
    "@tailwindcss/container-queries": "^0.1.1",
    "@types/lodash": "^4.17.20",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.2",
    "@types/video-react": "^0.15.8",
    "@typescript/native-preview": "7.0.0-dev.20251103.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.21",
    "miaoda-sc-plugin": "^1.0.4",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.11",
    "typescript": "~5.9.3",
    "vite": "^5.1.4",
    "vite-plugin-svgr": "^4.5.0"
  }
}
EOF

# Create backend package.json
cat > backend/package.json << 'EOF'
{
  "name": "careerpath50-backend",
  "version": "1.0.0",
  "description": "CareerPath50 Backend - Supabase",
  "scripts": {
    "start": "npx supabase start",
    "stop": "npx supabase stop",
    "status": "npx supabase status",
    "db:push": "npx supabase db push",
    "db:reset": "npx supabase db reset",
    "db:lint": "npx supabase db lint",
    "db:pull": "npx supabase db pull",
    "migration:new": "npx supabase migration new",
    "functions:serve": "npx supabase functions serve",
    "functions:deploy": "npx supabase functions deploy"
  },
  "dependencies": {
    "supabase": "^1.142.2"
  }
}
EOF

# Create root package.json
cat > package.json << 'EOF'
{
  "name": "careerpath50",
  "version": "1.0.0",
  "description": "CareerPath50 - 50-Day Job Search Platform",
  "private": true,
  "workspaces": [
    "frontend",
    "backend"
  ],
  "scripts": {
    "install:all": "npm install && cd frontend && npm install && cd ../backend && npm install && cd ..",
    "dev": "concurrently -n \"frontend,backend\" -c \"cyan,magenta\" \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run start",
    "build": "cd frontend && npm run build",
    "lint": "cd frontend && npm run lint",
    "test": "npm run lint",
    "clean": "rm -rf frontend/node_modules frontend/dist backend/node_modules node_modules",
    "clean:install": "npm run clean && npm run install:all"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
EOF

echo -e "${GREEN}✓${NC} Package.json files created"

echo ""
echo "🔧 Step 5: Creating environment file templates..."

# Create frontend .env.example
if [ -f ".env.template" ]; then
    cp .env.template frontend/.env.example
fi

cat > frontend/.env.example << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Google OAuth (optional)
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Cloudflare (optional)
VITE_CLOUDFLARE_ACCOUNT_ID=your-account-id
VITE_CLOUDFLARE_API_TOKEN=your-api-token
VITE_CLOUDFLARE_WORKER_URL=https://your-worker.workers.dev

# Application
VITE_APP_ID=chasemycareer
VITE_API_ENV=development
EOF

# Create backend .env.example
cat > backend/.env.example << 'EOF'
# Supabase Project
SUPABASE_PROJECT_REF=your-project-ref
SUPABASE_DB_PASSWORD=your-db-password
SUPABASE_ACCESS_TOKEN=your-access-token

# Local Development
SUPABASE_DB_PORT=54322
SUPABASE_STUDIO_PORT=54323
SUPABASE_API_PORT=54321
EOF

echo -e "${GREEN}✓${NC} Environment templates created"

echo ""
echo "📚 Step 6: Moving documentation..."

# Move Cloudflare documentation to docs
for file in CLOUDFLARE_*.md; do
    if [ -f "$file" ]; then
        mv "$file" docs/ 2>/dev/null || echo "  $file already moved"
    fi
done

echo -e "${GREEN}✓${NC} Documentation organized"

echo ""
echo "🎉 Restructuring complete!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Install dependencies:"
echo "   ${GREEN}npm run install:all${NC}"
echo ""
echo "2. Configure environment variables:"
echo "   - Copy ${YELLOW}frontend/.env.example${NC} to ${YELLOW}frontend/.env.local${NC}"
echo "   - Copy ${YELLOW}backend/.env.example${NC} to ${YELLOW}backend/.env${NC}"
echo "   - Fill in your actual values"
echo ""
echo "3. Start development:"
echo "   ${GREEN}npm run dev${NC}"
echo ""
echo "   Or run separately:"
echo "   ${GREEN}cd frontend && npm run dev${NC}"
echo "   ${GREEN}cd backend && npm run start${NC}"
echo ""
echo "📖 For detailed instructions, see:"
echo "   - LOCAL_DEVELOPMENT_GUIDE.md"
echo "   - frontend/README.md"
echo "   - backend/README.md"
echo ""
echo -e "${GREEN}✨ Happy coding!${NC}"
