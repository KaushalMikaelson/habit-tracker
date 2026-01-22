// DashboardGrid.jsx
// ONLY responsible for the habit calendar grid

const DAY_COLUMN_WIDTH = 34; // px

function DashboardGrid({
  habits,
  monthDates,
  today,
  toggleHabit,
  gridScrollRef,
  isFutureDate,
}) {
  return (
    <div style={{ background: "#ffffff" }}>
      {/* ================= SCROLLABLE DATE GRID ================= */}
      <div
        ref={gridScrollRef}
        style={{
          overflowX: "auto",
          width: "100%",
          
        }}
      >
        {/* WIDTH ENFORCER */}
        <div style={{ minWidth: `${monthDates.length * DAY_COLUMN_WIDTH}px` }}>
          {/* WEEKDAY ROW */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${monthDates.length}, ${DAY_COLUMN_WIDTH}px)`,
              height: "26px",
              fontSize: "11px",
              color: "#6b7280",
              borderBottom: "1px solid #e5e7eb",
              
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

          {/* DATE ROW */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${monthDates.length}, ${DAY_COLUMN_WIDTH}px)`,
              height: "36px",
              borderBottom: "1px solid #e5e7eb",
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

          {/* HABIT ROWS */}
          {habits.map((habit) => (
            <div
              key={habit._id}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${monthDates.length}, ${DAY_COLUMN_WIDTH}px)`,
                height: "38px",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              {monthDates.map((date) => {
                const isCompleted =
                  habit.completedDates?.includes(date);
                const isFuture = isFutureDate(date);
                const isWeekStart =
                  new Date(date).getDay() === 1;
                const isWeekend =
                  [0, 6].includes(new Date(date).getDay());

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
                      pointerEvents: "none",
                    }}
                  >
                    <button
                      disabled={isFuture}
                      onClick={() =>
                        !isFuture &&
                        toggleHabit(habit._id, date)
                      }
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
                        color: "#ffffff",
                        cursor: isFuture
                          ? "not-allowed"
                          : "pointer",
                        pointerEvents: "auto",
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
