# 🎓 Online Examination Management System

**Production-Ready Full-Stack MERN Application**

[![Status](https://img.shields.io/badge/Status-Complete-success)]()
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)]()
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)]()
[![Database](https://img.shields.io/badge/Database-MongoDB-brightgreen)]()

## 🚀 Quick Start

```bash
# 1. Run automated setup
setup.bat

# 2. Seed test data
cd backend
npm run seed

# 3. Start backend (Terminal 1)
start-backend.bat

# 4. Start frontend (Terminal 2)
start-frontend.bat
```

**Access:** http://localhost:3000  
**Admin:** admin@exam.com / admin123  
**Student:** student@exam.com / student123

## 📋 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 3 steps
- **[INSTALLATION.md](INSTALLATION.md)** - Complete setup guide
- **[TESTING.md](TESTING.md)** - Testing procedures
- **[API.md](API.md)** - API documentation
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete overview
- **[CHECKLIST.md](CHECKLIST.md)** - Completion checklist

## 🎯 Features

### 🔐 Authentication & Security
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control (Admin/Staff/Student)
- Protected routes & API endpoints

### 👨💼 Admin Features
- Analytics dashboard with charts
- Subject management (CRUD)
- Question bank management (CRUD)
- Exam creation & management
- Result publishing control
- PDF & Excel export
- Pass percentage analytics

### 👨🎓 Student Features
- View available exams
- Take exams with countdown timer
- Auto-submit when timer ends
- Question navigation
- View published results
- Prevent multiple attempts

### 🎨 UI/UX
- Modern Tailwind CSS design
- Fully responsive layout
- Toast notifications
- Loading states
- Smooth transitions
- Professional interface

## 🏗 Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Recharts (Analytics)
- Axios (API calls)
- React Router DOM
- jsPDF & xlsx (Export)
- React Hot Toast
- Lucide React (Icons)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt (Password hashing)
- CORS enabled

## 📁 Project Structure

```
exam-system/
├── backend/              # Node.js + Express API
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & validation
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── seed.js          # Test data seeder
│   └── server.js        # Entry point
│
├── frontend/            # React + Vite app
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # State management
│   │   ├── pages/       # Page components
│   │   ├── utils/       # Utilities
│   │   ├── App.jsx      # Main app
│   │   └── main.jsx     # Entry point
│   └── index.html
│
└── Documentation files
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Git (optional)

### Installation

1. **Clone/Download Project**
```bash
cd "sac net exam"
```

2. **Automated Setup**
```bash
setup.bat
```

3. **Configure Environment**

Backend `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/exam-system
JWT_SECRET=your_secret_key
```

Frontend `.env`:
```env
VITE_API_URL=http://localhost:5000
```

4. **Seed Database**
```bash
cd backend
npm run seed
```

5. **Start Application**
```bash
# Terminal 1
start-backend.bat

# Terminal 2
start-frontend.bat
```

## 📊 Database Schema

### Collections
- **Users** - Authentication & roles
- **Subjects** - Subject management
- **Questions** - MCQ question bank
- **Exams** - Exam configuration
- **Results** - Student results with publish control

### Key Features
- Unique constraints prevent duplicates
- Indexes for performance
- Population for related data
- Aggregation for analytics

## 🔒 Security Features

- JWT token authentication
- Password hashing (bcrypt)
- Role-based middleware
- Protected API routes
- CORS configuration
- Input validation
- Prevent SQL injection
- XSS protection

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get profile

### Subjects
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Questions
- `GET /api/questions` - Get questions
- `POST /api/questions` - Create question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

### Exams
- `GET /api/exams` - Get all exams
- `GET /api/exams/available` - Get available exams (student)
- `GET /api/exams/:id` - Get exam by ID
- `POST /api/exams` - Create exam
- `POST /api/exams/submit` - Submit exam
- `DELETE /api/exams/:id` - Delete exam

### Results
- `GET /api/results` - Get all results (admin)
- `GET /api/results/my-results` - Get student results
- `PUT /api/results/publish/:id` - Publish result
- `GET /api/results/analytics` - Get analytics
- `GET /api/results/export` - Export results

## 🎓 User Roles

| Feature | Admin | Staff | Student |
|---------|-------|-------|---------|
| Dashboard | ✅ | ❌ | ❌ |
| Manage Subjects | ✅ | ❌ | ❌ |
| Manage Questions | ✅ | ✅ | ❌ |
| Create Exams | ✅ | ✅ | ❌ |
| Take Exams | ❌ | ❌ | ✅ |
| View All Results | ✅ | ✅ | ❌ |
| Publish Results | ✅ | ❌ | ❌ |
| Export Data | ✅ | ❌ | ❌ |

## 🧪 Testing

See [TESTING.md](TESTING.md) for complete testing guide.

**Quick Test:**
1. Login as admin
2. Create subject & questions
3. Create exam
4. Login as student
5. Take exam
6. Admin publishes result
7. Student views result

## 🌐 Deployment

### Backend (Render/Railway)
1. Push to GitHub
2. Connect repository
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push to GitHub
2. Connect repository
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set `VITE_API_URL`

### Database (MongoDB Atlas)
1. Create cluster
2. Get connection string
3. Update `MONGODB_URI`

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check MongoDB is running
- Verify connection string
- Check firewall settings

### Port Already in Use
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Module Not Found
```bash
cd backend && npm install
cd frontend && npm install
```

## 📄 License

MIT License - Free to use and modify

## 🤝 Contributing

Contributions welcome! Please read documentation before contributing.

## 📞 Support

For issues:
1. Check documentation
2. Review error messages
3. Check browser console
4. Verify dependencies installed

## ✨ Credits

Built with MERN Stack (MongoDB, Express, React, Node.js)

---

**Status:** ✅ Complete & Production Ready  
**Version:** 1.0.0  
**Last Updated:** 2024

🎉 **Happy Coding!**
