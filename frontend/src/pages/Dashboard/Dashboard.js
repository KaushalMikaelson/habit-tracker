import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";

/* ================= DND ================= */
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

/* ================= Existing imports ================= */
import AddHabitModal from "../../components/AddHabitModal.jsx";
import HabitDetailModal from "../../components/habits/HabitDetailModal.jsx";
import MomentumFlame from "../../components/MomentumFlame.jsx";
import PrestigeBadge from "../../components/PrestigeBadge";
import DashboardGrid from "./DashboardGrid.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import StatsView from "./StatsView.jsx";
import WeeklyView from "./WeeklyView.jsx";
import MonthlyView from "./MonthlyView.jsx";
import SettingsView from "./SettingsView.jsx";
import NotesView from "./NotesView.jsx";

import KpiRingRow from "../../components/kpi/KpiRingRow.jsx";
import KpiIntroBox from "../../components/kpi/KpiIntroBox.jsx";

import HabitNameColumn from "../../components/habits/HabitNameColumn.jsx";
import HabitProgressColumn from "../../components/habits/HabitProgressColumn.jsx";
import HabitGraphs from "../../components/habits/HabitGraph";

import { calculateKPIs } from "../../components/kpi/calculations";
import TopHabits from "../../components/stats/TopHabits";

import TodoNotes from "../../components/Todo/TodoNotes";
import TodayFocus from "../../components/Todo/TodayFocus";

import useHabits from "../../hooks/useHabits";
// Unused constants removed

import {
  getCurrentYearMonth,
  getMonthDates,
  getMonthLabel,
} from "../../utils/dateUtils";

/* ================= Constants ================= */

const KPI_ROW_HEIGHT = 180;

/* ================= Helpers ================= */

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}








/* ================= Top Loading Bar ================= */

function TopLoadingBar() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "4px",
        background: "rgba(255,255,255,0.08)",
        zIndex: 2000,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: "40%",
          background: "linear-gradient(90deg, #2563eb, #60a5fa)",
          animation: "loadingBar 1.2s infinite ease-in-out",
        }}
      />
    </div>
  );
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}




/* ================= Dashboard ================= */

