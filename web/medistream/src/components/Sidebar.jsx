import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// ─── Shared Theme ─────────────────────────────────────────────────────────────
export const COLORS = {
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

// ─── Sidebar Icons ────────────────────────────────────────────────────────────
const IconHome = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);
const IconQueue = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="6" height="18" rx="1"/>
    <rect x="9" y="3" width="6" height="18" rx="1"/>
    <rect x="16" y="3" width="6" height="18" rx="1"/>
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
const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16,17 21,12 16,7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
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

// ─── Reusable: Sidebar ────────────────────────────────────────────────────────
export const Sidebar = ({ onLogout }) => {
  const location = useLocation(); 
  const navigate = useNavigate();

  const navItems = [
    { path: "/PatientQueue", label: "Patient Queue", icon: <IconQueue /> },
    { path: "/Patient", label: "Patient Records", icon: <IconUsers /> },
    { path: "/Staff", label: "Medical Staff", icon: <IconStaff /> },
    { path: "/Consultations", label: "Consultation", icon: <IconCalendar /> },
    { path: "/MedicalHistory", label: "Medical History", icon: <IconClipboard /> },
    { path: "/general-settings", label: "Settings", icon: <IconSettings /> },
  ];

  return (
    <div style={{
      width: 250, flexShrink: 0,
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

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: 8 }}>
        {navItems.map(item => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.path} 
            onClick={() => navigate(item.path)}  
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