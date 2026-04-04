# ⚡ QUICK REFERENCE - START HERE

## 🎯 Your App is Running!

**Frontend:** http://localhost:3001 ✅  
**Backend:** Need to start (see below)

## 🚀 Start Backend Now

Open **NEW TERMINAL** and run:

```bash
cd "C:\Workspace\sac net exam\backend"
npm run dev
```

Wait for: `🚀 Server running on port 5000`

## 🌐 Access Application

Once backend is running, open browser:

**URL:** http://localhost:3001

## 👤 Login Credentials

### Admin
- Email: `admin@exam.com`
- Password: `admin123`

### Student  
- Email: `student@exam.com`
- Password: `student123`

## ⚠️ First Time Setup

If you haven't seeded the database yet:

```bash
# In backend terminal (Ctrl+C to stop server first)
npm run seed

# Then restart
npm run dev
```

## 📊 What You'll See

### Admin Dashboard
- Analytics cards
- Subject management
- Question bank
- Exam creation
- Results & publishing
- PDF/Excel export

### Student Dashboard
- Available exams
- Take exams
- View results

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
# Update backend/.env with correct MONGODB_URI
```

### Can't login
```bash
# Run seed script first
cd backend
npm run seed
```

### Port 3001 instead of 3000
✅ **This is fine!** Just use http://localhost:3001

## ✅ Current Status

- [x] Frontend installed
- [x] Frontend running on port 3001
- [ ] Backend needs to start
- [ ] Database needs seeding (if first time)

## 🎉 You're Almost There!

Just start the backend and you're ready to go!
