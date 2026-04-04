# ⚠️ BACKEND NOT RUNNING

## Error: Failed to load resource: net::ERR_CONNECTION_REFUSED

This means the backend server is not started.

## ✅ Fix: Start Backend

Open **NEW TERMINAL** and run:

```bash
cd "C:\Workspace\sac net exam\backend"
npm run dev
```

Wait for: `✅ MongoDB Connected` and `🚀 Server running on port 5000`

## 🗄️ First Time? Seed Database

If this is your first time:

```bash
cd backend
npm run seed
npm run dev
```

## ✅ Warnings Fixed

React Router warnings have been fixed. They were just future compatibility notices.

## 🎯 Complete Startup

**Terminal 1 - Backend:**
```bash
cd backend
npm run seed    # First time only
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access:** http://localhost:3000

**Login:**
- Admin: admin@exam.com / admin123
- Student: student@exam.com / student123
