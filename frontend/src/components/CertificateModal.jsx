import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { X, Download, Award } from 'lucide-react';

const CertificateModal = ({ cert, onClose }) => {
  const certRef = useRef();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
      pdf.save(`certificate-${cert.certificate_id}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  const percentage = ((cert.score / cert.total_marks) * 100).toFixed(1);
  const date = new Date(cert.issued_date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl">
        {/* Modal header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" /> Certificate Preview
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Certificate template */}
        <div className="p-4 sm:p-6 overflow-x-auto">
          <div
            ref={certRef}
            className="relative bg-white mx-auto"
            style={{ width: '794px', height: '560px', fontFamily: 'Georgia, serif' }}
          >
            {/* Outer border */}
            <div className="absolute inset-2 border-8 border-indigo-800 rounded-lg" />
            {/* Inner border */}
            <div className="absolute inset-4 border-2 border-yellow-500 rounded-lg" />

            {/* Corner ornaments */}
            {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos, i) => (
              <div key={i} className={`absolute ${pos} w-10 h-10 flex items-center justify-center`}>
                <div className="w-8 h-8 border-4 border-yellow-500 rounded-full bg-indigo-800 flex items-center justify-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                </div>
              </div>
            ))}

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-16 text-center">
              {/* Header */}
              <div className="flex items-center gap-3 mb-2">
                <img
                  src="/Assest/sadak1.jpg"
                  alt="Logo"
                  className="w-14 h-14 rounded-full object-cover border-2 border-indigo-800"
                  crossOrigin="anonymous"
                />
                <div className="text-left">
                  <p className="text-indigo-900 font-bold text-lg leading-tight">Sadakathullah Appa College</p>
                  <p className="text-gray-500 text-xs">Tirunelveli, Tamil Nadu</p>
                </div>
              </div>

              <div className="w-48 h-0.5 bg-yellow-500 mb-3" />

              <p className="text-yellow-600 text-sm tracking-widest uppercase font-semibold mb-1">
                Certificate of Achievement
              </p>

              <p className="text-gray-600 text-sm mb-3">This is to certify that</p>

              <p className="text-indigo-900 font-bold mb-1" style={{ fontSize: '28px' }}>
                {cert.student_name}
              </p>

              <p className="text-gray-600 text-sm mb-3">
                has successfully completed the examination
              </p>

              <p className="text-indigo-800 font-bold text-xl mb-3">
                "{cert.exam_name}"
              </p>

              {/* Score row */}
              <div className="flex gap-8 mb-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Score</p>
                  <p className="text-indigo-900 font-bold text-lg">{cert.score}/{cert.total_marks}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Percentage</p>
                  <p className="text-indigo-900 font-bold text-lg">{percentage}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Grade</p>
                  <p className="text-indigo-900 font-bold text-lg">{cert.grade}</p>
                </div>
              </div>

              <div className="w-48 h-0.5 bg-yellow-500 mb-3" />

              {/* Footer */}
              <div className="flex justify-between w-full px-8">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Date of Issue</p>
                  <p className="text-gray-800 font-semibold text-sm">{date}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Certificate ID</p>
                  <p className="text-indigo-700 font-mono font-semibold text-sm">{cert.certificate_id}</p>
                </div>
                <div className="text-center">
                  <div className="w-20 border-b border-gray-400 mb-1" />
                  <p className="text-xs text-gray-500">Principal's Signature</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download button */}
        <div className="flex justify-end px-6 py-4 border-t gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium">
            Close
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 text-sm font-medium disabled:opacity-60"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
