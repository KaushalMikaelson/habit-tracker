import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { calculateMonthlyCompletion, calculateHabitStreak } from "../../utils/habitUtils";

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


  /* ---------- Build (NO SORTING) ---------- */

  const enrichedHabits = safeHabits.map((habit) => {
    const progress = calculateMonthlyCompletion(habit, month, today);
    const streak = calculateHabitStreak(habit, today);

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
        background: "#020617",
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
          height: "77px",
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
                background: habit.status === 'paused' ? '#c4b5fd' : habit.status === 'archived' ? '#fb923c' : '#22c55e',
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
