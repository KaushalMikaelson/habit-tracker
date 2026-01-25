import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import AddHabitModal from "../../components/AddHabitModal.jsx";
import DashboardHeader from "./DashboardHeader.jsx";
import DashboardGrid from "./DashboardGrid.jsx";
import DashboardLayout from "./DashboardLayout.js";

import KpiRingRow from "../../components/kpi/KpiRingRow.jsx";
import KpiIntroBox from "../../components/kpi/KpiIntroBox.jsx";

import HabitNameColumn from "../../components/habits/HabitNameColumn.jsx";
import useHabits from "../../hooks/useHabits";
import {
  LEFT_COLUMN_WIDTH,
  RIGHT_COLUMN_WIDTH,
} from "./DashboardLayout.constants";

import { calculateKPIs } from "../../components/kpi/calculations";
import TopHabits from "../../components/stats/TopHabits";



import {
  getCurrentYearMonth,
  getMonthDates,
  getMonthLabel,
} from "../../utils/dateUtils";

/* ================= Constants ================= */

const KPI_ROW_HEIGHT = 170;


/* ================= Helpers ================= */

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

/* ================= Dashboard ================= */

function Dashboard() {
  const today = getTodayDate();

  const {
    habits,
    addHabit,
    toggleHabit,
    deleteHabit,
    undoDelete,
    showUndo,
  } = useHabits(today);




const [newHabit, setNewHabit] = useState("");
const [showModal, setShowModal] = useState(false);

const initialYearMonth = getCurrentYearMonth();
const [currentYear, setCurrentYear] = useState(initialYearMonth.year);
const [currentMonth, setCurrentMonth] = useState(initialYearMonth.month);

const monthDates = getMonthDates(currentYear, currentMonth);
const monthLabel = getMonthLabel(currentYear, currentMonth);

const gridScrollRef = useRef(null);


const selectedMonth = dayjs(`${currentYear}-${currentMonth + 1}-01`);
const isCurrentMonth = selectedMonth.isSame(dayjs(), "month");



const kpis = calculateKPIs(
  Array.isArray(habits) ? habits : [],
  selectedMonth
);


  /* ---------- Auto-scroll to Today ---------- */
  useEffect(() => {
    if (!gridScrollRef.current) return;

    const todayIndex = monthDates.findIndex((d) => d === today);
    if (todayIndex === -1) return;

    const columnWidth = 34;
    gridScrollRef.current.scrollTo({
      left: Math.max(todayIndex * columnWidth - 6 * columnWidth, 0),
      behavior: "smooth",
    });
  }, [monthDates, today]);

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
    const isCurrentMonth =
      currentYear === now.getFullYear() &&
      currentMonth === now.getMonth();

    if (isCurrentMonth) return;

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

  /* ================= Render ================= */

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#a2c6deff",
      }}
    >
      {/* ================= Top Header ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "56px",
          padding: "0 16px",
          borderBottom: "1px solid #e5e7eb",
          background: "#ffffff",
        }}
      >
        <div>
          <div style={{ fontSize: "16px", fontWeight: 700 }}>
            Habit Tracker
          </div>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>
            Track your consistency
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            border: "none",
            background: "#2563eb",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add Habit
        </button>
      </div>

      {/* ================= Modal ================= */}
      <AddHabitModal
        showModal={showModal}
        setShowModal={setShowModal}
        newHabit={newHabit}
        setNewHabit={setNewHabit}
        addHabit={handleAddHabit}
      />

      {/* ================= Content ================= */}
      {habits.length === 0 ? (
        <div style={{ marginTop: "48px", textAlign: "center" }}>
          <h2>No habits yet</h2>
          <p style={{ color: "#6b7280" }}>
            Click “Add Habit” to get started
          </p>
        </div>
      ) : (
        <DashboardLayout>
          {/* ================= LEFT COLUMN ================= */}
          <div
            style={{
              width: LEFT_COLUMN_WIDTH,
              minWidth: LEFT_COLUMN_WIDTH,
              display: "flex",
              flexDirection: "column",
              gap: "40px",
            }}
          >
            {/* KPI INTRO */}
            <div style={{ height: KPI_ROW_HEIGHT }}>
              <KpiIntroBox />
            </div>

            {/* HABITS COLUMN */}
            <HabitNameColumn
              habits={habits}
              deleteHabit={deleteHabit}
            />
          </div>

          {/* ================= CENTER COLUMN ================= */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              minWidth: 0, // 🔥 CRITICAL: prevents overflow
            }}
          >

            {/* KPI RING Row */}
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
              <KpiRingRow kpis={kpis} isCurrentMonth={isCurrentMonth} />

            </div>

            {/* CALENDAR */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                overflow: "hidden",
                minWidth: 0,
              }}
            >
              <DashboardHeader
                monthLabel={monthLabel}
                goToPreviousMonth={goToPreviousMonth}
                goToNextMonth={goToNextMonth}
              />

              <DashboardGrid
                habits={habits}
                monthDates={monthDates}
                today={today}
                toggleHabit={toggleHabit}
                deleteHabit={deleteHabit}
                gridScrollRef={gridScrollRef}
                isFutureDate={isFutureDate}
              />
            </div>
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div
            style={{
              width: RIGHT_COLUMN_WIDTH,
              minWidth: RIGHT_COLUMN_WIDTH,
              display: "flex",
              flexDirection: "column",
              alignSelf: "flex-start",
            }}
          >
            <TopHabits
              habits={habits}
              currentYear={currentYear}
              currentMonth={currentMonth}
              height={KPI_ROW_HEIGHT}
            />
          </div>
        </DashboardLayout>

      )}

      {/* ================= Undo Snackbar ================= */}
      {showUndo && (
        <div
          style={{
            position: "fixed",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#111827",
            color: "#ffffff",
            padding: "10px 14px",
            borderRadius: "8px",
            display: "flex",
            gap: "12px",
            fontSize: "13px",
            zIndex: 1000,
          }}
        >
          <span>Habit deleted</span>
          <button
            onClick={undoDelete}
            style={{
              background: "transparent",
              border: "none",
              color: "#60a5fa",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            UNDO
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
