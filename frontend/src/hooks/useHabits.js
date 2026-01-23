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

  // 🔥 ALWAYS keep habits as an array
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [recentlyDeleted, setRecentlyDeleted] = useState(null);
  const [showUndo, setShowUndo] = useState(false);

  const undoTimerRef = useRef(null);

  /* ---------- Fetch Habits (user-aware) ---------- */
  useEffect(() => {
    if (!user) {
      // User logged out → reset state safely
      setHabits([]);
      setLoading(false);
      return;
    }

    fetchHabits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const data = await getHabits();

      // ✅ HARD GUARANTEE: habits is ALWAYS an array
      setHabits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch habits:", err);
      setHabits([]); // 🔥 prevents render crash
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Add Habit ---------- */
  const addHabit = async (title) => {
    try {
      const newHabit = await createHabit({ title });

      // Defensive append
      setHabits((prev) =>
        Array.isArray(prev) ? [newHabit, ...prev] : [newHabit]
      );
    } catch (err) {
      console.error("Failed to add habit:", err);
      alert("Failed to add habit. Please try again.");
    }
  };

  /* ---------- Toggle Habit ---------- */
  const toggleHabit = async (id, date) => {
    const previousHabits = habits;

    // Optimistic update (safe)
    setHabits((prev) =>
      Array.isArray(prev)
        ? prev.map((h) => {
            if (h._id === id) {
              const completedDates = Array.isArray(h.completedDates)
                ? h.completedDates
                : [];

              const isCompleted = completedDates.includes(date);

              return {
                ...h,
                completedDates: isCompleted
                  ? completedDates.filter((d) => d !== date)
                  : [...completedDates, date],
              };
            }
            return h;
          })
        : []
    );

    try {
      const updatedHabit = await toggleHabitApi(id, date);
      setHabits((prev) =>
        Array.isArray(prev)
          ? prev.map((h) => (h._id === id ? updatedHabit : h))
          : []
      );
    } catch (err) {
      console.error("Failed to toggle habit:", err);
      setHabits(previousHabits); // rollback
      alert("Failed to toggle habit. Please try again.");
    }
  };

  /* ---------- Delete Habit (Soft Delete + Undo) ---------- */
  const deleteHabit = async (id) => {
    if (!Array.isArray(habits)) return;

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
      setHabits((prev) => [habitToDelete, ...prev]);
      setRecentlyDeleted(null);
      setShowUndo(false);
      alert("Failed to delete habit. Please try again.");
    }
  };

  /* ---------- Undo Delete ---------- */
  const undoDelete = async () => {
    if (!recentlyDeleted) return;

    // Restore immediately for UX
    setHabits((prev) =>
      Array.isArray(prev) ? [recentlyDeleted, ...prev] : [recentlyDeleted]
    );

    setRecentlyDeleted(null);
    setShowUndo(false);

    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }

    try {
      await undoDeleteApi(recentlyDeleted._id);
    } catch (err) {
      console.error("Failed to undo delete:", err);
      setHabits((prev) =>
        prev.filter((h) => h._id !== recentlyDeleted._id)
      );
    }
  };

  return {
    habits,   // ✅ ALWAYS array
    loading,
    addHabit,
    toggleHabit,
    deleteHabit,
    undoDelete,
    showUndo,
  };
}
