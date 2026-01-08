function HabitNameColumn({ habits, deleteHabit }) {
  const ROW_HEIGHT = 38;

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

          /* Container for glossy button */
          .trash-wrapper {
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 0.15s ease, transform 0.15s ease;
          }

          .habit-row:hover .trash-wrapper {
            opacity: 1;
            transform: scale(1);
          }

          /* Glossy trash button */
          .trash-btn {
            width: 26px;
            height: 26px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            background: radial-gradient(
              circle at top left,
              #ffb4b4,
              #ef4444 45%,
              #b91c1c 100%
            );
            box-shadow:
              inset 0 2px 3px rgba(255, 255, 255, 0.5),
              inset 0 -2px 3px rgba(0, 0, 0, 0.25),
              0 2px 6px rgba(0, 0, 0, 0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.1s ease, box-shadow 0.1s ease;
          }

          .trash-btn:hover {
            transform: scale(1.08);
            box-shadow:
              inset 0 2px 3px rgba(255, 255, 255, 0.6),
              inset 0 -2px 3px rgba(0, 0, 0, 0.3),
              0 4px 10px rgba(0, 0, 0, 0.3);
          }

          .trash-btn:active {
            transform: scale(0.95);
          }

          .trash-icon {
            font-size: 14px;
            color: white;
            line-height: 1;
          }
        `}
      </style>

      <div
        style={{
          width: "200px",
          flexShrink: 0,
          borderRight: "1px solid #e5e7eb",
          background: "#ffffff",
        }}
      >
        {habits.map((habit) => (
          <div
            key={habit._id}
            className="habit-row"
            style={{
              height: ROW_HEIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 12px",
              borderBottom: "1px solid #f1f5f9",
              fontSize: "14px",
            }}
          >
            {/* Habit title */}
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

            {/* Glossy trash icon */}
            <div className="trash-wrapper">
              <button
                className="trash-btn"
                onClick={() => handleDelete(habit)}
                title="Delete habit"
              >
                <span className="trash-icon">🗑</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
export default HabitNameColumn;