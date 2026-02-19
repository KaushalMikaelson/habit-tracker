const DAY_COLUMN_WIDTH = 34; // px

function DashboardGrid({
  habits,
  monthDates,
  today,
  toggleHabit,
  gridScrollRef,
  isFutureDate,
  theme, // ✅ RECEIVE THEME
}) {
  const isDark = theme === "dark";

  const safeHabits = Array.isArray(habits) ? habits : [];
  const safeMonthDates = Array.isArray(monthDates) ? monthDates : [];

  return (
    <>
      <style>{`
        @keyframes checkPop {
          0%   { transform: scale(0.7); }
          60%  { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .habit-cell-btn {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          border: none;
          font-weight: 700;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }
        .habit-cell-btn.completed {
          background: #22c55e;
          color: #fff;
          box-shadow: 0 2px 8px rgba(34,197,94,0.45);
          animation: checkPop 0.25s cubic-bezier(.4,0,.2,1);
        }
        .habit-cell-btn.pending-dark {
          background: rgba(255,255,255,0.12);
          color: transparent;
        }
        .habit-cell-btn.pending-light {
          background: #e5e7eb;
          color: transparent;
        }
        .habit-cell-btn.future-dark {
          background: rgba(255,255,255,0.05);
          color: transparent;
          cursor: not-allowed;
        }
        .habit-cell-btn.future-light {
          background: #f1f5f9;
          color: transparent;
          cursor: not-allowed;
        }
        .habit-cell-btn:not(:disabled):hover {
          transform: scale(1.15);
        }
      `}</style>

      <div
        style={{
          background: isDark
            ? "linear-gradient(180deg, #020617, #020617cc)"
            : "#ffffff",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: isDark
            ? "inset 0 0 0 1px rgba(255,255,255,0.06)"
            : "0 1px 3px rgba(0,0,0,0.08)",
          border: isDark ? "none" : "1px solid #e5e7eb",
        }}
      >
        {/* SCROLLABLE DATE GRID */}
        <div
          ref={gridScrollRef}
          style={{
            overflowX: "auto",
            width: "100%",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="hide-scrollbar"
        >
          {/* WIDTH ENFORCER */}
          <div style={{ minWidth: `${safeMonthDates.length * DAY_COLUMN_WIDTH}px` }}>

            {/* WEEKDAY ROW */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${safeMonthDates.length}, ${DAY_COLUMN_WIDTH}px)`,
                height: "26px",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.03em",
                color: isDark ? "#475569" : "#9ca3af",
                borderBottom: isDark
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "1px solid #f1f5f9",
              }}
            >
              {safeMonthDates.map((date) => (
                <div
                  key={date}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  {new Date(date).toLocaleDateString("en-US", { weekday: "short" }).charAt(0)}
                </div>
              ))}
            </div>

            {/* DATE ROW */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${safeMonthDates.length}, ${DAY_COLUMN_WIDTH}px)`,
                height: "36px",
                borderBottom: isDark
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "1px solid #f1f5f9",
              }}
            >
              {safeMonthDates.map((date) => {
                const isToday = date === today;
                return (
                  <div
                    key={date}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: isToday ? 800 : 400,
                      color: isToday
                        ? isDark ? "#60a5fa" : "#2563eb"
                        : isDark ? "#64748b" : "#9ca3af",
                      background: isToday
                        ? isDark ? "rgba(96,165,250,0.1)" : "#eff6ff"
                        : "transparent",
                      borderRadius: isToday ? "6px" : "0",
                      margin: isToday ? "4px 2px" : "0",
                      position: "relative",
                    }}
                  >
                    {date.slice(8, 10)}
                    {isToday && (
                      <div style={{
                        position: "absolute",
                        bottom: "-2px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        background: "#60a5fa",
                      }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* HABIT ROWS */}
            {safeHabits.map((habit) => (
              <div
                key={habit._id}
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${safeMonthDates.length}, ${DAY_COLUMN_WIDTH}px)`,
                  height: "38px",
                  borderBottom: isDark
                    ? "1px solid rgba(255,255,255,0.04)"
                    : "1px solid #f8fafc",
                }}
              >
                {safeMonthDates.map((date) => {
                  const completedDates = Array.isArray(habit.completedDates)
                    ? habit.completedDates
                    : [];
                  const isCompleted = completedDates.includes(date);
                  const isFuture = isFutureDate(date);
                  const isToday = date === today;
                  const isWeekend = [0, 6].includes(new Date(date).getDay());
                  const isWeekStart = new Date(date).getDay() === 1;

                  let cellClass = "";
                  if (isFuture) cellClass = isDark ? "future-dark" : "future-light";
                  else if (isCompleted) cellClass = "completed";
                  else cellClass = isDark ? "pending-dark" : "pending-light";

                  return (
                    <div
                      key={date}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isToday
                          ? isDark ? "rgba(96,165,250,0.05)" : "rgba(37,99,235,0.04)"
                          : isWeekend
                            ? isDark ? "rgba(255,255,255,0.02)" : "#fafafa"
                            : "transparent",
                        borderLeft: isWeekStart
                          ? isDark ? "1px solid rgba(34,197,94,0.2)" : "1px solid #bbf7d0"
                          : "none",
                        pointerEvents: "none",
                      }}
                    >
                      <button
                        disabled={isFuture}
                        onClick={() => !isFuture && toggleHabit(habit._id, date)}
                        className={`habit-cell-btn ${cellClass}`}
                        style={{ pointerEvents: "auto" }}
                        title={isCompleted ? "Mark incomplete" : isFuture ? "Future date" : "Mark complete"}
                      >
                        {isCompleted ? "✓" : ""}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardGrid;
