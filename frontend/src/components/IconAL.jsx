import React from "react";

export const JalSetuLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2.69l5.66 5.66a8 8 0 11-11.32 0L12 2.69z"
      fill="url(#logo-gradient)"
      stroke="#22d3ee"
      strokeWidth="1.5"
    />
    <defs>
      <linearGradient id="logo-gradient" x1="12" y1="2.69" x2="12" y2="21.31">
        <stop stopColor="#67e8f9" />
        <stop offset="1" stopColor="#22d3ee" />
      </linearGradient>
    </defs>
  </svg>
);

export const MenuIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const XIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const ArrowRightIcon = () => (
  <svg
    className="w-6 h-6 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 5l7 7m0 0l-7 7m7-7H3"
    />
  </svg>
);

export const GisMapIcon = () => (
  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

export const AiMlIcon = () => (
  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.9 4.3A8 8 0 005.1 16.9m-1.2 2.8A8 8 0 0018.9 7.1M22 12A10 10 0 112 12m20 0a10 10 0 00-20 0"></path>
    <path d="M12 8v4l2 1"></path>
  </svg>
);

export const SmartAlertsIcon = () => (
  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 01-3.46 0"></path>
  </svg>
);

export const GovtIntegrationIcon = () => (
  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

export const CommunityImpactIcon = () => (
  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
    <path d="M16 3.13a4 4 0 010 7.75"></path>
  </svg>
);

export const MainWaterDropIcon = () => (
  <svg width="48" height="48" fill="none">
    <path
      d="M12 2.69l5.66 5.66a8 8 0 11-11.32 0L12 2.69z"
      fill="url(#main-drop-gradient)"
    />
    <defs>
      <linearGradient
        id="main-drop-gradient"
        x1="12"
        y1="2.69"
        x2="12"
        y2="21.31"
      >
        <stop stopColor="#67e8f9" />
        <stop offset="1" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
  </svg>
);
export const InitialAvatar = ({ name, className }) => {
  const getInitials = (name) => {
    const names = name.split(" ");
    const firstName = names[0] || "";
    const lastName = names.length > 1 ? names[names.length - 1] : "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-cyan-500 text-white font-bold ${className}`}
    >
      <span>{getInitials(name)}</span>
    </div>
  );
};
