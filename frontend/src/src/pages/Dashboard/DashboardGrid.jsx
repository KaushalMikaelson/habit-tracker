import HabitNameColumn from "../../components/habits/HabitNameColumn";

function DashboardGrid({ habits, monthDates, today, toggleHabit, deleteHabit, gridScrollRef, isFutureDate }) {
  return (

<div style={{ display: "flex" }}>
  
  {/* ================= FIXED HABIT COLUMN ================= */}
  <div>
    {/* HABITS header (spans weekday + date height) */}
    <div
      style={{
        width: "200px",
        height: "62px", // 26 + 36
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        color: "#374151",
        borderBottom: "1px solid #e5e7eb",
        background: "#ffffff",
      }}
    >
      HABITS
    </div>

    {/* Habit names */}
    <HabitNameColumn habits={habits} deleteHabit={deleteHabit} />
  </div>

  {/* ================= SHARED SCROLL CONTAINER ================= */}
  <div
    ref={gridScrollRef}
    style={{
      overflowX: "auto",
      width: "100%",
    }}
  >
    <div style={{ minWidth: `${monthDates.length * 34}px` }}>

      {/* ================= WEEKDAY ROW ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${monthDates.length}, 34px)`,
          height: "26px",
          fontSize: "11px",
          color: "#6b7280",
          borderBottom: "1px solid #e5e7eb",
          background: "#ffffff",
        }}
      >
        {monthDates.map((date) => (
          <div
            key={date}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {new Date(date).toLocaleDateString("en-US", {
              weekday: "short",
            })}
          </div>
        ))}
      </div>

      {/* ================= DATE ROW ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${monthDates.length}, 34px)`,

          height: "36px",
          borderBottom: "1px solid #e5e7eb",
          background: "#ffffff",
        }}
      >
        {monthDates.map((date) => {
          const isToday = date === today;

          return (
            <div
              key={date}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: isToday ? 700 : 400,
                color: isToday ? "#1d4ed8" : "#111827",
                background: isToday ? "#e3f2fd" : "transparent",
              }}
            >
              {date.slice(8, 10)}
            </div>
          );
        })}
      </div>

      {/* ================= HABIT GRID ROWS ================= */}
      {habits.map((habit) => (
        <div
          key={habit.id}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${monthDates.length}, 34px)`,
            height: "38px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          {monthDates.map((date) => {
            const isCompleted = habit.completedDates?.includes(date);
            const isFuture = isFutureDate(date);
            const isWeekStart = new Date(date).getDay() === 1;
            const isWeekend = [0, 6].includes(
              new Date(date).getDay()
            );

            return (
              <div
                key={date}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isWeekend ? "#f8fafc" : "transparent",
                  borderLeft: isWeekStart
                    ? "2px solid #d1fae5"
                    : "none",
                }}
              >
                <button
                  disabled={isFuture}
                  onClick={() => {
                    if (isFuture) return;
                    toggleHabit(habit.id, date);
                  }}
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "6px",
                    border: "none",
                    background: isFuture
                      ? "#f3f4f6"
                      : isCompleted
                      ? "#22c55e"
                      : "#e5e7eb",
                    color: "white",
                    cursor: isFuture
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  ✓
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  </div>
</div>
    );  
}

export default DashboardGrid;