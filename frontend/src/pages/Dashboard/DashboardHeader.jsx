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
        display: "grid",
        gridTemplateColumns: "auto 1fr auto", // 🔥 KEY FIX
        alignItems: "center",
        padding: "0 16px",
        height: "56px",

        background: isDark
          ? "linear-gradient(180deg, #020617, #020617cc)"
          : "#f9fafb",

        borderBottom: isDark
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid #e5e7eb",
      }}
    >
      {/* LEFT: PREVIOUS */}
      <button
        onClick={goToPreviousMonth}
        aria-label="Previous month"
        style={navBtnStyle(isDark)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform =
            "translateY(-2px) scale(1.03)";
          e.currentTarget.style.boxShadow =
            "0 10px 22px rgba(0,0,0,0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow =
            navBtnStyle(isDark).boxShadow;
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "scale(0.97)";
        }}
      >
        ◀
      </button>

      {/* CENTER: MONTH (TRUE CENTER) */}
      <div
        style={{
          justifySelf: "center", // 🔥 TRUE CENTER
          fontSize: "14px",
          fontWeight: 800,
          letterSpacing: "0.1em",
          color: isDark ? "#93c5fd" : "#111827",
        }}
      >
        {monthLabel.toUpperCase()}
      </div>

      {/* RIGHT: THEME + NEXT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          justifySelf: "end",
        }}
      >
        {/* THEME TOGGLE */}
        <button
          onClick={() =>
            setTheme(isDark ? "light" : "dark")
          }
          style={{
            padding: "6px 12px",
            fontSize: "11px",
            borderRadius: "999px",
            border: isDark
              ? "1px solid rgba(255,255,255,0.25)"
              : "1px solid #d1d5db",
            background: isDark
              ? "rgba(255,255,255,0.06)"
              : "#ffffff",
            color: isDark ? "#e5e7eb" : "#111827",
            cursor: "pointer",
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          {isDark ? "LIGHT" : "DARK"}
        </button>

        {/* NEXT */}
        <button
          onClick={goToNextMonth}
          aria-label="Next month"
          style={navBtnStyle(isDark)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "translateY(-2px) scale(1.03)";
            e.currentTarget.style.boxShadow =
              "0 10px 22px rgba(0,0,0,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow =
              navBtnStyle(isDark).boxShadow;
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.97)";
          }}
        >
          ▶
        </button>
      </div>
    </div>
  );
}

/* ================= BUTTON STYLE ================= */

function navBtnStyle(isDark) {
  return {
    width: "40px",
    height: "40px",
    borderRadius: "14px",

    border: isDark
      ? "1px solid rgba(255,255,255,0.25)"
      : "1px solid #d1d5db",

    background: isDark
      ? "radial-gradient(circle at top left, rgba(255,255,255,0.18), rgba(255,255,255,0.04))"
      : "radial-gradient(circle at top left, #ffffff, #f1f5f9)",

    color: isDark ? "#e5e7eb" : "#111827",

    boxShadow: isDark
      ? `
        0 6px 16px rgba(0,0,0,0.6),
        inset 0 1px 0 rgba(255,255,255,0.2)
      `
      : `
        0 6px 14px rgba(0,0,0,0.12),
        inset 0 1px 0 #ffffff
      `,

    cursor: "pointer",
    transition: "all 0.18s cubic-bezier(.4,0,.2,1)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "17px",
    fontWeight: 700,
  };
}

export default DashboardHeader;
