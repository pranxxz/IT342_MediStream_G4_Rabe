import React, { useState } from 'react';
import { useStaff } from "../../../hooks";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const M       = "#4a0e0e";
const BG      = "#f9fafb";
const WHITE   = "#ffffff";
const BORDER  = "#e5e7eb";
const TEXT    = "#1f2937";
const MUTED   = "#6b7280";
const ROW_BG  = "#ffffff";
const ROW_HOV = "#faf0f0";
const ROW_DIV = "#f3f4f6";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconStaffGroup = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill={M}>
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);
const IconPerson = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
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
const IconDots = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={MUTED}>
    <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
  </svg>
);

// ─── Custom Components ────────────────────────────────────────────────────────
const StatCard = ({ label, value, last }) => (
  <div style={{
    flex: 1, background: M, borderRadius: 10, padding: "18px 24px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginRight: last ? 0 : 16, boxShadow: "0 2px 8px rgba(74,14,14,0.15)",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <IconPerson />
      <span style={{ color: "white", fontWeight: 600, fontSize: 15 }}>{label}</span>
    </div>
    <span style={{ color: "white", fontWeight: 800, fontSize: 32, lineHeight: 1 }}>{value}</span>
  </div>
);

const Avatar = ({ name }) => {
  const parts = (name || '').split(' ');
  const initials = ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
  return (
    <div style={{
      width: 38, height: 38, borderRadius: "50%",
      background: M, color: "white",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 13, fontWeight: 700, flexShrink: 0,
    }}>
      {initials || '?'}
    </div>
  );
};

const RoleBadge = ({ role, roleColor }) => {
  // Fallback to light red/pink if no specific color is provided
  const bg = roleColor ? `${roleColor}15` : '#fee2e2';
  const text = roleColor || '#dc2626';
  
  return (
    <span style={{
      display: "inline-block", padding: "4px 14px", borderRadius: 20,
      background: bg, color: text, border: `1px solid ${text}30`,
      fontSize: 12, fontWeight: 600, textTransform: "capitalize"
    }}>
      {role}
    </span>
  );
};

// ─── Main Staff Component ─────────────────────────────────────────────────────
const Staff = () => {
  const {
    staffMembers,
    staffStats,
    searchQuery,
    roleFilter,
    statusFilter,
    loading,
    error,
    hasActiveFilters,
    getRoleColor,
    handleSearch,
    handleRoleFilter,
    handleStatusFilter,
    clearFilters,
  } = useStaff();

  // Dropdown States
  const [roleDropOpen, setRoleDropOpen] = useState(false);
  const [statusDropOpen, setStatusDropOpen] = useState(false);

  // Dropdown Helper Component
  const Dropdown = ({ open, setOpen, value, setValue, options, label }) => (
    <div style={{ position: "relative" }}>
      <button
        onClick={(e) => { 
          e.stopPropagation(); 
          setOpen(o => !o); 
          if(label === 'All Roles') setStatusDropOpen(false);
          else setRoleDropOpen(false);
        }}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 16px", borderRadius: 8,
          border: `1px solid ${BORDER}`, background: WHITE,
          color: TEXT, fontWeight: 500, fontSize: 13,
          cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
        }}
      >
        <IconFilter /> {value === 'all' ? label : value}
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 20,
          background: WHITE, borderRadius: 8, minWidth: 160,
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)", border: `1px solid ${BORDER}`,
          overflow: "hidden",
        }}>
          {options.map(opt => (
            <div key={opt.value}
              onClick={() => { setValue(opt.value); setOpen(false); }}
              style={{
                padding: "10px 16px", fontSize: 13, cursor: "pointer",
                color: value === opt.value ? M : TEXT,
                fontWeight: value === opt.value ? 700 : 400,
                background: value === opt.value ? "#fdf0f0" : WHITE,
              }}
              onMouseEnter={e => { if (value !== opt.value) e.currentTarget.style.background = BG; }}
              onMouseLeave={e => { if (value !== opt.value) e.currentTarget.style.background = WHITE; }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div 
      style={{ background: BG, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
      onClick={() => { setRoleDropOpen(false); setStatusDropOpen(false); }}
    >
      {/* ── Page Header ── */}
      <div style={{ padding: "28px 32px 20px", display: "flex", alignItems: "center", gap: 14 }}>
        <IconStaffGroup />
        <div>
          <div style={{ fontWeight: 800, fontSize: 24, color: M, letterSpacing: "-0.5px", lineHeight: 1.2 }}>
            Staff Management
          </div>
          <div style={{ fontSize: 14, color: MUTED, fontWeight: 500 }}>
            Manage doctors and nurses
          </div>
        </div>
      </div>

      <div style={{ padding: "0 32px 32px" }}>

        {/* ── Horizontal Stat Cards ── */}
        <div style={{ display: "flex", marginBottom: 28 }}>
          {staffStats && staffStats.length > 0 ? (
            staffStats.map((stat, index) => (
              <StatCard 
                key={stat.id} 
                label={stat.title} 
                value={stat.value} 
                last={index === staffStats.length - 1} 
              />
            ))
          ) : (
            // Fallbacks in case stats aren't loaded properly
            <>
               <StatCard label="Total Staff" value={staffMembers.length} />
               <StatCard label="Doctors" value={staffMembers.filter(s => s.role?.toLowerCase() === 'doctor').length} />
               <StatCard label="Nurses" value={staffMembers.filter(s => s.role?.toLowerCase() === 'nurse').length} />
               <StatCard label="Staff" value={staffMembers.filter(s => s.role?.toLowerCase() === 'staff').length} last />
            </>
          )}
        </div>

        {/* ── Table Card ── */}
        <div style={{
          background: WHITE, borderRadius: 12,
          border: `1px solid ${M}`,
          boxShadow: "0 4px 20px rgba(74,14,14,0.06)",
          overflow: "hidden",
        }}>
          {/* Toolbar */}
          <div style={{
            padding: "20px 24px",
            borderBottom: `1px solid #e8d5d5`,
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: M }}>Staff Directory</div>
              <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>{staffMembers.length} staff members found</div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              
              {hasActiveFilters && (
                <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: MUTED, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                  Clear Filters
                </button>
              )}

              <Dropdown 
                open={roleDropOpen} setOpen={setRoleDropOpen} 
                value={roleFilter} setValue={handleRoleFilter} 
                options={[
                  { label: 'All Roles', value: 'all' },
                  { label: 'Doctor', value: 'Doctor' },
                  { label: 'Nurse', value: 'Nurse' },
                  { label: 'Staff', value: 'Staff' }
                ]} 
                label="All Roles" 
              />
              
              <Dropdown 
                open={statusDropOpen} setOpen={setStatusDropOpen} 
                value={statusFilter} setValue={handleStatusFilter} 
                options={[
                  { label: 'All Status', value: 'all' },
                  { label: 'Available', value: 'Available' },
                  { label: 'Busy', value: 'Busy' },
                  { label: 'Off Duty', value: 'Off Duty' }
                ]} 
                label="All Status" 
              />

              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                border: `1px solid ${BORDER}`, borderRadius: 8,
                padding: "8px 14px", background: WHITE,
              }}>
                <IconSearch />
                <input
                  value={searchQuery} onChange={e => handleSearch(e.target.value)}
                  placeholder="Search staff..."
                  style={{ border: "none", outline: "none", fontSize: 13, color: TEXT, fontFamily: "inherit", width: 200 }}
                />
              </div>
            </div>
          </div>

          {/* Column Headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "48px 2fr 1fr 1.5fr 2fr 1.2fr 40px",
            padding: "16px 24px",
            borderBottom: `1px solid #e8d5d5`,
            background: BG
          }}>
            {["#", "STAFF", "ROLE", "SPECIALIZATION", "EMAIL", "CONTACT", ""].map((h, i) => (
              <div key={i} style={{ fontSize: 11, fontWeight: 800, color: M, letterSpacing: "0.5px" }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {loading ? (
            <div style={{ padding: "48px", textAlign: "center", color: MUTED }}>Loading records...</div>
          ) : error ? (
            <div style={{ padding: "24px", color: "#ef4444", textAlign: "center", background: "#fef2f2" }}>{error}</div>
          ) : staffMembers.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center", color: MUTED }}>No staff members found matching your criteria.</div>
          ) : (
            staffMembers.map((staff, i) => (
              <div key={staff.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px 2fr 1fr 1.5fr 2fr 1.2fr 40px",
                  padding: "16px 24px",
                  borderBottom: i === staffMembers.length - 1 ? 'none' : `1px solid ${ROW_DIV}`,
                  background: ROW_BG,
                  alignItems: "center",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = ROW_HOV}
                onMouseLeave={e => e.currentTarget.style.background = ROW_BG}
              >
                {/* # */}
                <div style={{ fontSize: 13, color: MUTED, fontWeight: 600 }}>{i + 1}</div>

                {/* Staff Name & ID */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar name={staff.name} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>{staff.name || 'Unknown Name'}</div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>ID: {staff.id || 'N/A'}</div>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <RoleBadge role={staff.role || 'Staff'} roleColor={getRoleColor(staff.role)} />
                </div>

                {/* Specialization */}
                <div style={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>
                  {staff.specialty || 'General'}
                </div>

                {/* Email */}
                <div style={{ fontSize: 13, color: TEXT }}>
                  {staff.email || 'No email provided'}
                </div>

                {/* Contact */}
                <div style={{ fontSize: 13, color: TEXT }}>
                  {staff.contact || 'N/A'}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                    <IconDots />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Staff;