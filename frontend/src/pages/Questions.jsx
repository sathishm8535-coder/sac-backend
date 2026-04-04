import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ subject_id: '', question_text: '', options: { A: '', B: '', C: '', D: '' }, correct_answer: 'A' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchQuestions();
    fetchSubjects();
  }, []);

  const fetchQuestions = async () => {
    const { data } = await axios.get('/api/questions');
    setQuestions(data);
  };

  const fetchSubjects = async () => {
    const { data } = await axios.get('/api/subjects');
    setSubjects(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/questions/${editId}`, formData);
        toast.success('Question updated');
      } else {
        await axios.post('/api/questions', formData);
        toast.success('Question created');
      }
      setShowModal(false);
      setFormData({ subject_id: '', question_text: '', options: { A: '', B: '', C: '', D: '' }, correct_answer: 'A' });
      setEditId(null);
      fetchQuestions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this question?')) {
      await axios.delete(`/api/questions/${id}`);
      toast.success('Question deleted');
      fetchQuestions();
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Questions</h1>
          <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center gap-2 hover:bg-indigo-700 text-sm sm:text-base">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Add Question
          </button>
        </div>

        <div className="space-y-4">
          {questions.map(q => (
            <div key={q._id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">{q.subject_id?.subject_name}</span>
                  <p className="text-lg font-semibold text-gray-800 mt-3">{q.question_text}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditId(q._id); setFormData({ subject_id: q.subject_id?._id || '', question_text: q.question_text, options: q.options, correct_answer: q.correct_answer }); setShowModal(true); }} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(q._id)} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>A: {q.options.A}</div>
                <div>B: {q.options.B}</div>
                <div>C: {q.options.C}</div>
                <div>D: {q.options.D}</div>
              </div>
              <p className="text-green-600 font-semibold mt-2">Correct: {q.correct_answer}</p>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl p-8 w-full max-w-2xl my-8">
              <h2 className="text-2xl font-bold mb-6">{editId ? 'Edit' : 'Add'} Question</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <select required className="w-full px-4 py-3 border rounded-lg" value={formData.subject_id} onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}>
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s._id} value={s._id}>{s.subject_name}</option>)}
                </select>
                <textarea required placeholder="Question Text" className="w-full px-4 py-3 border rounded-lg" rows="3" value={formData.question_text} onChange={(e) => setFormData({ ...formData, question_text: e.target.value })} />
                <input required placeholder="Option A" className="w-full px-4 py-3 border rounded-lg" value={formData.options.A} onChange={(e) => setFormData({ ...formData, options: { ...formData.options, A: e.target.value } })} />
                <input required placeholder="Option B" className="w-full px-4 py-3 border rounded-lg" value={formData.options.B} onChange={(e) => setFormData({ ...formData, options: { ...formData.options, B: e.target.value } })} />
                <input required placeholder="Option C" className="w-full px-4 py-3 border rounded-lg" value={formData.options.C} onChange={(e) => setFormData({ ...formData, options: { ...formData.options, C: e.target.value } })} />
                <input required placeholder="Option D" className="w-full px-4 py-3 border rounded-lg" value={formData.options.D} onChange={(e) => setFormData({ ...formData, options: { ...formData.options, D: e.target.value } })} />
                <select required className="w-full px-4 py-3 border rounded-lg" value={formData.correct_answer} onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">Save</button>
                  <button type="button" onClick={() => { setShowModal(false); setEditId(null); setFormData({ subject_id: '', question_text: '', options: { A: '', B: '', C: '', D: '' }, correct_answer: 'A' }); }} className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Questions;
