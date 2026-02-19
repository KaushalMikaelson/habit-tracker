import dayjs from "dayjs";

function TopHabits({
  habits,
  currentYear,
  currentMonth, // 0-based (Jan = 0)
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
        height:180,
        boxSizing: "border-box",
        background: "linear-gradient(180deg, #020617, #020617cc)",
        borderRadius: "16px",
        padding: "16px",
        color: "#e5e7eb",
        display: "flex",
        flexDirection: "column",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          height: 28,
          fontSize: "12px",
          letterSpacing: "0.14em",
          fontWeight: 800,
          color: "#93c5fd",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
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
          gap: "12px",
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

            return (
              <div key={habit._id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "13px",
                    marginBottom: "6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      maxWidth: "75%",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: colors[index],
                      }}
                    >
                      #{index + 1}
                    </span>

                    <span
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {habit.title}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: colors[index],
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
                  <div
                    style={{
                      width: `${percent}%`,
                      height: "100%",
                      background: colors[index],
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default TopHabits;
