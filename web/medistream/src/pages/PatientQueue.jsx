import React, { useState, useEffect } from "react";
import API from '../services/api';

// ─── Theme ────────────────────────────────────────────────────────────────────
const COLORS = {
  primary: "#4a0e0e",
  primaryDark: "#3a0a0a",
  primaryLight: "#6b1414",
  accent: "#8b1a1a",
  consulting: "#ff6b6b",
  consultingBg: "#ffe4e4",
  waiting: "#888",
  waitingBg: "#f0f0f0",
  completed: "#2ecc71",
  completedBg: "#e8f8f0",
  bg: "#f5f5f7",
  white: "#ffffff",
  text: "#1a1a1a",
  textMuted: "#666",
  border: "#e8e8e8",
  sidebarText: "#ffffff",
  sidebarTextMuted: "rgba(255,255,255,0.6)",
  sidebarActive: "rgba(255,255,255,0.15)",
  sidebarHover: "rgba(255,255,255,0.08)",
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconStaff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
    <path d="M16 11l2 2 4-4"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconClipboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
  </svg>
);
const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16,17 21,12 16,7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="2">
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
  <svg width="16" height="16" viewBox="0 0 24 24" fill={COLORS.textMuted}>
    <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
  </svg>
);
const IconQueue = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="6" height="18" rx="1"/>
    <rect x="9" y="3" width="6" height="18" rx="1"/>
    <rect x="16" y="3" width="6" height="18" rx="1"/>
  </svg>
);
const IconPatientCount = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" opacity="0.9">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity="0.9">
    <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
  </svg>
);
const IconDoc = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity="0.9">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10,9 9,9 8,9"/>
  </svg>
);
const IconCheckCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" opacity="0.9">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22,4 12,14.01 9,11.01"/>
  </svg>
);

// ─── Reusable: Avatar ─────────────────────────────────────────────────────────
export const Avatar = ({ initials, color = COLORS.primary, size = 38 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: color, color: "white",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.34, fontWeight: 700, flexShrink: 0,
    fontFamily: "inherit", letterSpacing: "0.5px",
  }}>
    {initials}
  </div>
);

// ─── Reusable: StatusBadge ────────────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const map = {
    Consulting: { color: COLORS.consulting, bg: COLORS.consultingBg, border: "#ffb3b3" },
    Waiting:    { color: COLORS.waiting,    bg: COLORS.waitingBg,    border: "#d0d0d0" },
    Completed:  { color: COLORS.completed,  bg: COLORS.completedBg,  border: "#a8e6c0" },
  };
  const s = map[status] || map.Waiting;
  return (
    <span style={{
      display: "inline-block", padding: "4px 14px", borderRadius: 20,
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      fontSize: 12, fontWeight: 600, letterSpacing: "0.3px",
    }}>
      {status}
    </span>
  );
};

// ─── Reusable: StatCard ───────────────────────────────────────────────────────
export const StatCard = ({ value, label, icon, borderRight }) => (
  <div style={{
    flex: 1, textAlign: "center", padding: "28px 16px",
    borderRight: borderRight ? "1px solid rgba(255,255,255,0.15)" : "none",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
  }}>
    <div style={{ fontSize: 48, fontWeight: 800, color: "white", lineHeight: 1 }}>{value}</div>
    <div style={{ display: "flex", alignItems: "center", gap: 7, color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 500 }}>
      <span>{label}</span>{icon}
    </div>
  </div>
);

// ─── Reusable: SidebarItem ────────────────────────────────────────────────────
export const SidebarItem = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "11px 20px", cursor: "pointer", borderRadius: 10,
      margin: "2px 10px",
      background: active ? COLORS.sidebarActive : "transparent",
      color: active ? "white" : COLORS.sidebarTextMuted,
      fontWeight: active ? 600 : 400,
      fontSize: 14, transition: "all 0.18s ease",
      userSelect: "none",
    }}
    onMouseEnter={e => { if (!active) e.currentTarget.style.background = COLORS.sidebarHover; }}
    onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
  >
    {icon}
    <span>{label}</span>
  </div>
);

