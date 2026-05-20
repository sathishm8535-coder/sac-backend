import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { X, Download, Award, ShieldCheck, ImagePlus } from 'lucide-react';
import axios from 'axios';

const CertificateModal = ({ cert, onClose }) => {
  const certRef  = useRef();
  const [photoSrc,    setPhotoSrc]    = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [verifying,   setVerifying]   = useState(false);
  const [verifyResult,setVerifyResult]= useState(null);

  const date       = new Date(cert.issued_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const percentage = ((cert.score / cert.total_marks) * 100).toFixed(1);
  const dept       = cert.department || 'Sadakathullah Appa College';

  /* ── Photo upload ─────────────────────────────────────────── */
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  /* ── Capture canvas from HTML ─────────────────────────────── */
  const capture = () =>
    html2canvas(certRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
    });

  /* ── PDF download ─────────────────────────────────────────── */
  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const canvas  = await capture();
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf     = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`certificate-${cert.certificate_id}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  /* ── PNG download ─────────────────────────────────────────── */
  const handleDownloadPNG = async () => {
    const canvas = await capture();
    const link   = document.createElement('a');
    link.download = `certificate-${cert.certificate_id}.png`;
    link.href     = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  /* ── Verify ───────────────────────────────────────────────── */
  const handleVerify = async () => {
    setVerifying(true);
    setVerifyResult(null);
    try {
      const { data } = await axios.get(`/api/certificates/verify/${cert.certificate_id}`);
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

        {/* Modal header */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" /> Certificate Preview
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Photo upload strip */}
        <div className="px-5 py-3 border-b bg-gray-50 flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
            <ImagePlus className="w-4 h-4" />
            {photoSrc ? 'Change Photo' : 'Upload Student Photo'}
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
          {photoSrc && <span className="text-green-600 text-sm font-medium">✓ Photo uploaded</span>}
          {!photoSrc && <span className="text-gray-400 text-xs">Upload a passport-size photo to include in the certificate</span>}
        </div>

        {/* ── Certificate design ── */}
        <div className="p-4 bg-gray-100 overflow-x-auto">
          <div
            ref={certRef}
            style={{
              width: '960px',
              minHeight: '640px',
              background: 'linear-gradient(135deg, #0f2557 0%, #1a3a8f 40%, #0f2557 100%)',
              fontFamily: 'Georgia, "Times New Roman", serif',
              position: 'relative',
              margin: '0 auto',
              padding: '0',
              boxSizing: 'border-box',
            }}
          >
            {/* Gold outer border */}
            <div style={{ position:'absolute', inset:'8px', border:'3px solid #c9a84c', pointerEvents:'none', zIndex:1 }} />
            {/* Thin inner border */}
            <div style={{ position:'absolute', inset:'16px', border:'1px solid rgba(201,168,76,0.4)', pointerEvents:'none', zIndex:1 }} />

            {/* Corner ornaments */}
            {[
              { top:'4px',   left:'4px'  },
              { top:'4px',   right:'4px' },
              { bottom:'4px',left:'4px'  },
              { bottom:'4px',right:'4px' },
            ].map((style, i) => (
              <div key={i} style={{ position:'absolute', width:'40px', height:'40px', zIndex:2, ...style }}>
                <div style={{ width:'100%', height:'100%', border:'3px solid #c9a84c', borderRadius:'50%', background:'#0f2557', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ width:'12px', height:'12px', background:'#c9a84c', borderRadius:'50%' }} />
                </div>
              </div>
            ))}

            {/* Main content */}
            <div style={{ position:'relative', zIndex:3, padding:'48px 64px', display:'flex', flexDirection:'column', alignItems:'center', gap:'0' }}>

              {/* Header row: logo + title + photo */}
              <div style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
                {/* College logo */}
                <img
                  src="/Assest/sadak1.jpg"
                  alt="College Logo"
                  crossOrigin="anonymous"
                  style={{ width:'72px', height:'72px', borderRadius:'50%', objectFit:'cover', border:'3px solid #c9a84c' }}
                />

                {/* Center title */}
                <div style={{ textAlign:'center', flex:1, padding:'0 24px' }}>
                  <div style={{ color:'#c9a84c', fontSize:'11px', letterSpacing:'4px', textTransform:'uppercase', marginBottom:'4px' }}>
                    Sadakathullah Appa College (Autonomous)
                  </div>
                  <div style={{ color:'#ffffff', fontSize:'28px', fontWeight:'bold', letterSpacing:'2px', textTransform:'uppercase', lineHeight:1.2 }}>
                    Certificate
                  </div>
                  <div style={{ color:'#c9a84c', fontSize:'13px', letterSpacing:'3px', textTransform:'uppercase', marginTop:'4px' }}>
                    of Achievement
                  </div>
                </div>

                {/* Student photo */}
                <div style={{ width:'80px', height:'96px', border:'3px solid #c9a84c', borderRadius:'6px', overflow:'hidden', background:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {photoSrc ? (
                    <img src={photoSrc} alt="Student" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  ) : (
                    <div style={{ color:'rgba(201,168,76,0.5)', fontSize:'10px', textAlign:'center', padding:'4px' }}>Photo</div>
                  )}
                </div>
              </div>

              {/* Gold divider */}
              <div style={{ width:'100%', height:'1px', background:'linear-gradient(90deg, transparent, #c9a84c, transparent)', margin:'8px 0 20px' }} />

              {/* Presented to */}
              <div style={{ color:'rgba(255,255,255,0.7)', fontSize:'13px', letterSpacing:'2px', textTransform:'uppercase', marginBottom:'8px' }}>
                This certificate is proudly presented to
              </div>

              {/* Student name */}
              <div style={{ color:'#c9a84c', fontSize:'38px', fontWeight:'bold', textAlign:'center', lineHeight:1.2, marginBottom:'6px', maxWidth:'700px', wordBreak:'break-word' }}>
                {cert.student_name}
              </div>

              {/* Department */}
              <div style={{ color:'rgba(255,255,255,0.85)', fontSize:'15px', marginBottom:'16px', textAlign:'center' }}>
                {dept}
              </div>

              {/* Body text */}
              <div style={{ color:'rgba(255,255,255,0.75)', fontSize:'13px', textAlign:'center', lineHeight:1.7, marginBottom:'20px', maxWidth:'640px' }}>
                has successfully completed the examination and demonstrated outstanding academic performance in
              </div>

              {/* Exam name */}
              <div style={{ color:'#ffffff', fontSize:'20px', fontWeight:'bold', textAlign:'center', marginBottom:'24px', padding:'10px 32px', border:'1px solid rgba(201,168,76,0.5)', borderRadius:'4px', background:'rgba(201,168,76,0.08)', maxWidth:'700px', wordBreak:'break-word' }}>
                {cert.exam_name}
              </div>

              {/* Score / Grade / Date row */}
              <div style={{ display:'flex', gap:'48px', marginBottom:'24px', justifyContent:'center' }}>
                {[
                  { label:'Score',      value:`${cert.score} / ${cert.total_marks}` },
                  { label:'Percentage', value:`${percentage}%` },
                  { label:'Grade',      value:cert.grade },
                  { label:'Date',       value:date },
                ].map(({ label, value }) => (
                  <div key={label} style={{ textAlign:'center' }}>
                    <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'10px', letterSpacing:'2px', textTransform:'uppercase', marginBottom:'4px' }}>{label}</div>
                    <div style={{ color:'#c9a84c', fontSize:'16px', fontWeight:'bold' }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Gold divider */}
              <div style={{ width:'100%', height:'1px', background:'linear-gradient(90deg, transparent, #c9a84c, transparent)', margin:'0 0 16px' }} />

              {/* Footer: signature + cert ID */}
              <div style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                <div style={{ textAlign:'center' }}>
                  <div style={{ width:'120px', height:'1px', background:'rgba(201,168,76,0.6)', marginBottom:'6px' }} />
                  <div style={{ color:'rgba(255,255,255,0.6)', fontSize:'11px', letterSpacing:'1px' }}>Principal's Signature</div>
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'10px', letterSpacing:'1px', marginBottom:'4px' }}>CERTIFICATE ID</div>
                  <div style={{ color:'#c9a84c', fontSize:'12px', fontFamily:'monospace', fontWeight:'bold' }}>{cert.certificate_id}</div>
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ width:'120px', height:'1px', background:'rgba(201,168,76,0.6)', marginBottom:'6px' }} />
                  <div style={{ color:'rgba(255,255,255,0.6)', fontSize:'11px', letterSpacing:'1px' }}>Examiner's Signature</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Verify result */}
        {verifyResult && (
          <div className={`mx-5 mt-2 px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${
            verifyResult.valid
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            {verifyResult.valid
              ? `✅ Valid — issued to ${verifyResult.student_name} on ${new Date(verifyResult.issued_date).toLocaleDateString('en-IN')}`
              : '❌ Certificate not found or invalid'}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap justify-end px-5 py-4 border-t gap-2">
          <button onClick={handleVerify} disabled={verifying}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-2 text-sm font-medium disabled:opacity-60">
            <ShieldCheck className="w-4 h-4" />
            {verifying ? 'Verifying...' : 'Verify'}
          </button>
          <button onClick={handleDownloadPNG}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 text-sm font-medium">
            <Download className="w-4 h-4" /> PNG
          </button>
          <button onClick={handleDownloadPDF} disabled={downloading}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 text-sm font-medium disabled:opacity-60">
            <Download className="w-4 h-4" />
            {downloading ? 'Generating...' : 'PDF'}
          </button>
          <button onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium">
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default CertificateModal;
