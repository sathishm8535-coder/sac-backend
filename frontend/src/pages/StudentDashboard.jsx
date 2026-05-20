import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Menu, X, Award } from 'lucide-react';
import CertificateModal from '../components/CertificateModal';

const StudentDashboard = () => {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [navOpen, setNavOpen] = useState(false);
  const [activeCert, setActiveCert] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/exams/available').then(({ data }) => setExams(data));
    axios.get('/api/results/my-results').then(({ data }) => setResults(data));
  }, []);

  const handleGetCertificate = async (resultId) => {
    try {
      const { data } = await axios.post(`/api/certificates/generate/${resultId}`);
      setActiveCert(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not generate certificate');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {activeCert && <CertificateModal cert={activeCert} onClose={() => setActiveCert(null)} />}
      {/* Navbar */}
      <nav className="bg-indigo-900 text-white sticky top-0 z-40">
        <div className="flex justify-between items-center px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/Assest/sadak1.jpg"
              alt="App Logo"
              loading="lazy"
              className="h-9 w-9 sm:h-11 sm:w-11 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0"
            />
            <span className="font-bold text-sm sm:text-lg leading-tight">
              Sadakathullah Appa College
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-indigo-200 text-sm">{user?.name}</span>
            <button
              onClick={logout}
              className="bg-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-600 flex items-center gap-2 text-sm"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden text-white p-1"
            onClick={() => setNavOpen(!navOpen)}
          >
            {navOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {navOpen && (
          <div className="sm:hidden border-t border-indigo-800 px-4 py-3 flex flex-col gap-3">
            <span className="text-indigo-200 text-sm">{user?.name}</span>
            <button
              onClick={logout}
              className="bg-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-600 flex items-center gap-2 text-sm w-full"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </nav>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Available Exams */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-8">Available Exams</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
          {exams.map(exam => (
            <div key={exam._id} className="bg-white rounded-xl shadow-md p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{exam.title}</h3>
              <p className="text-gray-600 mb-3 text-sm">{exam.subject_id?.subject_name}</p>
              <div className="space-y-1 text-sm text-gray-700 mb-4">
                <p>Questions: {exam.questions.length}</p>
                <p>Duration: {exam.duration} mins</p>
                <p>Total Marks: {exam.total_marks}</p>
              </div>
              {exam.attempted ? (
                <div className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-center text-sm">
                  Attempted
                </div>
              ) : (
                <button
                  onClick={() => navigate(`/exam/${exam._id}`)}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"
                >
                  🔒 Start Secure Exam
                </button>
              )}
            </div>
          ))}
        </div>

        {/* My Results */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-8">My Results</h2>
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          {results.length === 0 ? (
            <p className="p-8 text-gray-600 text-center">No published results yet</p>
          ) : (
            <table className="w-full min-w-[500px]">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm">Exam</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm">Subject</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm">Score</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm">%</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm">Status</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm">Certificate</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r._id} className="border-b text-sm">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">{r.exam_id?.title}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">{r.exam_id?.subject_id?.subject_name}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">{r.score}/{r.total_marks}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">{((r.score / r.total_marks) * 100).toFixed(1)}%</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (r.score / r.total_marks) >= 0.4
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {(r.score / r.total_marks) >= 0.4 ? 'Pass' : 'Fail'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      {(r.score / r.total_marks) >= 0.4 ? (
                        <button
                          onClick={() => handleGetCertificate(r._id)}
                          className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 text-xs font-medium"
                        >
                          <Award className="w-3.5 h-3.5" /> Certificate
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">Not eligible</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
