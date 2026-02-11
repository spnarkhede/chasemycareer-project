# 🚀 ChaseMyCareer - Quick Start

## ⚡ Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm run install:all
```

### Step 2: Configure Environment
```bash
# Copy environment template
cp frontend/.env.example frontend/.env.local

# Edit with your Supabase credentials
nano frontend/.env.local
```

Add your Supabase URL and key:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 3: Start Development
```bash
npm run dev
```

Visit **http://localhost:5173** 🎉

---

## 📁 Project Structure

```
chasemycareer/
├── frontend/     # React app (edit here for UI)
├── backend/      # Supabase (edit here for database)
├── docs/         # All documentation (83 files)
└── README.md     # Main documentation
```

---

## 📚 Documentation

- **[README.md](./README.md)** - Main documentation
- **[PROJECT_INDEX.md](./PROJECT_INDEX.md)** - Complete project index
- **[docs/GETTING_STARTED.md](./docs/GETTING_STARTED.md)** - Detailed setup guide
- **[docs/RESTRUCTURING_COMPLETE.md](./docs/RESTRUCTURING_COMPLETE.md)** - Restructuring summary
- **[frontend/README.md](./frontend/README.md)** - Frontend guide
- **[backend/README.md](./backend/README.md)** - Backend guide

---

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Run both frontend + backend
npm run dev:frontend     # Run frontend only
npm run dev:backend      # Run backend only

# Building
npm run build            # Build for production

# Testing
npm run lint             # Run linter

# Database
cd backend
npm run db:push          # Apply migrations
npm run migration:new    # Create new migration
```

---

## 🆘 Need Help?

1. Check **[docs/GETTING_STARTED.md](./docs/GETTING_STARTED.md)**
2. Check **[PROJECT_INDEX.md](./PROJECT_INDEX.md)**
3. Browse **docs/** folder for specific topics

---

**Happy coding!** 🎉
