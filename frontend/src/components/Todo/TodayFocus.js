import { useState } from "react";

export default function TodayFocus() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");

  function addItem() {
    if (!text.trim()) return;

    setItems([
      ...items,
      {
        id: Date.now(),
        text,
        done: false,
      },
    ]);
    setText("");
  }

  function toggleItem(id) {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  }

  function removeItem(id) {
    setItems(items.filter((item) => item.id !== id));
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleWrap}>
          <span style={styles.titleIcon}>🎯</span>

          <div style={styles.titleText}>
            <span style={styles.titleTop}>TODAY’S</span>
            <span style={styles.titleBottom}>FOCUS</span>
          </div>
        </div>

        <span style={styles.counter}>
          {items.filter((i) => !i.done).length} pending
        </span>
      </div>

      {/* Input */}
      <div style={styles.inputRow}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add today’s focus..."
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
        />
        <button onClick={addItem} style={styles.addBtn}>
          +
        </button>
      </div>

      {/* List */}
      <div style={styles.list}>
        {items.length === 0 && (
          <div style={styles.empty}>No focus items yet</div>
        )}

        {items.map((item) => (
          <div key={item.id} style={styles.itemRow}>
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggleItem(item.id)}
              style={styles.checkbox}
            />

            <span
              style={{
                ...styles.itemText,
                textDecoration: item.done ? "line-through" : "none",
                opacity: item.done ? 0.45 : 1,
              }}
            >
              {item.text}
            </span>

            <button
              onClick={() => removeItem(item.id)}
              style={styles.deleteBtn}
              title="Delete"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===============================
   STYLES
================================ */

const styles = {
  container: {
    height: "378px",
    borderRadius: "18px",
    padding: "16px",
    background: "linear-gradient(180deg, #020617, #020617cc)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
    display: "flex",
    flexDirection: "column",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start", // ⬅️ important for multi-line title
    marginBottom: "12px",
  },

  titleWrap: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
  },

  titleIcon: {
    fontSize: "16px",
    marginTop: "2px",
    flexShrink: 0,
  },

  titleText: {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.1,
  },

  titleTop: {
    fontSize: "13px",
    letterSpacing: "1px",
    color: "#22c55e",
    fontWeight: 700,
  },

  titleBottom: {
    fontSize: "15px",
    letterSpacing: "1.2px",
    color: "#22c55e",
    fontWeight: 800,
  },

  counter: {
    fontSize: "11px",
    color: "#64748b",
    marginTop: "2px",
  },

  inputRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "12px",
    overflow: "hidden",
  },

  input: {
    flex: 1,
    minWidth: 0,
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: "10px",
    padding: "8px 10px",
    color: "#e5e7eb",
    outline: "none",
    fontSize: "13px",
  },

  addBtn: {
    width: "36px",
    minWidth: "36px",
    flexShrink: 0,
    borderRadius: "10px",
    border: "none",
    background: "#22c55e",
    color: "#020617",
    fontSize: "18px",
    cursor: "pointer",
    boxShadow: "0 0 10px rgba(34,197,94,0.5)",
  },

  list: {
    flex: 1,
    overflowY: "auto",
    paddingRight: "4px",
  },

  empty: {
    textAlign: "center",
    fontSize: "12px",
    color: "#475569",
    marginTop: "24px",
  },

  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 0",
  },

  checkbox: {
    cursor: "pointer",
  },

  itemText: {
    flex: 1,
    fontSize: "13px",
    color: "#e5e7eb",
  },

  deleteBtn: {
    border: "none",
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
    fontSize: "14px",
  },
};
