import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ subject_name: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const { data } = await axios.get('/api/subjects');
    setSubjects(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/subjects/${editId}`, formData);
        toast.success('Subject updated');
      } else {
        await axios.post('/api/subjects', formData);
        toast.success('Subject created');
      }
      setShowModal(false);
      setFormData({ subject_name: '' });
      setEditId(null);
      fetchSubjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this subject?')) {
      await axios.delete(`/api/subjects/${id}`);
      toast.success('Subject deleted');
      fetchSubjects();
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-50">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Subjects</h1>
          <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
            <Plus className="w-5 h-5" /> Add Subject
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(subject => (
            <div key={subject._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{subject.subject_name}</h3>
              <div className="flex gap-2">
                <button onClick={() => { setEditId(subject._id); setFormData({ subject_name: subject.subject_name }); setShowModal(true); }} className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => handleDelete(subject._id)} className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6">{editId ? 'Edit' : 'Add'} Subject</h2>
              <form onSubmit={handleSubmit}>
                <input type="text" required placeholder="Subject Name" className="w-full px-4 py-3 border rounded-lg mb-4" value={formData.subject_name} onChange={(e) => setFormData({ subject_name: e.target.value })} />
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">Save</button>
                  <button type="button" onClick={() => { setShowModal(false); setEditId(null); setFormData({ subject_name: '' }); }} className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subjects;
