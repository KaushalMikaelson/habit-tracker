import React from 'react';
import dayjs from 'dayjs';

export default function StatsView({ habits }) {
  const totalHabits = habits?.length || 0;
  const totalCompletions = habits?.reduce((acc, h) => acc + (h.completedDates?.length || 0), 0) || 0;
  
  // Find highest streak
  let bestStreak = 0;
  habits?.forEach(h => {
    const streak = h.highestStreak || h.streak || 0;
    if (streak > bestStreak) bestStreak = streak;
  });

  // Calculate some basic consistency based on past 30 days
  let past30Total = 0;
  let past30Completed = 0;
  const thirtyDaysAgo = dayjs().subtract(30, 'day');
  
  habits?.forEach(h => {
    // Simple mock logic for finding percentages
    const created = dayjs(h.createdAt || thirtyDaysAgo);
    let trackingDays = dayjs().diff(created, 'day') + 1;
    if (trackingDays > 30) trackingDays = 30;
    if (trackingDays <= 0) trackingDays = 1;
    
    past30Total += trackingDays;
    
    h.completedDates?.forEach(date => {
      if (dayjs(date).isAfter(thirtyDaysAgo)) {
        past30Completed++;
      }
    });
  });

  const overallConsistency = past30Total > 0 ? Math.round((past30Completed / past30Total) * 100) : 0;

  // Most Consistent & Needs Work
  const habitConsistencies = habits?.map(h => {
    const created = dayjs(h.createdAt || thirtyDaysAgo);
    let trackingDays = dayjs().diff(created, 'day') + 1;
    if (trackingDays > 30) trackingDays = 30;
    if (trackingDays <= 0) trackingDays = 1;
    
    let comp = 0;
    h.completedDates?.forEach(date => {
      if (dayjs(date).isAfter(thirtyDaysAgo)) comp++;
    });
    
    const pct = Math.round((comp / trackingDays) * 100);
    return { name: h.name, pct };
  }).sort((a,b) => b.pct - a.pct) || [];

  const mostConsistent = habitConsistencies.length > 0 ? habitConsistencies[0] : { name: "N/A", pct: 0 };
  const needsWork = habitConsistencies.length > 0 ? habitConsistencies[habitConsistencies.length - 1] : { name: "N/A", pct: 0 };

  // Reusable card style
  const cardStyle = {
    background: "#111827",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div style={{ padding: "32px", color: "#f8fafc", width: "100%", boxSizing: "border-box", overflowY: "auto", flex: 1 }}>
      
      {/* HEADER & TABS */}
      <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#10b981", margin: "0 0 24px 0" }}>
        Stats & Insights
      </h1>
      
      <div style={{ display: "flex", gap: "24px", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "32px" }}>
        <div style={{ paddingBottom: "12px", borderBottom: "2px solid #10b981", color: "#f8fafc", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>
          Overview
        </div>
        <div style={{ paddingBottom: "12px", color: "#94a3b8", fontWeight: 500, fontSize: "14px", cursor: "pointer" }}>
          Per-Habit Detail
        </div>
      </div>

      {/* 4 STAT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <div style={cardStyle}>
          <div style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>{totalHabits}</div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em" }}>TOTAL HABITS</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>{totalCompletions}</div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em" }}>TOTAL COMPLETIONS</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>{bestStreak} 🔥</div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em" }}>BEST STREAK</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>{overallConsistency}%</div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em" }}>CONSISTENCY</div>
        </div>
      </div>

      {/* OVERALL CONSISTENCY BAR */}
      <div style={{ ...cardStyle, alignItems: "flex-start", marginBottom: "24px" }}>
        <div style={{ fontSize: "11px", fontWeight: 800, color: "#f8fafc", letterSpacing: "0.05em", marginBottom: "16px" }}>
          OVERALL CONSISTENCY
        </div>
        <div style={{ width: "100%", height: "12px", background: "#0f172a", borderRadius: "6px", position: "relative", overflow: "hidden" }}>
          <div style={{ 
            height: "100%", 
            width: `${Math.max(overallConsistency, 1)}%`, 
            background: "linear-gradient(90deg, #10b981, #06b6d4)", 
            borderRadius: "6px",
            transition: "width 0.5s ease"
          }} />
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        
        {/* NO CATEGORY DATA */}
        <div style={{ ...cardStyle, textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "32px", marginBottom: "16px" }}>🥚</div>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: 700 }}>No category data</h3>
          <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", maxWidth: "240px", lineHeight: "1.5" }}>
            Complete habits to see your category breakdown
          </p>
        </div>

        {/* CONSISTENCY COMPARISON */}
        <div style={{ ...cardStyle, alignItems: "flex-start", justifyContent: "flex-start", padding: "24px" }}>
          <div style={{ fontSize: "11px", fontWeight: 800, color: "#f8fafc", letterSpacing: "0.05em", marginBottom: "20px" }}>
            CONSISTENCY COMPARISON
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
            {/* Most Consistent Row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.2)", padding: "12px 16px", borderRadius: "8px" }}>
              <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 500 }}>Most Consistent:</span>
              <span style={{ fontSize: "14px", color: "#10b981", fontWeight: 700 }}>{mostConsistent.name} ({mostConsistent.pct}%)</span>
            </div>
            
            {/* Needs Work Row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.2)", padding: "12px 16px", borderRadius: "8px" }}>
              <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 500 }}>Needs Work:</span>
              <span style={{ fontSize: "14px", color: "#ef4444", fontWeight: 700 }}>{needsWork.name} ({needsWork.pct}%)</span>
            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}
