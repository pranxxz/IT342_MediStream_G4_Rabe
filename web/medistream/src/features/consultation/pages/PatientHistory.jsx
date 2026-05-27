import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../../shared/services/api';

export default function PatientHistory() {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState('');
  const [warning, setWarning] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');

  const handleIdChange = (e) => {
    const val = e.target.value;
    const hasNonNumeric = /[^0-9]/.test(val);
    
    if (hasNonNumeric) {
      setWarning('Patient ID must be a numeric value');
    } else {
      setWarning('');
    }

    const numericValue = val.replace(/[^0-9]/g, '');
    setPatientId(numericValue);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!patientId.trim()) return;

    setLoading(true);
    setError('');
    setSearched(false);

    try {
      const response = await API.get(`/api/consultations/patient/${patientId.trim()}`);
      setRecords(response.data || []);
      setSearched(true);
    } catch (err) {
      console.error('Failed to fetch patient records', err);
      setError('Could not connect to the database. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSearch = () => {
    setSearched(false);
    setPatientId('');
    setRecords([]);
  };

  return (
    <div className="patient-history-page">
      <div className="decor-bg">
        <div className="blur-circle circle-1"></div>
        <div className="blur-circle circle-2"></div>
      </div>

      <header className="page-header-bar">
        <div className="header-logo" onClick={() => navigate('/')}>
          <div className="logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12h5l2-7 3 14 3-10 2 3h5" />
            </svg>
          </div>
          <span>MediStream</span>
        </div>
        <button className="back-landing-btn" onClick={() => navigate('/')}>
          Back to Landing
        </button>
      </header>

      <main className="content-container">
        {!searched ? (
          <div className="search-card-outer">
            <div className="search-card-inner">
              <h2>My Medical Records</h2>
              <p>Enter your patient identification number below to fetch your consultation and prescription history.</p>
              
              <form onSubmit={handleSearch}>
                <div className="input-group">
                  <label>Patient ID Number</label>
                  <input
                    type="text"
                    value={patientId}
                    onChange={handleIdChange}
                    className={warning ? 'warn-border' : ''}
                    disabled={loading}
                  />
                  {warning && <span className="warning-msg">{warning}</span>}
                </div>

                <button type="submit" className="search-submit-btn" disabled={loading || !patientId.trim()}>
                  {loading ? (
                    <div className="loading-spinner">
                      <div className="double-bounce1"></div>
                      <div className="double-bounce2"></div>
                    </div>
                  ) : 'Fetch My Records'}
                </button>
              </form>
              
              {error && <div className="error-alert">{error}</div>}
            </div>
          </div>
        ) : (
          <div className="results-container">
            <div className="results-header">
              <div className="patient-meta">
                <h2>Medical Timeline</h2>
                <p>Showing records for Patient ID: <strong>#{patientId}</strong></p>
              </div>
              <button className="back-search-btn" onClick={handleBackToSearch}>
                New Search
              </button>
            </div>

            {records.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h3>No Consultation Records Found</h3>
                <p>We couldn't find any past consultation history for Patient #{patientId}. Please double check the ID or contact your clinic administrator.</p>
              </div>
            ) : (
              <div className="timeline-list">
                {records.map((c, index) => (
                  <div key={c.consultationId || index} className="timeline-card">
                    <div className="card-top-accent" />
                    <div className="card-header">
                      <div className="doc-info">
                        <div className="doc-avatar">
                          {c.doctorName ? c.doctorName.charAt(0).toUpperCase() : 'D'}
                        </div>
                        <div>
                          <h3>{c.doctorName || 'Unassigned Doctor'}</h3>
                          <span className="doc-title">Consulting Physician</span>
                        </div>
                      </div>
                      <div className="date-badge">
                        {c.consultationDate ? new Date(c.consultationDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'N/A'}
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="detail-section">
                        <span className="section-label">Diagnosis</span>
                        <div className="diagnosis-pill">
                          {c.diagnosis || 'General Checkup'}
                        </div>
                      </div>

                      {c.symptoms && (
                        <div className="detail-section">
                          <span className="section-label">Symptoms Reported</span>
                          <p className="symptoms-text">{c.symptoms}</p>
                        </div>
                      )}

                      {c.medicinePrescribed && (
                        <div className="detail-section">
                          <span className="section-label">Prescription / Medication</span>
                          <div className="prescription-card">
                            <div className="prescription-icon">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="4.5" y1="19.5" x2="19.5" y2="4.5"/>
                                <path d="M12 2a15.3 15.3 0 0 1 4 7c0 4.14-3.36 7.5-7.5 7.5a7.5 7.5 0 0 1-7-4 15.3 15.3 0 0 1 7.5-7.5C10 2 11 2 12 2z"/>
                              </svg>
                            </div>
                            <span className="prescription-text">{c.medicinePrescribed}</span>
                          </div>
                        </div>
                      )}

                      {c.remarks && (
                        <div className="detail-section notes-section">
                          <span className="section-label">Clinical Remarks & Notes</span>
                          <p className="remarks-text">{c.remarks}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <style>{`
        .patient-history-page {
          min-height: 100vh;
          background: #f8f9fa;
          color: #1f2937;
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          position: relative;
          overflow-x: hidden;
        }
 
        .decor-bg {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 0;
        }
 
        .blur-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.07;
        }
 
        .circle-1 {
          width: 50vw;
          height: 50vw;
          background: #44000D;
          top: -20vw;
          right: -10vw;
        }
 
        .circle-2 {
          width: 40vw;
          height: 40vw;
          background: #88001a;
          bottom: -15vw;
          left: -10vw;
        }
 
        .page-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 48px;
          border-bottom: 1px solid rgba(68, 0, 13, 0.08);
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          position: relative;
          z-index: 10;
        }
 
        .header-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
 
         .logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #44000d;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 12px rgba(68, 0, 13, 0.25);
        }
 
        .header-logo span {
          font-size: 1.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, #44000d 0%, #7a0017 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
 
        .back-landing-btn {
          background: rgba(68, 0, 13, 0.05);
          border: 1px solid rgba(68, 0, 13, 0.1);
          color: #44000d;
          padding: 8px 20px;
          border-radius: 30px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }
 
        .back-landing-btn:hover {
          background: rgba(68, 0, 13, 0.1);
          color: #44000d;
          transform: translateY(-1px);
        }
 
        .content-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 80px 24px;
          position: relative;
          z-index: 5;
        }
 
        .search-card-outer {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(68, 0, 13, 0.08);
          border-radius: 28px;
          padding: 4px;
          box-shadow: 0 40px 80px -15px rgba(68, 0, 13, 0.08);
          animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
 
        @keyframes scaleIn {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
 
        .search-card-inner {
          padding: 40px 48px;
          text-align: center;
        }
 
        .search-card-inner h2 {
          font-size: 2.2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #44000d 0%, #7a0017 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
          margin-bottom: 12px;
        }
 
        .search-card-inner p {
          color: #4b5563;
          font-size: 0.98rem;
          line-height: 1.6;
          margin-bottom: 36px;
        }
 
        .input-group {
          text-align: left;
          margin-bottom: 28px;
        }
 
        .input-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #374151;
          letter-spacing: 0.2px;
        }
 
        .input-group input {
          box-sizing: border-box;
          width: 100%;
          padding: 16px 20px;
          background: #ffffff;
          border: 1.5px solid rgba(68, 0, 13, 0.15);
          border-radius: 16px;
          font-size: 1.1rem;
          color: #44000d;
          font-weight: 700;
          letter-spacing: 1px;
          text-align: center;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
 
        .input-group input:focus {
          outline: none;
          border-color: #7a0017;
          box-shadow: 0 0 0 4px rgba(122, 0, 23, 0.12);
          background: #ffffff;
        }
 
        .input-group input.warn-border {
          border-color: #dc2626;
          background: rgba(220, 38, 38, 0.02);
        }
 
        .warning-msg {
          color: #dc2626;
          font-size: 0.8rem;
          font-weight: 500;
          display: block;
          margin-top: 8px;
        }
 
        .search-submit-btn {
          width: 100%;
          padding: 16px;
          border-radius: 40px;
          border: none;
          background: linear-gradient(135deg, #7a0017 0%, #44000d 100%);
          color: white;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 8px 25px rgba(122, 0, 23, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
        }
 
        .search-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(122, 0, 23, 0.35);
        }
 
        .search-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
 
        .error-alert {
          margin-top: 20px;
          padding: 12px 18px;
          background: rgba(220, 38, 38, 0.05);
          border: 1px solid rgba(220, 38, 38, 0.15);
          border-radius: 12px;
          color: #dc2626;
          font-size: 0.88rem;
          font-weight: 500;
        }
 
        .results-container {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
 
        .results-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 40px;
        }
 
        .patient-meta h2 {
          font-size: 1.8rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin: 0;
          color: #44000d;
        }
 
        .patient-meta p {
          margin: 4px 0 0;
          color: #4b5563;
          font-size: 0.92rem;
        }
 
        .back-search-btn {
          background: linear-gradient(135deg, #7a0017 0%, #44000d 100%);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 30px;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(122, 0, 23, 0.2);
          transition: all 0.25s ease;
        }
 
        .back-search-btn:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 8px 22px rgba(122, 0, 23, 0.3);
        }
 
        .empty-state {
          text-align: center;
          padding: 60px 40px;
          background: #ffffff;
          border: 1px dashed rgba(68, 0, 13, 0.2);
          border-radius: 24px;
        }
 
        .empty-icon {
          color: rgba(68, 0, 13, 0.4);
          margin-bottom: 20px;
        }
 
        .empty-state h3 {
          font-size: 1.3rem;
          font-weight: 700;
          margin: 0 0 10px;
          color: #44000d;
        }
 
        .empty-state p {
          color: #6b7280;
          font-size: 0.92rem;
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.6;
        }
 
        .timeline-list {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
 
        .timeline-card {
          background: #ffffff;
          backdrop-filter: blur(16px);
          border: 1px solid rgba(68, 0, 13, 0.08);
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 20px 40px rgba(68, 0, 13, 0.03);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
 
        .timeline-card:hover {
          transform: translateY(-4px);
          border-color: rgba(122, 0, 23, 0.25);
          box-shadow: 0 30px 50px rgba(68, 0, 13, 0.08);
        }
 
        .card-top-accent {
          height: 4px;
          background: linear-gradient(90deg, #7a0017 0%, #44000d 100%);
        }
 
        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px;
          border-bottom: 1px solid rgba(68, 0, 13, 0.06);
          flex-wrap: wrap;
          gap: 16px;
        }
 
        .doc-info {
          display: flex;
          align-items: center;
          gap: 14px;
        }
 
        .doc-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7a0017 0%, #44000d 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          box-shadow: 0 4px 10px rgba(122, 0, 23, 0.25);
          font-size: 1.1rem;
        }
 
        .doc-info h3 {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 700;
          color: #1f2937;
        }
 
        .doc-title {
          font-size: 0.76rem;
          color: #6b7280;
          display: block;
          margin-top: 2px;
        }
 
        .date-badge {
          background: rgba(68, 0, 13, 0.04);
          border: 1px solid rgba(68, 0, 13, 0.05);
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #44000d;
        }
 
        .card-body {
          padding: 28px 32px 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          color: #374151;
        }
 
        .detail-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
 
        .section-label {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #7a0017;
        }
 
        .diagnosis-pill {
          background: rgba(122, 0, 23, 0.06);
          border: 1.5px solid rgba(122, 0, 23, 0.15);
          color: #7a0017;
          padding: 8px 18px;
          border-radius: 25px;
          font-size: 0.88rem;
          font-weight: 700;
          display: inline-block;
          align-self: flex-start;
        }
 
        .symptoms-text {
          margin: 0;
          font-size: 0.92rem;
          color: #374151;
          line-height: 1.5;
        }
 
        .prescription-card {
          background: rgba(122, 0, 23, 0.03);
          border: 1px dashed rgba(122, 0, 23, 0.2);
          border-radius: 12px;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
 
        .prescription-icon {
          color: #7a0017;
        }
 
        .prescription-text {
          font-size: 0.95rem;
          font-weight: 700;
          color: #44000d;
        }
 
        .notes-section {
          border-top: 1px solid #f3f4f6;
          padding-top: 18px;
        }
 
        .remarks-text {
          margin: 0;
          font-size: 0.88rem;
          line-height: 1.6;
          color: #4b5563;
          font-style: italic;
          border-left: 3px solid #7a0017;
          padding-left: 14px;
        }

        /* Pulsing search animation */
        .loading-spinner {
          width: 24px;
          height: 24px;
          position: relative;
        }

        .double-bounce1, .double-bounce2 {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #fff;
          opacity: 0.6;
          position: absolute;
          top: 0;
          left: 0;
          animation: sk-bounce 2.0s infinite ease-in-out;
        }

        .double-bounce2 {
          animation-delay: -1.0s;
        }

        @keyframes sk-bounce {
          0%, 100% { transform: scale(0.0) }
          50% { transform: scale(1.0) }
        }

        @media (max-width: 600px) {
          .page-header-bar {
            padding: 16px 20px;
          }
          .search-card-inner {
            padding: 30px 24px;
          }
          .search-card-inner h2 {
            font-size: 1.8rem;
          }
          .card-header {
            padding: 20px;
          }
          .card-body {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
