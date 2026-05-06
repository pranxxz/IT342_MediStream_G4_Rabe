import React, { useState, useEffect } from "react";
import API from '../services/api';
import { COLORS, Avatar } from '../components/Sidebar'; 

// ─── PatientQueue Specific Icons ──────────────────────────────────────────────
const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconFilter = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/>
    <line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
);
const IconDots = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#aaa">
    <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
  </svg>
);
const IconPatientCount = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" opacity="0.85">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity="0.85">
    <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
  </svg>
);
const IconDoc = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity="0.85">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10,9 9,9 8,9"/>
  </svg>
);
const IconCheckCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" opacity="0.85">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22,4 12,14.01 9,11.01"/>
  </svg>
);

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  maroon:       "#4a0e0e",
  maroonDark:   "#3a0a0a",
  maroonLight:  "#5c1212",
  bg:           "#f5f5f5",
  white:        "#ffffff",
  border:       "#e8e8e8",
  text:         "#1a1a1a",
  textMuted:    "#888",
  consulting:   "#c0392b",
  consultingBg: "#fdecea",
  waiting:      "#666",
  waitingBg:    "#f0f0f0",
  completed:    "#27ae60",
  completedBg:  "#eafaf1",
};

// ─── Reusable Components ──────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    Consulting: { color: C.consulting, bg: C.consultingBg, border: "#f5c6c6" },
    Waiting:    { color: C.waiting,    bg: C.waitingBg,    border: "#d5d5d5" },
    Completed:  { color: C.completed,  bg: C.completedBg,  border: "#a8e6c0" },
  };
  const s = map[status] || map.Waiting;
  return (
    <span style={{
      display: "inline-block", padding: "5px 16px", borderRadius: 20,
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      fontSize: 12, fontWeight: 600, letterSpacing: "0.2px",
    }}>
      {status}
    </span>
  );
};

const StatCard = ({ value, label, icon, borderRight }) => (
  <div style={{
    flex: 1, textAlign: "center", padding: "32px 16px",
    borderRight: borderRight ? "1px solid rgba(255,255,255,0.12)" : "none",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
  }}>
    <div style={{ fontSize: 52, fontWeight: 800, color: "white", lineHeight: 1 }}>{value}</div>
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 500,
    }}>
      <span>{label}</span>{icon}
    </div>
  </div>
);

// Avatar specifically styled for the image (dark maroon circle)
const PatientAvatar = ({ initials }) => (
  <div style={{
    width: 36, height: 36, borderRadius: "50%",
    background: C.maroon,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "white", fontSize: 13, fontWeight: 700, flexShrink: 0,
    letterSpacing: "0.5px",
  }}>
    {initials}
  </div>
);

