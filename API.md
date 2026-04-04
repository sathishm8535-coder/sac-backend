# 📡 API Documentation

Base URL: `http://localhost:5000/api`

## 🔐 Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

### Register
**POST** `/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register

### Get Profile
**GET** `/auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

## 📚 Subjects

### Get All Subjects
**GET** `/subjects`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "subject_id",
    "subject_name": "Mathematics",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Create Subject
**POST** `/subjects`

**Headers:** `Authorization: Bearer <token>`

**Roles:** admin, staff

**Body:**
```json
{
  "subject_name": "Physics"
}
```

### Update Subject
**PUT** `/subjects/:id`

**Headers:** `Authorization: Bearer <token>`

**Roles:** admin

**Body:**
```json
{
  "subject_name": "Advanced Physics"
}
```

### Delete Subject
**DELETE** `/subjects/:id`

**Headers:** `Authorization: Bearer <token>`

**Roles:** admin

## ❓ Questions

### Get All Questions
**GET** `/questions?subject_id=<subject_id>`

**Headers:** `Authorization: Bearer <token>`

**Roles:** admin, staff

**Response:**
```json
[
  {
    "_id": "question_id",
    "subject_id": {
      "_id": "subject_id",
      "subject_name": "Mathematics"
    },
    "question_text": "What is 2 + 2?",
    "options": {
      "A": "3",
      "B": "4",
      "C": "5",
      "D": "6"
    },
    "correct_answer": "B"
  }
]
```

### Create Question
**POST** `/questions`

**Headers:** `Authorization: Bearer <token>`

**Roles:** admin, staff

**Body:**
```json
{
  "subject_id": "subject_id",
  "question_text": "What is 2 + 2?",
  "options": {
    "A": "3",
    "B": "4",
    "C": "5",
    "D": "6"
  },
  "correct_answer": "B"
}
```

### Update Question
**PUT** `/questions/:id`

**Headers:** `Authorization: Bearer <token>`

**Roles:** admin, staff

### Delete Question
**DELETE** `/questions/:id`

**Headers:** `Authorization: Bearer <token>`

**Roles:** admin

## 📝 Exams

### Get All Exams
**GET** `/exams`

**Headers:** `Authorization: Bearer <token>`

**Roles:** admin, staff

**Response:**
```json
[
  {
    "_id": "exam_id",
    "title": "Math Final Exam",
    "subject_id": {
      "_id": "subject_id",
      "subject_name": "Mathematics"
    },
    "questions": ["q1_id", "q2_id"],
    "duration": 60,
    "total_marks": 10,
    "resultPublished": false
  }
]
```

### Get Available Exams (Student)
**GET** `/exams/available`

**Headers:** `Authorization: Bearer <token>`

**Roles:** student

**Response:**
```json
[
  {
    "_id": "exam_id",
    "title": "Math Final Exam",
    "subject_id": { "subject_name": "Mathematics" },
    "questions": ["q1_id", "q2_id"],
    "duration": 60,
    "total_marks": 10,
    "attempted": false
  }
]
```

### Get Exam by ID
**GET** `/exams/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "_id": "exam_id",
  "title": "Math Final Exam",
  "duration": 60,
  "total_marks": 10,
  "questions": [
    {
      "_id": "q1_id",
      "question_text": "What is 2 + 2?",
      "options": {
        "A": "3",
        "B": "4",
        "C": "5",
        "D": "6"
      }
    }
  ]
}
```
**Note:** Correct answers NOT included for students

### Create Exam
**POST** `/exams`

**Headers:** `Authorization: Bearer <token>`

**Roles:** admin, staff

**Body:**
```json
{
  "subject_id": "subject_id",
  "title": "Math Final Exam",
  "questions": ["q1_id", "q2_id", "q3_id"],
  "duration": 60,
  "total_marks": 10
}
```

### Submit Exam
**POST** `/exams/submit`

**Headers:** `Authorization: Bearer <token>`

**Roles:** student

**Body:**
```json
{
  "exam_id": "exam_id",
  "answers": {
    "q1_id": "B",
    "q2_id": "A",
    "q3_id": "C"
  }
}
```

**Response:**
```json
{
  "message": "Exam submitted successfully"
}
```

### Delete Exam
**DELETE** `/exams/:id`

**Headers:** `Authorization: Bearer <token>`

**Roles:** admin

## 📊 Results

### Get All Results
**GET** `/results`

**Headers:** `Authorization: Bearer <token>`

**Roles:** admin, staff

**Response:**
```json
[
  {
    "_id": "result_id",
    "student_id": {
      "_id": "student_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "exam_id": {
      "_id": "exam_id",
      "title": "Math Final Exam",
      "subject_id": {
        "subject_name": "Mathematics"
      }
    },
    "score": 8,
    "total_marks": 10,
    "published": false,
    "date": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Student Results
**GET** `/results/my-results`

**Headers:** `Authorization: Bearer <token>`

**Roles:** student

**Response:** Only published results

### Publish Result
**PUT** `/results/publish/:id`

**Headers:** `Authorization: Bearer <token>`

**Roles:** admin

**Response:**
```json
{
  "message": "Result published",
  "result": { ... }
}
```

### Get Analytics
**GET** `/results/analytics`

**Headers:** `Authorization: Bearer <token>`

**Roles:** admin

**Response:**
```json
{
  "totalStudents": 50,
  "totalExams": 10,
  "totalResults": 100,
  "passPercentage": "75.50",
  "subjectPerformance": [
    {
      "_id": "Mathematics",
      "avgScore": 78.5
    },
    {
      "_id": "Science",
      "avgScore": 82.3
    }
  ]
}
```

### Export Results
**GET** `/results/export`

**Headers:** `Authorization: Bearer <token>`

**Roles:** admin

**Response:** Array of all published results

## 🔒 Role-Based Access

| Endpoint | Admin | Staff | Student |
|----------|-------|-------|---------|
| Auth | ✅ | ✅ | ✅ |
| View Subjects | ✅ | ✅ | ✅ |
| Manage Subjects | ✅ | ❌ | ❌ |
| View Questions | ✅ | ✅ | ❌ |
| Manage Questions | ✅ | ✅ | ❌ |
| View All Exams | ✅ | ✅ | ❌ |
| View Available Exams | ❌ | ❌ | ✅ |
| Create Exam | ✅ | ✅ | ❌ |
| Take Exam | ❌ | ❌ | ✅ |
| View All Results | ✅ | ✅ | ❌ |
| View My Results | ❌ | ❌ | ✅ |
| Publish Results | ✅ | ❌ | ❌ |
| Analytics | ✅ | ❌ | ❌ |
| Export | ✅ | ❌ | ❌ |

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Internal server error"
}
```
