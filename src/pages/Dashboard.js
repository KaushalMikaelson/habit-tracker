import { useState, useEffect, useRef } from "react";

import HabitList from "../components/HabitList";
import AddHabitModal from "../components/AddHabitModal";

import {
  getCurrentYearMonth,
  getMonthDates,
  getMonthLabel,
} from "../utils/dateUtils";

/* ========================================================= */
/* Helpers                                                   */
/* ========================================================= */

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}


/* ========================================================= */
/* Fixed Habit Name Column                                   */
/* ========================================================= */

function HabitNameColumn({ habits }) {
  const ROW_HEIGHT = 38;

  return (
    <div
      style={{
        width: "200px",
        flexShrink: 0,
        borderRight: "1px solid #e5e7eb",
        background: "#ffffff",
      }}
    >
      {habits.map((habit) => (
        <div
          key={habit.id}
          style={{
            height: ROW_HEIGHT,
            display: "flex",
            alignItems: "center",
            paddingLeft: "12px",
            borderBottom: "1px solid #f1f5f9",
            fontSize: "14px",
          }}
        >
          {habit.title}
        </div>
      ))}
    </div>
  );
}







/* ==================Dashboard ================== */


function Dashboard() {
  /* ------------------ Core State ------------------ */

  const today = getTodayDate();

  const [newHabit, setNewHabit] = useState("");
  const [habits, setHabits] = useState([
    { id: 1, title: "Drink Water", createdAt: today, completedDates: [] },
    { id: 2, title: "Exercise", createdAt: today, completedDates: [] },
    { id: 3, title: "Read Book", createdAt: today, completedDates: [] },
  ]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  /* ------------------ Date Grid State ------------------ */

  const initialYearMonth = getCurrentYearMonth();

  const [currentYear, setCurrentYear] = useState(initialYearMonth.year);
  const [currentMonth, setCurrentMonth] = useState(initialYearMonth.month);

  const monthDates = getMonthDates(currentYear, currentMonth);
  const monthLabel = getMonthLabel(currentYear, currentMonth);

  const [recentlyDeleted, setRecentlyDeleted] = useState(null);
  const [showUndo, setShowUndo] = useState(false);

  const gridScrollRef = useRef(null);
  
  useEffect(() => {
  if (!gridScrollRef.current) return;

  const todayIndex = monthDates.findIndex(
    (date) => date === today
  );

  if (todayIndex === -1) return;

  const columnWidth = 34; // must match your grid
  const scrollPosition =
    todayIndex * columnWidth - 6 * columnWidth;

  gridScrollRef.current.scrollTo({
    left: Math.max(scrollPosition, 0),
    behavior: "smooth",
  });
}, [monthDates, today]);


  /* ------------------ Persistence ------------------ */

  useEffect(() => {
    const storedHabits = localStorage.getItem("habits");
    if (storedHabits) {
      setHabits(JSON.parse(storedHabits));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits, isLoaded]);

  /* ------------------ Actions ------------------ */

  function toggleHabit(id) {
    const targetDate = selectedDate || today;

    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id !== id) return habit;

        const completedDates = Array.isArray(habit.completedDates)
          ? habit.completedDates
          : [];

        const isDone = completedDates.includes(targetDate);

        return {
          ...habit,
          completedDates: isDone
            ? completedDates.filter((d) => d !== targetDate)
            : [...completedDates, targetDate],
        };
      })
    );
  }

  function addHabit() {
    if (!newHabit.trim()) return;

    setHabits((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: newHabit,
        createdAt: today,
        completedDates: [],
      },
    ]);

    setNewHabit("");
  }

  function deleteHabit(id) {
  setHabits((prevHabits) => {
    const habitToDelete = prevHabits.find((h) => h.id === id);
    setRecentlyDeleted(habitToDelete);
    setShowUndo(true);

    // auto-hide undo after 5 seconds
    setTimeout(() => {
      setShowUndo(false);
      setRecentlyDeleted(null);
    }, 5000);

    return prevHabits.filter((h) => h.id !== id);
  });
}

function undoDelete(){
    if(!recentlyDeleted) return;

    setHabits((prev) => [recentlyDeleted, ...prev]);
    setRecentlyDeleted(null);
    setShowUndo(false);
}


  function isFutureDate(date){
    return date > today;
 }

function goToPreviousMonth() {
    if (currentMonth === 0) {
        setCurrentYear((y) => y - 1);
        setCurrentMonth(11);
    }else{
        setCurrentMonth((m) => m - 1);
    } 
}

