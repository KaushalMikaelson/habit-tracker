import { useEffect, useState } from "react";

export default function TodayFocus() {
  /* ===============================
     DATE KEYS
  ================================ */
  const todayDate = new Date();
  const todayKey = todayDate.toISOString().split("T")[0];

  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(todayDate.getDate() - 1);
  const yesterdayKey = yesterdayDate.toISOString().split("T")[0];

  const TODAY_STORAGE = `today-focus-${todayKey}`;
  const YESTERDAY_STORAGE = `today-focus-${yesterdayKey}`;

  /* ===============================
     STATE (SAFE INIT)
  ================================ */
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(TODAY_STORAGE);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [text, setText] = useState("");
  const [hasCarryFromYesterday, setHasCarryFromYesterday] = useState(false);

  /* ===============================
     CHECK IF YESTERDAY HAS UNFINISHED
  ================================ */
  useEffect(() => {
    try {
      const yesterdayItems = JSON.parse(
        localStorage.getItem(YESTERDAY_STORAGE) || "[]"
      );
      setHasCarryFromYesterday(
        yesterdayItems.some((item) => !item.done)
      );
    } catch {
      setHasCarryFromYesterday(false);
    }
  }, [YESTERDAY_STORAGE]);

  /* ===============================
     SAVE TODAY (ONLY ON CHANGE)
  ================================ */
  useEffect(() => {
    localStorage.setItem(TODAY_STORAGE, JSON.stringify(items));
  }, [items, TODAY_STORAGE]);

  /* ===============================
     ACTIONS
  ================================ */
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

  /* ===============================
     MANUAL CARRY FROM YESTERDAY
  ================================ */
  function carryFromYesterday() {
  try {
    const yesterdayItems = JSON.parse(
      localStorage.getItem(YESTERDAY_STORAGE) || "[]"
    );

    const unfinished = yesterdayItems.filter((item) => !item.done);
    if (unfinished.length === 0) return;

    const existingTexts = new Set(items.map((i) => i.text));

    const carried = unfinished
      .filter((item) => !existingTexts.has(item.text))
      .map((item) => ({
        ...item,
        id: Date.now() + Math.random(),
        done: false,
      }));

    if (carried.length > 0) {
      setItems([...items, ...carried]);
    }

    /* ✅ MARK YESTERDAY AS RESOLVED */
    const updatedYesterday = yesterdayItems.map((item) =>
      item.done ? item : { ...item, done: true }
    );

    localStorage.setItem(
      YESTERDAY_STORAGE,
      JSON.stringify(updatedYesterday)
    );

    setHasCarryFromYesterday(false);
  } catch {
    // fail silently
  }
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
            <span style={styles.titleTop}>TODAY’S</span>
            <span style={styles.titleBottom}>FOCUS</span>
          </div>
        </div>

        <span style={styles.counter}>
          {items.filter((i) => !i.done).length} pending
        </span>
      </div>

      {/* Carry Button (ONLY IF NEEDED) */}
      {hasCarryFromYesterday && (
        <button
          onClick={carryFromYesterday}
          style={styles.carryBtn}
          title="Carry unfinished tasks from yesterday"
        >
          Carry unfinished from yesterday
        </button>
      )}

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
    height: "415px",
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
    alignItems: "flex-start",
    marginBottom: "10px",
  },

  titleWrap: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
  },

  titleIcon: {
    fontSize: "16px",
    marginTop: "2px",
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

  /* 🔴 RED BUTTON */
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
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: "10px",
    padding: "8px 10px",
    color: "#e5e7eb",
    fontSize: "13px",
  },

  addBtn: {
    width: "36px",
    borderRadius: "10px",
    border: "none",
    background: "#22c55e",
    color: "#020617",
    fontSize: "18px",
    cursor: "pointer",
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
    accentColor: "#22c55e"
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
