import api from "./axios";

// get all habits
export const getHabits = async () => {
  const response = await api.get("/habits");
  return response.data;
};

// create habit
export const createHabit = async (habit) => {
  const response = await api.post("/habits", habit);
  return response.data;
};

// toggle habit
export const toggleHabit = async (id, date) => {
  const response = await api.patch(`/habits/${id}/toggle`, { date });
  return response.data;
};

// delete habit
export const deleteHabit = async (id) => {
  const response = await api.delete(`/habits/${id}`);
  return response.data;
};

// undo delete
export const undoDelete = async (id) => {
  const response = await api.patch(`/habits/${id}/undo`);
  return response.data;
};

// ✅ EDIT / UPDATE HABIT (ADD THIS)
export const updateHabit = async (id, payload) => {
  const response = await api.put(`/habits/${id}`, payload);
  return response.data;
};

// ✅ NEW: persist habit order
export const reorderHabits = async (orderPayload) => {
  const response = await api.post("/habits/reorder", orderPayload);
  return response.data;
};

// ✅ UPDATE NOTE
export const updateNote = async (id, date, note) => {
  const response = await api.patch(`/habits/${id}/note`, { date, note });
  return response.data;
};
