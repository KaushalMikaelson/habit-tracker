import { useState, useEffect } from "react";

export function useHabits(today) {
  const [habits, setHabits] = useState([]);

  const [recentlyDeleted, setRecentlyDeleted] = useState(null);
  const [showUndo, setShowUndo] = useState(false);

  /* ---------- Load from localStorage ---------- */
  useEffect(() => {
    const storedHabits = localStorage.getItem("habits");
    if (storedHabits) {
      setHabits(JSON.parse(storedHabits));
    }
  }, []);

  /* ---------- Save to localStorage ---------- */
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  /* ---------- Toggle Habit ---------- */
  function toggleHabit(id, date) {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id !== id) return habit;

        const completedDates = Array.isArray(habit.completedDates)
          ? habit.completedDates
          : [];

        const isDone = completedDates.includes(date);

        return {
          ...habit,
          completedDates: isDone
            ? completedDates.filter((d) => d !== date)
            : [...completedDates, date],
        };
      })
    );
  }

  /* ---------- Add Habit ---------- */
  function addHabit(title) {
    if (!title.trim()) return;

    setHabits((prev) => [
      ...prev,
      {
        id: Date.now(),
        title,
        createdAt: today,
        completedDates: [],
      },
    ]);
  }

  /* ---------- Delete Habit (with Undo) ---------- */
  function deleteHabit(id) {
    setHabits((prevHabits) => {
      const habitToDelete = prevHabits.find((h) => h.id === id);

      setRecentlyDeleted(habitToDelete);
      setShowUndo(true);

      setTimeout(() => {
        setShowUndo(false);
        setRecentlyDeleted(null);
      }, 10000);

      return prevHabits.filter((h) => h.id !== id);
    });
  }

  /* ---------- Undo Delete ---------- */
  function undoDelete() {
    if (!recentlyDeleted) return;

    setHabits((prev) => [recentlyDeleted, ...prev]);
    setRecentlyDeleted(null);
    setShowUndo(false);
  }

  return {
    habits,
    addHabit,
    toggleHabit,
    deleteHabit,
    undoDelete,
    showUndo,
  };
}