function goToNextMonth(){
    const now = new Date();

    const isCurrentMonth =
    currentYear === now.getFullYear() && currentMonth === now.getMonth();

    if (isCurrentMonth) return; // Prevent going to future month

    if(currentMonth == 11){
        setCurrentYear((y) => y + 1);
        setCurrentMonth(0);
    }else{
        setCurrentMonth((m) => m + 1);
    }
}





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
  {/* Left: App / Page Title */}
  <div>
    <div
      style={{
        fontSize: "18px",
        fontWeight: 700,
        color: "#111827",
        lineHeight: 1.2,
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

  {/* Right: Primary Action */}
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
      boxShadow: "0 2px 6px rgba(37, 99, 235, 0.3)",
      transition: "background 0.15s ease, transform 0.1s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "#1d4ed8";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "#2563eb";
    }}
    onMouseDown={(e) => {
      e.currentTarget.style.transform = "scale(0.98)";
    }}
    onMouseUp={(e) => {
      e.currentTarget.style.transform = "scale(1)";
    }}
  >
    + Add Habit
  </button>
</div>


      <AddHabitModal
        showModal={showModal}
        setShowModal={setShowModal}
        newHabit={newHabit}
        setNewHabit={setNewHabit}
        addHabit={addHabit}
      />

    
{/* =================== HABIT GRID CARD =================== */}
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
  {/* ================= Month Toolbar (FULL WIDTH) ================= */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "48px",
      background: "#fafafa",
      borderBottom: "1px solid #e5e7eb",
      fontSize: "16px",
      fontWeight: 600,
      color: "#111827",
      
    }}
  >
    <button
      onClick={goToPreviousMonth}
      style={{
        border: "none",
        background: "transparent",
        fontSize: "18px",
        cursor: "pointer",
        padding: "0 16px",
        color: "#6b7280",
      }}
    >
      ◀
    </button>

    <span style={{ minWidth: "180px", textAlign: "center" }}>
      {monthLabel}
    </span>

    <button
      onClick={goToNextMonth}
      style={{
        border: "none",
        background: "transparent",
        fontSize: "18px",
        cursor: "pointer",
        padding: "0 16px",
        color: "#6b7280",
      }}
    >
      ▶
    </button>
  </div>

  {/* ================= GRID HEADER (HABITS + DATES) ================= */}

{/* ================= HEADERS ================= */}
{/* HEADER BLOCK */}
<div
  style={{
    display: "flex",
    borderBottom: "1px solid #e5e7eb", // ✅ SINGLE BORDER
    background: "#ffffff",
  }}
>
  {/* HABITS (spans weekday + date) */}
  <div
    style={{
      width: "200px",
      flexShrink: 0,
      height: "62px", // 26 + 36
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "0.08em",
      color: "#374151",
    }}
  >
    HABITS
  </div>

  {/* Right header (weekday + date stacked) */}
  <div style={{ width: "100%" }}>
    {/* Weekday row */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${monthDates.length}, 34px)`,
        height: "26px",
        fontSize: "11px",
        color: "#6b7280",
      }}
    >
      {monthDates.map((date) => (
        <div
          key={date}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
          })}
        </div>
      ))}
    </div>

    {/* Date row */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${monthDates.length}, 34px)`,
        height: "36px",
      }}
    >
      {monthDates.map((date) => {
        const isToday = date === today;

        return (
          <div
            key={date}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: isToday ? 700 : 400,
              color: isToday ? "#1d4ed8" : "#111827",
              background: isToday ? "#e3f2fd" : "transparent",
            }}
          >
            {date.slice(8, 10)}
          </div>
        );
      })}
    </div>
  </div>
</div>


{/* ================= HABIT GRID ================= */}
<div style={{ display: "flex" }}>
  
  {/* Fixed Habit Column */}
  <HabitNameColumn habits={habits} deleteHabit={deleteHabit} />

  {/* Scrollable Grid */}
  <div ref={gridScrollRef} style={{ overflowX: "auto", width: "100%" }}>
    <div style={{ minWidth: `${monthDates.length * 34}px` }}>
      {habits.map((habit) => (
        <div
          key={habit.id}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${monthDates.length}, 34px)`,
            height: "38px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          {monthDates.map((date) => {
            const isCompleted = habit.completedDates?.includes(date);
            const isFuture = isFutureDate(date);
            const isWeekStart = new Date(date).getDay() === 1;
            const isWeekend = [0, 6].includes(
              new Date(date).getDay()
            );

            return (
              <div
                key={date}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isWeekend ? "#f8fafc" : "transparent",
                  borderLeft: isWeekStart
                    ? "2px solid #d1fae5"
                    : "none",
                }}
              >
                <button
                  disabled={isFuture}
                  onClick={() => {
                    if (isFuture) return;
                    setSelectedDate(date);
                    toggleHabit(habit.id);
                  }}
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "6px",
                    border: "none",
                    background: isFuture
                      ? "#f3f4f6"
                      : isCompleted
                      ? "#22c55e"
                      : "#e5e7eb",
                    color: "white",
                    cursor: isFuture
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  ✓
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  </div>
</div>

{/* ================= UNDO SNACKBAR ================= */}
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
    </div>
  );




}
export default Dashboard;
