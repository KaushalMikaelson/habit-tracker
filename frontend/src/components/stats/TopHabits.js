import dayjs from "dayjs";
import { motion } from "framer-motion";

function TopHabits({
  habits,
  currentYear,
  currentMonth,
  limit = 3,
  height,
}) {
  const safeHabits = Array.isArray(habits) ? habits : [];

  const scoredHabits = safeHabits.map((habit) => {
    const completedDates = Array.isArray(habit.completedDates)
      ? habit.completedDates
      : [];

    const monthlyScore = completedDates.filter((date) => {
      const d = dayjs(date);

      return (
        d.year() === currentYear &&
        d.month() === currentMonth
      );
    }).length;

    return {
      ...habit,
      score: monthlyScore,
    };
  });

  const topHabits = scoredHabits
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const maxScore = Math.max(...topHabits.map((h) => h.score), 1);

  const colors = [
    "#22d3ee",
    "#22c55e",
    "#a855f7",
    "#facc15",
    "#fb7185",
  ];

  return (
    <div
      style={{
        height: "100%",
        boxSizing: "border-box",
        background: "#020617",
        borderRadius: "16px",
        padding: "14px 20px",
        color: "#e5e7eb",
        display: "flex",
        flexDirection: "column",
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,0.06), 0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          height: 20,
          fontSize: "12px",
          letterSpacing: "0.14em",
          fontWeight: 800,
          color: "white",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          marginBottom: "8px",
        }}
      >
        TOP HABITS
      </div>

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          overflowY: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {topHabits.length === 0 ? (
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>
            No activity this month
          </div>
        ) : (
          topHabits.map((habit, index) => {
            const percent = Math.round(
              (habit.score / maxScore) * 100
            );

            const rankColor = colors[index % colors.length];

            return (
              <motion.div
                key={habit._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.25,
                  ease: "easeOut",
                }}
                whileHover={{ scale: 1.01 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "13px",
                    marginBottom: "4px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      maxWidth: "75%", // minWidth was not present, but maxWidth is kept
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 800,
                        color: rankColor,
                      }}
                    >
                      #{index + 1}
                    </span>

                    <span
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {habit.title}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 800,
                      color: rankColor,
                    }}
                  >
                    {habit.score}
                  </span>
                </div>

                <div
                  style={{
                    height: "7px",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    style={{
                      height: "100%",
                      background: rankColor,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{
                      delay: index * 0.08 + 0.15,
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default TopHabits;