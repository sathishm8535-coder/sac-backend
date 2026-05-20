import { useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { X, Download, Award, ShieldCheck, Image } from 'lucide-react';

// Text positions mapped to the WhatsApp certificate template
// Adjust x/y values here if the template image layout changes
const POSITIONS = {
  studentName: { x: 0.5,   y: 0.445, fontSize: 28, color: '#1e3a5f', bold: true,  align: 'center' },
  department:  { x: 0.5,   y: 0.515, fontSize: 16, color: '#374151', bold: false, align: 'center' },
  examName:    { x: 0.5,   y: 0.595, fontSize: 15, color: '#1e3a5f', bold: true,  align: 'center' },
  score:       { x: 0.5,   y: 0.655, fontSize: 14, color: '#374151', bold: false, align: 'center' },
  grade:       { x: 0.5,   y: 0.705, fontSize: 18, color: '#1e3a5f', bold: true,  align: 'center' },
  date:        { x: 0.5,   y: 0.820, fontSize: 13, color: '#374151', bold: false, align: 'center' },
  certId:      { x: 0.5,   y: 0.870, fontSize: 11, color: '#6b7280', bold: false, align: 'center' },
};

const drawCertificate = (canvas, cert, bgImage) => {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // Draw background template
  ctx.drawImage(bgImage, 0, 0, W, H);

  const date = new Date(cert.issued_date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  const percentage = ((cert.score / cert.total_marks) * 100).toFixed(1);

  const fields = [
    { key: 'studentName', text: cert.student_name },
    { key: 'department',  text: cert.department || 'Sadakathullah Appa College' },
    { key: 'examName',    text: cert.exam_name },
    { key: 'score',       text: `Score: ${cert.score} / ${cert.total_marks}  (${percentage}%)` },
    { key: 'grade',       text: `Grade: ${cert.grade}` },
    { key: 'date',        text: `Date: ${date}` },
    { key: 'certId',      text: `Certificate ID: ${cert.certificate_id}` },
  ];

  fields.forEach(({ key, text }) => {
    const pos = POSITIONS[key];
    ctx.font = `${pos.bold ? 'bold' : 'normal'} ${pos.fontSize}px Georgia, serif`;
    ctx.fillStyle = pos.color;
    ctx.textAlign = pos.align;
    ctx.fillText(text, W * pos.x, H * pos.y);
  });
};

const CertificateModal = ({ cert, onClose }) => {
  const canvasRef = useRef();
  const [downloading, setDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [bgLoaded, setBgLoaded] = useState(false);
  const bgRef = useRef(null);

  const BG_IMAGE = '/Assest/WhatsApp Image 2026-05-20 at 12.40.54 PM.jpeg';

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = BG_IMAGE;
    img.onload = () => {
      bgRef.current = img;
      setBgLoaded(true);
    };
    img.onerror = () => {
      // fallback: draw plain white background
      bgRef.current = null;
      setBgLoaded(true);
    };
  }, []);

  useEffect(() => {
    if (!bgLoaded || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width  = 1123; // A4 landscape px at 96dpi
    canvas.height = 794;

    if (bgRef.current) {
      drawCertificate(canvas, cert, bgRef.current);
    } else {
      // Fallback plain design if image fails
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#4f46e5';
      ctx.lineWidth = 12;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      drawCertificate(canvas, cert, { width: 0, height: 0 });
    }
  }, [bgLoaded, cert]);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    setDownloadType('pdf');
    try {
      const canvas = canvasRef.current;
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
      pdf.save(`certificate-${cert.certificate_id}.pdf`);
    } finally {
      setDownloading(false);
      setDownloadType(null);
    }
  };

  const handleDownloadPNG = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `certificate-${cert.certificate_id}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  const handleVerify = async () => {
    setVerifying(true);
    setVerifyResult(null);
    try {
      const { data } = await (await import('axios')).default.get(
        `/api/certificates/verify/${cert.certificate_id}`
      );
      setVerifyResult({ valid: true, ...data });
    } catch {
      setVerifyResult({ valid: false });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl">

        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" /> Certificate Preview
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas preview */}
        <div className="p-4 overflow-x-auto bg-gray-100">
          {!bgLoaded && (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              Loading certificate template...
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="mx-auto rounded shadow-lg"
            style={{
              display: bgLoaded ? 'block' : 'none',
              maxWidth: '100%',
              height: 'auto'
            }}
          />
        </div>

        {/* Verify result */}
        {verifyResult && (
          <div className={`mx-5 mb-2 px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${
            verifyResult.valid
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            {verifyResult.valid
              ? `✅ Valid certificate — issued to ${verifyResult.student_name} on ${new Date(verifyResult.issued_date).toLocaleDateString('en-IN')}`
              : '❌ Certificate not found or invalid'}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap justify-end px-5 py-4 border-t gap-2">
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-2 text-sm font-medium disabled:opacity-60"
          >
            <ShieldCheck className="w-4 h-4" />
            {verifying ? 'Verifying...' : 'Verify'}
          </button>
          <button
            onClick={handleDownloadPNG}
            disabled={!bgLoaded}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 text-sm font-medium disabled:opacity-60"
          >
            <Image className="w-4 h-4" /> PNG
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading || !bgLoaded}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 text-sm font-medium disabled:opacity-60"
          >
            <Download className="w-4 h-4" />
            {downloading && downloadType === 'pdf' ? 'Generating...' : 'PDF'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
