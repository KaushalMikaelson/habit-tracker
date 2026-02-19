function DashboardHeader({
  monthLabel,
  goToPreviousMonth,
  goToNextMonth,
  theme,
  setTheme,
}) {
  const isDark = theme === "dark";

  return (
    <>
      <style>{`
        .dash-nav-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
          transition: all 0.18s cubic-bezier(.4,0,.2,1);
        }
        .dash-nav-btn-dark {
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          color: #94a3b8;
        }
        .dash-nav-btn-dark:hover {
          background: rgba(255,255,255,0.12);
          color: #f1f5f9;
          transform: scale(1.08);
        }
        .dash-nav-btn-dark:active { transform: scale(0.95); }
        .dash-nav-btn-light {
          border: 1px solid #e5e7eb;
          background: #ffffff;
          color: #374151;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }
        .dash-nav-btn-light:hover {
          background: #f9fafb;
          transform: scale(1.08);
        }
        .dash-nav-btn-light:active { transform: scale(0.95); }

        .theme-toggle-btn {
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .theme-toggle-dark {
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: #64748b;
        }
        .theme-toggle-dark:hover {
          background: rgba(255,255,255,0.1);
          color: #94a3b8;
        }
        .theme-toggle-light {
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          color: #6b7280;
        }
        .theme-toggle-light:hover {
          background: #f3f4f6;
          color: #374151;
        }
      `}</style>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          padding: "0 14px",
          height: "52px",
          background: isDark
            ? "rgba(2,6,23,0.9)"
            : "#f9fafb",
          backdropFilter: "blur(10px)",
          borderBottom: isDark
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid #e5e7eb",
        }}
      >
        {/* LEFT: PREVIOUS */}
        <button
          onClick={goToPreviousMonth}
          aria-label="Previous month"
          className={`dash-nav-btn ${isDark ? "dash-nav-btn-dark" : "dash-nav-btn-light"}`}
        >
          ‹
        </button>

        {/* CENTER: MONTH */}
        <div
          style={{
            justifySelf: "center",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: isDark ? "#60a5fa" : "#1e40af",
            textTransform: "uppercase",
          }}
        >
          {monthLabel}
        </div>

        {/* RIGHT: THEME + NEXT */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`theme-toggle-btn ${isDark ? "theme-toggle-dark" : "theme-toggle-light"}`}
          >
            {isDark ? "☀ Light" : "☾ Dark"}
          </button>

          <button
            onClick={goToNextMonth}
            aria-label="Next month"
            className={`dash-nav-btn ${isDark ? "dash-nav-btn-dark" : "dash-nav-btn-light"}`}
          >
            ›
          </button>
        </div>
      </div>
    </>
  );
}

export default DashboardHeader;
