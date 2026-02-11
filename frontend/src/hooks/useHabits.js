import { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  getHabits,
  createHabit,
  toggleHabit as toggleHabitApi,
  deleteHabit as deleteHabitApi,
  undoDelete as undoDeleteApi,
  updateHabit as updateHabitApi,
  reorderHabits as reorderHabitsApi, // ✅ NEW (ONLY addition)
} from "../api/habits";

export default function useHabits() {
  const { user } = useAuth();

  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [recentlyDeleted, setRecentlyDeleted] = useState(null);
  const [showUndo, setShowUndo] = useState(false);

  const undoTimerRef = useRef(null);

  /* ---------- Fetch Habits ---------- */
  useEffect(() => {
    if (!user) {
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
      setHabits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch habits:", err);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Add Habit ---------- */
  const addHabit = async (title) => {
    try {
      const newHabit = await createHabit({ title });
      setHabits((prev) =>
        Array.isArray(prev) ? [...prev, newHabit] : [newHabit]
      );
    } catch (err) {
      console.error("Failed to add habit:", err);
      alert("Failed to add habit.");
    }
  };

  /* ---------- Edit Habit ---------- */
  const editHabit = async (id, newTitle) => {
    let snapshot = [];

    setHabits((prev) => {
      snapshot = prev;
      return Array.isArray(prev)
        ? prev.map((h) =>
            h._id === id ? { ...h, title: newTitle } : h
          )
        : [];
    });

    try {
      const updatedHabit = await updateHabitApi(id, {
        title: newTitle,
      });

      setHabits((prev) =>
        Array.isArray(prev)
          ? prev.map((h) => (h._id === id ? updatedHabit : h))
          : []
      );
    } catch (err) {
      console.error("Failed to edit habit:", err);
      setHabits(snapshot);
      alert("Failed to update habit.");
    }
  };

  /* ---------- Toggle Habit ---------- */
  const toggleHabit = async (id, date) => {
    let snapshot = [];

    setHabits((prev) => {
      snapshot = prev;
      return Array.isArray(prev)
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
        : [];
    });

    try {
      const updatedHabit = await toggleHabitApi(id, date);
      setHabits((prev) =>
        Array.isArray(prev)
          ? prev.map((h) => (h._id === id ? updatedHabit : h))
          : []
      );
    } catch (err) {
      console.error("Failed to toggle habit:", err);
      setHabits(snapshot);
    }
  };

  /* ---------- Delete Habit ---------- */
  const deleteHabit = async (id) => {
    if (!Array.isArray(habits)) return;

    const habitToDelete = habits.find((h) => h._id === id);
    if (!habitToDelete) return;

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
      setHabits((prev) =>
        Array.isArray(prev) ? [...prev, habitToDelete] : [habitToDelete]
      );
      setRecentlyDeleted(null);
      setShowUndo(false);
    }
  };

  /* ---------- Undo Delete ---------- */
  const undoDelete = async () => {
    if (!recentlyDeleted) return;

    setHabits((prev) =>
      Array.isArray(prev) ? [...prev, recentlyDeleted] : [recentlyDeleted]
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
      setHabits((prev) =>
        prev.filter((h) => h._id !== recentlyDeleted._id)
      );
    }
  };

  /* ---------- ✅ Persist Drag Reorder (ONLY NEW LOGIC) ---------- */
  const reorderHabits = async (newHabits) => {
    if (!Array.isArray(newHabits)) return;

    // optimistic UI (existing behavior preserved)
    setHabits(newHabits);

    try {
      await reorderHabitsApi(
        newHabits.map((h, index) => ({
          _id: h._id,
          order: index,
        }))
      );
    } catch (err) {
      console.error("Failed to persist habit order", err);
    }
  };

  return {
    habits,
    loading,
    addHabit,
    editHabit,
    toggleHabit,
    deleteHabit,
    undoDelete,
    showUndo,
    reorderHabits,
  };
}
