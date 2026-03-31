import React, { useState } from 'react';

export default function SmartTaskSystem({ tasks, onUpdateTasks }) {
  const [newTaskText, setNewTaskText] = useState({ deepWork: "", important: "", quick: "" });

  const cats = [
    { key: "deepWork", label: "🔴 Deep Work", max: 2, color: "#ef4444" },
    { key: "important", label: "🟡 Important", max: 5, color: "#eab308" },
    { key: "quick", label: "⚪ Quick Tasks", max: 10, color: "#94a3b8" }
  ];

  const handleAddTask = (key) => {
    if (!newTaskText[key].trim()) return;
    const currentList = tasks[key] || [];
    const catDef = cats.find(c => c.key === key);
    if (currentList.length >= catDef.max) return alert(`Maximum ${catDef.max} tasks allowed for ${catDef.label}`);
    
    const newTask = { id: Date.now() + Math.random().toString(), text: newTaskText[key], done: false };
    onUpdateTasks({ ...tasks, [key]: [...currentList, newTask] });
    setNewTaskText({ ...newTaskText, [key]: "" });
  };

  const handleToggle = (key, id) => {
    const list = tasks[key] || [];
    const newList = list.map(t => t.id === id ? { ...t, done: !t.done } : t);
    onUpdateTasks({ ...tasks, [key]: newList });
  };

  const handleDelete = (key, id) => {
    const list = tasks[key] || [];
    const newList = list.filter(t => t.id !== id);
    onUpdateTasks({ ...tasks, [key]: newList });
  };

  const handleEdit = (key, id, newText) => {
    const list = tasks[key] || [];
    const newList = list.map(t => t.id === id ? { ...t, text: newText } : t);
    onUpdateTasks({ ...tasks, [key]: newList });
  };

  const onDragStart = (e, key, index) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ key, index }));
  };

  const onDrop = (e, targetKey) => {
    e.preventDefault();
    try {
      const { key: sourceKey, index: sourceIndex } = JSON.parse(e.dataTransfer.getData("application/json"));
      if (sourceKey === targetKey) return; 
      
      const catDef = cats.find(c => c.key === targetKey);
      if ((tasks[targetKey] || []).length >= catDef.max) return alert(`Maximum ${catDef.max} tasks allowed for ${catDef.label}`);

      const sourceList = tasks[sourceKey] || [];
      const sourceTask = sourceList[sourceIndex];
      const newSourceList = [...sourceList];
      newSourceList.splice(sourceIndex, 1);
      
      const newTargetList = [...(tasks[targetKey] || []), sourceTask];
      onUpdateTasks({ ...tasks, [sourceKey]: newSourceList, [targetKey]: newTargetList });
    } catch(err) { console.error(err); }
  };

  return (
    <div>
      <h3 style={{ color: "#94a3b8", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px 0", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ color: "#38bdf8" }}>🧠</span> Smart Task System
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
        {cats.map(({ key, label, max, color }) => {
          const list = tasks[key] || [];
          return (
            <div 
              key={key} 
              style={{ background: "#020617", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => onDrop(e, key)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#f8fafc" }}>{label}</h4>
                <span style={{ fontSize: "12px", color: list.length >= max ? "#ef4444" : "#64748b" }}>{list.length}/{max}</span>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                {list.map((task, index) => (
                   <div 
                     key={task.id} 
                     draggable
                     onDragStart={e => onDragStart(e, key, index)}
                     style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.03)", padding: "8px 12px", borderRadius: "8px", borderLeft: `3px solid ${color}`, cursor: "grab", opacity: task.done ? 0.5 : 1 }}
                   >
                     <input type="checkbox" checked={task.done} onChange={() => handleToggle(key, task.id)} style={{ cursor: "pointer" }} />
                     <input 
                       value={task.text} 
                       onChange={e => handleEdit(key, task.id, e.target.value)} 
                       style={{ background: "transparent", border: "none", color: task.done ? "#94a3b8" : "#f1f5f9", textDecoration: task.done ? "line-through" : "none", flex: 1, fontSize: "13px", outline: "none" }} 
                     />
                     <button onClick={() => handleDelete(key, task.id)} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer", padding: "4px" }}>✕</button>
                   </div>
                ))}
                {list.length < max && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "auto", paddingTop: "8px" }}>
                    <input 
                      placeholder="Add task..." 
                      value={newTaskText[key]} 
                      onChange={e => setNewTaskText({ ...newTaskText, [key]: e.target.value })}
                      onKeyDown={e => { if(e.key === 'Enter') handleAddTask(key); }}
                      style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "6px 10px", color: "#f8fafc", flex: 1, fontSize: "12px", outline: "none" }}
                    />
                    <button onClick={() => handleAddTask(key)} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "6px", color: "#f8fafc", padding: "0 10px", cursor: "pointer" }}>+</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
