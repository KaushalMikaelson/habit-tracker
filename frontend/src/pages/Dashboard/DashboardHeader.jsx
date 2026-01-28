function DashboardHeader({
  monthLabel,
  goToPreviousMonth,
  goToNextMonth,
  theme,
  setTheme,
}) {
  const isDark = theme === "dark";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        height: "52px",
        background: isDark
          ? "linear-gradient(180deg, #020617, #020617cc)"
          : "#f9fafb",
        borderBottom: isDark
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid #e5e7eb",
      }}
    >
      {/* Left */}
      <button
        onClick={goToPreviousMonth}
        style={navBtnStyle(isDark)}
      >
        ◀
      </button>

      {/* Center */}
      <div
        style={{
          fontSize: "14px",
          fontWeight: 800,
          letterSpacing: "0.08em",
          color: isDark ? "#93c5fd" : "#111827",
        }}
      >
        {monthLabel.toUpperCase()}
      </div>

      {/* Right */}
      <div style={{ display: "flex", gap: "8px" }}>
        {/* THEME TOGGLE */}
        <button
          onClick={() =>
            setTheme(isDark ? "light" : "dark")
          }
          style={{
            padding: "6px 10px",
            fontSize: "11px",
            borderRadius: "999px",
            border: isDark
              ? "1px solid rgba(255,255,255,0.2)"
              : "1px solid #d1d5db",
            background: isDark ? "#020617" : "#ffffff",
            color: isDark ? "#e5e7eb" : "#111827",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {isDark ? "Light" : "Dark"}
        </button>

        <button
          onClick={goToNextMonth}
          style={navBtnStyle(isDark)}
        >
          ▶
        </button>
      </div>
    </div>
  );
}

function navBtnStyle(isDark) {
  return {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: isDark
      ? "1px solid rgba(255,255,255,0.12)"
      : "1px solid #e5e7eb",
    background: isDark
      ? "rgba(255,255,255,0.04)"
      : "#ffffff",
    color: isDark ? "#e5e7eb" : "#374151",
    cursor: "pointer",
  };
}

export default DashboardHeader;
