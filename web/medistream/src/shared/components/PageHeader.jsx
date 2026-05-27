import React from 'react';

const headerStyle = {
  background: '#f3f4f6',
  padding: '28px 40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid #e5e7eb',
};

const iconContainerStyle = {
  width: 48,
  height: 48,
  borderRadius: '14px',
  background: '#3d080b', // Deep maroon theme primary color
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 25px rgba(61, 8, 11, 0.15)',
  flexShrink: 0,
};

export default function PageHeader({ title, subtitle, icon, left, right, children }) {
  return (
    <div style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {icon && (
          <div style={iconContainerStyle}>
            {React.isValidElement(icon) ? (
              icon
            ) : (
              React.createElement(icon, { style: { color: 'white', fontSize: 24, width: 24, height: 24 } })
            )}
          </div>
        )}
        {left && !icon && left}
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>{title}</h1>
          {subtitle && <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>{subtitle}</p>}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {right}
        {children}
      </div>
    </div>
  );
}

export function HeaderSearch({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'white', border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 16px', width: 300 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#111827', width: '100%', fontFamily: 'inherit' }}
      />
    </div>
  );
}

