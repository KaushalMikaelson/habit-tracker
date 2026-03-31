import { useCallback, useEffect, useRef, useState } from "react";
import { fetchUserData, saveReminders } from "../../api/userdata";

export default function TodoNotes() {
  /* ===============================
     STATE
  ================================ */
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  /* ===============================
     LOAD FROM BACKEND ON MOUNT
  ================================ */
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchUserData();
        setItems(data.reminders || []);
      } catch {
        setError("Failed to load reminders.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ===============================
     DEBOUNCED SAVE TO BACKEND
  ================================ */
  const saveTimer = useRef(null);

  const persistItems = useCallback((newItems) => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        await saveReminders(newItems);
      } catch {
        // fail silently
      } finally {
        setSaving(false);
      }
    }, 600);
  }, []);

  /* ===============================
     ACTIONS
  ================================ */
  function addItem() {
    if (!text.trim()) return;
    const newItem = { id: Date.now(), text: text.trim(), done: false };
    const updated = [...items, newItem];
    setItems(updated);
    setText("");
    persistItems(updated);
  }

  function toggleItem(id) {
    const updated = items.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    setItems(updated);
    persistItems(updated);
  }

  function removeItem(id) {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    persistItems(updated);
  }

  /* ===============================
     UI
  ================================ */
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>📝 REMINDERS</h3>
        <div style={styles.headerRight}>
          {saving && <span style={styles.savingDot} title="Saving…">●</span>}
          <span style={styles.counter}>
            {items.filter((i) => !i.done).length} left
          </span>
        </div>
      </div>

      {/* Error */}
      {error && <div style={styles.errorBar}>{error}</div>}

      {/* Input */}
      <div style={styles.inputRow}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a reminder..."
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          disabled={loading}
        />
        <button onClick={addItem} style={styles.addBtn} disabled={loading}>
          +
        </button>
      </div>

      {/* List */}
      <div style={styles.list}>
        {loading && <div style={styles.empty}>Loading…</div>}

        {!loading && items.length === 0 && (
          <div style={styles.empty}>No reminders yet</div>
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
    height: "415px",
    borderRadius: "18px",
    padding: "16px",
    background: "#020617",
    boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
    display: "flex",
    flexDirection: "column",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },

  title: {
    color: "#93c5fd",
    letterSpacing: "1px",
    fontSize: "14px",
    margin: 0,
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  savingDot: {
    fontSize: "10px",
    color: "#93c5fd",
    animation: "pulse 1s infinite",
  },

  counter: {
    fontSize: "11px",
    color: "#64748b",
  },

  errorBar: {
    fontSize: "11px",
    color: "#f87171",
    background: "#1f1010",
    borderRadius: "8px",
    padding: "6px 10px",
    marginBottom: "8px",
  },

  inputRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "12px",
  },

  input: {
    flex: 1,
    background: "#1A2031",
    border: "1px solid #1e293b",
    borderRadius: "10px",
    padding: "8px 10px",
    color: "#e5e7eb",
    outline: "none",
    fontSize: "13px",
  },

  addBtn: {
    width: "36px",
    borderRadius: "10px",
    border: "none",
    background: "#22c55e",
    color: "#ffffff",
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

  checkbox: { cursor: "pointer", accentColor: "#93c5fd" },

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
