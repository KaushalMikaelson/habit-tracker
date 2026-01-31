import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import AddHabitModal from "../../components/AddHabitModal.jsx";
import DashboardHeader from "./DashboardHeader.jsx";
import DashboardGrid from "./DashboardGrid.jsx";
import DashboardLayout from "./DashboardLayout.js";

import KpiRingRow from "../../components/kpi/KpiRingRow.jsx";
import KpiIntroBox from "../../components/kpi/KpiIntroBox.jsx";

import HabitNameColumn from "../../components/habits/HabitNameColumn.jsx";
import HabitProgressColumn from "../../components/habits/HabitProgressColumn.jsx";
import useHabits from "../../hooks/useHabits";
import {
  LEFT_COLUMN_WIDTH,
  RIGHT_COLUMN_WIDTH,
} from "./DashboardLayout.constants";
import HabitGraphs from "../../components/habits/HabitGraph";

import { calculateKPIs } from "../../components/kpi/calculations";
import TopHabits from "../../components/stats/TopHabits";

import TodoNotes from "../../components/Todo/TodoNotes";
import TodayFocus from "../../components/Todo/TodayFocus";

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
  const hasAutoScrolledRef = useRef(false); // ✅ FIX

  const selectedMonth = dayjs(`${currentYear}-${currentMonth + 1}-01`);
  const isCurrentMonth = selectedMonth.isSame(dayjs(), "month");

  const [theme, setTheme] = useState("dark");

  const kpis = calculateKPIs(
    Array.isArray(habits) ? habits : [],
    selectedMonth
  );

  /* ---------- Auto-scroll to Today (ONCE) ---------- */
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

  /* ---------- Reset auto-scroll when month changes ---------- */
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

  /* ================= Render ================= */

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 600px at 20% -10%, #475569 0%, #1e293b 60%)",
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
          background: "rgba(30, 41, 59, 0.75)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
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
          {/* LEFT COLUMN */}
          <div
            style={{
              width: LEFT_COLUMN_WIDTH,
              minWidth: LEFT_COLUMN_WIDTH,
              display: "flex",
              flexDirection: "column",
              gap: "40px",
            }}
          >
            <div style={{ height: KPI_ROW_HEIGHT }}>
              <KpiIntroBox />
            </div>

            <TodayFocus habits={habits} onToggle={toggleHabit} />

            <div style={{ marginTop: "-62px" }} />

            <HabitNameColumn
              habits={habits}
              deleteHabit={deleteHabit}
              editHabit={editHabit}
            />

          </div>

          {/* CENTER COLUMN */}
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

          {/* RIGHT COLUMN */}
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

            <HabitProgressColumn habits={habits} />

            <div style={{ height: "15px" }} />
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
