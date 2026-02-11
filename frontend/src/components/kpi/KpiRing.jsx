function KpiRing({
  value = 0,             // percentage (0–100)
  label = "Momentum",    // text below ring
  color = "#38bdf8",     // ring color
  disabled = false,      // disabled state
  direction = "neutral", // ⬅️ NEW (up | down | neutral)
}) {
  /**
   * SVG math explanation:
   * radius = 36
   * circumference = 2 * π * r ≈ 226
   */
  const radius = 36;
  const circumference = 2 * Math.PI * radius;

  // Clamp value to avoid SVG glitches
  const safeValue = Math.max(0, Math.min(100, value));

  // If disabled → hide progress completely
  const offset = disabled
    ? circumference
    : circumference - (safeValue / 100) * circumference;

  // ⬅️ Arrow symbol
  const arrow =
    direction === "up"
      ? "▲"
      : direction === "down"
      ? "▼"
      : "—";

  return (
    <div
      style={{
        width: "160px",
        height: "160px",

        background:
          "linear-gradient(180deg, rgba(30,41,59,0.85), rgba(15,23,42,0.85))",

        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(10px)",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        color: "#e5e7eb",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",

        opacity: disabled ? 0.35 : 1,
        filter: disabled ? "grayscale(100%)" : "none",
        transition: "opacity 0.3s ease",
        pointerEvents: disabled ? "none" : "auto",
      }}
      title={
        disabled
          ? `${label} is only available for the current month`
          : ""
      }
    >
      {/* ===== RING WRAPPER ===== */}
      <div
        style={{
          position: "relative",
          width: "90px",
          height: "90px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Background + progress ring */}
        <svg width="90" height="90">
          <circle
            cx="45"
            cy="45"
            r={radius}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="8"
            fill="none"
          />

          <circle
            cx="45"
            cy="45"
            r={radius}
            stroke={disabled ? "#9ca3af" : color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 45 45)"
            style={{
              transition: disabled
                ? "none"
                : "stroke-dashoffset 0.8s ease-in-out",
            }}
          />
        </svg>

        {/* CENTER VALUE + ARROW */}
        <div
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "22px",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: disabled ? "#9ca3af" : "#f8fafc",
            lineHeight: 1,
          }}
        >
          {disabled ? "—" : arrow}
          {!disabled && `${safeValue}%`}
        </div>
      </div>

      {/* LABEL */}
      <div
        style={{
          marginTop: "14px",
          fontSize: "11px",
          fontWeight: 600,
          color: "#94a3b8",
          letterSpacing: "0.12em",
        }}
      >
        {label.toUpperCase()}
      </div>
    </div>
  );
}

export default KpiRing;
