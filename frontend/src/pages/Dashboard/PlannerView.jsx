import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import SmartTaskSystem from "./SmartTaskSystem";
import TimeBlockSystem from "./TimeBlockSystem";

dayjs.extend(isoWeek);

export default function PlannerView({ user, habits }) {
  const [activeTab, setActiveTab] = useState("daily"); // daily, weekly, monthly
  const storageKey = `planner_data_${user?.email || "guest"}`;

  const [datePivot, setDatePivot] = useState(dayjs());

  const [data, setData] = useState({
    daily: {},
    weekly: {},
    monthly: {},
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setData(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load planner data", e);
    }
  }, [storageKey]);

  function saveData(updatedData) {
    setData(updatedData);
    localStorage.setItem(storageKey, JSON.stringify(updatedData));
  }

  // --- Helpers for Keys ---
  const getCurrentDailyKey = () => datePivot.format("YYYY-MM-DD");
  const getCurrentWeeklyKey = () => `${datePivot.format("YYYY")}-W${datePivot.isoWeek()}`;
  const getCurrentMonthlyKey = () => datePivot.format("YYYY-MM");

  // --- Initial Data Structures ---
  const getDailyData = () => {
    const raw = data.daily[getCurrentDailyKey()] || {};
    
    let smartTasks = raw.smartTasks;
    if (!smartTasks) {
      smartTasks = {
        deepWork: (raw.priorities || []).slice(0, 2).filter(p => p.trim()).map((p, i) => ({ id: `mig-dw-${i}`, text: p, done: false })),
        important: (raw.priorities && raw.priorities[2] && raw.priorities[2].trim()) ? [{ id: `mig-im-0`, text: raw.priorities[2], done: false }] : [],
        quick: []
      };
    }

    let timeBlocks = raw.timeBlocks;
    if (!timeBlocks) {
      timeBlocks = {
        morning: typeof raw.morning === 'string' && raw.morning.trim() ? [{ id: "m0", time: "09:00", text: raw.morning, category: "Work", done: false, active: false }] : [],
        afternoon: typeof raw.afternoon === 'string' && raw.afternoon.trim() ? [{ id: "a0", time: "13:00", text: raw.afternoon, category: "Work", done: false, active: false }] : [],
        evening: typeof raw.evening === 'string' && raw.evening.trim() ? [{ id: "e0", time: "18:00", text: raw.evening, category: "Personal", done: false, active: false }] : []
      };
    }

    return { ...raw, smartTasks, timeBlocks, reflection: raw.reflection || "" };
  };
  const getWeeklyData = () => data.weekly[getCurrentWeeklyKey()] || { goals: ["", "", "", "", ""], reflection: "", quadrants: ["", "", "", ""] };
  const getMonthlyData = () => data.monthly[getCurrentMonthlyKey()] || { objectives: ["", "", "", ""] };

  // --- Handlers ---
  const handleDailyUpdate = (key, value) => {
    const updated = {
      ...data,
      daily: {
        ...data.daily,
        [getCurrentDailyKey()]: { ...getDailyData(), [key]: value }
      }
    };
    saveData(updated);
  };

  const handleWeeklyUpdate = (key, value) => {
    const updated = {
      ...data,
      weekly: {
        ...data.weekly,
        [getCurrentWeeklyKey()]: { ...getWeeklyData(), [key]: value }
      }
    };
    saveData(updated);
  };

  const handleMonthlyUpdate = (key, value) => {
    const updated = {
      ...data,
      monthly: {
        ...data.monthly,
        [getCurrentMonthlyKey()]: { ...getMonthlyData(), [key]: value }
      }
    };
    saveData(updated);
  };



  const handleSpecificWeeklyUpdate = (weekKey, field, value) => {
    const current = data.weekly[weekKey] || { goals: ["", "", "", "", ""], reflection: "", quadrants: ["", "", "", ""] };
    const updated = { ...data, weekly: { ...data.weekly, [weekKey]: { ...current, [field]: value } } };
    saveData(updated);
  };

  const handleMigrateUnfinished = () => {
    const dData = getDailyData();
    if (!dData || !dData.timeBlocks) return;
    
    const tomorrowKey = datePivot.add(1, "day").format("YYYY-MM-DD");
    const tomorrowRaw = data.daily[tomorrowKey] || {};
    let tomorrowBlocks = tomorrowRaw.timeBlocks || { morning: [], afternoon: [], evening: [] };
    
    const currentMigrated = { 
      morning: [...dData.timeBlocks.morning],
      afternoon: [...dData.timeBlocks.afternoon],
      evening: [...dData.timeBlocks.evening]
    };
    
    // Move unfinished blocks to tomorrow
    ["morning", "afternoon", "evening"].forEach(bk => {
      const unfinished = currentMigrated[bk].filter(t => !t.done).map(t => ({ ...t, active: false }));
      if (unfinished.length > 0) {
        tomorrowBlocks[bk] = [...(tomorrowBlocks[bk] || []), ...unfinished];
        currentMigrated[bk] = currentMigrated[bk].filter(t => t.done);
      }
    });

    const updated = {
      ...data,
      daily: {
        ...data.daily,
        [getCurrentDailyKey()]: { ...dData, timeBlocks: currentMigrated },
        [tomorrowKey]: { ...tomorrowRaw, timeBlocks: tomorrowBlocks }
      }
    };
    saveData(updated);
    alert("Unfinished tasks migrated to tomorrow.");
  };

  // --- Navigation Handlers ---
  const handlePrev = () => {
    if (activeTab === "daily") setDatePivot(datePivot.subtract(1, "day"));
    if (activeTab === "weekly") setDatePivot(datePivot.subtract(1, "week"));
    if (activeTab === "monthly") setDatePivot(datePivot.subtract(1, "month"));
  };
  const handleNext = () => {
    if (activeTab === "daily") setDatePivot(datePivot.add(1, "day"));
    if (activeTab === "weekly") setDatePivot(datePivot.add(1, "week"));
    if (activeTab === "monthly") setDatePivot(datePivot.add(1, "month"));
  };
  const handleToday = () => {
    setDatePivot(dayjs());
  };

  const isToday = datePivot.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
  const isThisWeek = `${datePivot.format("YYYY")}-W${datePivot.isoWeek()}` === `${dayjs().format("YYYY")}-W${dayjs().isoWeek()}`;
  const isThisMonth = datePivot.format("YYYY-MM") === dayjs().format("YYYY-MM");

  const dailyData = getDailyData();
  const weeklyData = getWeeklyData();
  const monthlyData = getMonthlyData();

  const primaryGradient = "linear-gradient(135deg, #10b981, #059669)";

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "40px 24px", maxWidth: "1000px", margin: "0 auto", width: "100%", boxSizing: "border-box", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .planner-tab.active {
          background: rgba(255, 255, 255, 0.1);
          color: #f1f5f9;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .planner-tab {
          background: transparent;
          color: #94a3b8;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        .planner-tab:hover:not(.active) {
          background: rgba(255, 255, 255, 0.05);
          color: #cbd5e1;
        }
        .planner-input {
          background: transparent;
          border: none;
          color: #f8fafc;
          font-family: inherit;
          font-size: 15px;
          outline: none;
          width: 100%;
        }
        .planner-textarea {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          color: #e2e8f0;
          font-family: inherit;
          font-size: 14px;
          padding: 16px;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          resize: vertical;
          min-height: 120px;
          transition: border-color 0.2s ease, background 0.2s ease;
          line-height: 1.6;
        }
        .planner-textarea:focus {
          border-color: #34d399;
          background: rgba(52, 211, 153, 0.05);
        }
        .priority-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #020617;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 14px 16px;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .priority-item:focus-within {
          border-color: #34d399;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(52, 211, 153, 0.15);
        }
        .nav-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #f1f5f9;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .nav-btn:hover {
          background: rgba(255,255,255,0.1);
          transform: scale(1.05);
        }
      `}</style>

      {/* HEADER SECTION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#f8fafc", margin: "0 0 12px 0", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ 
              width: "40px", height: "40px", borderRadius: "10px", background: primaryGradient, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)" 
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            </span>
            Planner
          </h1>
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "4px", borderRadius: "10px", display: "inline-flex" }}>
            <button className={`planner-tab ${activeTab === 'daily' ? 'active' : ''}`} onClick={() => { setActiveTab('daily'); setDatePivot(dayjs()); }}>Daily</button>
            <button className={`planner-tab ${activeTab === 'weekly' ? 'active' : ''}`} onClick={() => { setActiveTab('weekly'); setDatePivot(dayjs()); }}>Weekly</button>
            <button className={`planner-tab ${activeTab === 'monthly' ? 'active' : ''}`} onClick={() => { setActiveTab('monthly'); setDatePivot(dayjs()); }}>Monthly</button>
          </div>
        </div>

        {/* TIME NAVIGATOR */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", background: "#020617", padding: "8px 16px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
          <button className="nav-btn" onClick={handlePrev}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          
          <div style={{ textAlign: "center", minWidth: "160px" }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc" }}>
              {activeTab === "daily" && datePivot.format("MMMM D, YYYY")}
              {activeTab === "weekly" && `Week ${datePivot.isoWeek()}, ${datePivot.format("YYYY")}`}
              {activeTab === "monthly" && datePivot.format("MMMM YYYY")}
            </div>
            {(activeTab === "daily" && isToday) || (activeTab === "weekly" && isThisWeek) || (activeTab === "monthly" && isThisMonth) ? (
              <div style={{ fontSize: "12px", color: "#10b981", fontWeight: 600 }}>Current</div>
            ) : (
              <div style={{ fontSize: "12px", color: "#64748b", cursor: "pointer", fontWeight: 600 }} onClick={handleToday}>Go to current</div>
            )}
          </div>

          <button className="nav-btn" onClick={handleNext}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "32px", animation: "dropdownFadeIn 0.3s ease" }}>
        
        {/* ==================== DAILY VIEW ==================== */}
        {activeTab === "daily" && (
          <>
            {/* Smart Task System */}
            <SmartTaskSystem 
              tasks={dailyData.smartTasks} 
              onUpdateTasks={(newTasks) => handleDailyUpdate("smartTasks", newTasks)} 
            />

            {/* Time Blocks */}
            <TimeBlockSystem 
              timeBlocks={dailyData.timeBlocks} 
              onUpdateTimeBlocks={(newBlocks) => handleDailyUpdate("timeBlocks", newBlocks)} 
              onMigrateUnfinished={handleMigrateUnfinished}
            />

            {/* Daily Reflection */}
            <div>
              <h3 style={{ color: "#94a3b8", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px 0", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#f472b6" }}>✨</span> Daily Reflection
              </h3>
              <textarea
                className="planner-textarea"
                placeholder="How did today go? What went well, what could be improved?"
                value={dailyData.reflection || ""}
                onChange={(e) => handleDailyUpdate("reflection", e.target.value)}
              />
            </div>
          </>
        )}

        {/* ==================== WEEKLY VIEW ==================== */}
        {activeTab === "weekly" && (
          <>
            <div>
              <h3 style={{ color: "#94a3b8", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px 0", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#34d399" }}>🚀</span> Weekly Quadrants
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "16px" }}>
                {[
                  { title: "Q1: Do First (Urgent & Important)", color: "#ef4444" },
                  { title: "Q2: Schedule (Important, Not Urgent)", color: "#3b82f6" },
                  { title: "Q3: Delegate (Urgent, Not Important)", color: "#f59e0b" },
                  { title: "Q4: Don't Do (Neither)", color: "#94a3b8" }
                ].map((quad, index) => (
                  <div key={index} style={{ background: "#020617", borderRadius: "16px", padding: "16px", border: `1px solid ${quad.color}40`, transition: "transform 0.2s ease, box-shadow 0.2s ease" }}>
                    <h4 style={{ color: quad.color, margin: "0 0 12px 0", fontSize: "13px", fontWeight: 700, textTransform: "uppercase" }}>{quad.title}</h4>
                    <textarea
                      className="planner-textarea"
                      placeholder="Add editable tasks here..."
                      value={weeklyData.quadrants?.[index] || ""}
                      onChange={(e) => {
                        const newQuads = [...(weeklyData.quadrants || ["", "", "", ""])];
                        newQuads[index] = e.target.value;
                        handleWeeklyUpdate("quadrants", newQuads);
                      }}
                      style={{ minHeight: "140px", border: "none", background: "rgba(255,255,255,0.02)" }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ color: "#94a3b8", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em", margin: "24px 0 16px 0", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#fbbf24" }}>🏆</span> Weekly Reflection & Wins
              </h3>
              <textarea
                className="planner-textarea"
                placeholder="What were the big wins this week? What did you learn?"
                value={weeklyData.reflection || ""}
                onChange={(e) => handleWeeklyUpdate("reflection", e.target.value)}
                style={{ minHeight: "160px" }}
              />
            </div>

            <div>
               <h3 style={{ color: "#94a3b8", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em", margin: "24px 0 16px 0", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                 <span style={{ color: "#a78bfa" }}>📅</span> Week's Daily Priorities
               </h3>
               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
                 {Array.from({ length: 7 }, (_, i) => {
                    const dDate = datePivot.startOf("isoWeek").add(i, "day");
                    const dKey = dDate.format("YYYY-MM-DD");
                    const dData = data.daily && data.daily[dKey];

                    return (
                      <div key={dKey} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px" }}>
                        <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase" }}>{dDate.format("ddd, MMM D")}</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {['deepWork', 'important', 'quick'].map(cat => 
                            (dData?.smartTasks?.[cat] || []).slice(0, 3).map((task, pIdx) => (
                              <div key={task.id} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <input type="checkbox" checked={task.done} readOnly style={{ zoom: 0.8 }} />
                                <span style={{ fontSize: "11px", color: task.done ? "#64748b" : "#cbd5e1", textDecoration: task.done ? "line-through" : "none" }}>{task.text}</span>
                              </div>
                            ))
                          )}
                          {!dData?.smartTasks?.deepWork?.length && !dData?.smartTasks?.important?.length && (
                            <span style={{ fontSize: "11px", color: "#64748b", fontStyle: "italic" }}>No tasks set. Switch to Daily to add.</span>
                          )}
                        </div>
                      </div>
                    );
                 })}
               </div>
            </div>
          </>
        )}

        {/* ==================== MONTHLY VIEW ==================== */}
        {activeTab === "monthly" && (
          <>
            <div>
              <h3 style={{ color: "#94a3b8", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px 0", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#c084fc" }}>🌟</span> Monthly Objectives
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                {[0, 1, 2, 3].map(index => (
                  <div key={index} style={{ background: "#020617", borderRadius: "16px", padding: "20px", border: "1px solid rgba(255,255,255,0.08)", transition: "transform 0.2s ease, box-shadow 0.2s ease", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#c084fc", fontWeight: 700 }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "rgba(192, 132, 252, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {index + 1}
                      </div>
                      Objective {index + 1}
                    </div>
                    <textarea
                      className="planner-textarea"
                      placeholder={`Details for objective ${index + 1}...`}
                      value={monthlyData.objectives?.[index] || ""}
                      onChange={(e) => {
                        const newObjs = [...(monthlyData.objectives || ["", "", "", ""])];
                        newObjs[index] = e.target.value;
                        handleMonthlyUpdate("objectives", newObjs);
                      }}
                      style={{ minHeight: "120px", border: "none", background: "rgba(255,255,255,0.02)" }}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 style={{ color: "#94a3b8", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px 0", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#60a5fa" }}>🌊</span> Monthly Review & Adjustments
              </h3>
              <textarea
                className="planner-textarea"
                placeholder="Review your progress this month. What systems need tweaking? What are you proud of?"
                value={monthlyData.review || ""}
                onChange={(e) => handleMonthlyUpdate("review", e.target.value)}
                style={{ minHeight: "180px" }}
              />
            </div>

            <div>
              <h3 style={{ color: "#94a3b8", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em", margin: "24px 0 16px 0", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#f472b6" }}>🗓️</span> Month's Weekly Goals
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
                {(() => {
                   const sMonth = datePivot.startOf('month');
                   const eMonth = datePivot.endOf('month');
                   const mWeeks = [];
                   let curr = sMonth;
                   while (curr.isBefore(eMonth) || curr.isSame(eMonth, 'day')) {
                     const wKey = `${curr.format('YYYY')}-W${curr.isoWeek()}`;
                     if (!mWeeks.find(w => w.key === wKey)) {
                       mWeeks.push({ key: wKey, label: `Week ${curr.isoWeek()}` });
                     }
                     curr = curr.add(1, 'day');
                   }
                   
                   return mWeeks.map(wk => {
                     const wData = data.weekly && data.weekly[wk.key];

                     return (
                       <div key={wk.key} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px" }}>
                         <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase" }}>{wk.label}</div>
                         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                           {[0, 1, 2, 3].map(qIdx => (
                             <textarea
                               key={qIdx}
                               className="planner-textarea"
                               style={{ minHeight: "60px", fontSize: "11px", padding: "8px", border: "none", background: "rgba(0,0,0,0.2)" }}
                               placeholder={`Q${qIdx + 1}`}
                               value={(wData && wData.quadrants && wData.quadrants[qIdx]) || ""}
                               onChange={e => {
                                 const newQuads = wData?.quadrants ? [...wData.quadrants] : ["", "", "", ""];
                                 newQuads[qIdx] = e.target.value;
                                 handleSpecificWeeklyUpdate(wk.key, "quadrants", newQuads);
                               }}
                             />
                           ))}
                         </div>
                       </div>
                     );
                   });
                })()}
              </div>
            </div>

            <div>
               <h3 style={{ color: "#94a3b8", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em", margin: "24px 0 16px 0", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                 <span style={{ color: "#a78bfa" }}>📅</span> Month's Daily Priorities
               </h3>
               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
                 {Array.from({ length: datePivot.daysInMonth() }, (_, i) => {
                    const dDate = datePivot.startOf("month").add(i, "day");
                    const dKey = dDate.format("YYYY-MM-DD");
                    const dData = data.daily && data.daily[dKey];

                    return (
                      <div key={dKey} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px" }}>
                        <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase" }}>{dDate.format("ddd, MMM D")}</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {['deepWork', 'important', 'quick'].map(cat => 
                            (dData?.smartTasks?.[cat] || []).slice(0, 3).map((task, pIdx) => (
                              <div key={task.id} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <input type="checkbox" checked={task.done} readOnly style={{ zoom: 0.8 }} />
                                <span style={{ fontSize: "11px", color: task.done ? "#64748b" : "#cbd5e1", textDecoration: task.done ? "line-through" : "none" }}>{task.text}</span>
                              </div>
                            ))
                          )}
                          {!dData?.smartTasks?.deepWork?.length && !dData?.smartTasks?.important?.length && (
                            <span style={{ fontSize: "11px", color: "#64748b", fontStyle: "italic" }}>No tasks set. Switch to Daily to add.</span>
                          )}
                        </div>
                      </div>
                    );
                 })}
               </div>
            </div>
          </>
        )}
        
      </div>
    </div>
  );
}
