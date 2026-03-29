import { isDateAccessible } from "../../utils/habitUtils";

const DAY_COLUMN_WIDTH = 34; // px

function DashboardGrid({
  habits,
  monthDates,
  today,
  toggleHabit,
  gridScrollRef,
  isFutureDate,
  theme, // ✅ RECEIVE THEME
  monthLabel,
  goToPreviousMonth,
  goToNextMonth,
  setTheme,
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
        .dash-nav-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
          transition: all 0.18s cubic-bezier(.4,0,.2,1);
        }
        .dash-nav-btn-dark {
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          color: #94a3b8;
        }
        .dash-nav-btn-dark:hover {
          background: rgba(255,255,255,0.12);
          color: #f1f5f9;
          transform: scale(1.08);
        }
        .dash-nav-btn-dark:active { transform: scale(0.95); }
        .dash-nav-btn-light {
          border: 1px solid #e5e7eb;
          background: #ffffff;
          color: #374151;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }
        .dash-nav-btn-light:hover {
          background: #f9fafb;
          transform: scale(1.08);
        }
        .dash-nav-btn-light:active { transform: scale(0.95); }
        .theme-toggle-btn {
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .theme-toggle-dark {
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: #64748b;
        }
        .theme-toggle-dark:hover {
          background: rgba(255,255,255,0.1);
          color: #94a3b8;
        }
        .theme-toggle-light {
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          color: #6b7280;
        }
        .theme-toggle-light:hover {
          background: #f3f4f6;
          color: #374151;
        }
        .habit-cell-btn {
          width: 26px;
          height: 26px;
          border-radius: 8px;
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
          background: rgba(255,255,255,0.035);
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
        .habit-cell-btn.paused-dark {
          background: rgba(167,139,250,0.15);
          color: transparent;
          cursor: not-allowed;
        }
        .habit-cell-btn.paused-light {
          background: rgba(167,139,250,0.25);
          color: transparent;
          cursor: not-allowed;
        }
        .habit-cell-btn:not(:disabled):hover {
          transform: scale(1.15);
        }
        
        /* RESPONSIVE HEADER CLASSES */
        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 53px;
          padding: 0 24px;
          background: transparent;
          box-sizing: border-box;
        }
        .dash-nav-pill {
          display: flex;
          align-items: center;
          border-radius: 14px;
          padding: 6px;
          gap: 16px;
        }
        .dash-month-label {
          width: 120px;
          text-align: center;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        @media (max-width: 768px) {
          .dash-header {
            padding: 0 8px;
          }
          .dash-nav-pill {
            gap: 6px;
            padding: 4px;
          }
          .dash-nav-btn {
            width: 28px;
            height: 28px;
            border-radius: 6px;
          }
          .dash-month-label {
            width: auto;
            min-width: 50px;
            font-size: 11px; /* Slightly larger than 10px if we drop the year */
            letter-spacing: 0.05em;
          }
          .dash-year-text {
            display: none; /* Hide the year on small screens */
          }
          .theme-toggle-btn {
            padding: 6px 10px;
            font-size: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .theme-text {
            display: none; /* Hide 'Light' or 'Dark' strings on mobile */
          }
          .theme-icon {
            font-size: 14px; /* Slightly larger icon */
          }
        }
        
        @media (max-width: 480px) {
          .header-spacer {
            display: none; /* Let pill align left to prevent squishing */
          }
          .dash-month-label {
            font-size: 11px;
            min-width: 40px;
          }
          .theme-toggle-btn {
            padding: 5px 8px;
          }
        }
      `}</style>

      <div
        style={{
          background: isDark
            ? "#020617"
            : "#ffffff",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: isDark
            ? "inset 0 0 0 1px rgba(255,255,255,0.06)"
            : "0 1px 3px rgba(0,0,0,0.08)",
          border: isDark ? "none" : "1px solid #e5e7eb",
        }}
      >
        {/* INTEGRATED HEADER */}
        <div className="dash-header">
          {/* LEFT: Empty space equivalent for centering */}
          <div style={{ flex: 1 }} className="header-spacer" />

          {/* CENTER: Pill navigation */}
          <div
            className="dash-nav-pill"
            style={{
              background: isDark ? "rgba(255,255,255,0.03)" : "#f1f5f9",
              border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <button
              onClick={goToPreviousMonth}
              aria-label="Previous month"
              className={`dash-nav-btn ${isDark ? "dash-nav-btn-dark" : "dash-nav-btn-light"}`}
            >
              ‹
            </button>

            <div
              className="dash-month-label"
              style={{
                color: isDark ? "#60a5fa" : "#1e40af",
              }}
            >
              {typeof monthLabel === 'string' && monthLabel.includes(' ') ? (
                <>
                  <span>{monthLabel.split(' ')[0]}</span>
                  <span className="dash-year-text"> {monthLabel.split(' ').slice(1).join(' ')}</span>
                </>
              ) : (
                monthLabel
              )}
            </div>

            <button
              onClick={goToNextMonth}
              aria-label="Next month"
              className={`dash-nav-btn ${isDark ? "dash-nav-btn-dark" : "dash-nav-btn-light"}`}
            >
              ›
            </button>
          </div>

          {/* RIGHT: Theme Toggle */}
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", paddingRight: "4px" }}>
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`theme-toggle-btn ${isDark ? "theme-toggle-dark" : "theme-toggle-light"}`}
            >
              <span className="theme-icon">{isDark ? "☀" : "☾"}</span>
              <span className="theme-text"> {isDark ? "Light" : "Dark"}</span>
            </button>
          </div>
        </div>


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
                        ? isDark ? "rgba(96,165,250,0.12)" : "#eff6ff"
                        : "transparent",
                      borderBottom: !isToday
                        ? isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #f1f5f9"
                        : "none",
                      borderRadius: isToday ? "8px 8px 0 0" : "0",
                      margin: "0",
                      height: "100%",
                      position: "relative",
                      boxSizing: "border-box",
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
                }}
              >
                {safeMonthDates.map((date) => {
                  const completedDates = Array.isArray(habit.completedDates)
                    ? habit.completedDates
                    : [];
                  const isCompleted = completedDates.includes(date);
                  const isFuture = isFutureDate(date);
                  const isBeforeCreation = !isDateAccessible(habit, date);
                  const isPaused = habit.status === "paused";
                  const isDisabled = isFuture || isBeforeCreation || isPaused;
                  const isToday = date === today;
                  const isWeekend = [0, 6].includes(new Date(date).getDay());
                  const isWeekStart = new Date(date).getDay() === 0;

                  let cellClass = "";
                  if (isCompleted) {
                    cellClass = "completed";
                  } else if (isPaused) {
                    cellClass = isDark ? "paused-dark" : "paused-light";
                  } else if (isFuture || isBeforeCreation) {
                    cellClass = isDark ? "future-dark" : "future-light";
                  } else {
                    cellClass = isDark ? "pending-dark" : "pending-light";
                  }

                  let titleText = "Mark complete";
                  if (isCompleted) titleText = "Mark incomplete";
                  else if (isPaused) titleText = "Habit is paused";
                  else if (isBeforeCreation) titleText = "Before creation";
                  else if (isFuture) titleText = "Future date";

                  return (
                    <div
                      key={date}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isToday
                          ? isDark ? "rgba(96,165,250,0.12)" : "rgba(37,99,235,0.04)"
                          : isWeekend
                            ? isDark ? "rgba(255,255,255,0.02)" : "#fafafa"
                            : "transparent",
                        borderLeft: isWeekStart
                          ? isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #e2e8f0"
                          : "none",
                        pointerEvents: "none",
                      }}
                    >
                      <button
                        disabled={isDisabled}
                        onClick={() => !isDisabled && toggleHabit(habit._id, date)}
                        className={`habit-cell-btn ${cellClass}`}
                        style={{ pointerEvents: "auto" }}
                        title={titleText}
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
