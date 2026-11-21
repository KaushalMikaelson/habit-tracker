import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";

function KpiRing({
  value = 0,
  label = "Momentum",
  color = "#38bdf8",
  disabled = false,
  direction = "neutral",
  delta = 0,
}) {
  const radius = 48;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  const safeValue = Math.max(0, Math.min(100, value));
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const targetOffset = disabled
      ? circumference
      : circumference - (safeValue / 100) * circumference;

    setOffset(targetOffset);
  }, [safeValue, circumference, disabled]);

  const isPositive = direction === "up";

  return (
    <div style={styles.card}>
      <div style={styles.ringWrapper}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          {/* Background */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="var(--color-border, rgba(255,255,255,0.08))"
            strokeWidth={strokeWidth}
          />

          {/* Progress */}
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
              opacity: disabled ? 0.3 : 1,
            }}
          />
        </svg>

        {/* CENTER */}
        <div style={styles.center}>
          <span style={styles.percent}>
            {disabled ? "—" : `${safeValue}%`}
          </span>

          {!disabled && direction !== "neutral" && (
            <span
              style={{
                ...styles.delta,
                color: isPositive ? "var(--accent-green)" : "#ef4444",
              }}
            >
              {isPositive ? (
                <ArrowUpRight size={12} strokeWidth={3} />
              ) : (
                <ArrowDownRight size={12} strokeWidth={3} />
              )}
              {Math.abs(delta)}%
            </span>
          )}
        </div>
      </div>

      {/* LABEL */}
      <div style={styles.label}>{label}</div>
    </div>
  );
}

export default KpiRing;

const styles = {
  card: {
    background: "var(--color-surface, #020617)",
    border: "var(--color-card-border, none)",
    boxShadow: "var(--color-card-shadow, none)",
    borderRadius: "16px",
    padding: "10px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    flex: 1,
    minWidth: 0,
    transition: "transform 0.2s ease",
  },

  ringWrapper: {
    position: "relative",
    width: 120,
    height: 120,
    marginTop: "4px",
  },

  center: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  percent: {
    fontSize: "1.8rem",
    fontWeight: 800,
    color: "var(--color-text-title, var(--color-text, #f8fafc))",
    lineHeight: 1,
  },

  delta: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
    fontSize: "0.85rem",
    fontWeight: 800,
    marginTop: "4px",
  },

  label: {
    fontSize: "0.7rem",
    fontWeight: 800,
    color: "var(--color-text-muted, #94a3b8)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginTop: "6px",
  },
};