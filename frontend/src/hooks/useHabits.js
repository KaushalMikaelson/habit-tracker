import { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  getHabits,
  createHabit,
  toggleHabit as toggleHabitApi,
  deleteHabit as deleteHabitApi,
  undoDelete as undoDeleteApi,
} from "../api/habits";

export default function useHabits() {
  const { user } = useAuth();

  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [recentlyDeleted, setRecentlyDeleted] = useState(null);
  const [showUndo, setShowUndo] = useState(false);

  const undoTimerRef = useRef(null);

  /* ---------- Fetch Habits (user-aware) ---------- */
  useEffect(() => {
    if (!user) {
      // 🔥 Clear habits on logout
      setHabits([]);
      setLoading(false);
      return;
    }

    fetchHabits();
  }, [user]);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const data = await getHabits();
      setHabits(data);
    } catch (err) {
      console.error("Failed to fetch habits:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Add Habit ---------- */
  const addHabit = async (title) => {
    try {
      const newHabit = await createHabit({ title });
      setHabits((prev) => [newHabit, ...prev]);
    } catch (err) {
      console.error("Failed to add habit:", err);
      alert("Failed to add habit. Please try again.");
    }
  };

  /* ---------- Toggle Habit ---------- */
  const toggleHabit = async (id, date) => {
    // Optimistic update
    const previousHabits = habits;
    setHabits((prev) =>
      prev.map((h) => {
        if (h._id === id) {
          const isCompleted = h.completedDates?.includes(date);
          return {
            ...h,
            completedDates: isCompleted
              ? h.completedDates.filter((d) => d !== date)
              : [...(h.completedDates || []), date],
          };
        }
        return h;
      })
    );

    try {
      const updatedHabit = await toggleHabitApi(id, date);
      setHabits((prev) =>
        prev.map((h) => (h._id === id ? updatedHabit : h))
      );
    } catch (err) {
      console.error("Failed to toggle habit:", err);
      // Rollback on error
      setHabits(previousHabits);
      alert("Failed to toggle habit. Please try again.");
    }
  };

  /* ---------- Delete Habit (Soft Delete + Undo) ---------- */
  const deleteHabit = async (id) => {
    const habitToDelete = habits.find((h) => h._id === id);
    if (!habitToDelete) return;

    // Optimistic UI update
    setHabits((prev) => prev.filter((h) => h._id !== id));

    setRecentlyDeleted(habitToDelete);
    setShowUndo(true);

    try {
      await deleteHabitApi(id);

      undoTimerRef.current = setTimeout(() => {
        setShowUndo(false);
        setRecentlyDeleted(null);
      }, 10000);
    } catch (err) {
      console.error("Failed to delete habit:", err);
      // Rollback on error
      setHabits((prev) => [habitToDelete, ...prev]);
      setRecentlyDeleted(null);
      setShowUndo(false);
      alert("Failed to delete habit. Please try again.");
    }
  };

  /* ---------- Undo Delete ---------- */
  const undoDelete = async () => {
    if (!recentlyDeleted) return;

    // Restore in frontend immediately for better UX
    setHabits((prev) => [recentlyDeleted, ...prev]);
    setRecentlyDeleted(null);
    setShowUndo(false);

    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }

    // Call backend to restore the habit in the database
    try {
      await undoDeleteApi(recentlyDeleted._id);
    } catch (err) {
      console.error("Failed to undo delete:", err);
      // If backend fails, remove from frontend state
      setHabits((prev) => prev.filter((h) => h._id !== recentlyDeleted._id));
    }
  };

  return {
    habits,
    loading,
    addHabit,
    toggleHabit,
    deleteHabit,
    undoDelete,
    showUndo,
  };
}
