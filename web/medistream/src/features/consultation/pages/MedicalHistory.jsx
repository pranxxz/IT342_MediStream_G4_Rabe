import React, { useState, useEffect } from 'react';
import API from '../../../shared/services/api';
import { COLORS } from '../../../shared/components/Sidebar';
import PageHeader, { HeaderSearch } from '../../../shared/components/PageHeader';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const M       = COLORS.primary;
const BG      = COLORS.bg;
const WHITE   = COLORS.white;
const BORDER  = "#e0e0e0";
const TEXT    = COLORS.text;
const MUTED   = COLORS.textMuted;
const ROW_BG  = "#ffffff";
const ROW_HOV = "#f5f5f5";
const ROW_DIV = "#eeeeee";

// ─── Reusable Components ──────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, last }) => (
  <div style={{
    flex: 1, background: M, borderRadius: 10, padding: "18px 22px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginRight: last ? 0 : 12, boxShadow: "0 8px 25px rgba(68,0,13,0.15)",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>{icon}</div>
      <span style={{ color: "white", fontWeight: 600, fontSize: 15 }}>{label}</span>
    </div>
    <span style={{ color: "white", fontWeight: 800, fontSize: 30, lineHeight: 1 }}>{value}</span>
  </div>
);

const IconHistory = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={M} strokeWidth="2.5">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/><polyline points="12 7 12 12 15 14"/>
  </svg>
);
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconFilter = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
);
const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
  </svg>
);
const IconDoc = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const IconPerson = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconStethoscope = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>
  </svg>
);

const PatientAvatar = ({ name }) => {
  const safeName = name && typeof name === 'string' ? name.trim() : 'Unknown';
  const parts = safeName.split(' ');
  const initials = parts.length > 1 
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : (parts[0]?.[0] || 'U').toUpperCase();
  return (
    <div style={{
      width: 38, height: 38, borderRadius: "50%", background: M, color: "white",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 13, fontWeight: 700, flexShrink: 0,
    }}>{initials}</div>
  );
};

