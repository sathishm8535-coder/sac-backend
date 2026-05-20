import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Award, ShieldCheck, ImagePlus } from 'lucide-react';
import axios from 'axios';

const VERIFY_BASE = `${window.location.origin}/verify`;

const CertificateModal = ({ cert, onClose }) => {
  const certRef = useRef();
  const [photoSrc,     setPhotoSrc]     = useState(null);
  const [downloading,  setDownloading]  = useState(false);
  const [pdfLoading,   setPdfLoading]   = useState(false);
  const [verifying,    setVerifying]    = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

  const date       = new Date(cert.issued_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const percentage = ((cert.score / cert.total_marks) * 100).toFixed(1);
  const dept       = cert.department || '';
  const verifyUrl  = `${VERIFY_BASE}/${cert.certificate_id}`;

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  const capture = () =>
    html2canvas(certRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#fffdf5',
      logging: false,
      imageTimeout: 0,
    });

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    try {
      const canvas  = await capture();
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf     = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${cert.certificate_id}.pdf`);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDownloadPNG = async () => {
    setDownloading(true);
    try {
      const canvas = await capture();
      const link   = document.createElement('a');
      link.download = `${cert.certificate_id}.png`;
      link.href     = canvas.toDataURL('image/png', 1.0);
      link.click();
    } finally {
      setDownloading(false);
    }
  };

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

  /* ─── Shared inline styles ─────────────────────────────────── */
  const S = {
    wrap: {
      width: '960px', background: '#fffdf5',
      fontFamily: '"Georgia", "Times New Roman", serif',
      position: 'relative', margin: '0 auto', boxSizing: 'border-box',
      border: '2px solid #b8960c', padding: '0',
    },
    innerBorder: {
      position: 'absolute', inset: '10px',
      border: '1px solid rgba(184,150,12,0.35)',
      pointerEvents: 'none', zIndex: 1,
    },
    content: {
      position: 'relative', zIndex: 2,
      padding: '40px 56px 32px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    },
    headerRow: {
      width: '100%', display: 'flex',
      alignItems: 'flex-start', justifyContent: 'space-between',
      marginBottom: '12px',
    },
    logo: {
      width: '72px', height: '72px', borderRadius: '50%',
      objectFit: 'cover', border: '2px solid #b8960c',
    },
    collegeName: {
      color: '#1a3a6b', fontSize: '13px', fontWeight: 'bold',
      letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2px',
      textAlign: 'center',
    },
    certTitle: {
      color: '#1a3a6b', fontSize: '30px', fontWeight: 'bold',
      letterSpacing: '3px', textTransform: 'uppercase', lineHeight: 1.1,
      textAlign: 'center',
    },
    certSubtitle: {
      color: '#b8960c', fontSize: '14px', letterSpacing: '4px',
      textTransform: 'uppercase', marginTop: '4px', textAlign: 'center',
    },
    photoBox: {
      width: '80px', height: '96px',
      border: '2px solid #b8960c', borderRadius: '4px',
      overflow: 'hidden', background: '#f5f0e0',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    },
    divider: {
      width: '100%', height: '2px',
      background: 'linear-gradient(90deg, transparent, #b8960c 20%, #b8960c 80%, transparent)',
      margin: '12px 0',
    },
    thinDivider: {
      width: '60%', height: '1px',
      background: 'linear-gradient(90deg, transparent, #b8960c, transparent)',
      margin: '8px 0',
    },
    presentedTo: {
      color: '#555', fontSize: '12px', letterSpacing: '3px',
      textTransform: 'uppercase', marginBottom: '6px',
    },
    studentName: {
      color: '#1a3a6b', fontSize: '36px', fontWeight: 'bold',
      textAlign: 'center', lineHeight: 1.2, marginBottom: '4px',
      maxWidth: '700px', wordBreak: 'break-word',
    },
    deptText: {
      color: '#444', fontSize: '14px', marginBottom: '4px', textAlign: 'center',
    },
    bodyText: {
      color: '#666', fontSize: '13px', textAlign: 'center',
      lineHeight: 1.7, marginBottom: '12px', maxWidth: '600px',
    },
    examBox: {
      color: '#1a3a6b', fontSize: '18px', fontWeight: 'bold',
      textAlign: 'center', marginBottom: '20px',
      padding: '8px 28px',
      border: '1px solid rgba(184,150,12,0.5)',
      borderRadius: '4px',
      background: 'rgba(184,150,12,0.06)',
      maxWidth: '680px', wordBreak: 'break-word',
    },
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

        {/* Photo upload */}
        <div className="px-5 py-3 border-b bg-gray-50 flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
            <ImagePlus className="w-4 h-4" />
            {photoSrc ? 'Change Photo' : 'Upload Student Photo'}
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
          {photoSrc
            ? <span className="text-green-600 text-sm font-medium">✓ Photo uploaded</span>
            : <span className="text-gray-400 text-xs">Upload passport-size photo to include in certificate</span>
          }
        </div>

        {/* ── Certificate ── */}
        <div className="p-4 bg-gray-200 overflow-x-auto">
          <div ref={certRef} style={S.wrap}>
            <div style={S.innerBorder} />

            {/* Corner ornaments */}
            {[{top:'6px',left:'6px'},{top:'6px',right:'6px'},{bottom:'6px',left:'6px'},{bottom:'6px',right:'6px'}].map((pos,i)=>(
              <div key={i} style={{position:'absolute',width:'36px',height:'36px',zIndex:3,...pos}}>
                <div style={{width:'100%',height:'100%',border:'2px solid #b8960c',borderRadius:'50%',background:'#fffdf5',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <div style={{width:'10px',height:'10px',background:'#b8960c',borderRadius:'50%'}}/>
                </div>
              </div>
            ))}

            <div style={S.content}>

              {/* Header row */}
              <div style={S.headerRow}>
                <img src="/Assest/sadak1.jpg" alt="Logo" crossOrigin="anonymous" style={S.logo} />

                <div style={{textAlign:'center',flex:1,padding:'0 20px'}}>
                  <div style={S.collegeName}>Sadakathullah Appa College (Autonomous)</div>
                  <div style={{color:'#555',fontSize:'11px',marginBottom:'8px'}}>Tirunelveli — 627 011, Tamil Nadu</div>
                  <div style={S.certTitle}>Certificate</div>
                  <div style={S.certSubtitle}>of Achievement</div>
                </div>

                {/* Student photo */}
                <div style={S.photoBox}>
                  {photoSrc
                    ? <img src={photoSrc} alt="Student" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                    : <span style={{color:'#b8960c',fontSize:'9px',textAlign:'center',padding:'4px',opacity:0.6}}>Photo</span>
                  }
                </div>
              </div>

              <div style={S.divider} />

              <div style={S.presentedTo}>This certificate is proudly presented to</div>

              <div style={S.studentName}>{cert.student_name}</div>

              {dept && <div style={S.deptText}>{dept}</div>}

              <div style={S.thinDivider} />

              <div style={S.bodyText}>
                has successfully completed the examination and demonstrated outstanding academic performance in
              </div>

              <div style={S.examBox}>{cert.exam_name}</div>

              {/* Stats row */}
              <div style={{display:'flex',gap:'40px',marginBottom:'20px',justifyContent:'center',flexWrap:'wrap'}}>
                {[
                  {label:'Score',      value:`${cert.score} / ${cert.total_marks}`},
                  {label:'Percentage', value:`${percentage}%`},
                  {label:'Grade',      value:cert.grade},
                  {label:'Date',       value:date},
                ].map(({label,value})=>(
                  <div key={label} style={{textAlign:'center',minWidth:'80px'}}>
                    <div style={{color:'#999',fontSize:'9px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'3px'}}>{label}</div>
                    <div style={{color:'#1a3a6b',fontSize:'15px',fontWeight:'bold'}}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={S.divider} />

              {/* Footer: signatures + QR */}
              <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginTop:'8px'}}>

                {/* Principal */}
                <div style={{textAlign:'center'}}>
                  <div style={{width:'110px',height:'1px',background:'rgba(184,150,12,0.6)',marginBottom:'5px'}}/>
                  <div style={{color:'#555',fontSize:'10px',letterSpacing:'1px'}}>Principal's Signature</div>
                </div>

                {/* QR + Cert ID */}
                <div style={{textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}>
                  <QRCodeSVG
                    value={verifyUrl}
                    size={72}
                    bgColor="#fffdf5"
                    fgColor="#1a3a6b"
                    level="M"
                  />
                  <div style={{color:'#999',fontSize:'9px',letterSpacing:'1px',textTransform:'uppercase'}}>Scan to Verify</div>
                  <div style={{color:'#b8960c',fontSize:'11px',fontFamily:'monospace',fontWeight:'bold'}}>{cert.certificate_id}</div>
                </div>

                {/* Examiner */}
                <div style={{textAlign:'center'}}>
                  <div style={{width:'110px',height:'1px',background:'rgba(184,150,12,0.6)',marginBottom:'5px'}}/>
                  <div style={{color:'#555',fontSize:'10px',letterSpacing:'1px'}}>Examiner's Signature</div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Verify result banner */}
        {verifyResult && (
          <div className={`mx-5 mt-2 px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${
            verifyResult.valid
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            {verifyResult.valid
              ? `✅ Verified — issued to ${verifyResult.student_name} | Grade: ${verifyResult.grade} | ${new Date(verifyResult.issued_date).toLocaleDateString('en-IN')}`
              : '❌ Invalid Certificate ID — not found in database'}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap justify-end px-5 py-4 border-t gap-2">
          <button onClick={handleVerify} disabled={verifying}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-2 text-sm font-medium disabled:opacity-60">
            <ShieldCheck className="w-4 h-4" />
            {verifying ? 'Verifying...' : 'Verify Certificate'}
          </button>
          <button onClick={handleDownloadPNG} disabled={downloading}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 text-sm font-medium disabled:opacity-60">
            <Download className="w-4 h-4" />
            {downloading ? 'Saving...' : 'PNG'}
          </button>
          <button onClick={handleDownloadPDF} disabled={pdfLoading}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 text-sm font-medium disabled:opacity-60">
            <Download className="w-4 h-4" />
            {pdfLoading ? 'Generating...' : 'PDF'}
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
