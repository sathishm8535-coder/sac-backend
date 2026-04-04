import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ClipboardList, LogOut } from 'lucide-react';

const StudentDashboard = () => {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
    fetchResults();
  }, []);

  const fetchExams = async () => {
    const { data } = await axios.get('/api/exams/available');
    setExams(data);
  };

  const fetchResults = async () => {
    const { data } = await axios.get('/api/results/my-results');
    setResults(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-900 text-white p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sadakathullah Appa college</h1>
        <div className="flex items-center gap-4">
          <span>{user?.name}</span>
          <button onClick={logout} className="bg-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-600">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Available Exams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {exams.map(exam => (
            <div key={exam._id} className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{exam.title}</h3>
              <p className="text-gray-600 mb-4">{exam.subject_id?.subject_name}</p>
              <div className="space-y-2 text-sm text-gray-700 mb-4">
                <p>Questions: {exam.questions.length}</p>
                <p>Duration: {exam.duration} mins</p>
                <p>Total Marks: {exam.total_marks}</p>
              </div>
              {exam.attempted ? (
                <div className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-center">Attempted</div>
              ) : (
                <button onClick={() => navigate(`/exam/${exam._id}`)} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                  Start Exam
                </button>
              )}
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-8">My Results</h2>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {results.length === 0 ? (
            <p className="p-8 text-gray-600 text-center">No published results yet</p>
          ) : (
            <table className="w-full">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Exam</th>
                  <th className="px-6 py-4 text-left">Subject</th>
                  <th className="px-6 py-4 text-left">Score</th>
                  <th className="px-6 py-4 text-left">Percentage</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r._id} className="border-b">
                    <td className="px-6 py-4">{r.exam_id?.title}</td>
                    <td className="px-6 py-4">{r.exam_id?.subject_id?.subject_name}</td>
                    <td className="px-6 py-4">{r.score}/{r.total_marks}</td>
                    <td className="px-6 py-4">{((r.score / r.total_marks) * 100).toFixed(2)}%</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${(r.score / r.total_marks) >= 0.4 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {(r.score / r.total_marks) >= 0.4 ? 'Pass' : 'Fail'}
                      </span>
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
