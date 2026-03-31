import api from "./axios";

// Fetch both focusItems and reminders for the logged-in user
export async function fetchUserData() {
  const res = await api.get("/api/userdata");
  return res.data; // { focusItems, reminders }
}

// Save today's focus items (full replace for today's date)
export async function saveFocusItems(items, date) {
  const res = await api.put("/api/userdata/focus", { items, date });
  return res.data.focusItems;
}

// Save all reminders (full replace)
export async function saveReminders(items) {
  const res = await api.put("/api/userdata/reminders", { items });
  return res.data.reminders;
}
