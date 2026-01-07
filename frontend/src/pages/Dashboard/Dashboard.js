import { useState, useEffect, useRef } from "react";

import AddHabitModal from "../../components/AddHabitModal.jsx";
import DashboardHeader from "./DashboardHeader.jsx";
import DashboardGrid from "./DashboardGrid.jsx";

import { useHabits } from "../../hooks/useHabits";

import {
  getCurrentYearMonth,
  getMonthDates,
  getMonthLabel,
} from "../../utils/dateUtils";

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
        background: "#ffffff",     // system white
        margin: 0,
        padding: 0,               // ✅ NO OUTER GAP
      }}
    >
      {/* ================= Top Header ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "56px",
          padding: "0 16px",       // minimal horizontal padding
          borderBottom: "1px solid #e5e7eb",
          background: "#ffffff",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Habit Tracker
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#6b7280",
            }}
          >
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
        <div
          style={{
            marginTop: "48px",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: 700 }}>
            No habits yet
          </h2>
          <p style={{ fontSize: "13px", color: "#6b7280" }}>
            Click “Add Habit” to get started
          </p>
        </div>
      ) : (
        <div
          style={{
            borderBottom: "1px solid #e5e7eb",
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
