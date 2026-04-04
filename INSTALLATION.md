# 🚀 Complete Installation & Setup Guide

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (Local or Atlas) - [Download](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** (optional) - [Download](https://git-scm.com/)

## ⚡ Quick Setup (Windows)

### Option 1: Automated Setup
```bash
# Run the setup script
setup.bat
```

### Option 2: Manual Setup

#### 1️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file (if not exists)
copy .env.example .env
```

**Edit `backend/.env`:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/exam-system
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/exam-system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
NODE_ENV=development
```

#### 2️⃣ Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file (if not exists)
copy .env.example .env
```

**Edit `frontend/.env`:**
```env
VITE_API_URL=http://localhost:5000
```

## 🎯 Running the Application

### Start Backend
```bash
cd backend
npm run dev
```
✅ Backend will run on: `http://localhost:5000`

### Start Frontend (in new terminal)
```bash
cd frontend
npm run dev
```
✅ Frontend will run on: `http://localhost:3000`

### Quick Start Scripts
```bash
# Start backend
start-backend.bat

# Start frontend (in new terminal)
start-frontend.bat
```

## 🗄️ MongoDB Setup

### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/exam-system`

### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `backend/.env`

## 👤 Default Users

After setup, register users with these roles:

### Admin Account
- Email: `admin@exam.com`
- Password: `admin123`
- Role: `admin`

### Student Account
- Email: `student@exam.com`
- Password: `student123`
- Role: `student`

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Backend (Port 5000)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Frontend (Port 3000)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB Connection Error
- Check if MongoDB is running
- Verify connection string in `.env`
- Check firewall settings
- For Atlas: Whitelist your IP address

### Module Not Found
```bash
# Clear cache and reinstall
cd backend
rmdir /s /q node_modules
del package-lock.json
npm install

cd ../frontend
rmdir /s /q node_modules
del package-lock.json
npm install
```

### CORS Error
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Restart both servers

## 📦 Build for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 🌐 Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL`

### Database (MongoDB Atlas)
1. Already cloud-based
2. Update connection string in production

## 📝 Features Checklist

✅ JWT Authentication  
✅ Role-based Access Control  
✅ Subject Management  
✅ Question Bank  
✅ Exam Creation  
✅ Timer with Auto-submit  
✅ Auto-evaluation  
✅ Result Publishing  
✅ PDF Export  
✅ Excel Export  
✅ Analytics Dashboard  
✅ Responsive Design  

## 🆘 Support

For issues:
1. Check this guide
2. Review error messages
3. Check browser console (F12)
4. Verify all dependencies installed
5. Ensure MongoDB is running

## 📄 License

MIT License - Free to use and modify
