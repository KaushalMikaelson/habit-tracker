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
import MomentumFlame from "../../components/MomentumFlame.jsx";
import DashboardHeader from "./DashboardHeader.jsx";
import DashboardGrid from "./DashboardGrid.jsx";
import DashboardLayout from "./DashboardLayout.js";

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
import {
  LEFT_COLUMN_WIDTH,
  RIGHT_COLUMN_WIDTH,
} from "./DashboardLayout.constants";

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






/* ================= Skeleton Loader ================= */

function DashboardSkeleton() {
  return (
    <div style={{ padding: "32px" }}>
      <div
        style={{
          height: "170px",
          background: "#1f2937",
          borderRadius: "16px",
          marginBottom: "24px",
          animation: "pulse 1.5s infinite",
        }}
      />
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            height: "48px",
            background: "#111827",
            borderRadius: "8px",
            marginBottom: "12px",
            animation: "pulse 1.5s infinite",
          }}
        />
      ))}
    </div>
  );
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

function ProfileSidebar({ user, onClose, onLogout }) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          zIndex: 1500,
        }}
      />

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: "300px",
          background: "#0f172a",
          color: "white",
          padding: "24px",
          zIndex: 2000,
          boxShadow: "-4px 0 20px rgba(0,0,0,0.4)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          animation: "slideInRight 0.3s ease",
        }}
      >
        {/* TOP SECTION */}
        <div>
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: 700,
                marginBottom: "12px",
              }}
            >
              {getInitials(user?.email || "")}

            </div>

            <div style={{ fontSize: "16px", fontWeight: 700 }}>
              {user.name}
            </div>

            <div style={{ fontSize: "13px", color: "#94a3b8" }}>
              {user.email}
            </div>
          </div>

          <hr style={{ borderColor: "rgba(255,255,255,0.1)" }} />

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <button style={menuBtnStyle}>Profile</button>
            <button style={menuBtnStyle}>Settings</button>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div>
          <button
            style={{
              ...menuBtnStyle,
              color: "#f87171",
              fontWeight: 600,
            }}
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}
      </style>
    </>
  );
}

