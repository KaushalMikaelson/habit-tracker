import { useState, useEffect, useRef } from "react";

import AddHabitModal from "../../components/AddHabitModal";
import DashboardHeader from "./DashboardHeader";
import DashboardGrid from "./DashboardGrid";

import { useHabits } from "../../hooks/useHabits";

import {
  getCurrentYearMonth,
  getMonthDates,
  getMonthLabel,
} from "../../utils/dateUtils";

/* Helpers                                                   */


function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}


/* Dashboard Component                                       */

function Dashboard() {
  /* ------------------ Date (Today) ------------------ */

  const today = getTodayDate();

  /* ------------------ Habits Logic (Hook) ------------------ */

  const {
    habits,
    addHabit,
    toggleHabit,
    deleteHabit,
    undoDelete,
    showUndo,
  } = useHabits(today);

  /* ------------------ UI State ------------------ */

  const [newHabit, setNewHabit] = useState("");
  const [showModal, setShowModal] = useState(false);

  /* ------------------ Month / Calendar State ------------------ */

  const initialYearMonth = getCurrentYearMonth();

  const [currentYear, setCurrentYear] = useState(initialYearMonth.year);
  const [currentMonth, setCurrentMonth] = useState(initialYearMonth.month);

  const monthDates = getMonthDates(currentYear, currentMonth);
  const monthLabel = getMonthLabel(currentYear, currentMonth);

  /* ------------------ Grid Scroll Ref ------------------ */

  const gridScrollRef = useRef(null);

  /* ------------------ Auto-scroll to Today ------------------ */

  useEffect(() => {
    if (!gridScrollRef.current) return;

    const todayIndex = monthDates.findIndex(
      (date) => date === today
    );

    if (todayIndex === -1) return;

    const columnWidth = 34;
    const scrollPosition =
      todayIndex * columnWidth - 6 * columnWidth;

    gridScrollRef.current.scrollTo({
      left: Math.max(scrollPosition, 0),
      behavior: "smooth",
    });
  }, [monthDates, today]);

  /* ------------------ Utility Functions ------------------ */

  function isFutureDate(date) {
    return date > today;
  }

  /* ------------------ Month Navigation ------------------ */

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

  /* ------------------ Add Habit Handler ------------------ */

  function handleAddHabit() {
    if (!newHabit.trim()) return;

    addHabit(newHabit);
    setNewHabit("");
    setShowModal(false);
  }

  /* Render                                                   */

  return (
    <div>
      {/* ================= App Header ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          marginBottom: "12px",
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        {/* Title */}
        <div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Habit Tracker
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "#6b7280",
              marginTop: "2px",
            }}
          >
            Track your daily consistency
          </div>
        </div>

        {/* Add Habit Button */}
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add Habit
        </button>
      </div>

      {/* ================= Add Habit Modal ================= */}
      <AddHabitModal
        showModal={showModal}
        setShowModal={setShowModal}
        newHabit={newHabit}
        setNewHabit={setNewHabit}
        addHabit={handleAddHabit}
      />

      {/* ================= Habit Grid Card ================= */}
      <div
        style={{
          marginTop: "24px",
          background: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        {/* Month Toolbar */}
        <DashboardHeader
          monthLabel={monthLabel}
          goToPreviousMonth={goToPreviousMonth}
          goToNextMonth={goToNextMonth}
        />

        {/* Grid */}
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

      {/* ================= Undo Snackbar ================= */}
      {showUndo && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#323232",
            color: "white",
            padding: "10px 16px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "14px",
            zIndex: 1000,
          }}
        >
          <span>Habit deleted</span>
          <button
            onClick={undoDelete}
            style={{
              background: "transparent",
              border: "none",
              color: "#4fc3f7",
              cursor: "pointer",
              fontWeight: 600,
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
