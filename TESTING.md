# 🧪 Testing Guide

## Quick Test Setup

### 1. Seed Database with Test Data
```bash
cd backend
npm run seed
```

This creates:
- ✅ Admin account: `admin@exam.com` / `admin123`
- ✅ Student account: `student@exam.com` / `student123`
- ✅ 3 Subjects (Math, Science, English)
- ✅ 5 Sample Questions

### 2. Test Admin Features

**Login as Admin:**
- Email: `admin@exam.com`
- Password: `admin123`

**Test Flow:**
1. ✅ View Dashboard (analytics cards, charts)
2. ✅ Add/Edit/Delete Subjects
3. ✅ Add/Edit/Delete Questions
4. ✅ Create Exam (select subject, questions, duration)
5. ✅ View Results
6. ✅ Publish Results
7. ✅ Export PDF/Excel

### 3. Test Student Features

**Login as Student:**
- Email: `student@exam.com`
- Password: `student123`

**Test Flow:**
1. ✅ View Available Exams
2. ✅ Start Exam
3. ✅ Answer Questions
4. ✅ Navigate between questions
5. ✅ Watch timer countdown
6. ✅ Submit Exam
7. ✅ View Published Results

## 🔍 Feature Testing Checklist

### Authentication
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout
- [ ] Protected routes redirect to login

### Admin Dashboard
- [ ] View total students count
- [ ] View total exams count
- [ ] View pass percentage
- [ ] View subject performance chart

### Subject Management
- [ ] Create new subject
- [ ] Edit subject name
- [ ] Delete subject
- [ ] View all subjects

### Question Management
- [ ] Create MCQ question
- [ ] Edit question
- [ ] Delete question
- [ ] Filter by subject
- [ ] View correct answer (admin only)

### Exam Management
- [ ] Create exam with multiple questions
- [ ] Set duration
- [ ] Set total marks
- [ ] Delete exam
- [ ] View exam details

### Exam Taking (Student)
- [ ] View available exams
- [ ] Start exam
- [ ] Timer starts correctly
- [ ] Answer questions
- [ ] Navigate next/previous
- [ ] Question navigator shows answered questions
- [ ] Auto-submit when timer ends
- [ ] Manual submit
- [ ] Cannot retake exam

### Results
- [ ] Admin views all results
- [ ] Student views only published results
- [ ] Publish result (admin)
- [ ] Export PDF
- [ ] Export Excel
- [ ] Calculate percentage correctly
- [ ] Show pass/fail status

## 🐛 Common Issues & Solutions

### Issue: Cannot login
**Solution:** 
- Check MongoDB is running
- Verify credentials
- Check browser console for errors

### Issue: Timer not working
**Solution:**
- Refresh page
- Check browser console
- Ensure exam has duration set

### Issue: Questions not loading
**Solution:**
- Ensure questions exist for selected subject
- Check network tab in browser
- Verify backend is running

### Issue: Export not working
**Solution:**
- Check browser allows downloads
- Ensure results exist
- Check console for errors

## 📊 Test Scenarios

### Scenario 1: Complete Exam Flow
1. Admin creates subject "Physics"
2. Admin adds 10 questions
3. Admin creates exam (30 mins, 10 marks)
4. Student logs in
5. Student takes exam
6. Student submits
7. Admin publishes result
8. Student views result

### Scenario 2: Timer Auto-Submit
1. Student starts exam
2. Wait for timer to reach 0
3. Exam auto-submits
4. Student redirected to dashboard

### Scenario 3: Multiple Students
1. Register 3 students
2. All take same exam
3. Admin views all results
4. Admin exports to Excel
5. Verify all data correct

## 🎯 Performance Testing

### Load Test
- Create 50 questions
- Create 10 exams
- Register 20 students
- All students take exams
- Check response times

### Stress Test
- Rapid question creation
- Multiple simultaneous logins
- Concurrent exam submissions
- Check for errors

## ✅ Final Checklist

Before deployment:
- [ ] All features tested
- [ ] No console errors
- [ ] Mobile responsive
- [ ] All exports working
- [ ] Security tested (JWT, roles)
- [ ] Database indexes created
- [ ] Environment variables set
- [ ] Error handling works
- [ ] Loading states show
- [ ] Toast notifications work
