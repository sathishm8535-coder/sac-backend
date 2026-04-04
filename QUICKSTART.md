# ⚡ QUICK START GUIDE

## 🎯 Get Started in 3 Steps

### Step 1: Setup (One Time)
```bash
# Run automated setup
setup.bat
```
This installs all dependencies for both backend and frontend.

### Step 2: Seed Database (One Time)
```bash
cd backend
npm run seed
```
This creates test data:
- Admin: admin@exam.com / admin123
- Student: student@exam.com / student123
- 3 Subjects + 5 Questions

### Step 3: Start Application
```bash
# Terminal 1 - Start Backend
start-backend.bat

# Terminal 2 - Start Frontend  
start-frontend.bat
```

## 🌐 Access Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 👤 Login Credentials

### Admin Account
- Email: `admin@exam.com`
- Password: `admin123`
- Access: Full system control

### Student Account
- Email: `student@exam.com`
- Password: `student123`
- Access: Take exams, view results

## 📋 What to Test

### As Admin:
1. Login → View Dashboard
2. Create Subject (e.g., "History")
3. Add Questions (MCQ format)
4. Create Exam (select questions, set duration)
5. View Results → Publish Results
6. Export PDF/Excel

### As Student:
1. Login → View Available Exams
2. Start Exam → Answer Questions
3. Watch Timer → Submit
4. View Published Results

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Update backend/.env with your MongoDB URI
MONGODB_URI=mongodb://localhost:27017/exam-system
# OR use MongoDB Atlas connection string
```

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000 (frontend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module Not Found
```bash
# Reinstall dependencies
cd backend
npm install

cd ../frontend
npm install
```

## 📚 Full Documentation

- **INSTALLATION.md** - Complete setup guide
- **TESTING.md** - Testing procedures
- **API.md** - API documentation
- **PROJECT_SUMMARY.md** - Complete project overview

## ✅ Features

✅ JWT Authentication  
✅ Role-Based Access  
✅ Auto-Evaluation  
✅ Timer with Auto-Submit  
✅ Result Publishing  
✅ PDF & Excel Export  
✅ Analytics Dashboard  
✅ Responsive Design  

## 🎉 You're Ready!

The complete exam management system is now set up and ready to use.

**Happy Testing! 🚀**