// ─── Restore red/pink badges ─────────────────────────────────────────────────
const DiagnosisBadge = ({ text }) => (
  <span style={{
    display: "inline-block", padding: "4px 12px", borderRadius: 6,
    background: "#fdecea", color: M, border: `1px solid #f5c6c6`,
    fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
  }}>{text || 'General Checkup'}</span>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MedicalHistory() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('All Doctors');
  const [doctorDropOpen, setDoctorDropOpen] = useState(false);
  const [diagnosisDropOpen, setDiagnosisDropOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const rowsPerPage = 10;

  const formatDateTime = (isoString) => {
    if (!isoString || isoString === 'No Date') return isoString;
    try {
      const date = new Date(isoString);
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await API.get('/api/consultations/all');
        const data = res.data || [];

        const mapped = data.map(c => ({
          id: c.consultationId,
          patientId: c.patientId || 'N/A',
          patientName: c.patientName || 'Unknown Patient',
          age: c.age || '-',
          dateTime: c.consultationDate || 'No Date',
          doctor: c.doctorName || 'Unassigned',
          diagnosis: c.diagnosis || 'No Diagnosis',
          notes: c.remarks || '',
          symptoms: c.symptoms || 'None reported',
          prescription: c.medicinePrescribed || 'None prescribed',
          status: c.status || 'Completed',
        }));

        if (mounted) setConsultations(mapped);
      } catch (err) {
        console.error('Failed to load consultations', err);
        if (mounted) setError('Failed to connect to backend.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchHistory();
    return () => { mounted = false; };
  }, []);

  const doctors = ['All Doctors', ...new Set(consultations.map(c => c.doctor).filter(Boolean))];

  const filtered = consultations.filter(c => {
    const term = searchTerm.toLowerCase();
    const matchSearch = !term ||
      (c.patientName || '').toLowerCase().includes(term) ||
      (c.doctor || '').toLowerCase().includes(term) ||
      (c.diagnosis || '').toLowerCase().includes(term);
    const matchDoctor = filterDoctor === 'All Doctors' || c.doctor === filterDoctor;
    return matchSearch && matchDoctor;
  });

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const totalConsultations = consultations.length;
  const uniquePatients = new Set(consultations.map(c => c.patientId)).size;
  const uniqueDoctors = new Set(consultations.map(c => c.doctor)).size;
  const uniqueDiagnoses = new Set(consultations.map(c => c.diagnosis)).size;

  const Dropdown = ({ open, setOpen, value, setValue, options, label }) => (
    <div style={{ position: "relative" }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        style={{
          display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8,
          border: `1px solid ${BORDER}`, background: WHITE, color: TEXT, fontWeight: 500, fontSize: 13,
          cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
        }}
      >
        <IconFilter /> {value === label ? label : value}
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 20,
          background: WHITE, borderRadius: 8, minWidth: 180,
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)", border: `1px solid ${BORDER}`, overflow: "hidden",
        }}>
          {options.map(opt => (
            <div key={opt} onClick={() => { setValue(opt); setOpen(false); }}
              style={{
                padding: "10px 16px", fontSize: 13, cursor: "pointer",
                color: value === opt ? M : TEXT, fontWeight: value === opt ? 700 : 400,
                background: value === opt ? "#f0f0f0" : WHITE,
              }}
              onMouseEnter={e => { if (value !== opt) e.currentTarget.style.background = BG; }}
              onMouseLeave={e => { if (value !== opt) e.currentTarget.style.background = WHITE; }}
            >{opt}</div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
         onClick={() => { setDoctorDropOpen(false); setDiagnosisDropOpen(false); }}>
      
      <PageHeader
        title="Medical History"
        subtitle="View past consultations and patient records"
        icon={HistoryEduIcon}
        right={<HeaderSearch value={searchTerm} onChange={setSearchTerm} placeholder="Search records..." />}
      />

      <div style={{ padding: "0 40px 40px" }}>
        <div style={{ display: "flex", marginBottom: 24 }}>
          <StatCard label="Total Consultations" value={totalConsultations} icon={<IconDoc />} />
          <StatCard label="Unique Patients" value={uniquePatients} icon={<IconPerson />} />
          <StatCard label="Doctors" value={uniqueDoctors} icon={<IconStethoscope />} />
          <StatCard label="Diagnoses" value={uniqueDiagnoses} icon={<IconClock />} last />
        </div>

        <div style={{ background: WHITE, borderRadius: 12, border: `1px solid #e0e0e0`, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: `1px solid #eaeaea`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: M }}>Consultation History</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{filtered.length} records found</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Dropdown open={doctorDropOpen} setOpen={setDoctorDropOpen} value={filterDoctor} setValue={setFilterDoctor} options={doctors} label="All Doctors" />
              <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "7px 14px", background: WHITE }}>
                <IconSearch />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search records..." style={{ border: "none", outline: "none", fontSize: 13, color: TEXT, fontFamily: "inherit", width: 220, background: "transparent" }} />
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "48px 2fr 60px 1.6fr 1.6fr 2fr 40px", padding: "12px 24px", borderBottom: `1px solid #eaeaea` }}>
            {["#", "PATIENT", "AGE", "DATE & TIME", "DOCTOR", "DIAGNOSIS", ""].map((h, i) => (
              <div key={i} style={{ fontSize: 11, fontWeight: 800, color: M, letterSpacing: "0.9px" }}>{h}</div>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: "48px", textAlign: "center", color: MUTED }}>Fetching records from backend...</div>
          ) : error ? (
            <div style={{ padding: "24px", color: "#ef4444", textAlign: "center" }}>{error}</div>
          ) : paginated.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center", color: MUTED }}>No matching records found.</div>
          ) : (
            paginated.map((c, i) => (
              <div key={c.id || i}
                onClick={() => setSelectedConsultation(c)}
                style={{
                  display: "grid", gridTemplateColumns: "48px 2fr 60px 1.6fr 1.6fr 2fr 40px",
                  padding: "15px 24px", borderBottom: `1px solid ${ROW_DIV}`, background: ROW_BG, alignItems: "center", transition: "background 0.15s",
                  cursor: "pointer",
                }}
                onMouseEnter={e => e.currentTarget.style.background = ROW_HOV}
                onMouseLeave={e => e.currentTarget.style.background = ROW_BG}
              >
                <div style={{ fontSize: 13, color: MUTED, fontWeight: 600 }}>{page * rowsPerPage + i + 1}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <PatientAvatar name={c.patientName} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>{c.patientName}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>ID: {c.patientId}</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: TEXT }}>{c.age}</div>
                <div style={{ fontSize: 13, color: MUTED }}>{formatDateTime(c.dateTime)}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: M }}>{c.doctor}</div>
                <DiagnosisBadge text={c.diagnosis} />
              </div>
            ))
          )}

          {totalPages > 1 && (
            <div style={{ padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, borderTop: `1px solid ${ROW_DIV}` }}>
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                style={{ padding: "6px 14px", borderRadius: 7, border: `1px solid ${BORDER}`, background: WHITE, color: page === 0 ? MUTED : TEXT, fontWeight: 600, fontSize: 13, cursor: page === 0 ? "not-allowed" : "pointer" }}
              >← Prev</button>
              <span style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>Page {page + 1} of {totalPages}</span>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
                style={{ padding: "6px 14px", borderRadius: 7, border: `1px solid ${BORDER}`, background: WHITE, color: page >= totalPages - 1 ? MUTED : TEXT, fontWeight: 600, fontSize: 13, cursor: page >= totalPages - 1 ? "not-allowed" : "pointer" }}
              >Next →</button>
            </div>
          )}
        </div>

        {/* ── Consultation Detail Pop-up Modal ── */}
        {selectedConsultation && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(240, 240, 240, 0.10)',   
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.25s ease-out',
          }}
          onClick={() => setSelectedConsultation(null)}
          >
            <div style={{
              background: WHITE,
              borderRadius: 16,
              padding: '36px',
              maxWidth: 560,
              width: '90%',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.15)',
              border: `1px solid ${M}`,
              position: 'relative',
              boxSizing: 'border-box',
            }}
            onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedConsultation(null)}
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  background: 'none',
                  border: 'none',
                  fontSize: 28,
                  cursor: 'pointer',
                  color: MUTED,
                  transition: 'color 0.2s',
                  lineHeight: 1,
                }}
                onMouseEnter={e => e.currentTarget.style.color = M}
                onMouseLeave={e => e.currentTarget.style.color = MUTED}
              >
                ×
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, borderBottom: `1px solid #eaeaea`, paddingBottom: 20 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: M, color: "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, fontWeight: 700, boxShadow: '0 4px 12px rgba(68,0,13,0.2)',
                }}>
                  {(() => {
                    const safeName = selectedConsultation.patientName && typeof selectedConsultation.patientName === 'string' ? selectedConsultation.patientName.trim() : 'Unknown';
                    const parts = safeName.split(' ');
                    return parts.length > 1 
                      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
                      : (parts[0]?.[0] || 'U').toUpperCase();
                  })()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: TEXT }}>{selectedConsultation.patientName || 'Unknown Patient'}</h3>
                    <span style={{ fontSize: 13, color: MUTED, fontWeight: 600 }}>Patient ID: #{selectedConsultation.patientId}</span>
                    <span style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>{selectedConsultation.age} yrs old</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 4 }}>CONSULTING DOCTOR</label>
                    <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{selectedConsultation.doctor}</div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 4 }}>DATE & TIME</label>
                    <div style={{ fontSize: 14, fontWeight: 600, color: MUTED }}>{formatDateTime(selectedConsultation.dateTime)}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 6 }}>DIAGNOSIS</label>
                    <DiagnosisBadge text={selectedConsultation.diagnosis} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 6 }}>SYMPTOMS REPORTED</label>
                    {/* Symptoms badge also restored to red/pink */}
                    <span style={{
                      display: "inline-block", padding: "4px 12px", borderRadius: 6,
                      background: "#fdecea", color: M, border: `1px solid #f5c6c6`,
                      fontSize: 12, fontWeight: 600, whiteSpace: "normal", wordBreak: "break-word",
                    }}>
                      {selectedConsultation.symptoms}
                    </span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 6 }}>PRESCRIBED MEDICINE</label>
                  <div style={{
                    background: '#fff',
                    border: `1.5px dashed ${M}50`,
                    borderRadius: 10,
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={M} strokeWidth="2.5">
                      <line x1="4.5" y1="19.5" x2="19.5" y2="4.5"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 7c0 4.14-3.36 7.5-7.5 7.5a7.5 7.5 0 0 1-7-4 15.3 15.3 0 0 1 7.5-7.5C10 2 11 2 12 2z"/>
                    </svg>
                    <span style={{ fontSize: 14, fontWeight: 700, color: M }}>
                      {selectedConsultation.prescription}
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid #eaeaea`, paddingTop: 20 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: M, letterSpacing: '0.5px', marginBottom: 8 }}>CLINICAL NOTES & REMARKS</label>
                  <div style={{ 
                    background: '#fdf8f8',                   
                    borderLeft: `4px solid ${M}`,            
                    borderRadius: '4px 8px 8px 4px',
                    padding: '16px 20px',
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: TEXT,
                    fontStyle: 'italic',
                    border: `1px solid #f5c6c6`,              
                    borderLeftWidth: 4,
                  }}>
                    {selectedConsultation.notes || 'No remarks or clinical notes recorded for this consultation.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}