import { useEffect, useState } from "react";

function KpiRing({
  value = 0,
  label = "Momentum",
  color = "#38bdf8",
  disabled = false,
  direction = "neutral",
  delta = 0,
  streak = 0, // 🔥 optional streak indicator
}) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;

  const safeValue = Math.max(0, Math.min(100, value));

  const offset = disabled
    ? circumference
    : circumference - (safeValue / 100) * circumference;

  /* ================= COUNT UP ANIMATION ================= */
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 900;
    const increment = safeValue / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= safeValue) {
        setDisplayValue(safeValue);
        clearInterval(counter);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [safeValue]);

  /* ================= SMALL ARROW ================= */
  const SmallArrow = () => {
    if (direction === "up") {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#22c55e">
          <path d="M12 4L4 12h5v8h6v-8h5z" />
        </svg>
      );
    }

    if (direction === "down") {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#ef4444">
          <path d="M12 20l8-8h-5V4h-6v8H4z" />
        </svg>
      );
    }

    return null;
  };

  const deltaColor =
    direction === "up"
      ? "#22c55e"
      : direction === "down"
      ? "#ef4444"
      : "#94a3b8";

  const sign = delta > 0 ? "+" : "";

  /* ================= STREAK FLAME ================= */
  const Flame = () =>
    streak > 3 ? (
      <span
        style={{
          position: "absolute",
          top: "-8px",
          right: "-10px",
          fontSize: "18px",
          animation: "flameFlicker 1.5s infinite",
        }}
      >
        🔥
      </span>
    ) : null;
    const gradientId = `shimmer-${label}`;

  return (
    <div
      style={{
        width: "180px",
        height: "175px",
        background:
          "linear-gradient(160deg, rgba(30,41,59,0.95), rgba(15,23,42,0.9))",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(14px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#e5e7eb",
        boxShadow:
          "0 15px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
        opacity: disabled ? 0.35 : 1,
        transition: "all 0.25s ease",
        transform: "translateY(0)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-4px)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "translateY(0)")
      }
    >
      {/* ===== RING WRAPPER ===== */}
      <div
        style={{
          position: "relative",
          width: "120px",
          height: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Flame />

        <svg width="120" height="120">
          <defs>
  <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stopColor={color} stopOpacity="0.50" />
    <stop offset="50%" stopColor={color} stopOpacity="1" />
    <stop offset="100%" stopColor={color} stopOpacity="0.25" />
  </linearGradient>
</defs>


          {/* Background ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="10"
            fill="none"
          />

          {/* Progress ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={`url(#${gradientId})`}

            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{
              transition:
                "stroke-dashoffset 0.9s cubic-bezier(.4,0,.2,1)",
              filter:
                direction === "up"
                  ? `drop-shadow(0 0 10px ${color}88)`
                  : "none",
              animation:
                direction === "up"
                  ? "pulseGlow 2s infinite"
                  : "none",
            }}
          />
        </svg>

        {/* CENTER CONTENT */}
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1.1,
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              textShadow: "0 2px 6px rgba(0,0,0,0.6)",
            }}
          >
            {disabled ? "—" : `${displayValue}%`}
          </div>

          {!disabled && direction !== "neutral" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginTop: "6px",
                fontSize: "12px",
                fontWeight: 700,
                color: deltaColor,
              }}
            >
              <SmallArrow />
              {sign}
              {delta}%
            </div>
          )}
        </div>
      </div>

      {/* LABEL */}
      <div
        style={{
          marginTop: "18px",
          fontSize: "11px",
          fontWeight: 700,
          color: "#94a3b8",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>

      {/* ===== GLOBAL ANIMATIONS ===== */}
      <style>
        {`
        @keyframes pulseGlow {
          0% { filter: drop-shadow(0 0 6px ${color}55); }
          50% { filter: drop-shadow(0 0 14px ${color}aa); }
          100% { filter: drop-shadow(0 0 6px ${color}55); }
        }

        @keyframes flameFlicker {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        `}
      </style>
    </div>
  );
}

export default KpiRing;
