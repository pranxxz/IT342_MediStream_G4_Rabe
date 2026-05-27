import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/authentication/hooks/useAuth';

// ─── Shared Theme ─────────────────────────────────────────────────────────────
export const COLORS = {
  primary: "#3d080b",
  primaryDark: "#2d0608",
  primaryLight: "#5c0c11",
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
  sidebarText: "rgba(255,255,255,0.7)",
  sidebarActive: "#f5f5f7",
};

// ─── Icons ────────────────────────────────────────────────────────────────────
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

// ─── Avatar ───────────────────────────────────────────────────────────────────
export const Avatar = ({ initials, color = COLORS.primary, size = 38, src }) => {
  const [imgError, setImgError] = React.useState(false);

  // Reset img error status if src changes
  React.useEffect(() => {
    setImgError(false);
  }, [src]);

  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color, color: "white",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.34, fontWeight: 700, flexShrink: 0,
      fontFamily: "inherit", letterSpacing: "0.5px",
      overflow: "hidden",
    }}>
      {src && !imgError ? (
        <img 
          src={src} 
          alt="Avatar" 
          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          onError={() => setImgError(true)} 
        />
      ) : (
        initials
      )}
    </div>
  );
};

// ─── SidebarItem (unchanged) ─────────────────────────────────────────────────
export const SidebarItem = ({ icon, label, active, onClick }) => (
  <div style={{ position: 'relative' }}>
    <div onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 25px", cursor: "pointer",
      borderRadius: active ? "30px 0 0 30px" : "0",
      background: active ? COLORS.sidebarActive : "transparent",
      color: active ? COLORS.primary : COLORS.sidebarText,
      fontWeight: active ? 700 : 500,
      fontSize: 14, transition: "all 0.2s ease",
      userSelect: "none",
      marginLeft: active ? 15 : 0,
      position: 'relative',
      zIndex: 2,
    }}>
      {icon}
      <span>{label}</span>
    </div>
    {active && (
      <>
        <div style={{ position: 'absolute', top: -20, right: 0, width: 20, height: 20, background: COLORS.sidebarActive, zIndex: 1 }}>
          <div style={{ width: '100%', height: '100%', background: COLORS.primary, borderBottomRightRadius: 20 }} />
        </div>
        <div style={{ position: 'absolute', bottom: -20, right: 0, width: 20, height: 20, background: COLORS.sidebarActive, zIndex: 1 }}>
          <div style={{ width: '100%', height: '100%', background: COLORS.primary, borderTopRightRadius: 20 }} />
        </div>
      </>
    )}
  </div>
);

// ─── Sidebar (FIXED VERSION) ─────────────────────────────────────────────────
export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCurrentUser, logout } = useAuth();
  
  const [avatarTimestamp, setAvatarTimestamp] = React.useState(Date.now());

  // Listen to profile updates to refresh sidebar avatar dynamically
  React.useEffect(() => {
    const handleSync = () => {
      setAvatarTimestamp(Date.now());
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('userProfileUpdated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('userProfileUpdated', handleSync);
    };
  }, []);

  const currentUser = getCurrentUser();
  const nameToDisplay = currentUser?.medicalStaff?.name || currentUser?.firstName || currentUser?.name || currentUser?.email?.split('@')[0] || "User";
  const roleToDisplay = currentUser?.medicalStaff?.role || currentUser?.role || "Staff";

  const nameParts = nameToDisplay.trim().split(" ");
  const initials = nameParts.length > 1
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : nameParts[0].substring(0, 2).toUpperCase();

  const navItems = [
    { path: "/PatientQueue", label: "Patient Queue", icon: <IconQueue />, roles: ['nurse', 'staff', 'doctor', 'admin'] },
    { path: "/Patient", label: "Patients", icon: <IconUsers />, roles: ['nurse', 'staff', 'doctor', 'admin'] },
    { path: "/Staff", label: "Medical Staff", icon: <IconStaff />, roles: ['nurse', 'staff', 'doctor', 'admin'] },
    { path: "/Consultations", label: "Consultation", icon: <IconCalendar />, roles: ['doctor', 'admin'] },
    { path: "/MedicalHistory", label: "Medical History", icon: <IconClipboard />, roles: ['nurse', 'staff', 'doctor', 'admin'] },
    { path: "/general-settings", label: "Settings", icon: <IconSettings /> },
  ];

  const userRole = (roleToDisplay || '').toLowerCase();
  const visibleNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });

  // Construct dynamic picture path
  const accountID = currentUser?.id || currentUser?.accountID;
  const avatarSrc = currentUser?.profilePicturePath 
    ? `http://localhost:8080/api/users/${accountID}/profile-picture?t=${avatarTimestamp}`
    : null;

  return (
    <div style={{
      width: 240,
      position: 'fixed',           // FIXED: stays in place on scroll
      top: 0,
      left: 0,
      height: '100vh',
      background: COLORS.primary,
      display: "flex",
      flexDirection: "column",
      overflow: 'hidden',
      zIndex: 100,
    }}>
      {/* Logo */}
      <div onClick={() => navigate('/')} style={{ padding: "40px 25px 30px", display: "flex", alignItems: "center", gap: 15, cursor: "pointer", userSelect: "none" }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: "#44000d", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(68, 0, 13, 0.25)", border: "1.5px solid rgba(255,255,255,0.2)" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12h5l2-7 3 14 3-10 2 3h5" />
          </svg>
        </div>
        <div>
          <div style={{ color: "white", fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px" }}>MediStream</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Medical Management</div>
        </div>
      </div>
 
      {/* Navigation – internal scroll */}
      <nav style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        paddingTop: 20,
      }}>
        {visibleNavItems.map(item => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>
 
      {/* Footer */}
      <div style={{ padding: "20px 25px 30px", borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: "auto", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar initials={initials} size={36} color={COLORS.accent} src={avatarSrc} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "white", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nameToDisplay}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "capitalize" }}>{roleToDisplay}</div>
          </div>
          <button onClick={logout} style={{ background: "none", border: "none", cursor: "pointer", color: "white", opacity: 0.7, padding: 4, display: "flex" }}>
            <IconLogout />
          </button>
        </div>
      </div>
    </div>
  );
};