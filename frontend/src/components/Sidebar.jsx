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
    color: "var(--theme-2, #34d399)",
    background: "rgba(255, 255, 255, 0.06)",
    position: "relative",
  };

  const activeIndicatorStyle = {
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    width: "4px",
    height: "20px",
    background: "var(--theme-1, #34d399)",
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
    <>
      {/* OVERLAY */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            zIndex: 9998,
          }}
        />
      )}

      {/* SIDEBAR MAIN CONTAINER */}
      <div
        style={{
          width: "260px",
          height: "100vh",
          background: "#0b101e",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          position: "fixed",
          top: 0,
          left: isOpen ? "0" : "-260px",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          zIndex: 9999,
          transition: "left 0.3s ease-in-out",
          boxShadow: isOpen ? "4px 0 24px rgba(0,0,0,0.5)" : "none",
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
              background: "linear-gradient(135deg, var(--theme-1, #3b82f6), var(--theme-2, #60a5fa))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
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
            onClick={() => { if (onNavigate) onNavigate("dashboard"); if (onClose) onClose(); }}
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
            onClick={() => { if (onNavigate) onNavigate("stats"); if (onClose) onClose(); }}
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
            onClick={() => { if (onNavigate) onNavigate("weekly"); if (onClose) onClose(); }}
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
            style={activeView === "monthly" ? activeLinkStyle : linkStyle}
            onClick={() => { if (onNavigate) onNavigate("monthly"); if (onClose) onClose(); }}
            onMouseEnter={(e) => { if (activeView !== "monthly") { e.currentTarget.style.color = "#f8fafc"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; } }}
            onMouseLeave={(e) => { if (activeView !== "monthly") { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "transparent"; } }}
          >
            {activeView === "monthly" && <div style={activeIndicatorStyle} />}
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
            style={activeView === "notes" ? activeLinkStyle : linkStyle}
            onClick={() => { if (onNavigate) onNavigate("notes"); if (onClose) onClose(); }}
            onMouseEnter={(e) => { if (activeView !== "notes") { e.currentTarget.style.color = "#f8fafc"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; } }}
            onMouseLeave={(e) => { if (activeView !== "notes") { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "transparent"; } }}
          >
            {activeView === "notes" && <div style={activeIndicatorStyle} />}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <line x1="10" y1="9" x2="8" y2="9"></line>
            </svg>
            Notes
          </div>

          <div 
            style={activeView === "journal" ? activeLinkStyle : linkStyle}
            onClick={() => { if (onNavigate) onNavigate("journal"); if (onClose) onClose(); }}
            onMouseEnter={(e) => { if (activeView !== "journal") { e.currentTarget.style.color = "#f8fafc"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; } }}
            onMouseLeave={(e) => { if (activeView !== "journal") { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "transparent"; } }}
          >
            {activeView === "journal" && <div style={activeIndicatorStyle} />}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            My Space
          </div>
        </div>

        {/* ACCOUNT SECTION */}
        <div style={sectionHeaderStyle}>Account</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div 
            style={activeView === "settings" ? activeLinkStyle : linkStyle}
            onClick={() => { if (onNavigate) onNavigate("settings"); if (onClose) onClose(); }}
            onMouseEnter={(e) => { if (activeView !== "settings") { e.currentTarget.style.color = "#f8fafc"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; } }}
            onMouseLeave={(e) => { if (activeView !== "settings") { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "transparent"; } }}
          >
            {activeView === "settings" && <div style={activeIndicatorStyle} />}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Settings
          </div>
        </div>
      </div>


      </div>
    </>
  );
}

export default Sidebar;
