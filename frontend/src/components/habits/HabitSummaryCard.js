import dayjs from "dayjs";

/**
 * HabitSummaryCard
 * Monthly Completed vs Remaining with visual ring
 */
function HabitSummaryCard({ habits = [], month }) {
  const activeMonth = month ? dayjs(month) : dayjs();

  const daysInMonth = activeMonth.daysInMonth();
  const monthKey = activeMonth.format("YYYY-MM");

  let completed = 0;

  habits.forEach((habit) => {
    completed += (habit.completedDates || []).filter(
      (d) => dayjs(d).format("YYYY-MM") === monthKey
    ).length;
  });

  const totalPossible = habits.length * daysInMonth;
  const remaining = Math.max(totalPossible - completed, 0);

  const percent =
    totalPossible === 0
      ? 0
      : Math.round((completed / totalPossible) * 100);

  return (
    <div style={styles.card}>
      {/* LEFT CONTENT */}
      <div style={styles.left}>
        <div style={styles.row}>
          <div style={styles.label}>COMPLETED</div>
          <div style={styles.completed}>{completed}</div>
        </div>

        <div style={styles.divider} />

        <div style={styles.row}>
          <div style={styles.label}>REMAINING</div>
          <div style={styles.remaining}>{remaining}</div>
        </div>
      </div>

      {/* RIGHT RING */}
      <div style={styles.ringWrap}>
        <svg width="120" height="120">
          <circle
            cx="60"
            cy="60"
            r="48"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r="48"
            stroke="#22c55e"
            strokeWidth="10"
            fill="none"
            strokeDasharray={2 * Math.PI * 48}
            strokeDashoffset={
              2 * Math.PI * 48 * (1 - percent / 100)
            }
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.6s ease",
            }}
            transform="rotate(-90 60 60)"
          />

          {/* CENTER TEXT */}
          <text
            x="60"
            y="56"
            textAnchor="middle"
            fill="#e5e7eb"
            fontSize="20"
            fontWeight="800"
          >
            {percent}%
          </text>
          <text
            x="60"
            y="74"
            textAnchor="middle"
            fill="#9ca3af"
            fontSize="10"
          >
            completed
          </text>
        </svg>
      </div>
    </div>
  );
}

export default HabitSummaryCard;

/* ================= STYLES ================= */

const styles = {
  card: {
    background: "linear-gradient(180deg, #020617, #020617cc)",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
    color: "#e5e7eb",
    width: "100%",
    minHeight: "170px", // 🔥 makes it visually balanced
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  left: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    minWidth: "140px",
  },

  label: {
    fontSize: "11px",
    letterSpacing: "0.14em",
    fontWeight: 700,
    color: "#9ca3af",
  },

  completed: {
    fontSize: "26px",
    fontWeight: 800,
    color: "#22c55e",
  },

  remaining: {
    fontSize: "26px",
    fontWeight: 800,
    color: "#f87171",
  },

  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.08)",
  },

  ringWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
