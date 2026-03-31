import React, { useState, useEffect } from 'react';

export default function TimeBlockSystem({ timeBlocks, onUpdateTimeBlocks, onMigrateUnfinished }) {
  const blocks = [
    { key: "morning", label: "Sunrise Block", color: "#fbbf24", icon: "🌅" },
    { key: "afternoon", label: "Day Block", color: "#38bdf8", icon: "☀️" },
    { key: "evening", label: "Sunset Block", color: "#a78bfa", icon: "🌙" },
  ];

  const categories = ["Work", "Study", "Personal", "Health", "Errands"];

  const handleAddTask = (blockKey) => {
    const list = timeBlocks[blockKey] || [];
    const newTask = { id: Date.now() + Math.random().toString(), time: "", text: "", category: "Work", done: false, active: false };
    onUpdateTimeBlocks({ ...timeBlocks, [blockKey]: [...list, newTask] });
  };

  const handleUpdateTask = (blockKey, id, field, value) => {
    const list = timeBlocks[blockKey] || [];
    let newList = list.map(t => t.id === id ? { ...t, [field]: value } : t);
    
    // If setting active, deactivate others in all blocks
    if (field === "active" && value === true) {
      const resetBlocks = { ...timeBlocks };
      ["morning", "afternoon", "evening"].forEach(bk => {
        resetBlocks[bk] = (resetBlocks[bk] || []).map(t => ({ ...t, active: false }));
      });
      newList = (resetBlocks[blockKey] || []).map(t => t.id === id ? { ...t, active: true } : t);
      onUpdateTimeBlocks({ ...resetBlocks, [blockKey]: newList });
      return;
    }
    
    onUpdateTimeBlocks({ ...timeBlocks, [blockKey]: newList });
  };

  const handleDeleteTask = (blockKey, id) => {
    const list = timeBlocks[blockKey] || [];
    onUpdateTimeBlocks({ ...timeBlocks, [blockKey]: list.filter(t => t.id !== id) });
  };

  // --- Pomodoro Timer ---
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    else if (timeLeft === 0) setIsRunning(false);
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => { setIsRunning(false); setTimeLeft(25 * 60); };
  
  const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Header & Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <h3 style={{ color: "#94a3b8", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0, fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#f59e0b" }}>⏳</span> Actionable Time Blocks
        </h3>
        
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Pomodoro */}
          <div style={{ display: "flex", alignItems: "center", background: "#020617", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "4px 6px" }}>
            <span style={{ color: isRunning ? "#ef4444" : "#f1f5f9", fontWeight: 700, fontSize: "14px", padding: "0 12px", fontFamily: "monospace" }}>{m}:{s}</span>
            <button onClick={toggleTimer} style={{ background: isRunning ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)", border: "none", color: isRunning ? "#ef4444" : "#10b981", borderRadius: "14px", padding: "4px 12px", cursor: "pointer", fontSize: "12px", fontWeight: 700 }}>
              {isRunning ? "PAUSE" : "FOCUS"}
            </button>
            <button onClick={resetTimer} style={{ background: "transparent", border: "none", color: "#64748b", padding: "4px 8px", cursor: "pointer" }}>↻</button>
          </div>
          
          <button onClick={onMigrateUnfinished} style={{ background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.2)", color: "#38bdf8", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
            Migrate Unfinished ➔
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {blocks.map(block => {
          const list = timeBlocks[block.key] || [];
          return (
            <div key={block.key} style={{ background: "rgba(255,255,255,0.01)", border: `1px solid ${block.color}20`, borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ background: `${block.color}10`, padding: "12px 16px", borderBottom: `1px solid ${block.color}20`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 style={{ margin: 0, color: block.color, fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>{block.icon}</span> {block.label}
                </h4>
                <button onClick={() => handleAddTask(block.key)} style={{ background: "transparent", border: `1px dashed ${block.color}50`, color: block.color, borderRadius: "6px", padding: "2px 8px", fontSize: "12px", cursor: "pointer" }}>+ Add Block</button>
              </div>
              
              <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {list.length === 0 && <div style={{ fontSize: "12px", color: "#475569", textAlign: "center", padding: "12px" }}>No tasks planned for {block.label.toLowerCase()}.</div>}
                {list.map(task => (
                  <div key={task.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px", background: task.active ? "rgba(16, 185, 129, 0.05)" : "#020617", border: `1px solid ${task.active ? "#10b981" : "rgba(255,255,255,0.05)"}`, borderRadius: "8px", transition: "all 0.2s ease" }}>
                    <input type="checkbox" checked={task.done} onChange={e => handleUpdateTask(block.key, task.id, "done", e.target.checked)} style={{ cursor: "pointer" }} />
                    <input placeholder="Task description..." value={task.text} onChange={e => handleUpdateTask(block.key, task.id, "text", e.target.value)} style={{ flex: 1, background: "transparent", border: "none", color: task.done ? "#64748b" : "#f1f5f9", textDecoration: task.done ? "line-through" : "none", fontSize: "13px", outline: "none" }} />
                    <select value={task.category} onChange={e => handleUpdateTask(block.key, task.id, "category", e.target.value)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#94a3b8", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", outline: "none" }}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button onClick={() => handleUpdateTask(block.key, task.id, "active", !task.active)} style={{ background: "transparent", border: "none", color: task.active ? "#10b981" : "#475569", cursor: "pointer", fontSize: "14px" }} title="Set Active">🎯</button>
                    <button onClick={() => handleDeleteTask(block.key, task.id)} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer", fontSize: "14px" }} title="Delete">✕</button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
