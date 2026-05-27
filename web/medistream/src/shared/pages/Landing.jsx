import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import QueueModalForm from "../../features/patientqueue/components/QueueModalForm";
import { queueService } from "../../features/patientqueue/services/queueService";
import {
  QueueMonitorIcon,
  RegistrationIcon,
  WorkspaceIcon,
  HistoryIcon,
  LocalHealthcareIcon,
} from "./LandingIcons";
import "./Landing.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const [queueModalOpen, setQueueModalOpen] = useState(false);
  const [queueSubmitting, setQueueSubmitting] = useState(false);

  const handleOpenQueueModal = () => setQueueModalOpen(true);
  const handleCloseQueueModal = () => setQueueModalOpen(false);

  const handleQueueSubmit = async (patientData) => {
    setQueueSubmitting(true);
    try {
      const formattedData = {
        ...patientData,
        age: patientData.age ? Number(patientData.age) : null,
        status: "Waiting",
      };
      const result = await queueService.joinQueue(formattedData);
      handleCloseQueueModal();
      navigate("/QueueDashboard", { state: { queueNumber: result.queueNumber } });
    } catch (error) {
      console.error("Queue submission error:", error);
      alert("Failed to join queue. Please try again.");
    } finally {
      setQueueSubmitting(false);
    }
  };

  const features = [
    {
      title: "Real-Time Queue Monitor",
      desc: "Replace paper tokens with a live-updating monitor. Keep patients and staff aligned on clinic status in real time.",
      dark: true,
      Icon: QueueMonitorIcon,
    },
    {
      title: "Seamless Registration",
      desc: "Eliminate chaotic paperwork. Streamline your clinic's entry process with quick, organized digital check-ins.",
      dark: false,
      Icon: RegistrationIcon,
    },
    {
      title: "Dedicated Staff Workspaces",
      desc: "Keep workflows efficient. Separate, custom dashboards for administrators and doctors ensure zero confusion.",
      dark: false,
      Icon: WorkspaceIcon,
    },
    {
      title: "Digital History Tracking",
      desc: "Swap physical logbooks for secure digital records. Easily review past visit timelines and daily clinic metrics.",
      dark: true,
      Icon: HistoryIcon,
    },
  ];

  return (
    <div className="landing-page">
      {/* ── Navbar ── */}
      <nav className="landing-navbar">
        <div 
          className="nav-logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <div className="nav-logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12h5l2-7 3 14 3-10 2 3h5" />
            </svg>
          </div>
          <span className="nav-logo-text">MediStream</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/PatientHistory" style={{ textDecoration: "none" }}>
            <span className="nav-records-link" style={{ fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer', marginRight: '12px' }}>My Records</span>
          </Link>
          <Link to="/Login" style={{ textDecoration: "none" }}>
            <button className="nav-login-btn">Log in</button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="hero-inner">
          {/* Left */}
          <div className="hero-left">
            <span className="hero-badge">Modern Healthcare Management</span>
            <h1 className="hero-heading">
              Streamline Your<br />
              Clinic Operations
            </h1>
            <p className="hero-desc">
              A complete web-based system for small clinics and barangay health centers.
              Manage patient registration, queues, and consultations in a fast, organized,
              and digital way.
            </p>
            <Link to="/Register" className="hero-btn">
              Get Started
            </Link>
          </div>

          {/* Right – Patient Queue mockup */}
          <div className="hero-right">
            <div className="queue-card-outer">
              <div className="queue-card-inner">
                <div className="queue-title">Patient Queue</div>
                {[
                  { num: 1, status: "Consulting" },
                  { num: 2, status: "Waiting" },
                  { num: 3, status: "Waiting" },
                ].map((item) => (
                  <div key={item.num} className="queue-row">
                    <div className="queue-row-left">
                      <div className="queue-num">{item.num}</div>
                      <div className="queue-lines">
                        <div className="queue-line-1" />
                        <div className="queue-line-2" />
                      </div>
                    </div>
                    <span className={item.status === "Consulting" ? "chip-consulting" : "chip-waiting"}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Maroon band separator ── */}
      <div className="dark-band" />

      {/* ── Features ── */}
      <section className="features-section">
        {/* Header row */}
        <div className="features-header">
          <h2 className="features-title">Features</h2>
          <p className="features-subtext">
            A complete web-based system for small clinics and barangay health centers. <br/>
            Manage patient registration, queues, and consultations in a fast, organized,
            and digital way.
          </p>
        </div>

        {/* 2×2 grid */}
        <div className="features-grid">
          {features.map(({ title, desc, dark, Icon }) => (
            <div key={title} className={dark ? "feature-card-dark" : "feature-card-light"}>
              <div>
                <h3 className="feature-card-title">{title}</h3>
                <p className="feature-card-desc">{desc}</p>
              </div>
              <div className="feature-icon-wrap">
                <Icon dark={dark} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Highlight Banner ── */}
        <div className="highlight-banner">
          <div className="highlight-text">
            <p className="highlight-title">
              Built for local healthcare, designed for clarity.
            </p>
            <p className="highlight-desc">
              MediStream bridges the gap between clinic staff and waiting rooms. By replacing
              chaotic paper tokens with an intuitive, live-updating digital queue, we help health
              centers reduce perceived wait times, optimize daily patient flow, and let doctors
              focus on what matters most: care.
            </p>
          </div>
          <div className="highlight-illustration">
            <LocalHealthcareIcon />
          </div>
        </div>
      </section>

      {/* ── Maroon band before CTA ── */}
      <div className="dark-band" />

      {/* ── CTA Section ── */}
      <section className="cta-section">
        <div className="cta-circle-left" />
        <div className="cta-circle-right" />
        <div className="cta-inner">
          <h2 className="cta-heading">
            Skip the Line. Join Us Online
          </h2>
          <p className="cta-desc">
            Register yourself in the patient queue from the comfort of your home. No need
            to wait at the clinic – we'll notify you when it's your turn.
          </p>
          <button className="cta-btn" onClick={handleOpenQueueModal} disabled={queueSubmitting}>
            {queueSubmitting ? "Submitting…" : "Join Queue Now"}
          </button>
          <p className="cta-note">
            You'll receive a queue number immediately after registration
          </p>
        </div>
      </section>

      {/* Footer separator band */}
      <div className="footer-band" />

      <QueueModalForm
        open={queueModalOpen}
        onClose={handleCloseQueueModal}
        onSubmit={handleQueueSubmit}
        isSubmitting={queueSubmitting}
      />
    </div>
  );
}