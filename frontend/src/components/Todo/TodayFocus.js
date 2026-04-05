import { useCallback, useEffect, useRef, useState } from "react";
import { fetchUserData, saveFocusItems } from "../../api/userdata";

/* ===============================
   DATE HELPERS
================================ */
const todayDate = new Date();
const todayKey = todayDate.toISOString().split("T")[0];

const yesterdayDate = new Date(todayDate);
yesterdayDate.setDate(todayDate.getDate() - 1);
const yesterdayKey = yesterdayDate.toISOString().split("T")[0];

export default function TodayFocus() {
  /* ===============================
     STATE
  ================================ */
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [hasCarryFromYesterday, setHasCarryFromYesterday] = useState(false);
  const [yesterdayItems, setYesterdayItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Ref to hold ALL focusItems from backend (all dates) so we can do
  // targeted updates without wiping other days' data
  const allFocusRef = useRef([]);

  /* ===============================
     LOAD FROM BACKEND ON MOUNT
  ================================ */
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchUserData();
        const all = data.focusItems || [];
        allFocusRef.current = all;

        const todayItems = all.filter((i) => i.date === todayKey);
        const yItems = all.filter((i) => i.date === yesterdayKey && !i.done);

        const existingTexts = new Set(todayItems.map((i) => i.text));
        const uncarriedYItems = yItems.filter((i) => !existingTexts.has(i.text));

        setItems(todayItems);
        setYesterdayItems(uncarriedYItems);
        setHasCarryFromYesterday(uncarriedYItems.length > 0);
      } catch (err) {
        setError("Failed to load focus items.");
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
        await saveFocusItems(newItems, todayKey);
      } catch {
        // fail silently – data is still in state
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
    const newItem = { id: Date.now(), text: text.trim(), done: false, date: todayKey };
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
     CARRY FROM YESTERDAY
  ================================ */
  async function carryFromYesterday() {
    const existingTexts = new Set(items.map((i) => i.text));
    const toCarry = yesterdayItems
      .filter((i) => !existingTexts.has(i.text))
      .map((i) => ({ ...i, id: Date.now() + Math.random(), done: false, date: todayKey }));

    if (toCarry.length === 0) {
      setHasCarryFromYesterday(false);
      return;
    }

    const updated = [...items, ...toCarry];
    setItems(updated);
    setHasCarryFromYesterday(false);
    persistItems(updated);
  }

  /* ===============================
     UI
  ================================ */
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleWrap}>
          <span style={styles.titleIcon}>🎯</span>
          <div style={styles.titleText}>
            <span style={styles.titleTop}>TODAY'S</span>
            <span style={styles.titleBottom}>FOCUS</span>
          </div>
        </div>

        <div style={styles.headerRight}>
          {saving && <span style={styles.savingDot} title="Saving…">●</span>}
          <span style={styles.counter}>
            {items.filter((i) => !i.done).length} pending
          </span>
        </div>
      </div>

      {/* Error */}
      {error && <div style={styles.errorBar}>{error}</div>}

      {/* Carry Button */}
      {hasCarryFromYesterday && (
        <button
          onClick={carryFromYesterday}
          style={styles.carryBtn}
          title="Carry unfinished tasks from yesterday"
        >
          ↩ Carry unfinished from yesterday
        </button>
      )}

      {/* Input */}
      <div style={styles.inputRow}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add today's focus..."
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
    alignItems: "flex-start",
    marginBottom: "10px",
  },

  titleWrap: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
  },

  titleIcon: { fontSize: "16px", marginTop: "2px" },

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

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  savingDot: {
    fontSize: "10px",
    color: "#22c55e",
    animation: "pulse 1s infinite",
  },

  counter: { fontSize: "11px", color: "#64748b", marginTop: "2px" },

  errorBar: {
    fontSize: "11px",
    color: "#f87171",
    background: "#1f1010",
    borderRadius: "8px",
    padding: "6px 10px",
    marginBottom: "8px",
  },

  carryBtn: {
    marginBottom: "10px",
    padding: "6px 10px",
    fontSize: "11px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #ef4444, #b91c1c)",
    color: "#ffffff",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(239,68,68,0.45)",
    alignSelf: "flex-start",
  },

  inputRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "12px",
    overflow: "hidden",
  },

  input: {
    flex: 1,
    background: "#1A2031",
    border: "1px solid #1e293b",
    borderRadius: "10px",
    padding: "8px 10px",
    color: "#e5e7eb",
    fontSize: "13px",
    outline: "none",
  },

  addBtn: {
    width: "36px",
    borderRadius: "10px",
    border: "none",
    background: "#22c55e",
    color: "#ffffff",
    fontSize: "18px",
    cursor: "pointer",
  },

  list: { flex: 1, overflowY: "auto", paddingRight: "4px" },

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

  checkbox: { cursor: "pointer", accentColor: "#22c55e" },

  itemText: { flex: 1, fontSize: "13px", color: "#e5e7eb" },

  deleteBtn: {
    border: "none",
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
    fontSize: "14px",
  },
};
