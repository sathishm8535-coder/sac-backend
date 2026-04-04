# 🔧 Secure Exam Mode - Troubleshooting Guide

## Common Issues & Fixes

### 1. Session Not Starting

**Symptoms:** Exam page shows "Loading..." forever

**Fix:**
```bash
# Restart backend
cd backend
npm run dev
```

**Check:** Browser console for errors (F12)

### 2. Violations Not Recording

**Symptoms:** Switching tabs doesn't show warning

**Fix:** 
- Make sure you're logged in as a student
- Check browser console for errors
- Ensure backend is running

### 3. Timer Not Working

**Symptoms:** Timer shows 00:00 or doesn't count down

**Fix:**
- Clear browser cache
- Check backend logs for session creation
- Verify exam has duration set

### 4. Page Refresh Loses Progress

**Symptoms:** Answers disappear after refresh

**Fix:**
- Check MongoDB connection
- Verify ExamSession collection exists
- Check browser console for API errors

### 5. Auto-Submit Not Working

**Symptoms:** After 3 violations, exam doesn't submit

**Fix:**
- Check backend logs for errors
- Verify Result model has student_roll_no field
- Check MongoDB for ExamSession violations count

## Testing Steps

### Test 1: Basic Exam Start
1. Login as student
2. Click "Start Secure Exam"
3. Should see roll number input
4. Should see timer counting down
5. Should see violation counter (0/3)

### Test 2: Violation Detection
1. Start exam
2. Switch to another tab
3. Should see red warning banner
4. Should see violation count increase (1/3)

### Test 3: Page Refresh
1. Start exam
2. Answer 2-3 questions
3. Refresh page (F5)
4. Should return to same question
5. Answers should be preserved
6. Timer should continue from server time

### Test 4: Auto-Submit
1. Start exam
2. Switch tabs 3 times
3. Should auto-submit after 3rd violation
4. Should redirect to student dashboard

## Debug Commands

### Check if backend is running:
```bash
curl http://localhost:5000
```

### Check MongoDB connection:
```bash
# In backend folder
node -e "import('./config/db.js').then(m => m.default())"
```

### View backend logs:
```bash
cd backend
npm run dev
# Watch for errors in console
```

### Clear exam sessions (if stuck):
```javascript
// In MongoDB shell or Compass
db.examsessions.deleteMany({})
```

## Browser Console Checks

Open browser console (F12) and check for:

1. **Network errors:** Red requests in Network tab
2. **JavaScript errors:** Red messages in Console tab
3. **API responses:** Check response data in Network tab

## Expected API Calls

When exam starts, you should see these API calls:

1. `GET /api/exams/:id` - Get exam details
2. `POST /api/exam-sessions/start` - Start session
3. `GET /api/exam-sessions/:id` - Get remaining time
4. `PUT /api/exam-sessions/update` - Save progress (every change)
5. `POST /api/exam-sessions/violation` - Record violation (on tab switch)

## Still Not Working?

1. **Clear browser cache** - Ctrl+Shift+Delete
2. **Restart backend** - Stop and start npm run dev
3. **Check MongoDB** - Ensure it's running and connected
4. **Check .env file** - Verify MONGODB_URI is correct
5. **Check browser console** - Look for specific error messages

## Success Indicators

✅ Timer counts down from exam duration  
✅ Switching tabs shows warning  
✅ Violation counter increases  
✅ Page refresh preserves answers  
✅ Auto-submit works after 3 violations  
✅ Back button is disabled  
✅ Right-click is disabled  
✅ Keyboard shortcuts are blocked  

## Contact Support

If issues persist:
1. Check backend console for errors
2. Check browser console for errors
3. Verify MongoDB is connected
4. Ensure all dependencies are installed
