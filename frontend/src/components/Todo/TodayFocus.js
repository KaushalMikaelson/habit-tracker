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

export default function TodayFocus({ user, activeView }) {
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
     LOAD PLANNER FOCUS ITEMS
  ================================ */
  const getPlannerTasks = useCallback(() => {
    try {
      const storageKey = `planner_data_${user?.email || "guest"}`;
      const rawData = localStorage.getItem(storageKey);
      if (!rawData) return [];
      const data = JSON.parse(rawData);
      const todayData = data.daily?.[todayKey];
      if (!todayData) return [];

      const smart = todayData.smartTasks || { deepWork: [], important: [], quick: [] };
      const blocks = todayData.timeBlocks || { morning: [], afternoon: [], evening: [] };

      const tasks = [];
      
      // Add smart tasks
      ["deepWork", "important", "quick"].forEach(cat => {
        const list = smart[cat] || [];
        const catLabel = cat === "deepWork" ? "🔴 Deep Work" : cat === "important" ? "🟡 Important" : "⚪ Quick Task";
        const catColor = cat === "deepWork" ? "#ef4444" : cat === "important" ? "#eab308" : "#94a3b8";
        list.forEach(t => {
          tasks.push({
            id: t.id,
            text: t.text,
            done: t.done,
            date: todayKey,
            isFromPlanner: true,
            plannerType: "smart",
            plannerCategory: cat,
            categoryLabel: catLabel,
            categoryColor: catColor
          });
        });
      });

      // Add time block tasks
      ["morning", "afternoon", "evening"].forEach(bk => {
        const list = blocks[bk] || [];
        const bkLabel = bk === "morning" ? "🌅 Morning" : bk === "afternoon" ? "☀️ Afternoon" : "🌇 Evening";
        const bkColor = "#10b981"; // Emerald green for time blocks
        list.forEach(t => {
          tasks.push({
            id: t.id,
            text: `[${t.time}] ${t.text}`,
            done: t.done,
            date: todayKey,
            isFromPlanner: true,
            plannerType: "timeBlock",
            plannerCategory: bk,
            categoryLabel: bkLabel,
            categoryColor: bkColor
          });
        });
      });

      return tasks;
    } catch (e) {
      console.error("Failed to load planner focus items", e);
      return [];
    }
  }, [user?.email]);

  /* ===============================
     LOAD FROM BACKEND + PLANNER
  ================================ */
  const loadData = useCallback(async () => {
    try {
      const data = await fetchUserData();
      const all = data.focusItems || [];
      allFocusRef.current = all;

      const todayItems = all.filter((i) => i.date === todayKey);
      const yItems = all.filter((i) => i.date === yesterdayKey && !i.done);

      const existingTexts = new Set(todayItems.map((i) => i.text));
      const uncarriedYItems = yItems.filter((i) => !existingTexts.has(i.text));

      const plannerTasks = getPlannerTasks();

      setItems([...todayItems, ...plannerTasks]);
      setYesterdayItems(uncarriedYItems);
      setHasCarryFromYesterday(uncarriedYItems.length > 0);
    } catch (err) {
      setError("Failed to load focus items.");
    } finally {
      setLoading(false);
    }
  }, [getPlannerTasks]);

  useEffect(() => {
    loadData();

    // Set up local storage listeners
    const handlePlannerUpdate = () => {
      const pTasks = getPlannerTasks();
      setItems(prevItems => {
        const customItems = prevItems.filter(i => !i.isFromPlanner);
        return [...customItems, ...pTasks];
      });
    };

    window.addEventListener("plannerDataChanged", handlePlannerUpdate);
    window.addEventListener("storage", handlePlannerUpdate);

    return () => {
      window.removeEventListener("plannerDataChanged", handlePlannerUpdate);
      window.removeEventListener("storage", handlePlannerUpdate);
    };
  }, [loadData, getPlannerTasks, activeView]);

  /* ===============================
     DEBOUNCED SAVE TO BACKEND (CUSTOM ITEMS ONLY)
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
    
    // Save only custom focus items to the backend
    const customOnly = updated.filter(i => !i.isFromPlanner);
    persistItems(customOnly);
  }

  function toggleItem(id) {
    const updated = items.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    setItems(updated);

    const clickedItem = items.find(item => item.id === id);
    if (clickedItem && clickedItem.isFromPlanner) {
      try {
        const storageKey = `planner_data_${user?.email || "guest"}`;
        const rawData = localStorage.getItem(storageKey);
        if (rawData) {
          const data = JSON.parse(rawData);
          const daily = data.daily || {};
          const todayData = daily[todayKey] || {};

          if (clickedItem.plannerType === "smart") {
            const smart = todayData.smartTasks || {};
            const list = smart[clickedItem.plannerCategory] || [];
            const taskIndex = list.findIndex(t => t.id === id);
            if (taskIndex !== -1) {
              list[taskIndex].done = !list[taskIndex].done;
              localStorage.setItem(storageKey, JSON.stringify(data));
              window.dispatchEvent(new Event("plannerDataChanged"));
            }
          } else if (clickedItem.plannerType === "timeBlock") {
            const blocks = todayData.timeBlocks || {};
            const list = blocks[clickedItem.plannerCategory] || [];
            const taskIndex = list.findIndex(t => t.id === id);
            if (taskIndex !== -1) {
              list[taskIndex].done = !list[taskIndex].done;
              localStorage.setItem(storageKey, JSON.stringify(data));
              window.dispatchEvent(new Event("plannerDataChanged"));
            }
          }
        }
      } catch (e) {
        console.error("Failed to update planner task toggle", e);
      }
    } else {
      const customOnly = updated.filter(i => !i.isFromPlanner);
      persistItems(customOnly);
    }
  }

  function removeItem(id) {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);

    const clickedItem = items.find(item => item.id === id);
    if (clickedItem && clickedItem.isFromPlanner) {
      try {
        const storageKey = `planner_data_${user?.email || "guest"}`;
        const rawData = localStorage.getItem(storageKey);
        if (rawData) {
          const data = JSON.parse(rawData);
          const daily = data.daily || {};
          const todayData = daily[todayKey] || {};

          if (clickedItem.plannerType === "smart") {
            const smart = todayData.smartTasks || {};
            const list = smart[clickedItem.plannerCategory] || [];
            const filtered = list.filter(t => t.id !== id);
            smart[clickedItem.plannerCategory] = filtered;
            localStorage.setItem(storageKey, JSON.stringify(data));
            window.dispatchEvent(new Event("plannerDataChanged"));
          } else if (clickedItem.plannerType === "timeBlock") {
            const blocks = todayData.timeBlocks || {};
            const list = blocks[clickedItem.plannerCategory] || [];
            const filtered = list.filter(t => t.id !== id);
            blocks[clickedItem.plannerCategory] = filtered;
            localStorage.setItem(storageKey, JSON.stringify(data));
            window.dispatchEvent(new Event("plannerDataChanged"));
          }
        }
      } catch (e) {
        console.error("Failed to remove planner task", e);
      }
    } else {
      const customOnly = updated.filter(i => !i.isFromPlanner);
      persistItems(customOnly);
    }
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
    
    const customOnly = updated.filter(i => !i.isFromPlanner);
    persistItems(customOnly);
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
                display: "flex",
                flexDirection: "column",
                gap: "2px"
              }}
            >
              <span>{item.text}</span>
              {item.isFromPlanner && (
                <span style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: item.categoryColor,
                  background: `${item.categoryColor}16`,
                  border: `1px solid ${item.categoryColor}32`,
                  padding: "1px 6px",
                  borderRadius: "6px",
                  width: "fit-content",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginTop: "2px",
                  display: "inline-block"
                }}>
                  {item.categoryLabel}
                </span>
              )}
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
