import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ================= Sortable Row ================= */

function SortableHabitRow({ habit, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ attributes, listeners })}
    </div>
  );
}

/* ================= Habit Column ================= */

function HabitNameColumn({ habits, deleteHabit, editHabit }) {
  const HEADER_HEIGHT = 115;
  const ROW_HEIGHT = 38;

  const safeHabits = Array.isArray(habits) ? habits : [];

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  function handleDelete(habit) {
    if (window.confirm(`Delete "${habit.title}"?`)) {
      deleteHabit(habit._id);
    }
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
    if (trimmed && trimmed !== habit.title) {
      editHabit(habit._id, trimmed);
    }
    cancelEdit();
  }

  return (
    <>
      <style>{`
        .habit-name-row {
          transition: background 0.15s ease;
          position: relative;
        }
        .habit-name-row::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #2563eb;
          opacity: 0;
          transition: opacity 0.15s ease;
          border-radius: 0 2px 2px 0;
        }
        .habit-name-row:hover {
          background: rgba(255,255,255,0.04);
        }
        .habit-name-row:hover::before {
          opacity: 1;
        }
        .habit-action-group {
          display: flex;
          gap: 5px;
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .habit-name-row:hover .habit-action-group {
          opacity: 1;
        }
        .habit-icon-btn {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s ease, background 0.15s ease;
        }
        .habit-icon-btn:hover {
          transform: scale(1.1);
        }
        .habit-edit-btn {
          background: rgba(34,197,94,0.15);
          color: #22c55e;
          border: 1px solid rgba(34,197,94,0.2);
        }
        .habit-edit-btn:hover {
          background: rgba(34,197,94,0.25);
        }
        .habit-delete-btn {
          background: rgba(239,68,68,0.12);
          color: #f87171;
          border: 1px solid rgba(239,68,68,0.2);
        }
        .habit-delete-btn:hover {
          background: rgba(239,68,68,0.22);
        }
        .habit-confirm-btn {
          background: rgba(34,197,94,0.15);
          color: #22c55e;
          border: 1px solid rgba(34,197,94,0.2);
        }
        .habit-cancel-btn {
          background: rgba(255,255,255,0.06);
          color: #94a3b8;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .habit-edit-input {
          width: 100%;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(37,99,235,0.4);
          border-radius: 6px;
          padding: 4px 8px;
          color: #f1f5f9;
          font-size: 13px;
          font-family: 'Inter', sans-serif;
          outline: none;
          box-shadow: 0 0 0 2px rgba(37,99,235,0.15);
        }
        .drag-handle-dots {
          cursor: grab;
          color: #334155;
          font-size: 13px;
          padding-right: 6px;
          user-select: none;
          transition: color 0.15s ease;
          line-height: 1;
        }
        .habit-name-row:hover .drag-handle-dots {
          color: #64748b;
        }
        .drag-handle-dots:active {
          cursor: grabbing;
        }
      `}</style>

      <div
        style={{
          background: "linear-gradient(180deg, #020617, rgba(2,6,23,0.9))",
          borderRadius: "16px",
          overflow: "hidden",
          color: "#e5e7eb",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            height: HEADER_HEIGHT,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{
            width: "28px",
            height: "28px",
            borderRadius: "8px",
            background: "rgba(37,99,235,0.15)",
            border: "1px solid rgba(37,99,235,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
          }}>
            ◈
          </div>
          <div style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.16em",
            color: "#475569",
            textTransform: "uppercase",
          }}>
            Habits
          </div>
        </div>

        {/* HABIT ROWS */}
        {safeHabits.length === 0 ? (
          <div style={{
            padding: "20px 16px",
            textAlign: "center",
            fontSize: "12px",
            color: "#334155",
          }}>
            No habits yet
          </div>
        ) : (
          safeHabits.map((habit) => {
            const isEditing = editingId === habit._id;

            return (
              <SortableHabitRow key={habit._id} habit={habit}>
                {({ attributes, listeners }) => (
                  <div
                    className="habit-name-row"
                    style={{
                      height: ROW_HEIGHT,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 10px 0 12px",
                      fontSize: "13px",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      gap: "6px",
                    }}
                  >
                    {/* DRAG HANDLE */}
                    <div
                      className="drag-handle-dots"
                      {...attributes}
                      {...listeners}
                    >
                      ⠿
                    </div>

                    {/* NAME / INPUT */}
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      {isEditing ? (
                        <input
                          className="habit-edit-input"
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit(habit);
                            if (e.key === "Escape") cancelEdit();
                          }}
                        />
                      ) : (
                        <span style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "block",
                          color: "#cbd5e1",
                          fontWeight: 500,
                        }}>
                          {habit.title}
                        </span>
                      )}
                    </div>

                    {/* ACTIONS */}
                    {isEditing ? (
                      <div className="habit-action-group" style={{ opacity: 1 }}>
                        <button className="habit-icon-btn habit-confirm-btn" onClick={() => saveEdit(habit)} title="Save">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </button>
                        <button className="habit-icon-btn habit-cancel-btn" onClick={cancelEdit} title="Cancel">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="habit-action-group">
                        <button className="habit-icon-btn habit-edit-btn" onClick={() => startEdit(habit)} title="Edit">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button className="habit-icon-btn habit-delete-btn" onClick={() => handleDelete(habit)} title="Delete">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </SortableHabitRow>
            );
          })
        )}
      </div>
    </>
  );
}

export default HabitNameColumn;
