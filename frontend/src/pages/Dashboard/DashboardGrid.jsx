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
    <div
      style={{
        background: isDark
          ? "linear-gradient(180deg, #020617, #020617cc)"
          : "#ffffff",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: isDark
          ? "inset 0 0 0 1px rgba(255,255,255,0.04)"
          : "0 1px 2px rgba(0,0,0,0.06)",
        border: isDark ? "none" : "1px solid #e5e7eb",
      }}
    >
      {/* ================= SCROLLABLE DATE GRID ================= */}
      <div
        ref={gridScrollRef}
        style={{
          overflowX: "auto",
          width: "100%",
          scrollbarWidth: "none",        // Firefox
          msOverflowStyle: "none",       // IE/Edge
        }}
        className="hide-scrollbar"
      >

        {/* WIDTH ENFORCER */}
        <div
          style={{
            minWidth: `${safeMonthDates.length * DAY_COLUMN_WIDTH}px`,
          }}
        >
          {/* WEEKDAY ROW */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${safeMonthDates.length}, ${DAY_COLUMN_WIDTH}px)`,
              height: "26px",
              fontSize: "11px",
              color: isDark ? "#9ca3af" : "#6b7280",
              borderBottom: isDark
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid #e5e7eb",
            }}
          >
            {safeMonthDates.map((date) => (
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
              gridTemplateColumns: `repeat(${safeMonthDates.length}, ${DAY_COLUMN_WIDTH}px)`,
              height: "36px",
              borderBottom: isDark
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid #e5e7eb",
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
                    fontWeight: isToday ? 700 : 400,
                    color: isToday
                      ? isDark
                        ? "#93c5fd"
                        : "#2563eb"
                      : isDark
                        ? "#e5e7eb"
                        : "#111827",
                    background: isToday
                      ? isDark
                        ? "rgba(147,197,253,0.12)"
                        : "#eff6ff"
                      : "transparent",
                  }}
                >
                  {date.slice(8, 10)}
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
                  ? "1px solid rgba(255,255,255,0.05)"
                  : "1px solid #f1f5f9",
              }}
            >
              {safeMonthDates.map((date) => {
                const completedDates = Array.isArray(
                  habit.completedDates
                )
                  ? habit.completedDates
                  : [];

                const isCompleted = completedDates.includes(date);
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
                      background: isWeekend
                        ? isDark
                          ? "rgba(255,255,255,0.03)"
                          : "#f8fafc"
                        : "transparent",
                      borderLeft: isWeekStart
                        ? isDark
                          ? "2px solid rgba(34,197,94,0.35)"
                          : "2px solid #bbf7d0"
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
                          ? isDark
                            ? "rgba(255,255,255,0.08)"
                            : "#e5e7eb"
                          : isCompleted
                            ? "#22c55e"
                            : isDark
                              ? "rgba(255,255,255,0.18)"
                              : "#e5e7eb",
                        color: isDark ? "#020617" : "#ffffff",
                        cursor: isFuture
                          ? "not-allowed"
                          : "pointer",
                        pointerEvents: "auto",
                        fontWeight: 700,
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
