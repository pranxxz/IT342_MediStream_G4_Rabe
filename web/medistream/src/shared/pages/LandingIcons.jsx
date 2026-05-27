import React from "react";

const MAROON = "#44000D";

export const QueueMonitorIcon = ({ dark }) => {
  const primaryColor = MAROON;
  const paperColor = "#ffffff";
  const detailColor = primaryColor;
  const outlineColor = dark ? "#ffffff" : primaryColor;
  
  return (
    <svg viewBox="0 0 120 100" width="120" height="100">
      {/* Back page */}
      <rect x="20" y="10" width="55" height="70" rx="8" fill={paperColor} stroke={outlineColor} strokeWidth="2.5" transform="rotate(-8 47 45)" />
      {/* Middle page */}
      <rect x="30" y="12" width="55" height="70" rx="8" fill={paperColor} stroke={outlineColor} strokeWidth="2.5" transform="rotate(4 57 47)" />
      {/* Front page */}
      <rect x="42" y="18" width="55" height="70" rx="8" fill={paperColor} stroke={outlineColor} strokeWidth="2.5" />
      {/* Front page contents (Avatar + lines) */}
      <circle cx="58" cy="36" r="7" fill="none" stroke={detailColor} strokeWidth="2" />
      <circle cx="58" cy="33" r="3.5" fill={detailColor} />
      <path d="M50 45 C 50 40, 66 40, 66 45" fill="none" stroke={detailColor} strokeWidth="2" strokeLinecap="round" />
      {/* Horizontal text lines on right of avatar */}
      <line x1="72" y1="32" x2="88" y2="32" stroke={detailColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="72" y1="40" x2="84" y2="40" stroke={detailColor} strokeWidth="2" strokeLinecap="round" />
      {/* Full width text lines at bottom */}
      <line x1="52" y1="58" x2="88" y2="58" stroke={detailColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="52" y1="66" x2="80" y2="66" stroke={detailColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="52" y1="74" x2="72" y2="74" stroke={detailColor} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export const RegistrationIcon = ({ dark }) => {
  const primaryColor = MAROON;
  const paperColor = "#ffffff";
  const detailColor = primaryColor;
  const outlineColor = dark ? "#ffffff" : primaryColor;
  
  return (
    <svg viewBox="0 0 120 100" width="120" height="100">
      {/* Clipboard base */}
      <rect x="25" y="15" width="55" height="74" rx="8" fill={paperColor} stroke={outlineColor} strokeWidth="2.5" />
      {/* Clip at top */}
      <rect x="42" y="8" width="20" height="10" rx="3" fill={detailColor} />
      {/* Sheets lines */}
      <line x1="37" y1="36" x2="68" y2="36" stroke={detailColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="37" y1="44" x2="60" y2="44" stroke={detailColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="37" y1="52" x2="64" y2="52" stroke={detailColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="37" y1="60" x2="52" y2="60" stroke={detailColor} strokeWidth="2" strokeLinecap="round" />
      
      {/* Shield / checkmark badge overlapping bottom left */}
      <circle cx="36" cy="72" r="14" fill={paperColor} stroke={outlineColor} strokeWidth="2" />
      <circle cx="36" cy="72" r="9" fill={detailColor} />
      <path d="M32 72 l3 3 l6-6" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Pen overlapping the right side */}
      <g transform="rotate(25 80 50)">
        <rect x="74" y="20" width="8" height="50" rx="2" fill={detailColor} />
        <path d="M74 70 l4 8 l4-8 Z" fill={detailColor} />
        <rect x="80" y="25" width="4" height="12" rx="1" fill={outlineColor} />
      </g>
    </svg>
  );
};

export const WorkspaceIcon = ({ dark }) => {
  const primaryColor = MAROON;
  const paperColor = "#ffffff";
  const detailColor = primaryColor;
  const outlineColor = dark ? "#ffffff" : primaryColor;
  
  return (
    <svg viewBox="0 0 120 100" width="120" height="100">
      {/* Computer stand */}
      <path d="M45 78 L55 78 L50 65 Z" fill={detailColor} />
      <rect x="35" y="78" width="30" height="4" rx="2" fill={detailColor} />
      
      {/* Main monitor screen */}
      <rect x="15" y="18" width="70" height="48" rx="6" fill={paperColor} stroke={outlineColor} strokeWidth="2.5" />
      {/* Screen content lines */}
      <rect x="22" y="26" width="12" height="12" rx="2" fill={detailColor} />
      <line x1="40" y1="30" x2="74" y2="30" stroke={detailColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="36" x2="66" y2="36" stroke={detailColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="46" x2="74" y2="46" stroke={detailColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="53" x2="56" y2="53" stroke={detailColor} strokeWidth="2" strokeLinecap="round" />
      
      {/* Tablet/Mini screen overlapping right/bottom */}
      <rect x="74" y="38" width="32" height="42" rx="4" fill={paperColor} stroke={outlineColor} strokeWidth="2" />
      {/* Mini screen contents */}
      <circle cx="90" cy="48" r="4" fill={detailColor} />
      <line x1="82" y1="58" x2="98" y2="58" stroke={detailColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="82" y1="64" x2="94" y2="64" stroke={detailColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="82" y1="70" x2="90" y2="70" stroke={detailColor} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export const HistoryIcon = ({ dark }) => {
  const primaryColor = MAROON;
  const paperColor = "#ffffff";
  const detailColor = primaryColor;
  const outlineColor = dark ? "#ffffff" : primaryColor;
  
  return (
    <svg viewBox="0 0 120 100" width="120" height="100">
      {/* Browser window */}
      <rect x="18" y="20" width="84" height="60" rx="8" fill={paperColor} stroke={outlineColor} strokeWidth="2.5" />
      
      {/* Browser top bar */}
      <line x1="18" y1="32" x2="102" y2="32" stroke={outlineColor} strokeWidth="2" />
      {/* Dots on top bar */}
      <circle cx="26" cy="26" r="2" fill={outlineColor} />
      <circle cx="32" cy="26" r="2" fill={outlineColor} />
      <circle cx="38" cy="26" r="2" fill={outlineColor} />
      
      {/* Dashboard workspace contents (e.g. video avatars) */}
      <circle cx="40" cy="52" r="10" fill={detailColor} />
      <circle cx="40" cy="49" r="5" fill="#ffffff" />
      <path d="M32 60 C32 56, 48 56, 48 60" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      
      {/* Multi participant bubbles in top right */}
      <circle cx="74" cy="46" r="6" fill={detailColor} />
      <circle cx="86" cy="46" r="6" fill={detailColor} />
      
      {/* Text/metric details below */}
      <line x1="60" y1="62" x2="94" y2="62" stroke={detailColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="60" y1="68" x2="88" y2="68" stroke={detailColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="74" x2="94" y2="74" stroke={detailColor} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export const LocalHealthcareIcon = () => {
  const primaryColor = MAROON;
  const paperColor = "#ffffff";
  
  return (
    <svg viewBox="0 0 140 120" width="140" height="120">
      {/* Floating background circle/accents */}
      <circle cx="50" cy="50" r="30" fill="rgba(255, 255, 255, 0.08)" />
      <circle cx="100" cy="80" r="25" fill="rgba(255, 255, 255, 0.08)" />
      
      {/* Document sheet */}
      <rect x="35" y="15" width="65" height="85" rx="8" fill={paperColor} stroke="#ffffff" strokeWidth="2.5" />
      
      {/* Lines inside document */}
      <line x1="48" y1="32" x2="88" y2="32" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="48" y1="42" x2="80" y2="42" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="48" y1="52" x2="84" y2="52" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
      
      {/* Checkmark circle overlapping bottom left */}
      <circle cx="40" cy="90" r="15" fill={paperColor} stroke="#ffffff" strokeWidth="2.5" />
      <circle cx="40" cy="90" r="11" fill="#44000D" />
      <path d="M35 90 l3 3 l7-7" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Floating avatar profile overlapping right */}
      <circle cx="102" cy="65" r="18" fill={paperColor} stroke="#ffffff" strokeWidth="2.5" />
      <circle cx="102" cy="61" r="7" fill={primaryColor} />
      <path d="M92 78 C92 72, 112 72, 112 78" fill="none" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
};