// ─── Reusable: PatientRow ─────────────────────────────────────────────────────
export const PatientRow = ({ num, initials, name, id, age, status, doctor, time, avatarColor }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
      <td style={{ padding: "18px 16px", color: COLORS.textMuted, fontSize: 14, fontWeight: 500 }}>{num}</td>
      <td style={{ padding: "18px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar initials={initials} color={avatarColor || COLORS.primary} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{name}</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 1 }}>{id}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: "18px 8px", fontSize: 14, color: COLORS.text, fontWeight: 500 }}>{age}</td>
      <td style={{ padding: "18px 8px" }}><StatusBadge status={status} /></td>
      <td style={{ padding: "18px 8px", fontSize: 14, fontWeight: 700, color: COLORS.text }}>{doctor}</td>
      <td style={{ padding: "18px 8px", fontSize: 14, color: COLORS.text }}>{time}</td>
      <td style={{ padding: "18px 8px", position: "relative" }}>
        <button onClick={() => setMenuOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <IconDots />
        </button>
        {menuOpen && (
          <div style={{
            position: "absolute", right: 8, top: "100%", zIndex: 10,
            background: "white", borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            border: `1px solid ${COLORS.border}`, minWidth: 140, overflow: "hidden",
          }}>
            {["View Details", "Edit", "Delete"].map(item => (
              <div key={item} onClick={() => setMenuOpen(false)} style={{
                padding: "10px 16px", fontSize: 13,
                color: item === "Delete" ? "#e74c3c" : COLORS.text,
                cursor: "pointer", fontWeight: 500,
              }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.bg}
                onMouseLeave={e => e.currentTarget.style.background = "white"}
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

// ─── Reusable: Sidebar ────────────────────────────────────────────────────────
// activeItem + setActiveItem are lifted to App.js so every sidebar click
// changes which page App renders — not just which item looks active.
export const Sidebar = ({ activeItem, setActiveItem, onLogout }) => {
  const navItems = [
    { key: "queue",    label: "Patient Queue",   icon: <IconQueue /> },
    { key: "patients", label: "Patients",        icon: <IconUsers /> },
    { key: "staff",    label: "Medical Staff",   icon: <IconStaff /> },
    { key: "consult",  label: "Consultation",    icon: <IconCalendar /> },
    { key: "history",  label: "Medical History", icon: <IconClipboard /> },
  ];

  return (
    <div style={{
      width: 210, flexShrink: 0,
      background: COLORS.primary,
      display: "flex", flexDirection: "column",
      height: "100vh", position: "sticky", top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
          </svg>
        </div>
        <div>
          <div style={{ color: "white", fontWeight: 800, fontSize: 16, letterSpacing: "-0.3px" }}>MediStream</div>
          <div style={{ color: COLORS.sidebarTextMuted, fontSize: 11 }}>Medical Management</div>
        </div>
      </div>

      {/* Nav — onClick lifts navigation up to App.js */}
      <nav style={{ flex: 1, paddingTop: 8 }}>
        {navItems.map(item => (
          <SidebarItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            active={activeItem === item.key}
            onClick={() => setActiveItem(item.key)}
          />
        ))}
      </nav>

      <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "0 20px" }} />

      {/* Footer */}
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar initials="EL" size={34} color={COLORS.accent} />
        <div style={{ flex: 1 }}>
          <div style={{ color: "white", fontWeight: 600, fontSize: 13 }}>Ethan Lee</div>
          <div style={{ color: COLORS.sidebarTextMuted, fontSize: 11 }}>Doctor</div>
        </div>
        <button
          onClick={onLogout}
          title="Logout"
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: COLORS.sidebarTextMuted, padding: 4, borderRadius: 4,
            display: "flex", alignItems: "center",
          }}
        >
          <IconLogout />
        </button>
      </div>
    </div>
  );
};

// ─── Patient Queue page content (no sidebar — sidebar lives in the wrapper) ───
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
      const response = await API.get('/api/patients');
      setPatients(response.data || []);
    } catch (error) {
      console.error('Failed to load patients', error);
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
      await API.post('/api/patients', {
        ...formData,
        age: Number(formData.age),
        status: 'Waiting',
      });
      // Reset form and reload patients
      setFormData({
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        address: '',
        contactNumber: '',
      });
      setModalOpen(false);
      await loadPatients();
    } catch (error) {
      console.error('Failed to create patient', error);
      alert('Failed to add patient. Please try again.');
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

  const queuePatients = patients.filter(p => p.status === 'Waiting');
  const filtered = queuePatients.filter(p => {
    const matchSearch = `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
                        (p.assignedDoctor || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All Status" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ flex: 1, background: COLORS.bg, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{
        padding: "24px 32px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              width: 34, height: 34, borderRadius: 8, background: COLORS.primary,
              display: "flex", alignItems: "center", justifyContent: "center", color: "white",
              border: "none", cursor: "pointer", transition: "all 0.2s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.background = COLORS.primaryDark}
            onMouseLeave={e => e.currentTarget.style.background = COLORS.primary}
          >
            <IconPlus />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: COLORS.text, letterSpacing: "-0.5px" }}>
              Patient Queue
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: COLORS.textMuted }}>Real-time patient monitoring</p>
          </div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "white", border: `1px solid ${COLORS.border}`,
          borderRadius: 10, padding: "9px 16px", width: 260,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
          <IconSearch />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search patients, doctors..."
            style={{
              border: "none", outline: "none", background: "transparent",
              fontSize: 13, color: COLORS.text, width: "100%", fontFamily: "inherit",
            }}
          />
        </div>
      </div>

      <div style={{ padding: "0 32px 32px", flex: 1 }}>
        <div style={{
          background: COLORS.primary, borderRadius: 16, display: "flex",
          marginBottom: 24, overflow: "hidden",
          boxShadow: "0 4px 24px rgba(74,14,14,0.25)",
        }}>
          <StatCard value={stats.total}      label="Total Patients" icon={<IconPatientCount />} borderRight />
          <StatCard value={stats.waiting}    label="Waiting"        icon={<IconClock />}        borderRight />
          <StatCard value={stats.consulting} label="Consulting"     icon={<IconDoc />}           borderRight />
          <StatCard value={stats.completed}  label="Completed"      icon={<IconCheckCircle />} />
        </div>

        <div style={{
          background: "white", borderRadius: 14,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          border: `1px solid ${COLORS.border}`, overflow: "hidden",
        }}>
          <div style={{
            padding: "20px 24px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: `1px solid ${COLORS.border}`,
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.text }}>Patient Queue</div>
              <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>
                {filtered.length} patients in queue
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setFilterOpen(o => !o)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "8px 16px", borderRadius: 8,
                  border: `1px solid ${COLORS.border}`, background: "white",
                  color: COLORS.text, fontWeight: 500, fontSize: 13,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                <IconFilter /> {filterStatus}
              </button>
              {filterOpen && (
                <div style={{
                  position: "absolute", right: 0, top: "calc(100% + 6px)", zIndex: 10,
                  background: "white", borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                  border: `1px solid ${COLORS.border}`, minWidth: 140,
                }}>
                  {["All Status", "Consulting", "Waiting", "Completed"].map(s => (
                    <div key={s}
                      onClick={() => { setFilterStatus(s); setFilterOpen(false); }}
                      style={{
                        padding: "10px 16px", fontSize: 13, cursor: "pointer",
                        color: filterStatus === s ? COLORS.primary : COLORS.text,
                        fontWeight: filterStatus === s ? 700 : 400,
                        background: filterStatus === s ? "#fdf0f0" : "white",
                      }}
                      onMouseEnter={e => { if (filterStatus !== s) e.currentTarget.style.background = COLORS.bg; }}
                      onMouseLeave={e => { if (filterStatus !== s) e.currentTarget.style.background = "white"; }}
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
              <tr style={{ background: "#fafafa" }}>
                {["#", "PATIENT", "AGE", "STATUS", "DOCTOR", "TIME", ""].map((h, i) => (
                  <th key={i} style={{
                    padding: "12px 8px", textAlign: "left",
                    fontSize: 11, fontWeight: 700,
                    color: COLORS.textMuted, letterSpacing: "0.8px",
                    borderBottom: `1px solid ${COLORS.border}`,
                    paddingLeft: i === 0 ? 16 : 8,
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
                const time = p.lastVisit ? new Date(p.lastVisit).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-';
                return (
                  <PatientRow
                    key={p.patientId}
                    num={i + 1}
                    initials={initials}
                    name={name}
                    id={patientId}
                    age={p.age}
                    status={p.status}
                    doctor={p.assignedDoctor || '-'}
                    time={time}
                    avatarColor={COLORS.primary}
                  />
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px 16px", color: COLORS.textMuted, fontSize: 14 }}>
                    {loading ? 'Loading patients...' : 'No patients in queue.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
          <div style={{
            background: "white", borderRadius: 16, width: "90%", maxWidth: 500,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)", padding: 0,
            overflow: "hidden",
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "24px", borderBottom: `1px solid ${COLORS.border}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: COLORS.text }}>
                Add Patient to Queue
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 24, color: COLORS.textMuted,
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px" }}>
              <form onSubmit={handleFormSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      placeholder="John"
                      style={{
                        width: "100%", padding: "10px 12px", borderRadius: 8,
                        border: `1px solid ${COLORS.border}`, fontSize: 14,
                        fontFamily: "inherit", boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      placeholder="Doe"
                      style={{
                        width: "100%", padding: "10px 12px", borderRadius: 8,
                        border: `1px solid ${COLORS.border}`, fontSize: 14,
                        fontFamily: "inherit", boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>
                      Age *
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleFormChange}
                      placeholder="35"
                      min="0"
                      max="150"
                      style={{
                        width: "100%", padding: "10px 12px", borderRadius: 8,
                        border: `1px solid ${COLORS.border}`, fontSize: 14,
                        fontFamily: "inherit", boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleFormChange}
                      style={{
                        width: "100%", padding: "10px 12px", borderRadius: 8,
                        border: `1px solid ${COLORS.border}`, fontSize: 14,
                        fontFamily: "inherit", boxSizing: "border-box",
                      }}
                    >
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleFormChange}
                    placeholder="09123456789"
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: 8,
                      border: `1px solid ${COLORS.border}`, fontSize: 14,
                      fontFamily: "inherit", boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    placeholder="123 Main Street, City, Country"
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: 8,
                      border: `1px solid ${COLORS.border}`, fontSize: 14,
                      fontFamily: "inherit", boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    style={{
                      padding: "10px 20px", borderRadius: 8,
                      border: `1px solid ${COLORS.border}`, background: "white",
                      color: COLORS.text, fontWeight: 600, fontSize: 14,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      padding: "10px 20px", borderRadius: 8,
                      border: "none", background: COLORS.primary,
                      color: "white", fontWeight: 600, fontSize: 14,
                      cursor: submitting ? "not-allowed" : "pointer",
                      opacity: submitting ? 0.7 : 1,
                      fontFamily: "inherit",
                    }}
                  >
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
// Receives activeItem, setActiveItem, onLogout from App.js.
// The Sidebar uses them directly so every click navigates at the app level.
export default function PatientQueue({ onLogout, activeItem, setActiveItem }) {
  return (
    <div style={{ display: "flex", fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh" }}>
      <Sidebar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        onLogout={onLogout}
      />
      <PatientQueueContent />
    </div>
  );
}