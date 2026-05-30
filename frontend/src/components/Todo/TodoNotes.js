import { useCallback, useEffect, useRef, useState } from "react";
import { fetchUserData, saveReminders } from "../../api/userdata";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

export default function TodoNotes({ user, activeView }) {
  /* ===============================
     STATE
  ================================ */
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const weekKey = `${dayjs().format("YYYY")}-W${dayjs().isoWeek()}`;

  /* ===============================
     LOAD WEEKLY PLANNER TASKS
  ================================ */
  const getWeeklyTasks = useCallback(() => {
    try {
      const storageKey = `planner_data_${user?.email || "guest"}`;
      const rawData = localStorage.getItem(storageKey);
      if (!rawData) return [];
      const data = JSON.parse(rawData);
      const weekData = data.weekly?.[weekKey];
      if (!weekData || !weekData.quadrants) return [];

      const completedKey = `completed_weekly_tasks_${user?.email || "guest"}`;
      const completedList = JSON.parse(localStorage.getItem(completedKey) || "[]");

      const tasks = [];
      const quadTitles = [
        "Q1: Do First",
        "Q2: Schedule",
        "Q3: Delegate",
        "Q4: Don't Do"
      ];
      const quadColors = ["#ef4444", "#3b82f6", "#f59e0b", "#94a3b8"];

      weekData.quadrants.forEach((quadText, qIdx) => {
        if (!quadText || !quadText.trim()) return;
        const lines = quadText.split("\n");
        let validLineIdx = 0;

        lines.forEach((lineText) => {
          const trimmed = lineText.trim();
          if (!trimmed) return;

          // Strip leading "- ", "* ", number lists like "1. ", or custom checks
          let cleanText = trimmed.replace(/^[-*•\s\d.]+\s*/, "");
          if (!cleanText) return;

          const taskId = `weekly-${weekKey}-${qIdx}-${validLineIdx}`;
          const isDone = completedList.includes(taskId);

          tasks.push({
            id: taskId,
            text: cleanText,
            done: isDone,
            isFromWeeklyPlanner: true,
            quadrantIndex: qIdx,
            quadrantLabel: quadTitles[qIdx],
            quadrantColor: quadColors[qIdx],
            lineIndex: validLineIdx,
            rawLineText: lineText // Store original line for deletion matching
          });
          validLineIdx++;
        });
      });

      return tasks;
    } catch (e) {
      console.error("Failed to load weekly planner reminders", e);
      return [];
    }
  }, [user?.email, weekKey]);

  /* ===============================
     LOAD FROM BACKEND ON MOUNT
  ================================ */
  const loadData = useCallback(async () => {
    try {
      const data = await fetchUserData();
      const customReminders = data.reminders || [];
      const weeklyTasks = getWeeklyTasks();
      setItems([...customReminders, ...weeklyTasks]);
    } catch {
      setError("Failed to load reminders.");
    } finally {
      setLoading(false);
    }
  }, [getWeeklyTasks]);

  useEffect(() => {
    loadData();

    // Listen for custom planner updates
    const handlePlannerUpdate = () => {
      const wTasks = getWeeklyTasks();
      setItems(prevItems => {
        const customOnly = prevItems.filter(i => !i.isFromWeeklyPlanner);
        return [...customOnly, ...wTasks];
      });
    };

    window.addEventListener("plannerDataChanged", handlePlannerUpdate);
    window.addEventListener("storage", handlePlannerUpdate);

    return () => {
      window.removeEventListener("plannerDataChanged", handlePlannerUpdate);
      window.removeEventListener("storage", handlePlannerUpdate);
    };
  }, [loadData, getWeeklyTasks, activeView]);

  /* ===============================
     DEBOUNCED SAVE TO BACKEND (CUSTOM REMINDERS ONLY)
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
    
    // Save only custom reminders to backend database
    const customOnly = updated.filter(i => !i.isFromWeeklyPlanner);
    persistItems(customOnly);
  }

  function toggleItem(id) {
    const updated = items.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    setItems(updated);

    const clickedItem = items.find(item => item.id === id);
    if (clickedItem && clickedItem.isFromWeeklyPlanner) {
      try {
        const completedKey = `completed_weekly_tasks_${user?.email || "guest"}`;
        let completedList = JSON.parse(localStorage.getItem(completedKey) || "[]");
        if (completedList.includes(id)) {
          completedList = completedList.filter(item => item !== id);
        } else {
          completedList.push(id);
        }
        localStorage.setItem(completedKey, JSON.stringify(completedList));
        window.dispatchEvent(new Event("plannerDataChanged"));
      } catch (e) {
        console.error("Failed to toggle weekly task", e);
      }
    } else {
      const customOnly = updated.filter(i => !i.isFromWeeklyPlanner);
      persistItems(customOnly);
    }
  }

  function removeItem(id) {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);

    const clickedItem = items.find(item => item.id === id);
    if (clickedItem && clickedItem.isFromWeeklyPlanner) {
      try {
        const storageKey = `planner_data_${user?.email || "guest"}`;
        const rawData = localStorage.getItem(storageKey);
        if (rawData) {
          const data = JSON.parse(rawData);
          const weekly = data.weekly || {};
          const weekData = weekly[weekKey] || {};
          const quadrants = weekData.quadrants || ["", "", "", ""];
          
          const quadText = quadrants[clickedItem.quadrantIndex] || "";
          
          // Surgically find the line in the quadrant's text block
          const lines = quadText.split("\n");
          let validLineIdx = 0;
          const filteredLines = lines.filter((lineText) => {
            const trimmed = lineText.trim();
            if (!trimmed) return true; // Keep empty lines
            
            let cleanText = trimmed.replace(/^[-*•\s\d.]+\s*/, "");
            if (!cleanText) return true; // Keep empty/non-task lines
            
            const isMatch = validLineIdx === clickedItem.lineIndex;
            validLineIdx++;
            return !isMatch; // Exclude matching task line
          });

          quadrants[clickedItem.quadrantIndex] = filteredLines.join("\n");
          localStorage.setItem(storageKey, JSON.stringify(data));
          
          // Remove from completed list if there
          const completedKey = `completed_weekly_tasks_${user?.email || "guest"}`;
          let completedList = JSON.parse(localStorage.getItem(completedKey) || "[]");
          completedList = completedList.filter(item => item !== id);
          localStorage.setItem(completedKey, JSON.stringify(completedList));

          window.dispatchEvent(new Event("plannerDataChanged"));
        }
      } catch (e) {
        console.error("Failed to delete line from weekly quadrant", e);
      }
    } else {
      const customOnly = updated.filter(i => !i.isFromWeeklyPlanner);
      persistItems(customOnly);
    }
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
                display: "flex",
                flexDirection: "column",
                gap: "2px"
              }}
            >
              <span>{item.text}</span>
              {item.isFromWeeklyPlanner && (
                <span style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: item.quadrantColor,
                  background: `${item.quadrantColor}16`,
                  border: `1px solid ${item.quadrantColor}32`,
                  padding: "1px 6px",
                  borderRadius: "6px",
                  width: "fit-content",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginTop: "2px",
                  display: "inline-block"
                }}>
                  {item.quadrantLabel}
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
