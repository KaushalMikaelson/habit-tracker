import dayjs from "dayjs";
import { useEffect, useState } from "react";

function HabitProgressColumn({ habits, currentMonth }) {
  const ROW_HEIGHT = 38;

  const safeHabits = Array.isArray(habits) ? habits : [];

  /* ---------- FORCE DATE AWARE RE-RENDER ---------- */
  // Keeps current month progress updating daily
  const [today, setToday] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setToday(dayjs());
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  /* ---------- MONTH CONTEXT ---------- */
  // currentMonth is expected to be a dayjs object (selectedMonth)
  const month = dayjs.isDayjs(currentMonth)
    ? currentMonth
    : dayjs(currentMonth);

  const currentMonthStr = month.format("YYYY-MM");

  const totalDaysSoFar = month.isSame(today, "month")
    ? today.date()           // current month → up to today
    : month.daysInMonth();   // past month → full month

  /* ---------- Helpers ---------- */

  function normalizeDates(habit) {
    return new Set(
      (habit.completedDates || []).map((d) =>
        dayjs(d).format("YYYY-MM-DD")
      )
    );
  }

  function getProgressData(habit) {
    const completedSet = normalizeDates(habit);

    let completed = 0;
    for (let i = 1; i <= totalDaysSoFar; i++) {
      const date = `${currentMonthStr}-${String(i).padStart(2, "0")}`;
      if (completedSet.has(date)) completed++;
    }

    const percent =
      totalDaysSoFar === 0
        ? 0
        : Math.round((completed / totalDaysSoFar) * 100);

    return {
      completed,
      total: totalDaysSoFar,
      percent,
    };
  }

  function getCurrentStreak(habit) {
    const completedSet = normalizeDates(habit);

    let streak = 0;
    let cursor = today;

    while (completedSet.has(cursor.format("YYYY-MM-DD"))) {
      streak++;
      cursor = cursor.subtract(1, "day");
    }

    return streak;
  }

  /* ---------- Build (NO SORTING) ---------- */

  const enrichedHabits = safeHabits.map((habit) => {
    const progress = getProgressData(habit);
    const streak = getCurrentStreak(habit);

    return {
      ...habit,
      ...progress,
      streak,
    };
  });

  /* ---------- UI ---------- */

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minWidth: 0,
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
          fontSize: "15px",
          fontWeight: 800,
          letterSpacing: "0.14em",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "55px",
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
          <div style={{ width: "18px" }}>{index + 1}</div>

          <div style={{ width: "42px" }}>
            {habit.completed}/{habit.total}
          </div>

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

          <div style={{ width: "36px", textAlign: "right" }}>
            {habit.percent}%
          </div>

          <div style={{ width: "36px", textAlign: "right" }}>
            {habit.streak > 0 ? `🔥${habit.streak}` : "—"}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HabitProgressColumn;
