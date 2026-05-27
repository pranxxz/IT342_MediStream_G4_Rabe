import React from 'react';
import { Settings, LogOut, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingSideBar = ({ menuItems, currentView, setCurrentView }) => {
  const navigate = useNavigate();

  const colors = {
    primary: '#6366F1',
    primaryLight: '#8B5CF6',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    border: '#E2E8F0',
    hover: '#F1F5F9'
  };

  return (
    <div style={{
      width: '260px',
      background: colors.background,
      padding: '16px 12px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
      borderRight: `1px solid ${colors.border}`,
      height: '100vh',
      position: 'sticky',
      top: 0,
      overflowY: 'auto'
    }}>
      <div style={{ flex: 1 }}>
        
        {/* HEADER */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          paddingBottom: '12px'
        }}>
          
          {/* Left title area */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
            }}>
              <Settings size={20} color="white" />
            </div>

            <div>
              <h3 style={{ 
                margin: 0, 
                fontSize: '17px', 
                fontWeight: 700,
                color: colors.textPrimary,
                letterSpacing: '-0.02em',
                fontFamily: '"Arimo", "Poppins", "Inter", "Segoe UI", sans-serif'
              }}>
                ClinicaFlow
              </h3>
              <p style={{ 
                margin: 0, 
                fontSize: '12px', 
                color: colors.textTertiary,
                marginTop: '2px',
                fontWeight: 500,
                fontFamily: '"Arimo", "Poppins", "Inter", "Segoe UI", sans-serif'
              }}>
                Settings Panel
              </p>
            </div>
          </div>
          
          {/* Back Button */}
          <button 
            onClick={() => navigate('/Patient')}
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '6px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: '0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = colors.hover; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <ChevronLeft size={18} color={colors.textSecondary} />
          </button>

        </div>

        {/* MENU ITEMS */}
        <div style={{ padding: '0' }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '10px',
                marginBottom: '5px',
                background: currentView === item.id 
                  ? `linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(139, 92, 246, 0.04) 100%)`
                  : 'transparent',
                color: currentView === item.id ? colors.primary : colors.textSecondary,
                border: currentView === item.id ? `1.5px solid ${colors.primary}` : '1.5px solid transparent',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: currentView === item.id ? 600 : 500,
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: '"Arimo", "Poppins", "Inter", "Segoe UI", sans-serif',
                boxShadow: currentView === item.id ? '0 4px 12px rgba(99, 102, 241, 0.12)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (currentView !== item.id) {
                  e.currentTarget.style.background = colors.hover;
                  e.currentTarget.style.color = colors.primary;
                  e.currentTarget.style.borderColor = colors.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== item.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = colors.textSecondary;
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: currentView === item.id ? item.color : colors.hover,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}>
                  {React.cloneElement(item.icon, { 
                    color: currentView === item.id ? 'white' : colors.textSecondary,
                    size: 18 
                  })}
                </div>

                <span style={{ fontSize: '14px' }}>{item.text}</span>
              </div>
              
              {currentView === item.id && (
                <ChevronLeft 
                  size={16} 
                  color={colors.primary}
                  style={{ transform: 'rotate(180deg)' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* SIGN OUT BUTTON */}
      <button style={{
        width: '100%',
        padding: '10px 12px',
        borderRadius: '10px',
        background: 'transparent',
        color: colors.textSecondary,
        border: `1px solid ${colors.border}`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 500,
        fontSize: '14px',
        transition: 'all 0.2s ease',
        marginTop: '16px',
        fontFamily: '"Arimo", "Poppins", "Inter", "Segoe UI", sans-serif'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = colors.hover;
        e.currentTarget.style.borderColor = colors.textTertiary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderColor = colors.border;
      }}
      >
        <LogOut size={16} />
        Sign Out
      </button>

    </div>
  );
};

export default SettingSideBar;
