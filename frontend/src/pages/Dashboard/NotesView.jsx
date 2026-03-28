import { useState, useMemo } from "react";
import dayjs from "dayjs";

const CATEGORY_COLORS = {
  Health: "#34d399",
  Work: "#60a5fa",
  Mindfulness: "#a78bfa",
  Learning: "#fb923c",
  Household: "#f472b6",
  General: "#94a3b8",
};

function getCategoryColor(cat) {
  return CATEGORY_COLORS[cat] || "#94a3b8";
}

export default function NotesView({ habits = [], updateNote }) {
  const [search, setSearch] = useState("");
  const [selectedHabit, setSelectedHabit] = useState("all");
  const [editingKey, setEditingKey] = useState(null); // `${habitId}__${date}`
  const [editValue, setEditValue] = useState("");

  // Flatten all notes from all habits into a sortable list
  const allNotes = useMemo(() => {
    const entries = [];
    for (const habit of habits) {
      const notes = habit.notes || {};
      for (const [date, note] of Object.entries(notes)) {
        if (note && note.trim()) {
          entries.push({
            habitId: habit._id,
            habitTitle: habit.title,
            habitCategory: habit.category || "General",
            date,
            note,
            key: `${habit._id}__${date}`,
          });
        }
      }
    }
    return entries.sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
  }, [habits]);

  const filtered = useMemo(() => {
    return allNotes.filter((e) => {
      if (selectedHabit !== "all" && e.habitId !== selectedHabit) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !e.note.toLowerCase().includes(q) &&
          !e.habitTitle.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [allNotes, selectedHabit, search]);

  // Group by date
  const grouped = useMemo(() => {
    const map = {};
    for (const e of filtered) {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    }
    return map;
  }, [filtered]);

  const sortedDates = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1));

  function startEdit(entry) {
    setEditingKey(entry.key);
    setEditValue(entry.note);
  }

  function cancelEdit() {
    setEditingKey(null);
    setEditValue("");
  }

  async function saveEdit(entry) {
    await updateNote(entry.habitId, entry.date, editValue.trim());
    setEditingKey(null);
    setEditValue("");
  }

  async function deleteNote(entry) {
    await updateNote(entry.habitId, entry.date, "");
  }

  function formatDateLabel(dateStr) {
    const d = dayjs(dateStr);
    const today = dayjs().format("YYYY-MM-DD");
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";
    return d.format("ddd, MMM D · YYYY");
  }

  const hasNotes = allNotes.length > 0;

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "32px",
        maxWidth: "860px",
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        @keyframes noteIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .note-card {
          animation: noteIn 0.2s ease both;
          transition: border-color 0.15s ease;
        }
        .note-card:hover {
          border-color: rgba(255,255,255,0.12) !important;
        }
        .note-action-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 5px;
          border-radius: 6px;
          color: #64748b;
          display: flex;
          align-items: center;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .note-action-btn:hover {
          background: rgba(255,255,255,0.06);
          color: #f1f5f9;
        }
        .note-action-btn.danger:hover {
          background: rgba(239,68,68,0.1);
          color: #f87171;
        }
        .notes-search:focus {
          border-color: rgba(96,165,250,0.4) !important;
          box-shadow: 0 0 0 3px rgba(96,165,250,0.1) !important;
        }
        .notes-textarea {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(96,165,250,0.4);
          border-radius: 8px;
          padding: 10px 12px;
          color: #f1f5f9;
          font-family: inherit;
          font-size: 14px;
          resize: vertical;
          outline: none;
          box-sizing: border-box;
          min-height: 80px;
          line-height: 1.5;
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#f1f5f9", margin: "0 0 6px 0" }}>
          📝 Notes
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
          Your habit journal — daily reflections and thoughts
        </p>
      </div>

      {/* ── Filters ── */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
          <svg
            width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          >
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="notes-search"
            placeholder="Search notes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 36px 10px 36px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "#f1f5f9",
              fontSize: "14px",
              fontFamily: "inherit",
              outline: "none",
              transition: "border 0.2s ease, box-shadow 0.2s ease",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                background: "transparent", border: "none", color: "#64748b", cursor: "pointer",
                padding: "2px", display: "flex", alignItems: "center", justifyContent: "center"
              }}
              title="Clear search"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {/* Habit filter */}
        <select
          value={selectedHabit}
          onChange={(e) => setSelectedHabit(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            color: selectedHabit === "all" ? "#64748b" : "#f1f5f9",
            fontSize: "14px",
            fontFamily: "inherit",
            outline: "none",
            cursor: "pointer",
            minWidth: "160px",
          }}
        >
          <option value="all">All habits</option>
          {habits.map((h) => (
            <option key={h._id} value={h._id}>
              {h.title}
            </option>
          ))}
        </select>

        {/* Note count badge */}
        <div style={{
          display: "flex", alignItems: "center", padding: "0 16px",
          borderRadius: "10px", background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          fontSize: "13px", fontWeight: 600, color: "#64748b",
          whiteSpace: "nowrap",
        }}>
          {filtered.length} {filtered.length === 1 ? "note" : "notes"}
        </div>
      </div>

      {/* ── Empty state (no notes at all) ── */}
      {!hasNotes && (
        <div style={{
          textAlign: "center", padding: "80px 24px",
          border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "16px",
        }}>
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>📓</div>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: 700, color: "#f1f5f9" }}>
            No notes yet
          </h3>
          <p style={{ margin: 0, fontSize: "14px", color: "#64748b", maxWidth: "340px", marginInline: "auto" }}>
            Open any habit from the Dashboard to add a daily journal note. Your reflections will appear here.
          </p>
        </div>
      )}

      {/* ── No search results ── */}
      {hasNotes && filtered.length === 0 && (
        <div style={{
          textAlign: "center", padding: "60px 24px",
          border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "16px",
        }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
          <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
            No notes match your search.
          </p>
        </div>
      )}

      {/* ── Notes grouped by date ── */}
      {sortedDates.map((date) => (
        <div key={date} style={{ marginBottom: "32px" }}>
          {/* Date header */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            marginBottom: "12px",
          }}>
            <span style={{
              fontSize: "13px", fontWeight: 700, color: "#94a3b8",
              letterSpacing: "0.02em",
            }}>
              {formatDateLabel(date)}
            </span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
            <span style={{ fontSize: "11px", color: "#475569" }}>
              {dayjs(date).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD") ? "" : dayjs(date).format("MMM D, YYYY")}
            </span>
          </div>

          {/* Notes for this date */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {grouped[date].map((entry) => {
              const isEditing = editingKey === entry.key;
              const catColor = getCategoryColor(entry.habitCategory);

              return (
                <div
                  key={entry.key}
                  className="note-card"
                  style={{
                    background: "#020617",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "14px",
                    padding: "18px 20px",
                    borderLeft: `3px solid ${catColor}`,
                  }}
                >
                  {/* Habit name + category */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginBottom: "10px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "8px", height: "8px", borderRadius: "50%",
                        background: catColor, flexShrink: 0,
                      }} />
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#f1f5f9" }}>
                        {entry.habitTitle}
                      </span>
                      <span style={{
                        fontSize: "11px", fontWeight: 600, color: catColor,
                        background: catColor + "18", padding: "2px 8px",
                        borderRadius: "20px",
                      }}>
                        {entry.habitCategory}
                      </span>
                    </div>

                    {/* Actions */}
                    {!isEditing && (
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button
                          className="note-action-btn"
                          onClick={() => {
                            navigator.clipboard.writeText(entry.note);
                            // Optional small visual feedback can be added here
                          }}
                          title="Copy text"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                          </svg>
                        </button>
                        <button
                          className="note-action-btn"
                          onClick={() => startEdit(entry)}
                          title="Edit note"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          className="note-action-btn danger"
                          onClick={() => deleteNote(entry)}
                          title="Delete note"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Note body */}
                  {isEditing ? (
                    <div>
                      <textarea
                        className="notes-textarea"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                        <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>
                          {editValue.length} chars • {editValue.trim() ? editValue.trim().split(/\s+/).length : 0} words
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={cancelEdit}
                            style={{
                              padding: "7px 14px", borderRadius: "8px",
                              background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                              color: "#94a3b8", fontSize: "12px", fontWeight: 600,
                              cursor: "pointer", fontFamily: "inherit",
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => saveEdit(entry)}
                            disabled={!editValue.trim()}
                            style={{
                              padding: "7px 16px", borderRadius: "8px",
                              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                              border: "none", color: "#fff", fontSize: "12px",
                              fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p style={{
                      margin: 0, fontSize: "14px", color: "#cbd5e1",
                      lineHeight: "1.6", whiteSpace: "pre-wrap",
                    }}>
                      {entry.note}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
