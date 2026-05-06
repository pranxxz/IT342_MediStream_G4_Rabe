import React, { useState } from 'react';
import { Check } from 'lucide-react';

const SettingsProfileView = ({ userData, availability, setAvailability }) => {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);

  const handleAvailabilityUpdate = async (newAvailability) => {
    if (updatingStatus || newAvailability === availability) return;
    
    try {
      setUpdatingStatus(true);
      setUpdateMessage(null);
      
      // Call the parent function to update availability
      await setAvailability(newAvailability);
      
      // Show success message
      setUpdateMessage({
        type: 'success',
        text: `Status updated to ${newAvailability === 'available' ? 'Available' : 
               newAvailability === 'busy' ? 'Busy' : 'Offline'}`
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setUpdateMessage(null);
      }, 3000);
      
    } catch (error) {
      setUpdateMessage({
        type: 'error',
        text: 'Failed to update status. Please try again.'
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Generate professional avatar initials
  const getAvatarInitials = (name) => {
    if (!name || name === 'N/A') return 'MD';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Get avatar color based on role or name
  const getAvatarColor = (role, name) => {
    if (role && role.toLowerCase().includes('doctor')) return '#4B0082'; // Purple theme
    if (role && role.toLowerCase().includes('nurse')) return '#4B0082'; // Purple theme
    
    // Fallback to name-based color (using theme purple)
    const colors = [
      '#4B0082', // Primary purple theme
      '#4B0082', // Purple theme
      '#4B0082', // Purple theme
      '#4B0082', // Purple theme
    ];
    
    if (!name || name === 'N/A') return colors[0];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb'
    }}>
      {/* Update Status Message */}
      {updateMessage && (
        <div style={{
          marginBottom: '24px',
          padding: '12px 16px',
          borderRadius: '8px',
          background: updateMessage.type === 'success' ? '#d1fae5' : '#fee2e2',
          border: `1px solid ${updateMessage.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
          color: updateMessage.type === 'success' ? '#065f46' : '#991b1b',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 500,
          fontSize: '14px'
        }}>
          {updateMessage.type === 'success' ? (
            <Check size={16} />
          ) : (
            <span style={{ fontSize: '18px' }}>⚠</span>
          )}
          {updateMessage.text}
        </div>
      )}

      {/* Profile Header */}
      <div style={{
        display: 'flex',
        gap: '24px',
        marginBottom: '32px',
        paddingBottom: '24px',
        borderBottom: '1px solid #e5e7eb'
      }}>
   {/* Modern Professional Avatar - No circle inside */}
      <div style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%', // Modern circular shape
        background: getAvatarColor(userData?.role, userData?.name),
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 700,
        fontSize: '32px',
        boxShadow: `
          0 8px 32px rgba(75,0,130,0.15),
          inset 0 0 0 3px rgba(255,255,255,0.8)
        `,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '"Poppins", "Inter", sans-serif',
        transition: 'all 0.3s ease'
      }}>
        {/* Modern gradient overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 60%)',
          zIndex: 1
        }} />
        
        {/* Modern subtle pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)`,
          zIndex: 1
        }} />
        
        {/* Avatar initials */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          textShadow: '0 2px 8px rgba(0,0,0,0.2)',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        }}>
          {getAvatarInitials(userData?.name)}
        </div>
        
        {/* No status indicator badge - removed completely */}
      </div>
        
        <div style={{ flex: 1 }}>
          <h2 style={{ 
            fontWeight: 700, 
            fontSize: '24px', 
            margin: '0 0 8px 0', 
            color: '#1f2937',
            fontFamily: '"Poppins", "Inter", sans-serif'
          }}>
            {userData.name}
            {userData.hasMedicalStaffData && (
              <span style={{ 
                marginLeft: '12px', 
                fontSize: '12px', 
                background: '#4B0082', // Purple theme
                color: 'white',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: 'bold',
                verticalAlign: 'middle'
              }}>
                Medical Staff
              </span>
            )}
          </h2>
          <p style={{ 
            color: '#6b7280', 
            margin: '0 0 16px 0',
            fontFamily: '"Arimo", "Poppins", "Inter", sans-serif',
            fontSize: '16px'
          }}>
            {userData.title} • {userData.department || 'General Medicine'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: availability === 'available' ? '#10b981' : 
                        availability === 'busy' ? '#fef3c7' : '#f3f4f6',
              color: availability === 'available' ? 'white' : 
                    availability === 'busy' ? '#92400e' : '#374151',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: availability === 'available' ? 'white' : 
                          availability === 'busy' ? '#f59e0b' : '#6b7280'
              }} />
              {availability === 'available' ? 'Available' : 
               availability === 'busy' ? 'Busy' : 'Offline'}
            </span>
            
            {userData.staffID && userData.staffID !== 'N/A' && (
              <span style={{ 
                fontSize: '12px', 
                color: '#6b7280',
                background: '#f3f4f6',
                padding: '6px 10px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontWeight: 500
              }}>
                Staff ID: {userData.staffID}
              </span>
            )}
          </div>
        </div>
        
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px'
        }}>
          <div>
            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280', 
              marginBottom: '4px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Age:</div>
            <div style={{ 
              fontWeight: 600, 
              color: '#1f2937',
              fontFamily: '"Arimo", "Poppins", "Inter", sans-serif'
            }}>{userData.age}</div>
          </div>
          <div>
            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280', 
              marginBottom: '4px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Email:</div>
            <div style={{ 
              fontWeight: 600, 
              fontSize: '14px', 
              color: '#1f2937',
              fontFamily: '"Arimo", "Poppins", "Inter", sans-serif',
              wordBreak: 'break-all'
            }}>{userData.email}</div>
          </div>
          <div>
            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280', 
              marginBottom: '4px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Gender:</div>
            <div style={{ 
              fontWeight: 600, 
              color: '#1f2937',
              fontFamily: '"Arimo", "Poppins", "Inter", sans-serif'
            }}>{userData.gender}</div>
          </div>
          <div>
            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280', 
              marginBottom: '4px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Phone:</div>
            <div style={{ 
              fontWeight: 600, 
              color: '#1f2937',
              fontFamily: '"Arimo", "Poppins", "Inter", sans-serif'
            }}>{userData.phone}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Professional Information */}
        <div>
          <h3 style={{ 
            fontWeight: 600, 
            fontSize: '18px', 
            marginBottom: '32px', 
            color: '#4B0082', // Purple theme
            fontFamily: '"Poppins", "Inter", sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Professional Information
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            gap: '24px'
          }}>
            <div style={{ 
              textAlign: 'center',
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ 
                fontSize: '12px', 
                color: '#6b7280', 
                marginBottom: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Specialization</div>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 700, 
                color: '#4B0082', // Purple theme
                fontFamily: '"Poppins", "Inter", sans-serif',
                minHeight: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>{userData.specialization}</div>
            </div>
            
            <div style={{ 
              textAlign: 'center',
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ 
                fontSize: '12px', 
                color: '#6b7280', 
                marginBottom: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Department</div>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 700, 
                color: '#4B0082', // Purple theme
                fontFamily: '"Poppins", "Inter", sans-serif',
                minHeight: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>{userData.department}</div>
            </div>
            
            <div style={{ 
              textAlign: 'center',
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ 
                fontSize: '12px', 
                color: '#6b7280', 
                marginBottom: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Role</div>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 700, 
                color: '#4B0082', // Purple theme
                fontFamily: '"Poppins", "Inter", sans-serif',
                minHeight: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>{userData.role}</div>
            </div>
          </div>
        </div>

        {/* Availability Status Section */}
        <div>
          <h3 style={{ 
            fontWeight: 600, 
            fontSize: '18px', 
            marginBottom: '24px', 
            color: '#4B0082', // Purple theme
            fontFamily: '"Poppins", "Inter", sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Current Status
          </h3>
          
          <div style={{ marginBottom: '24px' }}>
            {[
              { value: 'available', label: 'Available', color: '#10b981', description: 'Ready to accept patients', icon: '✓' },
              { value: 'busy', label: 'Busy', color: '#f59e0b', description: 'Currently with a patient', icon: '!' },
              { value: 'offline', label: 'Offline', color: '#6b7280', description: 'Not available', icon: '○' }
            ].map((option) => (
              <div 
                key={option.value} 
                onClick={() => handleAvailabilityUpdate(option.value)}
                style={{
                  marginBottom: '12px',
                  padding: '16px',
                  borderRadius: '10px',
                  border: `2px solid ${availability === option.value ? option.color : '#e5e7eb'}`,
                  background: availability === option.value ? 
                            `${option.color}10` : '#f9fafb',
                  cursor: updatingStatus ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: updatingStatus ? 0.7 : 1,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Selection indicator */}
                {availability === option.value && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: option.color,
                    borderRadius: '10px 10px 0 0'
                  }} />
                )}
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '6px'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: `2px solid ${availability === option.value ? option.color : '#9ca3af'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: availability === option.value ? `${option.color}20` : 'white'
                  }}>
                    {availability === option.value && (
                      <span style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: option.color
                      }}>
                        {option.icon}
                      </span>
                    )}
                  </div>
                  <span style={{ 
                    fontWeight: 600, 
                    textTransform: 'capitalize', 
                    color: availability === option.value ? option.color : '#374151',
                    fontFamily: '"Arimo", "Poppins", "Inter", sans-serif',
                    fontSize: '14px'
                  }}>
                    {option.label}
                  </span>
                  {availability === option.value && (
                    <span style={{
                      marginLeft: 'auto',
                      fontSize: '11px',
                      color: option.color,
                      fontWeight: 700,
                      background: `${option.color}20`,
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}>
                      SELECTED
                    </span>
                  )}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  marginLeft: '36px',
                  fontFamily: '"Arimo", "Poppins", "Inter", sans-serif',
                  lineHeight: '1.4'
                }}>
                  {option.description}
                </div>
                
                <input
                  type="radio"
                  name="availability"
                  value={option.value}
                  checked={availability === option.value}
                  onChange={(e) => handleAvailabilityUpdate(e.target.value)}
                  style={{ display: 'none' }}
                />
              </div>
            ))}
          </div>
          
          {/* Status Info */}
          <div style={{
            padding: '16px',
            background: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#64748b',
              fontFamily: '"Arimo", "Poppins", "Inter", sans-serif',
              lineHeight: '1.5'
            }}>
              <strong>Status Selection Guide:</strong>
              <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
                <li style={{ marginBottom: '4px' }}><strong>Available:</strong> Ready to accept new patients</li>
                <li style={{ marginBottom: '4px' }}><strong>Busy:</strong> Currently consulting with a patient</li>
                <li style={{ marginBottom: '4px' }}><strong>Offline:</strong> Not available for consultations</li>
              </ul>
              <div style={{ 
                marginTop: '12px', 
                padding: '8px', 
                background: '#fef3c7', 
                borderRadius: '6px',
                border: '1px solid #fde68a'
              }}>
                <strong>Note:</strong> Click any status above to update instantly. Status updates are visible to other staff.
              </div>
            </div>
          </div>
          
          {/* Loading indicator when updating */}
          {updatingStatus && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: '#f3f4f6',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #6b7280',
                borderTopColor: '#4B0082', // Purple theme
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <span style={{
                fontSize: '13px',
                color: '#6b7280',
                fontWeight: 500
              }}>
                Updating status...
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Add CSS for spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default SettingsProfileView;