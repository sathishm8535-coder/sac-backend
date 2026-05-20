import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, ShieldX, Search, Award, ExternalLink } from 'lucide-react';

const VerifyPage = () => {
  const { certId } = useParams();
  const navigate   = useNavigate();
  const [input,    setInput]    = useState(certId || '');
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [searched, setSearched] = useState(false);

  // Auto-verify if certId is in URL
  useEffect(() => {
    if (certId) verify(certId);
  }, [certId]);

  const verify = async (id) => {
    const certIdToCheck = (id || input).trim().toUpperCase();
    if (!certIdToCheck) return;
    setLoading(true);
    setSearched(false);
    try {
      const { data } = await axios.get(`/api/certificates/verify/${certIdToCheck}`);
      setResult({ valid: true, ...data });
    } catch {
      setResult({ valid: false });
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = input.trim().toUpperCase();
    if (!id) return;
    navigate(`/verify/${id}`, { replace: true });
    verify(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-start pt-12 px-4 pb-12">

      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <img src="/Assest/sadak1.jpg" alt="Logo" className="w-16 h-16 rounded-full border-2 border-indigo-400 mb-3 object-cover" />
        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-900 text-center">Certificate Verification</h1>
        <p className="text-gray-500 text-sm mt-1 text-center">Sadakathullah Appa College (Autonomous)</p>
      </div>

      {/* Search box */}
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg mb-6">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            placeholder="Enter Certificate ID  e.g. SAC-2026-CS-0001"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm font-medium disabled:opacity-60 transition"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Checking...' : 'Verify'}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Certificate IDs are printed on the certificate and in the QR code
        </p>
      </div>

      {/* Result */}
      {searched && result && (
        <div className="w-full max-w-lg">
          {result.valid ? (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Green verified banner */}
              <div className="bg-green-500 px-6 py-4 flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-white flex-shrink-0" />
                <div>
                  <p className="text-white font-bold text-lg">✅ Verified Certificate</p>
                  <p className="text-green-100 text-xs">This certificate is authentic and issued by Sadakathullah Appa College</p>
                </div>
              </div>

              {/* Certificate details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <Award className="w-10 h-10 text-indigo-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Student Name</p>
                    <p className="text-xl font-bold text-gray-800">{result.student_name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Department',      value: result.department || '—' },
                    { label: 'Exam / Course',   value: result.exam_name },
                    { label: 'Score',           value: `${result.score} / ${result.total_marks}` },
                    { label: 'Percentage',      value: `${result.percentage}%` },
                    { label: 'Grade',           value: result.grade },
                    { label: 'Date of Issue',   value: new Date(result.issued_date).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }) },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                      <p className="text-sm font-semibold text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-indigo-50 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Certificate ID</p>
                    <p className="font-mono font-bold text-indigo-700 text-sm">{result.certificate_id}</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">VALID</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-red-500 px-6 py-4 flex items-center gap-3">
                <ShieldX className="w-8 h-8 text-white flex-shrink-0" />
                <div>
                  <p className="text-white font-bold text-lg">❌ Invalid Certificate ID</p>
                  <p className="text-red-100 text-xs">This certificate ID was not found in our database</p>
                </div>
              </div>
              <div className="p-6 text-center">
                <p className="text-gray-500 text-sm mb-4">
                  The certificate ID <span className="font-mono font-bold text-gray-700">{input}</span> does not match any record issued by Sadakathullah Appa College.
                </p>
                <p className="text-gray-400 text-xs">
                  If you believe this is an error, please contact the college administration.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <p className="text-gray-400 text-xs mt-8 text-center">
        © {new Date().getFullYear()} Sadakathullah Appa College — Certificate Verification Portal
      </p>
    </div>
  );
};

export default VerifyPage;