const PatientRow = ({ num, initials, name, id, age, status, doctor, time }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <tr style={{ borderBottom: `1.5px solid #e8d5d5`, background: "#ffffff" }}
      onMouseEnter={e => e.currentTarget.style.background = "#fbfbfb"}
      onMouseLeave={e => e.currentTarget.style.background = "#fdf8f8"}
    >
      <td style={{ padding: "20px 8px 20px 28px", color: C.textMuted, fontSize: 14 }}>{num}</td>
      <td style={{ padding: "20px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <PatientAvatar initials={initials} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{name}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{id}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: "20px 8px", fontSize: 14, color: C.text }}>{age}</td>
      <td style={{ padding: "20px 8px" }}><StatusBadge status={status} /></td>
      <td style={{ padding: "20px 8px", fontSize: 14, fontWeight: 700, color: C.maroon }}>{doctor}</td>
      <td style={{ padding: "20px 8px", fontSize: 14, color: C.text }}>{time}</td>
      <td style={{ padding: "20px 8px", position: "relative" }}>
        <button onClick={() => setMenuOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <IconDots />
        </button>
        {menuOpen && (
          <div style={{
            position: "absolute", right: 8, top: "100%", zIndex: 10,
            background: C.white, borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            border: `1px solid ${C.border}`, minWidth: 140, overflow: "hidden",
          }}>
            {["View Details", "Edit", "Delete"].map(item => (
              <div key={item} onClick={() => setMenuOpen(false)} style={{
                padding: "10px 16px", fontSize: 13,
                color: item === "Delete" ? "#e74c3c" : C.text,
                cursor: "pointer", fontWeight: 500,
              }}
                onMouseEnter={e => e.currentTarget.style.background = C.bg}
                onMouseLeave={e => e.currentTarget.style.background = C.white}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </td>
    </tr>
  );
};

// ─── Patient Queue Content ────────────────────────────────────────────────────
const PatientQueueContent = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterOpen, setFilterOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    address: '',
    contactNumber: '',
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await API.get('/api/queue');
      const data = response.data || [];

      const formattedQueue = data.map(queueItem => {
        // Force the status to Title Case so "waiting" becomes "Waiting"
        // This fixes the bug where the stats cards were showing 0
        let rawStatus = queueItem.status || 'Waiting';
        let formattedStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();

        return {
          queueId: queueItem.id,
          status: formattedStatus, 
          patientId: queueItem.patient?.patientId,
          firstName: queueItem.patient?.firstName,
          lastName: queueItem.patient?.lastName,
          age: queueItem.patient?.age || '-',
          gender: queueItem.patient?.gender || '-',
          assignedDoctor: queueItem.assignedDoctor || '-', 
          time: queueItem.arrivalTime || '-' 
        };
      });

      // NO MORE MOCK DATA - directly set the backend data
      setPatients(formattedQueue); 
    } catch (error) {
      console.error('Failed to load queue', error);
      setPatients([]); // Set to empty array if backend fails
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.age || !formData.contactNumber) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: Number(formData.age),
        gender: formData.gender,
        address: formData.address,
        contactNumber: formData.contactNumber
      };

      await API.post('/api/queue/join', payload);

      setFormData({ firstName: '', lastName: '', age: '', gender: '', address: '', contactNumber: '' });
      setModalOpen(false);
      await loadPatients();
    } catch (error) {
      console.error('Failed to add patient to queue', error);
      alert('Failed to add patient to queue. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const stats = {
    total: patients.length,
    waiting: patients.filter(p => p.status === "Waiting").length,
    consulting: patients.filter(p => p.status === "Consulting").length,
    completed: patients.filter(p => p.status === "Completed").length,
  };

  // Fixed filtering logic: Filter directly from 'patients', not a hardcoded 'queuePatients' list
  const filtered = patients.filter(p => {
    const matchSearch = `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
                        (p.assignedDoctor || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All Status" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* ── Header ── */}
      <div style={{ padding: "24px 32px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              width: 32, height: 32, borderRadius: 6, background: C.maroon,
              display: "flex", alignItems: "center", justifyContent: "center", color: "white",
              border: "none", cursor: "pointer",
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.maroonDark}
            onMouseLeave={e => e.currentTarget.style.background = C.maroon}
          >
            <IconPlus />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: "-0.4px" }}>
              Patient Queue
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>Real-time patient monitoring</p>
          </div>
        </div>

        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: C.white, border: `1px solid ${C.border}`,
          borderRadius: 8, padding: "8px 14px", width: 260,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          <IconSearch />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search patients, doctors..."
            style={{
              border: "none", outline: "none", background: "transparent",
              fontSize: 13, color: C.text, width: "100%", fontFamily: "inherit",
            }}
          />
        </div>
      </div>

      <div style={{ padding: "0 32px 32px", flex: 1 }}>
        {/* ── Stat Cards ── */}
        <div style={{
          background: C.maroon,
          borderRadius: 14,
          display: "flex",
          marginBottom: 24,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(74,14,14,0.3)",
        }}>
          <StatCard value={stats.total}      label="Total Patients" icon={<IconPatientCount />} borderRight />
          <StatCard value={stats.waiting}    label="Waiting"        icon={<IconClock />}        borderRight />
          <StatCard value={stats.consulting} label="Consulting"     icon={<IconDoc />}          borderRight />
          <StatCard value={stats.completed}  label="Completed"      icon={<IconCheckCircle />} />
        </div>

        {/* ── Table Card ── */}
        <div style={{
          background: C.white,
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(74,14,14,0.1)",
          border: `1.5px solid ${C.maroon}`,
          overflow: "hidden",
        }}>
          {/* Table Header Row */}
          <div style={{
            padding: "20px 28px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: `1.5px solid ${C.maroon}`,
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: C.maroon }}>Patient Queue</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>
                {filtered.length} patients in queue
              </div>
            </div>
            {/* Filter */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setFilterOpen(o => !o)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", borderRadius: 8,
                  border: `1.5px solid ${C.maroon}`, background: C.white,
                  color: C.maroon, fontWeight: 600, fontSize: 13,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                <IconFilter /> {filterStatus}
              </button>
              {filterOpen && (
                <div style={{
                  position: "absolute", right: 0, top: "calc(100% + 6px)", zIndex: 10,
                  background: C.white, borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                  border: `1px solid ${C.border}`, minWidth: 140,
                }}>
                  {["All Status", "Consulting", "Waiting", "Completed"].map(s => (
                    <div key={s}
                      onClick={() => { setFilterStatus(s); setFilterOpen(false); }}
                      style={{
                        padding: "10px 16px", fontSize: 13, cursor: "pointer",
                        color: filterStatus === s ? C.maroon : C.text,
                        fontWeight: filterStatus === s ? 700 : 400,
                        background: filterStatus === s ? "#fdf0f0" : C.white,
                      }}
                      onMouseEnter={e => { if (filterStatus !== s) e.currentTarget.style.background = C.bg; }}
                      onMouseLeave={e => { if (filterStatus !== s) e.currentTarget.style.background = C.white; }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "white" }}>
                {["#", "PATIENT", "AGE", "STATUS", "DOCTOR", "TIME", ""].map((h, i) => (
                  <th key={i} style={{
                    padding: "14px 8px", textAlign: "left",
                    fontSize: 11, fontWeight: 800,
                    color: C.maroon, letterSpacing: "1px",
                    borderBottom: `1px solid #e0c8c8`,
                    paddingLeft: i === 0 ? 28 : 8,
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const initials = ((p.firstName || '')[0] + (p.lastName || '')[0]).toUpperCase();
                const name = `${p.firstName || ''} ${p.lastName || ''}`.trim();
                const patientId = `ID: ${p.patientId}`;
                
                return (
                  <PatientRow
                    key={p.patientId || i}
                    num={i + 1}
                    initials={initials}
                    name={name}
                    id={patientId}
                    age={p.age}
                    status={p.status}
                    doctor={p.assignedDoctor || '-'}
                    time={p.time}
                  />
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px 16px", color: C.textMuted, fontSize: 14 }}>
                    {loading ? 'Loading patients...' : 'No patients in queue.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Patient Modal ── */}
      {modalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.45)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
          <div style={{
            background: C.white, borderRadius: 14, width: "90%", maxWidth: 500,
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)", overflow: "hidden",
          }}>
            <div style={{
              padding: "22px 24px", borderBottom: `1px solid ${C.border}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.text }}>
                Add Patient to Queue
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: C.textMuted, lineHeight: 1 }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: "24px" }}>
              <form onSubmit={handleFormSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>First Name *</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} placeholder="John"
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>Last Name *</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} placeholder="Doe"
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>Age *</label>
                    <input type="number" name="age" value={formData.age} onChange={handleFormChange} placeholder="35" min="0" max="150"
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleFormChange}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}>
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>Contact Number *</label>
                  <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleFormChange} placeholder="09123456789"
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleFormChange} placeholder="123 Main Street, City, Country"
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
                </div>
                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => setModalOpen(false)}
                    style={{ padding: "9px 20px", borderRadius: 7, border: `1px solid ${C.border}`, background: C.white, color: C.text, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    style={{ padding: "9px 20px", borderRadius: 7, border: "none", background: C.maroon, color: "white", fontWeight: 600, fontSize: 14, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, fontFamily: "inherit" }}>
                    {submitting ? 'Adding...' : 'Add Patient'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Default Export ───────────────────────────────────────────────────────────
export default function PatientQueue({ }) {
  return (
    <div style={{ display: "flex", fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh" }}>
      <PatientQueueContent />
    </div>
  );
}