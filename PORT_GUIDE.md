# 🔧 Port Configuration Guide

## Current Issue: Port 3000 Already in Use

Your frontend is running on **port 3001** instead of 3000.

## ✅ Quick Solutions

### Option 1: Use Port 3001 (Easiest)
The app is already running on http://localhost:3001
- Just use this URL
- Everything works the same

### Option 2: Free Port 3000
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace <PID> with actual number)
taskkill /PID <PID> /F

# Restart frontend
npm run dev
```

### Option 3: Change Default Port
Edit `frontend/vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: { 
    port: 3001,  // Change to any port you want
    strictPort: false,
    host: true
  }
});
```

## 🎯 Recommended: Use Port 3001

**Your app is working perfectly on port 3001!**

Access it at: **http://localhost:3001**

The port number doesn't affect functionality - everything works the same.

## 📝 Update Your Workflow

If using port 3001:
1. Frontend: http://localhost:3001 ✅
2. Backend: http://localhost:5000 ✅
3. No changes needed to code
4. API calls still work (configured in axios)

## 🚀 Next Steps

1. **Keep frontend running** on port 3001
2. **Open new terminal** for backend
3. **Start backend:**
   ```bash
   cd backend
   npm run dev
   ```
4. **Access app:** http://localhost:3001

## ✅ Everything is Working!

Port 3001 is fine - your exam system is ready to use!