const menuBtnStyle = {
  background: "transparent",
  border: "none",
  color: "white",
  textAlign: "left",
  fontSize: "14px",
  cursor: "pointer",
};


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
  } = useHabits(today);

  const [newHabit, setNewHabit] = useState("");
  const [showModal, setShowModal] = useState(false);

  const initialYearMonth = getCurrentYearMonth();
  const [currentYear, setCurrentYear] = useState(initialYearMonth.year);
  const [currentMonth, setCurrentMonth] = useState(initialYearMonth.month);

  const monthDates = getMonthDates(currentYear, currentMonth);
  const monthLabel = getMonthLabel(currentYear, currentMonth);

  const gridScrollRef = useRef(null);
  const hasAutoScrolledRef = useRef(false);

  const selectedMonth = dayjs(`${currentYear}-${currentMonth + 1}-01`);
  const isCurrentMonth = selectedMonth.isSame(dayjs(), "month");

  const [theme, setTheme] = useState("dark");
  const [showProfilePanel, setShowProfilePanel] = useState(false);


  const kpis = calculateKPIs(
    Array.isArray(habits) ? habits : [],
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

  function handleAddHabit() {
    if (!newHabit.trim()) return;
    addHabit(newHabit);
    setNewHabit("");
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
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse 1400px 700px at 15% -5%, #334155 0%, #1e293b 45%, #020617 100%)",
      }}
    >
      <style>
        {`
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(200%); }
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
          background: "rgba(2, 6, 23, 0.7)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* LEFT SIDE - BRAND */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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

        {/* RIGHT SIDE - BUTTON GROUP */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <MomentumFlame
            momentumDelta={kpis.momentumDelta}
            momentum={kpis.momentum}
            monthly={kpis.monthly}
          />
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

          <button
            onClick={() => setShowProfilePanel(true)}
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              border: "2px solid rgba(37,99,235,0.4)",
              background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "13px",
              letterSpacing: "0.5px",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(37,99,235,0.4)",
              transition: "all 0.2s ease",
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(37,99,235,0.55)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(37,99,235,0.4)"; }}
            onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.94)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
          >
            {getInitials(user?.email || "")}
          </button>
        </div>
      </div>


      <AddHabitModal
        showModal={showModal}
        setShowModal={setShowModal}
        newHabit={newHabit}
        setNewHabit={setNewHabit}
        addHabit={handleAddHabit}
      />

      {loading && <TopLoadingBar />}


      {loading ? (
        <>
          <div
            style={{
              textAlign: "center",
              marginTop: "40px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#94a3b8",
            }}
          >
            Loading your habits...
          </div>

          <DashboardSkeleton />
        </>

      ) : habits.length === 0 ? (
        <div style={{ marginTop: "48px", textAlign: "center" }}>
          <h2>No habits yet</h2>
          <p style={{ color: "#6b7280" }}>
            Click “Add Habit” to get started
          </p>
        </div>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={habits.map(h => h._id)}
            strategy={verticalListSortingStrategy}
          >
            <DashboardLayout>
              {/* LEFT */}
              <div
                style={{
                  width: LEFT_COLUMN_WIDTH,
                  minWidth: LEFT_COLUMN_WIDTH,
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px", // ✅ restored to first file
                }}
              >
                <div style={{ height: KPI_ROW_HEIGHT }}> {/* ✅ restored */}
                  <KpiIntroBox />
                </div>

                <TodayFocus habits={habits} onToggle={toggleHabit} />

                <div style={{ marginTop: "-30px" }} />

                <HabitNameColumn
                  habits={habits}
                  deleteHabit={deleteHabit}
                  editHabit={editHabit}
                />
              </div>

              {/* CENTER */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    height: KPI_ROW_HEIGHT,
                    background:
                      "linear-gradient(180deg, rgba(15,23,42,0.85), rgba(2,6,23,0.85))",
                    borderRadius: "16px",
                    padding: "12px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <KpiRingRow
                    kpis={kpis}
                    isCurrentMonth={isCurrentMonth}
                  />
                </div>

                <div style={{ marginTop: "-40px" }} />

                <HabitGraphs
                  habits={habits}
                  month={selectedMonth}
                  isCurrentMonth={isCurrentMonth}
                />

                <div
                  style={{
                    background: "transparent",
                    borderRadius: "12px",
                    overflow: "hidden",
                    minWidth: 0,
                  }}
                >
                  <DashboardHeader
                    monthLabel={monthLabel}
                    goToPreviousMonth={goToPreviousMonth}
                    goToNextMonth={goToNextMonth}
                    theme={theme}
                    setTheme={setTheme}
                  />

                  <DashboardGrid
                    habits={habits}
                    monthDates={monthDates}
                    today={today}
                    toggleHabit={toggleHabit}
                    gridScrollRef={gridScrollRef}
                    isFutureDate={isFutureDate}
                    theme={theme}
                  />
                </div>
              </div>

              {/* RIGHT */}
              <div
                style={{
                  width: RIGHT_COLUMN_WIDTH,
                  minWidth: RIGHT_COLUMN_WIDTH,
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  alignSelf: "flex-start",
                }}
              >
                <TopHabits
                  habits={habits}
                  currentYear={currentYear}
                  currentMonth={currentMonth}
                  height={KPI_ROW_HEIGHT}
                />

                <TodoNotes />
                <div style={{ marginTop: "10px" }} />

                <HabitProgressColumn
                  habits={habits}
                  currentMonth={selectedMonth}
                />
              </div>
            </DashboardLayout>
          </SortableContext>
        </DndContext>

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
      {showProfilePanel && (
        <ProfileSidebar
          user={user}
          onClose={() => setShowProfilePanel(false)}
          onLogout={() => {
            setShowProfilePanel(false);
            logout();
          }}

        />
      )}


    </div>
  );
}

export default Dashboard;
