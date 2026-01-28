import dayjs from "dayjs";

function HabitProgressColumn({ habits }) {
  const ROW_HEIGHT = 38;

  const safeHabits = Array.isArray(habits) ? habits : [];

  /* ---------- Helpers ---------- */

  function getProgressData(habit) {
    const todayStr = dayjs().format("YYYY-MM-DD");
    const currentMonth = todayStr.slice(0, 7);

    const completedDates = Array.isArray(habit.completedDates)
      ? habit.completedDates
      : [];

    const completedThisMonth = completedDates.filter(
      (d) => d.startsWith(currentMonth) && d <= todayStr
    );

    const completed = completedThisMonth.length;
    const total = dayjs().date();
    const percent =
      total === 0 ? 0 : Math.round((completed / total) * 100);

    return { completed, total, percent };
  }

  function getCurrentStreak(habit) {
    const completedDates = Array.isArray(habit.completedDates)
      ? habit.completedDates
      : [];

    let streak = 0;
    let cursor = dayjs();

    while (completedDates.includes(cursor.format("YYYY-MM-DD"))) {
      streak++;
      cursor = cursor.subtract(1, "day");
    }

    return streak;
  }

  /* ---------- Build + Sort ---------- */

  const enrichedHabits = safeHabits
    .map((habit) => {
      const progress = getProgressData(habit);
      const streak = getCurrentStreak(habit);

      return {
        ...habit,
        ...progress,
        streak,
      };
    })
    .sort((a, b) => b.percent - a.percent);

  return (
    <div
      style={{
        position: "sticky",
        top: "16px",
        width: "100%",
        minWidth: 0,

        /* 🔥 MATCH TOP HABITS CARD */
        background: "linear-gradient(180deg, #020617, #020617cc)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
        color: "#e5e7eb",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "12px",
          fontSize: "12px",
          fontWeight: 800,
          letterSpacing: "0.14em",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "51px",
          color: "#93c5fd",
        }}
      >
        PROGRESS BAR
      </div>

      {/* COLUMN HEADINGS */}
      <div
        style={{
          height: ROW_HEIGHT,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "0 12px",
          fontSize: "11px",
          color: "#9ca3af",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ width: "18px" }}>NO.</div>
        <div style={{ width: "42px" }}>DONE</div>
        <div style={{ flex: 1 }}>PROGRESS</div>
        <div style={{ width: "36px", textAlign: "right" }}>%</div>
        <div style={{ width: "36px", textAlign: "right" }}>STREAK</div>
      </div>

      {/* ROWS */}
      {enrichedHabits.map((habit, index) => (
        <div
          key={habit._id}
          style={{
            height: ROW_HEIGHT,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0 12px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            fontSize: "12px",
          }}
        >
          {/* RANK */}
          <div style={{ width: "18px" }}>{index + 1}</div>

          {/* COMPLETED */}
          <div style={{ width: "42px" }}>
            {habit.completed}/{habit.total}
          </div>

          {/* BAR */}
          <div
            style={{
              flex: 1,
              height: "6px",
              background: "rgba(255,255,255,0.12)",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${habit.percent}%`,
                height: "100%",
                background: "#22c55e",
                transition: "width 0.4s ease",
              }}
            />
          </div>

          {/* % */}
          <div style={{ width: "36px", textAlign: "right" }}>
            {habit.percent}%
          </div>

          {/* STREAK 🔥 */}
          <div style={{ width: "36px", textAlign: "right" }}>
            {habit.streak > 0 ? `🔥${habit.streak}` : "—"}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HabitProgressColumn;
