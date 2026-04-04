# 🎓 Online Examination Management System

Production-level full-stack web application for managing online exams with role-based access control.

## 🚀 Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- Recharts
- Axios
- React Router DOM
- jsPDF & xlsx

**Backend:**
- Node.js + Express
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt

## 📁 Project Structure

```
exam-system/
├── backend/
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        ├── context/
        └── utils/
```

## 🔧 Setup Instructions

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

4. Start server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

4. Start development server:
```bash
npm run dev
```

## 👥 User Roles

### Admin
- Dashboard with analytics
- Manage subjects, questions, exams
- Publish results
- Export PDF/Excel

### Student
- View available exams
- Take exams with timer
- View published results

## 🔐 Security Features

- JWT authentication
- Password hashing (bcrypt)
- Role-based access control
- Prevent multiple exam attempts
- CORS configured

## 📊 Features

- Auto-evaluation
- Countdown timer with auto-submit
- Analytics dashboard
- PDF & Excel export
- Responsive design
- Toast notifications

## 🌐 Deployment

**Frontend:** Vercel
**Backend:** Render
**Database:** MongoDB Atlas

## 📝 API Endpoints

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/profile`

### Subjects
- GET/POST `/api/subjects`
- PUT/DELETE `/api/subjects/:id`

### Questions
- GET/POST `/api/questions`
- PUT/DELETE `/api/questions/:id`

### Exams
- GET/POST `/api/exams`
- GET `/api/exams/available`
- POST `/api/exams/submit`

### Results
- GET `/api/results`
- GET `/api/results/my-results`
- PUT `/api/results/publish/:id`
- GET `/api/results/analytics`

## 📄 License

MIT
