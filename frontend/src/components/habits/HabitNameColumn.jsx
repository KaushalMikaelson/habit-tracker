import { useState } from "react";

function HabitNameColumn({ habits, deleteHabit, editHabit }) {
  const HEADER_HEIGHT = 115;
  const ROW_HEIGHT = 38;

  const safeHabits = Array.isArray(habits) ? habits : [];

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  function handleDelete(habit) {
    const ok = window.confirm(`Delete "${habit.title}"?`);
    if (!ok) return;
    deleteHabit(habit._id);
  }

  function startEdit(habit) {
    setEditingId(habit._id);
    setEditValue(habit.title);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue("");
  }

  function saveEdit(habit) {
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === habit.title) {
      cancelEdit();
      return;
    }
    editHabit(habit._id, trimmed);
    cancelEdit();
  }

  return (
    <>
      {/* ================= Scoped Styles ================= */}
      <style>
        {`
          .habit-row {
            transition: background 0.15s ease;
          }

          .habit-row:hover {
            background: rgba(255,255,255,0.06);
          }

          .action-wrapper {
            display: flex;
            gap: 6px;
            opacity: 0;
            transition: opacity 0.15s ease;
          }

          .habit-row:hover .action-wrapper {
            opacity: 1;
          }

          .icon-btn {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .edit-btn {
            background: #22c55e;
            color: #020617;
            font-weight: 700;
          }

          .trash-btn {
            background: #ef4444;
            color: white;
          }

          .edit-input {
            width: 100%;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 6px;
            padding: 4px 6px;
            color: #e5e7eb;
            font-size: 13px;
            outline: none;
          }
        `}
      </style>

      <div
        style={{
          background: "linear-gradient(180deg, #020617, #020617cc)",
          borderRadius: "16px",
          overflow: "hidden",
          color: "#e5e7eb",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* ================= HEADER ================= */}
        <div
          style={{
            height: HEADER_HEIGHT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "0.14em",
            color: "#93c5fd",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
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
              fontSize: "12px",
              color: "#9ca3af",
            }}
          >
            No habits yet
          </div>
        ) : (
          safeHabits.map((habit) => {
            const isEditing = editingId === habit._id;

            return (
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
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  gap: "8px",
                }}
              >
                {/* Name / Input */}
                <div style={{ flex: 1, overflow: "hidden" }}>
                  {isEditing ? (
                    <input
                      className="edit-input"
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(habit);
                        if (e.key === "Escape") cancelEdit();
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block",
                      }}
                    >
                      {habit.title}
                    </span>
                  )}
                </div>

                {/* Actions */}
                {isEditing ? (
                  <div className="action-wrapper" style={{ opacity: 1 }}>
                    <button
                      className="icon-btn edit-btn"
                      title="Save"
                      onClick={() => saveEdit(habit)}
                    >
                      ✓
                    </button>
                    <button
                      className="icon-btn trash-btn"
                      title="Cancel"
                      onClick={cancelEdit}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="action-wrapper">
                    <button
                      className="icon-btn edit-btn"
                      title="Edit habit"
                      onClick={() => startEdit(habit)}
                    >
                      ✎
                    </button>
                    <button
                      className="icon-btn trash-btn"
                      title="Delete habit"
                      onClick={() => handleDelete(habit)}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

export default HabitNameColumn;
