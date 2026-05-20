import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import SecureExamPage from './pages/SecureExamPage';
import Subjects from './pages/Subjects';
import Questions from './pages/Questions';
import Exams from './pages/Exams';
import Results from './pages/Results';
import VerifyPage from './pages/VerifyPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen flex flex-col">
        <Header />
        <Toaster position="top-right" />
        <main className="flex-1">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin routes */}
          <Route path="/admin-dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin-dashboard/subjects" element={<ProtectedRoute roles={['admin']}><Subjects /></ProtectedRoute>} />
          <Route path="/admin-dashboard/questions" element={<ProtectedRoute roles={['admin']}><Questions /></ProtectedRoute>} />
          <Route path="/admin-dashboard/exams" element={<ProtectedRoute roles={['admin']}><Exams /></ProtectedRoute>} />
          <Route path="/admin-dashboard/results" element={<ProtectedRoute roles={['admin']}><Results /></ProtectedRoute>} />

          {/* Staff routes */}
          <Route path="/staff-dashboard" element={<ProtectedRoute roles={['staff']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/staff-dashboard/subjects" element={<ProtectedRoute roles={['staff']}><Subjects /></ProtectedRoute>} />
          <Route path="/staff-dashboard/questions" element={<ProtectedRoute roles={['staff']}><Questions /></ProtectedRoute>} />
          <Route path="/staff-dashboard/exams" element={<ProtectedRoute roles={['staff']}><Exams /></ProtectedRoute>} />
          <Route path="/staff-dashboard/results" element={<ProtectedRoute roles={['staff']}><Results /></ProtectedRoute>} />

          {/* Student routes */}
          <Route path="/student" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/exam/:id" element={<ProtectedRoute roles={['student']}><SecureExamPage /></ProtectedRoute>} />

          <Route path="/verify/:certId" element={<VerifyPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/admin" element={<Navigate to="/admin-dashboard" />} />
          <Route path="/staff" element={<Navigate to="/staff-dashboard" />} />
        </Routes>
        </main>
        <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
