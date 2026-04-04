import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const ExamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [rollNo, setRollNo] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const submitRef = useRef(false);

  useEffect(() => {
    fetchExam();
  }, []);

  useEffect(() => {
    if (!exam || timeLeft <= 0) return;
    
    if (timeLeft === 1 && !submitRef.current) {
      submitRef.current = true;
      handleSubmit();
      return;
    }
    
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, exam]);

  const fetchExam = async () => {
    try {
      const { data } = await axios.get(`/api/exams/${id}`);
      setExam(data);
      setQuestions(data.questions);
      setTimeLeft(data.duration * 60);
    } catch (error) {
      toast.error('Error loading exam');
      navigate('/student');
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (!rollNo.trim()) {
      toast.error('Please enter your roll number');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post('/api/exams/submit', { exam_id: id, student_roll_no: rollNo, answers });
      toast.success('Exam submitted successfully!');
      navigate('/student');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed');
      setSubmitting(false);
    }
  };

  if (!exam) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  const currentQuestion = questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-900 text-white p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{exam.title}</h1>
        <div className="flex items-center gap-2 bg-indigo-700 px-6 py-3 rounded-lg">
          <Clock className="w-5 h-5" />
          <span className="text-xl font-bold">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number *</label>
          <input
            type="text"
            required
            placeholder="Enter your roll number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <span className="text-sm text-gray-500">Question {currentIndex + 1} of {questions.length}</span>
            <h2 className="text-2xl font-bold text-gray-800 mt-2">{currentQuestion?.question_text}</h2>
          </div>

          <div className="space-y-4 mb-8">
            {['A', 'B', 'C', 'D'].map(option => (
              <button
                key={option}
                onClick={() => setAnswers({ ...answers, [currentQuestion._id]: option })}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  answers[currentQuestion._id] === option
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-400'
                }`}
              >
                <span className="font-bold mr-3">{option}.</span>
                {currentQuestion?.options[option]}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>

            {currentIndex === questions.length - 1 ? (
              <button onClick={handleSubmit} disabled={submitting} className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold">
                {submitting ? 'Submitting...' : 'Submit Exam'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-4">Question Navigator</h3>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((q, idx) => (
              <button
                key={q._id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-10 h-10 rounded-lg font-bold ${
                  answers[q._id]
                    ? 'bg-green-500 text-white'
                    : idx === currentIndex
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
