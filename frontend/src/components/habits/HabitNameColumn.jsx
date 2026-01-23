function HabitNameColumn({ habits, deleteHabit }) {
  const HEADER_HEIGHT = 115; // must match calendar header height
  const ROW_HEIGHT = 38;

  // 🔒 HARD SAFETY
  const safeHabits = Array.isArray(habits) ? habits : [];

  function handleDelete(habit) {
    const ok = window.confirm(`Delete "${habit.title}"?`);
    if (!ok) return;
    deleteHabit(habit._id);
  }

  return (
    <>
      {/* Scoped styles */}
      <style>
        {`
          .habit-row {
            transition: background 0.15s ease;
          }

          .habit-row:hover {
            background: #f8fafc;
          }

          .trash-wrapper {
            opacity: 0;
            transition: opacity 0.15s ease;
          }

          .habit-row:hover .trash-wrapper {
            opacity: 1;
          }

          .trash-btn {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            background: #ef4444;
            color: white;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>

      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* ================= HEADER ================= */}
        <div
          style={{
            height: HEADER_HEIGHT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "15px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          DAILY HABITS
        </div>

        {/* ================= HABIT ROWS ================= */}
        {safeHabits.length === 0 ? (
          <div
            style={{
              padding: "16px",
              textAlign: "center",
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            No habits yet
          </div>
        ) : (
          safeHabits.map((habit) => (
            <div
              key={habit._id}
              className="habit-row"
              style={{
                height: ROW_HEIGHT,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 12px",
                fontSize: "13px",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              {/* Habit name */}
              <span
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  color: "#111827",
                }}
              >
                {habit.title}
              </span>

              {/* Delete */}
              <div className="trash-wrapper">
                <button
                  className="trash-btn"
                  onClick={() => handleDelete(habit)}
                  title="Delete habit"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default HabitNameColumn;
