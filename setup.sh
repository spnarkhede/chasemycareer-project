#!/bin/bash

# CareerPath50 Quick Setup Script
# This script helps you get started quickly

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║         CareerPath50 Quick Setup Script              ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Check Node.js
echo -e "${YELLOW}Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo "  Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}✗ Node.js version is too old (need 18+)${NC}"
    echo "  Current version: $(node -v)"
    echo "  Please upgrade from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

# Check Docker (optional)
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker $(docker -v | cut -d' ' -f3 | cut -d',' -f1)${NC}"
    DOCKER_AVAILABLE=true
else
    echo -e "${YELLOW}⚠ Docker not found (optional for local Supabase)${NC}"
    DOCKER_AVAILABLE=false
fi

echo ""

# Ask user what they want to do
echo -e "${BLUE}What would you like to do?${NC}"
echo ""
echo "1) Full setup (restructure + install + configure)"
echo "2) Install dependencies only"
echo "3) Configure environment variables"
echo "4) Start development servers"
echo "5) Exit"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}Starting full setup...${NC}"
        echo ""
        
        # Run restructuring
        if [ -f "restructure.sh" ]; then
            echo -e "${BLUE}Step 1: Restructuring project...${NC}"
            ./restructure.sh
        else
            echo -e "${YELLOW}⚠ Restructuring script not found, skipping...${NC}"
        fi
        
        # Install dependencies
        echo ""
        echo -e "${BLUE}Step 2: Installing dependencies...${NC}"
        npm run install:all
        
        # Configure environment
        echo ""
        echo -e "${BLUE}Step 3: Configuring environment...${NC}"
        
        # Frontend .env.local
        if [ ! -f "frontend/.env.local" ]; then
            if [ -f "frontend/.env.example" ]; then
                cp frontend/.env.example frontend/.env.local
                echo -e "${GREEN}✓ Created frontend/.env.local${NC}"
                echo -e "${YELLOW}  Please edit frontend/.env.local with your Supabase credentials${NC}"
            fi
        else
            echo -e "${YELLOW}⚠ frontend/.env.local already exists${NC}"
        fi
        
        # Backend .env
        if [ ! -f "backend/.env" ]; then
            if [ -f "backend/.env.example" ]; then
                cp backend/.env.example backend/.env
                echo -e "${GREEN}✓ Created backend/.env${NC}"
                echo -e "${YELLOW}  Please edit backend/.env with your Supabase credentials${NC}"
            fi
        else
            echo -e "${YELLOW}⚠ backend/.env already exists${NC}"
        fi
        
        echo ""
        echo -e "${GREEN}✨ Setup complete!${NC}"
        echo ""
        echo -e "${BLUE}Next steps:${NC}"
        echo "1. Edit frontend/.env.local with your Supabase credentials"
        echo "2. Edit backend/.env with your Supabase credentials"
        echo "3. Run: ${GREEN}npm run dev${NC}"
        echo ""
        ;;
        
    2)
        echo ""
        echo -e "${BLUE}Installing dependencies...${NC}"
        npm run install:all
        echo ""
        echo -e "${GREEN}✓ Dependencies installed${NC}"
        ;;
        
    3)
        echo ""
        echo -e "${BLUE}Configuring environment variables...${NC}"
        echo ""
        
        # Frontend configuration
        echo -e "${YELLOW}Frontend Configuration${NC}"
        if [ ! -f "frontend/.env.local" ]; then
            read -p "Enter Supabase URL: " SUPABASE_URL
            read -p "Enter Supabase Anon Key: " SUPABASE_ANON_KEY
            read -p "Enter Google Client ID (optional, press Enter to skip): " GOOGLE_CLIENT_ID
            
            cat > frontend/.env.local << EOF
# Supabase Configuration
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# Google OAuth (optional)
VITE_GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID

# Application
VITE_APP_ID=chasemycareer
VITE_API_ENV=development
EOF
            echo -e "${GREEN}✓ Created frontend/.env.local${NC}"
        else
            echo -e "${YELLOW}⚠ frontend/.env.local already exists${NC}"
        fi
        
        echo ""
        
        # Backend configuration
        if [ "$DOCKER_AVAILABLE" = true ]; then
            echo -e "${YELLOW}Backend Configuration${NC}"
            if [ ! -f "backend/.env" ]; then
                read -p "Enter Supabase Project Ref (optional for local dev): " SUPABASE_REF
                
                cat > backend/.env << EOF
# Supabase Project
SUPABASE_PROJECT_REF=$SUPABASE_REF

# Local Development
SUPABASE_DB_PORT=54322
SUPABASE_STUDIO_PORT=54323
SUPABASE_API_PORT=54321
EOF
                echo -e "${GREEN}✓ Created backend/.env${NC}"
            else
                echo -e "${YELLOW}⚠ backend/.env already exists${NC}"
            fi
        fi
        
        echo ""
        echo -e "${GREEN}✓ Configuration complete${NC}"
        ;;
        
    4)
        echo ""
        echo -e "${BLUE}Starting development servers...${NC}"
        echo ""
        
        # Check if dependencies are installed
        if [ ! -d "frontend/node_modules" ] || [ ! -d "backend/node_modules" ]; then
            echo -e "${YELLOW}⚠ Dependencies not installed. Installing now...${NC}"
            npm run install:all
            echo ""
        fi
        
        # Check if environment is configured
        if [ ! -f "frontend/.env.local" ]; then
            echo -e "${RED}✗ frontend/.env.local not found${NC}"
            echo "  Please run option 3 to configure environment variables first"
            exit 1
        fi
        
        echo -e "${GREEN}Starting servers...${NC}"
        echo ""
        echo -e "${BLUE}Frontend:${NC} http://localhost:5173"
        if [ "$DOCKER_AVAILABLE" = true ]; then
            echo -e "${BLUE}Backend:${NC} http://localhost:54323"
        fi
        echo ""
        echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
        echo ""
        
        npm run dev
        ;;
        
    5)
        echo ""
        echo "Goodbye!"
        exit 0
        ;;
        
    *)
        echo ""
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}For more information, see:${NC}"
echo "  - LOCAL_DEVELOPMENT_GUIDE.md"
echo "  - frontend/README.md"
echo "  - backend/README.md"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""
