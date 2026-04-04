import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ subject_id: '', title: '', questions: [], duration: '', total_marks: '' });

  useEffect(() => {
    fetchExams();
    fetchSubjects();
  }, []);

  const fetchExams = async () => {
    const { data } = await axios.get('/api/exams');
    setExams(data);
  };

  const fetchSubjects = async () => {
    const { data } = await axios.get('/api/subjects');
    setSubjects(data);
  };

  const fetchQuestions = async (subjectId) => {
    const { data } = await axios.get(`/api/questions?subject_id=${subjectId}`);
    setQuestions(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/exams', formData);
      toast.success('Exam created');
      setShowModal(false);
      setFormData({ subject_id: '', title: '', questions: [], duration: '', total_marks: '' });
      fetchExams();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this exam?')) {
      await axios.delete(`/api/exams/${id}`);
      toast.success('Exam deleted');
      fetchExams();
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-50">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Exams</h1>
          <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
            <Plus className="w-5 h-5" /> Create Exam
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map(exam => (
            <div key={exam._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{exam.title}</h3>
              <p className="text-gray-600 mb-4">{exam.subject_id?.subject_name}</p>
              <div className="space-y-2 text-sm text-gray-700 mb-4">
                <p>Questions: {exam.questions.length}</p>
                <p>Duration: {exam.duration} mins</p>
                <p>Total Marks: {exam.total_marks}</p>
              </div>
              <button onClick={() => handleDelete(exam._id)} className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl p-8 w-full max-w-2xl my-8">
              <h2 className="text-2xl font-bold mb-6">Create Exam</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input required placeholder="Exam Title" className="w-full px-4 py-3 border rounded-lg" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                <select required className="w-full px-4 py-3 border rounded-lg" value={formData.subject_id} onChange={(e) => { setFormData({ ...formData, subject_id: e.target.value }); fetchQuestions(e.target.value); }}>
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s._id} value={s._id}>{s.subject_name}</option>)}
                </select>
                <input required type="number" placeholder="Duration (minutes)" className="w-full px-4 py-3 border rounded-lg" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                <input required type="number" placeholder="Total Marks" className="w-full px-4 py-3 border rounded-lg" value={formData.total_marks} onChange={(e) => setFormData({ ...formData, total_marks: e.target.value })} />
                
                {questions.length > 0 && (
                  <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                    <p className="font-semibold mb-2">Select Questions:</p>
                    {questions.map(q => (
                      <label key={q._id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                        <input type="checkbox" checked={formData.questions.includes(q._id)} onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, questions: [...formData.questions, q._id] });
                          } else {
                            setFormData({ ...formData, questions: formData.questions.filter(id => id !== q._id) });
                          }
                        }} />
                        <span className="text-sm">{q.question_text}</span>
                      </label>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">Create</button>
                  <button type="button" onClick={() => { setShowModal(false); setFormData({ subject_id: '', title: '', questions: [], duration: '', total_marks: '' }); }} className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exams;
