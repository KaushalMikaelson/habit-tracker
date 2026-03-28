import React from "react";

function Sidebar({ isOpen, onClose, activeView = "dashboard", onNavigate }) {
  const linkStyle = {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 500,
    color: "#94a3b8",
    transition: "all 0.2s ease",
    textDecoration: "none",
  };

  const activeLinkStyle = {
    ...linkStyle,
    color: "#34d399",
    background: "rgba(16, 185, 129, 0.1)",
    position: "relative",
  };

  const activeIndicatorStyle = {
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    width: "4px",
    height: "20px",
    background: "#34d399",
    borderTopRightRadius: "4px",
    borderBottomRightRadius: "4px",
  };

  const sectionHeaderStyle = {
    fontSize: "11px",
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginTop: "24px",
    marginBottom: "12px",
    paddingLeft: "16px",
  };

  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        background: "#0b101e",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        zIndex: 50,
        marginLeft: isOpen ? "0" : "-260px",
        transition: "margin-left 0.3s ease-in-out",
      }}
    >
      {/* BRAND & HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "80px",
          padding: "0 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>Habit Tracker</span>
            <span style={{ fontSize: "10px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: "2px" }}>Track Your Journey</span>
          </div>
        </div>

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#64748b",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px",
            borderRadius: "6px",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#f8fafc"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* NAVIGATION LINKS */}
      <div style={{ flex: 1, padding: "24px 12px", overflowY: "auto" }}>
        {/* MAIN SECTION */}
        <div style={sectionHeaderStyle}>Main</div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div
            style={activeView === "dashboard" ? activeLinkStyle : linkStyle}
            onClick={() => onNavigate && onNavigate("dashboard")}
            onMouseEnter={(e) => { if (activeView !== "dashboard") { e.currentTarget.style.color = "#f8fafc"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; } }}
            onMouseLeave={(e) => { if (activeView !== "dashboard") { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "transparent"; } }}
          >
            {activeView === "dashboard" && <div style={activeIndicatorStyle} />}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Dashboard
          </div>

          <div 
            style={activeView === "stats" ? activeLinkStyle : linkStyle}
            onClick={() => onNavigate && onNavigate("stats")}
            onMouseEnter={(e) => { if (activeView !== "stats") { e.currentTarget.style.color = "#f8fafc"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; } }}
            onMouseLeave={(e) => { if (activeView !== "stats") { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "transparent"; } }}
          >
            {activeView === "stats" && <div style={activeIndicatorStyle} />}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            Stats
          </div>

          <div 
            style={activeView === "weekly" ? activeLinkStyle : linkStyle}
            onClick={() => onNavigate && onNavigate("weekly")}
            onMouseEnter={(e) => { if (activeView !== "weekly") { e.currentTarget.style.color = "#f8fafc"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; } }}
            onMouseLeave={(e) => { if (activeView !== "weekly") { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "transparent"; } }}
          >
            {activeView === "weekly" && <div style={activeIndicatorStyle} />}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Weekly View
          </div>

          <div 
            style={linkStyle}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#f8fafc"; e.currentTarget.style.background = "rgba(255,255,255,0.03)" }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "transparent" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
              <path d="M8 14h.01"></path>
              <path d="M12 14h.01"></path>
              <path d="M16 14h.01"></path>
              <path d="M8 18h.01"></path>
              <path d="M12 18h.01"></path>
              <path d="M16 18h.01"></path>
            </svg>
            Monthly View
          </div>

          <div 
            style={linkStyle}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#f8fafc"; e.currentTarget.style.background = "rgba(255,255,255,0.03)" }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "transparent" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Reports
          </div>
        </div>

        {/* ACCOUNT SECTION */}
        <div style={sectionHeaderStyle}>Account</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div 
            style={linkStyle}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#f8fafc"; e.currentTarget.style.background = "rgba(255,255,255,0.03)" }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "transparent" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Settings
          </div>
        </div>
      </div>

      {/* FOOTER SECTION: Achievements Card */}
      <div style={{ padding: "0 16px 20px 16px", display: "flex", flexDirection: "column", gap: "16px" }}>
        
        {/* Border / Box for Achievements */}
        <div style={{
          background: "rgba(76, 29, 149, 0.15)", // dark purple tint
          border: "1px solid rgba(139, 92, 246, 0.2)",
          borderRadius: "14px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          cursor: "pointer",
          transition: "background 0.2s ease, border-color 0.2s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(76, 29, 149, 0.25)"; e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.3)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(76, 29, 149, 0.15)"; e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.2)"; }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
              <path d="M4 22h16"></path>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
            </svg>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#a78bfa" }}>Achievements</span>
          </div>
          <span style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.4" }}>
            Complete habits to unlock badges
          </span>
        </div>

        {/* Bottom App Version / Star */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: "4px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span style={{ fontSize: "12px", fontWeight: 500, color: "#64748b" }}>Habit Tracker v1.0</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
