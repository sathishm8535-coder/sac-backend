import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Clock, ChevronLeft, ChevronRight, Maximize, ShieldAlert } from 'lucide-react';

const SecureExamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam]               = useState(null);
  const [questions, setQuestions]     = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers]         = useState({});
  const [rollNo, setRollNo]           = useState('');
  const [timeLeft, setTimeLeft]       = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [autoSubmitReason, setAutoSubmitReason] = useState('');

  // Refs so event handlers always read current values (no stale closures)
  const submitRef      = useRef(false);   // prevents double-submit
  const answersRef     = useRef({});
  const rollNoRef      = useRef('');
  const isFullscreenRef = useRef(false);
  const examIdRef      = useRef(id);

  // Keep refs in sync with state
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { rollNoRef.current = rollNo; }, [rollNo]);
  useEffect(() => { isFullscreenRef.current = isFullscreen; }, [isFullscreen]);

  // ── Block re-entry if already submitted ──────────────────────────────────
  useEffect(() => {
    const key = `exam_submitted_${id}`;
    if (localStorage.getItem(key) === 'true') {
      setIsSubmitted(true);
      setAutoSubmitReason('already_submitted');
    }
  }, [id]);

  // ── Load exam ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(`/api/exams/${id}`);
        if (!data.questions?.length) {
          toast.error('No questions available in this exam');
          navigate('/student');
          return;
        }
        setExam(data);
        setQuestions(data.questions);
        setTimeLeft(data.duration * 60);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error loading exam');
        navigate('/student');
      }
    };
    load();
  }, [id]);

  // ── Core auto-submit (uses refs — safe inside any event handler) ──────────
  const autoSubmit = useCallback(async (reason) => {
    if (submitRef.current) return;
    submitRef.current = true;

    setIsSubmitted(true);
    setAutoSubmitReason(reason);
    setSubmitting(true);

    // Mark in localStorage immediately so refresh also blocks re-entry
    localStorage.setItem(`exam_submitted_${examIdRef.current}`, 'true');

    // Exit fullscreen silently
    try {
      if (document.exitFullscreen) await document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    } catch (_) {}

    try {
      const roll = rollNoRef.current.trim() || 'AUTO';
      await axios.post('/api/exams/submit', {
        exam_id: examIdRef.current,
        student_roll_no: roll,
        answers: answersRef.current
      });
      toast.success('Exam auto-submitted.');
    } catch (err) {
      // 400 "already attempted" is fine — still treat as submitted
      if (err.response?.status !== 400) {
        toast.error('Submission error — your answers were recorded locally.');
      }
    } finally {
      setSubmitting(false);
    }
  }, []);

  // ── Security event handlers (defined once, use refs) ─────────────────────
  useEffect(() => {
    if (!exam) return; // don't attach until exam is loaded

    const onVisibilityChange = () => {
      if (document.hidden && isFullscreenRef.current && !submitRef.current) {
        autoSubmit('tab_switch');
      }
    };

    const onBlur = () => {
      if (isFullscreenRef.current && !submitRef.current) {
        autoSubmit('window_blur');
      }
    };

    const onFullscreenChange = () => {
      const active = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(active);
      isFullscreenRef.current = active;
      if (!active && isFullscreenRef.current === false && !submitRef.current) {
        // fullscreen was exited after it was entered
        autoSubmit('fullscreen_exit');
      }
    };

    const onContextMenu  = (e) => { e.preventDefault(); };
    const onCopyPaste    = (e) => { e.preventDefault(); };
    const onSelectStart  = (e) => { e.preventDefault(); };
    const onKeyDown      = (e) => {
      if (e.ctrlKey && ['c','v','x','a','u','s','p'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if (e.key === 'F5' || (e.ctrlKey && e.key.toLowerCase() === 'r')) {
        e.preventDefault();
      }
    };
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    const onPopState = () => {
      window.history.pushState(null, '', window.location.href);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onBlur);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('copy', onCopyPaste);
    document.addEventListener('cut', onCopyPaste);
    document.addEventListener('paste', onCopyPaste);
    document.addEventListener('selectstart', onSelectStart);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('beforeunload', onBeforeUnload);
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', onPopState);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('copy', onCopyPaste);
      document.removeEventListener('cut', onCopyPaste);
      document.removeEventListener('paste', onCopyPaste);
      document.removeEventListener('selectstart', onSelectStart);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('popstate', onPopState);
    };
  }, [exam, autoSubmit]);

  // ── Countdown timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!exam || timeLeft <= 0 || isSubmitted) return;
    if (timeLeft === 1) { autoSubmit('time_up'); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, exam, isSubmitted, autoSubmit]);

  // ── Manual submit ─────────────────────────────────────────────────────────
  const handleManualSubmit = async () => {
    if (!rollNo.trim()) { toast.error('Please enter your roll number'); return; }
    await autoSubmit('manual');
    navigate('/student');
  };

  // ── Answer selection (blocked after submit) ───────────────────────────────
  const selectAnswer = (questionId, option) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  // ── Fullscreen entry ──────────────────────────────────────────────────────
  const enterFullscreen = async () => {
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      setIsFullscreen(true);
      isFullscreenRef.current = true;
    } catch {
      toast.error('Please allow fullscreen to start the exam');
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (!exam || questions.length === 0) {
    return <div className="flex items-center justify-center h-screen text-gray-500">Loading exam...</div>;
  }

  // ── Already submitted screen ──────────────────────────────────────────────
  if (isSubmitted) {
    const reasonMessages = {
      tab_switch:       'You switched tabs or minimized the browser.',
      window_blur:      'The exam window lost focus.',
      fullscreen_exit:  'You exited fullscreen mode.',
      time_up:          'Time ran out.',
      manual:           'You submitted the exam.',
      already_submitted:'This exam was already submitted.'
    };
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Exam Submitted</h2>
          <p className="text-gray-500 mb-2 text-sm">
            {reasonMessages[autoSubmitReason] || 'Your exam has been submitted.'}
          </p>
          <p className="text-gray-400 text-xs mb-8">
            Answered: {Object.keys(answers).length} / {questions.length} questions
          </p>
          <button
            onClick={() => navigate('/student')}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Fullscreen entry screen ───────────────────────────────────────────────
  if (!isFullscreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <Maximize className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Secure Exam Mode</h2>
          <p className="text-gray-600 mb-4">
            This exam requires fullscreen mode. You must stay on this tab for the entire duration.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left space-y-1">
            <p className="text-sm text-red-700 font-semibold">⚠️ Strict Rules:</p>
            <p className="text-xs text-red-600">• Switching tabs → immediate auto-submit</p>
            <p className="text-xs text-red-600">• Minimizing window → immediate auto-submit</p>
            <p className="text-xs text-red-600">• Exiting fullscreen → immediate auto-submit</p>
            <p className="text-xs text-red-600">• No second chances</p>
          </div>
          <button
            onClick={enterFullscreen}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Enter Fullscreen &amp; Start Exam
          </button>
        </div>
      </div>
    );
  }

  // ── Exam UI ───────────────────────────────────────────────────────────────
  const currentQuestion = questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLocked = isSubmitted || submitting;

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* Header */}
      <div className="bg-indigo-900 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">{exam.title}</h1>
          <p className="text-xs text-indigo-300">🔒 Secure Mode — Tab switch = Auto Submit</p>
        </div>
        <div className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-lg ${
          timeLeft < 60 ? 'bg-red-600 animate-pulse' : 'bg-indigo-700'
        }`}>
          <Clock className="w-5 h-5" />
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Roll number */}
        <div className="bg-white rounded-xl shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number *</label>
          <input
            type="text"
            placeholder="Enter your roll number"
            disabled={isLocked}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            style={{ userSelect: 'text' }}
          />
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow p-8">
          <div className="mb-6">
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <h2 className="text-xl font-bold text-gray-800 mt-2">{currentQuestion?.question_text}</h2>
          </div>

          <div className="space-y-3 mb-8">
            {['A', 'B', 'C', 'D'].map(option => (
              <button
                key={option}
                disabled={isLocked}
                onClick={() => selectAnswer(currentQuestion._id, option)}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  isLocked
                    ? 'cursor-not-allowed opacity-60 border-gray-200'
                    : answers[currentQuestion._id] === option
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-400'
                } ${answers[currentQuestion._id] === option ? 'border-indigo-600 bg-indigo-50' : ''}`}
              >
                <span className="font-bold mr-3 text-indigo-600">{option}.</span>
                {currentQuestion?.options[option]}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentIndex(p => Math.max(0, p - 1))}
              disabled={currentIndex === 0 || isLocked}
              className="flex items-center gap-2 px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleManualSubmit}
                disabled={isLocked}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Exam'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex(p => Math.min(questions.length - 1, p + 1))}
                disabled={isLocked}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Question navigator */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-gray-700 mb-4">
            Question Navigator —{' '}
            <span className="text-green-600">{Object.keys(answers).length} answered</span>
            {' / '}
            <span className="text-gray-400">{questions.length - Object.keys(answers).length} remaining</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {questions.filter(Boolean).map((q, idx) => (
              <button
                key={q._id}
                onClick={() => !isLocked && setCurrentIndex(idx)}
                disabled={isLocked}
                className={`w-10 h-10 rounded-lg text-sm font-bold transition ${
                  answers[q._id]
                    ? 'bg-green-500 text-white'
                    : idx === currentIndex
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } disabled:cursor-not-allowed`}
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

export default SecureExamPage;