function Dashboard({ user, logout }) {
  const today = getTodayDate();

  const {
    habits,
    reorderHabits, // ✅ CORRECT
    loading,
    addHabit,
    toggleHabit,
    deleteHabit,
    undoDelete,
    showUndo,
    editHabit,
    updateNote,
  } = useHabits(today);

  const [newHabit, setNewHabit] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedHabitForDetail, setSelectedHabitForDetail] = useState(null);

  const [categoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState(
    () => localStorage.getItem("habitDefaultStatusFilter") || "active"
  );

  function handleDefaultStatusFilterChange(val) {
    setStatusFilter(val);
    localStorage.setItem("habitDefaultStatusFilter", val);
  }

  const visibleHabits = Array.isArray(habits) ? habits.filter(h => {
    const s = h.status || "active";
    if (statusFilter !== "all" && s !== statusFilter) return false;
    if (categoryFilter !== "All" && h.category !== categoryFilter) return false;
    return true;
  }) : [];

  const initialYearMonth = getCurrentYearMonth();
  const [currentYear, setCurrentYear] = useState(initialYearMonth.year);
  const [currentMonth, setCurrentMonth] = useState(initialYearMonth.month);

  const monthDates = getMonthDates(currentYear, currentMonth);
  const monthLabel = getMonthLabel(currentYear, currentMonth);

  const gridScrollRef = useRef(null);
  const hasAutoScrolledRef = useRef(false);

  const selectedMonth = dayjs(`${currentYear}-${currentMonth + 1}-01`);
  const [accentTheme, setAccentTheme] = useState(
    localStorage.getItem("appAccentTheme") || "blue"
  );

  const themeColors = {
    blue: { c1: "#2563eb", c2: "#3b82f6" },
    emerald: { c1: "#059669", c2: "#10b981" },
    purple: { c1: "#7e22ce", c2: "#a855f7" },
    rose: { c1: "#e11d48", c2: "#f43f5e" },
    amber: { c1: "#d97706", c2: "#f59e0b" },
  };

  const setAppTheme = (t) => {
    setAccentTheme(t);
    localStorage.setItem("appAccentTheme", t);
  };

  const isCurrentMonth = selectedMonth.isSame(dayjs(), "month");

  const [theme, setTheme] = useState("dark");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard"); // "dashboard" | "stats"


  const kpis = calculateKPIs(
    visibleHabits,
    selectedMonth
  );

  /* ---------- Auto-scroll to Today ---------- */
  useEffect(() => {
    if (!gridScrollRef.current) return;
    if (hasAutoScrolledRef.current) return;

    const todayIndex = monthDates.findIndex((d) => d === today);
    if (todayIndex === -1) return;

    const columnWidth = 34;
    gridScrollRef.current.scrollTo({
      left: Math.max(todayIndex * columnWidth - 6 * columnWidth, 0),
      behavior: "smooth",
    });

    hasAutoScrolledRef.current = true;
  }, [monthDates, today]);

  useEffect(() => {
    hasAutoScrolledRef.current = false;
  }, [currentMonth, currentYear]);

  function isFutureDate(date) {
    return date > today;
  }

  /* ---------- Month Navigation ---------- */
  function goToPreviousMonth() {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    const now = new Date();
    const isCurrent =
      currentYear === now.getFullYear() &&
      currentMonth === now.getMonth();

    if (isCurrent) return;

    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  function handleAddHabit(status = "active") {
    if (!newHabit.trim()) return;
    addHabit(newHabit, newCategory, status);
    setNewHabit("");
    setNewCategory("");
    setShowModal(false);
  }

  /* ================= DRAG END ================= */

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = habits.findIndex(h => h._id === active.id);
    const newIndex = habits.findIndex(h => h._id === over.id);

    reorderHabits(
      arrayMove(habits, oldIndex, newIndex)
    );
  }




  /* ================= Render ================= */

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0b101e",
      }}
    >
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeView={activeView}
        onNavigate={setActiveView}
      />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100vh", overflowY: "auto" }}>
      <style>
        {`
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        `}
      </style>

      {/* ================= Header ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "60px",
          padding: "0 20px",
          background: "rgba(11, 16, 30, 0.8)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* LEFT SIDE - BRAND & TOGGLE */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              style={{
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                marginRight: "-8px"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#f8fafc"; e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "transparent" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          )}

          {!isSidebarOpen && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", animation: "dropdownFadeIn 0.3s ease" }}>
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "9px",
                background: "linear-gradient(135deg, #2563eb, #38bdf8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(37,99,235,0.4)",
                flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.01em" }}>
                  Habit Tracker
                </div>
                <div style={{ fontSize: "11px", color: "#334155", fontWeight: 500 }}>
                  Track your consistency
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE - BUTTON GROUP */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <MomentumFlame
            momentumDelta={kpis.momentumDelta}
            momentum={kpis.momentum}
            monthly={kpis.monthly}
          />
          <style>{`
            :root {
              --theme-1: ${themeColors[accentTheme].c1};
              --theme-2: ${themeColors[accentTheme].c2};
            }
          `}</style>
          <PrestigeBadge habits={habits} />




          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(37,99,235,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(37,99,235,0.35)"; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Habit
          </button>

          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "20px",
                border: "none",
                background: "linear-gradient(135deg, var(--theme-1, #2563eb), var(--theme-2, #3b82f6))",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                transition: "all 0.2s ease",
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(37,99,235,0.45)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(37,99,235,0.3)"; }}
            >
              <span style={{ letterSpacing: "0.5px" }}>{getInitials(user?.email || "")}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.2s", transform: showProfileDropdown ? "rotate(-180deg)" : "rotate(0deg)" }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {showProfileDropdown && (
               <>
                 <div
                   onClick={() => setShowProfileDropdown(false)}
                   style={{
                     position: "fixed",
                     top: 0, left: 0, width: "100%", height: "100%",
                     zIndex: 1000,
                   }}
                 />
                 <div
                   style={{
                     position: "absolute",
                     top: "calc(100% + 12px)",
                     right: 0,
                     width: "280px",
                     background: "#020617",
                     borderRadius: "16px",
                     border: "1px solid rgba(255,255,255,0.08)",
                     boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                     padding: "16px",
                     zIndex: 1001,
                     animation: "dropdownFadeIn 0.2s ease",
                   }}
                 >
                   <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                     <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                          fontWeight: 700,
                          color: "#fff"
                        }}
                     >
                       {getInitials(user?.email || "")}
                     </div>
                     <div style={{ flex: 1, minWidth: 0 }}>
                       <div style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                         {user?.name || "User"}
                       </div>
                       <div style={{ fontSize: "14px", color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                         {user?.email || ""}
                       </div>
                     </div>
                   </div>

                   <hr style={{ borderColor: "rgba(255,255,255,0.06)", margin: "0 -16px 12px -16px", borderStyle: "solid", borderWidth: "1px 0 0 0" }} />

                   {/* Theme Selector UI */}
                   <div style={{ padding: "4px 0 16px 0" }}>
                     <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "8px", paddingLeft: "4px" }}>
                       Accent Color
                     </div>
                     <div style={{ display: "flex", gap: "8px", paddingLeft: "4px" }}>
                       {Object.keys(themeColors).map(t => (
                         <div
                           key={t}
                           onClick={() => setAppTheme(t)}
                           style={{
                             width: "24px", height: "24px", borderRadius: "50%", cursor: "pointer",
                             background: themeColors[t].c1,
                             border: accentTheme === t ? "2px solid #fff" : "2px solid transparent",
                             boxShadow: accentTheme === t ? "0 0 0 2px " + themeColors[t].c1 : "none"
                           }}
                         />
                       ))}
                     </div>
                   </div>

                   <hr style={{ borderColor: "rgba(255,255,255,0.06)", margin: "0 -16px 12px -16px", borderStyle: "solid", borderWidth: "1px 0 0 0" }} />

                   <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                     <button
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          background: "transparent",
                          border: "none",
                          color: "#cbd5e1",
                          fontSize: "15px",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "background 0.2s ease"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                     >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Profile
                     </button>
                     <button
                        onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); setShowProfileDropdown(false); }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          background: "transparent",
                          border: "none",
                          color: "#cbd5e1",
                          fontSize: "15px",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "background 0.2s ease"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                     >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="5" />
                          <line x1="12" y1="1" x2="12" y2="3" />
                          <line x1="12" y1="21" x2="12" y2="23" />
                          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                          <line x1="1" y1="12" x2="3" y2="12" />
                          <line x1="21" y1="12" x2="23" y2="12" />
                          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                     </button>
                   </div>

                   <hr style={{ borderColor: "rgba(255,255,255,0.06)", margin: "12px -16px", borderStyle: "solid", borderWidth: "1px 0 0 0" }} />

                   <div>
                     <button
                        onClick={() => { setShowProfileDropdown(false); logout(); }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          background: "transparent",
                          border: "none",
                          color: "#ef4444",
                          fontSize: "15px",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "background 0.2s ease",
                          textAlign: "left"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                     >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Log out
                     </button>
                   </div>
                 </div>
               </>
             )}
          </div>
        </div>
      </div>


      <AddHabitModal
        showModal={showModal}
        setShowModal={setShowModal}
        newHabit={newHabit}
        setNewHabit={setNewHabit}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        addHabit={handleAddHabit}
      />

      {loading && <TopLoadingBar />}

      {selectedHabitForDetail && (
        <HabitDetailModal
          habit={selectedHabitForDetail}
          monthDates={monthDates}
          onClose={() => setSelectedHabitForDetail(null)}
          isFutureDate={isFutureDate}
          toggleHabit={toggleHabit}
          updateHabit={editHabit}
          updateNote={updateNote}
        />
      )}

      {/* ===== VIEWS ===== */}
      {activeView === "settings" ? (
        <SettingsView
          defaultStatusFilter={statusFilter}
          onDefaultStatusFilterChange={handleDefaultStatusFilterChange}
          habits={habits}
          editHabit={editHabit}
          deleteHabit={deleteHabit}
          onHabitClick={setSelectedHabitForDetail}
        />
      ) : activeView === "notes" ? (
        <NotesView habits={habits} updateNote={updateNote} />
      ) : activeView === "stats" ? (
        <StatsView habits={visibleHabits} />
      ) : activeView === "weekly" ? (
        <WeeklyView habits={visibleHabits} />
      ) : activeView === "monthly" ? (
        <MonthlyView habits={visibleHabits} />
      ) : (
        <>
          {visibleHabits.length === 0 ? (
            <div style={{ marginTop: "48px", textAlign: "center" }}>
              <h2>No habits match filters</h2>
              <p style={{ color: "#6b7280" }}>
                Try changing your category or status filters, or add a new habit.
              </p>
            </div>
          ) : (
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={visibleHabits.map(h => h._id)}
                strategy={verticalListSortingStrategy}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    padding: "24px",
                    width: "100%",
                    boxSizing: "border-box",
                    alignItems: "start",
                  }}
                >
                  {/* LEFT COLUMN */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: 260,
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                    }}
                  >
                    <div style={{ height: KPI_ROW_HEIGHT }}>
                      <KpiIntroBox />
                    </div>
                    <TodayFocus habits={visibleHabits} onToggle={toggleHabit} />
                    <HabitNameColumn
                      habits={visibleHabits}
                      deleteHabit={deleteHabit}
                      editHabit={editHabit}
                      onHabitClick={(habit) => setSelectedHabitForDetail(habit)}
                    />
                  </div>

                  {/* CENTER COLUMN */}
                  <div
                    style={{
                      flex: 4,
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: "0px",
                    }}
                  >
                    <div style={{ height: KPI_ROW_HEIGHT, display: "flex", width: "100%" }}>
                      <KpiRingRow kpis={kpis} isCurrentMonth={isCurrentMonth} />
                    </div>
                    <HabitGraphs habits={visibleHabits} month={selectedMonth} isCurrentMonth={isCurrentMonth} />
                    <div style={{ marginTop: "24px", borderRadius: "12px", overflow: "hidden", minWidth: 0 }}>
                      <DashboardGrid
                        habits={visibleHabits}
                        monthDates={monthDates}
                        today={today}
                        toggleHabit={toggleHabit}
                        gridScrollRef={gridScrollRef}
                        isFutureDate={isFutureDate}
                        theme={theme}
                        monthLabel={monthLabel}
                        goToPreviousMonth={goToPreviousMonth}
                        goToNextMonth={goToNextMonth}
                        setTheme={setTheme}
                      />
                    </div>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: 260,
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                    }}
                  >
                    <div style={{ height: KPI_ROW_HEIGHT }}>
                      <TopHabits habits={visibleHabits} currentYear={currentYear} currentMonth={currentMonth} height={KPI_ROW_HEIGHT} />
                    </div>
                    <TodoNotes />
                    <HabitProgressColumn habits={visibleHabits} currentMonth={selectedMonth} />
                  </div>
                </div>
              </SortableContext>
            </DndContext>
          )}
        </>
      )}

      {showUndo && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(15,23,42,0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#e2e8f0",
            padding: "12px 18px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: "13px",
            fontWeight: 500,
            zIndex: 1000,
            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
            animation: "slideUp 0.3s cubic-bezier(.4,0,.2,1)",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
            Habit deleted
          </span>
          <button
            onClick={undoDelete}
            style={{
              background: "rgba(96,165,250,0.12)",
              border: "1px solid rgba(96,165,250,0.25)",
              color: "#60a5fa",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "12px",
              padding: "4px 10px",
              borderRadius: "6px",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.04em",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(96,165,250,0.22)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(96,165,250,0.12)"}
          >
            UNDO
          </button>
        </div>
      )}

      </div>
    </div>
  );
}

export default Dashboard;
