import { useState } from "react";

const DEFAULT_CATEGORIES = [
  { value: "Health", label: "Health 🏃" },
  { value: "Work", label: "Work 💼" },
  { value: "Mindfulness", label: "Mindfulness 🧘" },
  { value: "Learning", label: "Learning 📚" },
  { value: "Household", label: "Household 🧹" },
  { value: "General", label: "General 📌" },
];

function loadCategories() {
  try {
    const saved = localStorage.getItem("habitCategories");
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return DEFAULT_CATEGORIES;
}

function saveCategories(cats) {
  localStorage.setItem("habitCategories", JSON.stringify(cats));
}

const EMOJI_OPTIONS = ["🏃","💼","🧘","📚","🧹","📌","🎯","💪","🧠","🎨","🌿","🏋️","✍️","🎵","🍎","💧","🚀","⭐","🔥","🌙"];

export default function SettingsView({ defaultStatusFilter, onDefaultStatusFilterChange }) {
  const [categories, setCategories] = useState(loadCategories);
  const [newCatName, setNewCatName] = useState("");
  const [newCatEmoji, setNewCatEmoji] = useState("🎯");
  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState("");
  const [editEmoji, setEditEmoji] = useState("");
  const [saved, setSaved] = useState(false);

  function addCategory() {
    const name = newCatName.trim();
    if (!name) return;
    const value = name.charAt(0).toUpperCase() + name.slice(1);
    if (categories.find((c) => c.value.toLowerCase() === value.toLowerCase())) return;
    const updated = [...categories, { value, label: `${value} ${newCatEmoji}` }];
    setCategories(updated);
    saveCategories(updated);
    setNewCatName("");
    setNewCatEmoji("🎯");
    flashSaved();
  }

  function removeCategory(value) {
    const updated = categories.filter((c) => c.value !== value);
    setCategories(updated);
    saveCategories(updated);
    flashSaved();
  }

  function startEdit(cat) {
    setEditingId(cat.value);
    // parse emoji and name from label
    const parts = cat.label.split(" ");
    const emoji = parts[parts.length - 1];
    const name = parts.slice(0, -1).join(" ");
    setEditLabel(name);
    setEditEmoji(emoji);
  }

  function saveEdit(cat) {
    const name = editLabel.trim();
    if (!name) return;
    const updated = categories.map((c) =>
      c.value === cat.value ? { value: name, label: `${name} ${editEmoji}` } : c
    );
    setCategories(updated);
    saveCategories(updated);
    setEditingId(null);
    flashSaved();
  }

  function resetToDefaults() {
    setCategories(DEFAULT_CATEGORIES);
    saveCategories(DEFAULT_CATEGORIES);
    flashSaved();
  }

  function flashSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const cardStyle = {
    background: "#121826",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "24px",
  };

  const sectionTitle = {
    fontSize: "16px",
    fontWeight: 700,
    color: "#f1f5f9",
    marginBottom: "6px",
  };

  const sectionSubtitle = {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "20px",
  };

  const inputStyle = {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#f1f5f9",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    transition: "border 0.2s ease",
  };

  return (
    <div
      style={{
        padding: "32px",
        maxWidth: "700px",
        margin: "0 auto",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#f1f5f9", margin: 0 }}>
          Settings
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", marginTop: "6px" }}>
          Manage your habit categories and preferences
        </p>
      </div>

      {/* Saved Toast */}
      {saved && (
        <div
          style={{
            position: "fixed",
            bottom: "28px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(16,185,129,0.15)",
            border: "1px solid rgba(16,185,129,0.3)",
            color: "#34d399",
            padding: "10px 20px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 600,
            zIndex: 999,
            animation: "fadeIn 0.2s ease",
          }}
        >
          ✓ Settings saved
        </div>
      )}

      {/* ── Default Status Filter ── */}
      <div style={cardStyle}>
        <div style={sectionTitle}>Default Habit Filter</div>
        <div style={sectionSubtitle}>
          Choose which habits are shown by default across all views.
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {[
            { value: "active", label: "Active", desc: "Only active habits" },
            { value: "archived", label: "Archived", desc: "Only archived habits" },
            { value: "all", label: "All", desc: "Show every habit" },
          ].map((opt) => {
            const isSelected = defaultStatusFilter === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => { onDefaultStatusFilterChange(opt.value); flashSaved(); }}
                style={{
                  flex: 1,
                  minWidth: "120px",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  border: isSelected
                    ? "2px solid #2563eb"
                    : "1.5px solid rgba(255,255,255,0.08)",
                  background: isSelected ? "rgba(37,99,235,0.15)" : "rgba(255,255,255,0.04)",
                  color: isSelected ? "#60a5fa" : "#94a3b8",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: "12px", color: isSelected ? "#93c5fd" : "#475569" }}>
                  {opt.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Categories ── */}
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <div style={sectionTitle}>Habit Categories</div>
            <div style={sectionSubtitle}>
              Add, rename, or remove categories used when creating habits.
            </div>
          </div>
          <button
            onClick={resetToDefaults}
            style={{
              padding: "7px 14px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent",
              color: "#64748b",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#f1f5f9"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "transparent"; }}
          >
            Reset to defaults
          </button>
        </div>

        {/* Category list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
          {categories.map((cat) => (
            <div
              key={cat.value}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {editingId === cat.value ? (
                <>
                  <select
                    value={editEmoji}
                    onChange={(e) => setEditEmoji(e.target.value)}
                    style={{ ...inputStyle, width: "60px", padding: "6px 4px", flexShrink: 0 }}
                  >
                    {EMOJI_OPTIONS.map((em) => (
                      <option key={em} value={em}>{em}</option>
                    ))}
                  </select>
                  <input
                    style={{ ...inputStyle, flex: 1 }}
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(cat)}
                    autoFocus
                  />
                  <button
                    onClick={() => saveEdit(cat)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      border: "none",
                      background: "rgba(37,99,235,0.2)",
                      color: "#60a5fa",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "8px",
                      border: "none",
                      background: "transparent",
                      color: "#64748b",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span style={{ fontSize: "18px", flexShrink: 0 }}>
                    {cat.label.split(" ").slice(-1)[0]}
                  </span>
                  <span style={{ flex: 1, fontSize: "14px", fontWeight: 500, color: "#e2e8f0" }}>
                    {cat.label.split(" ").slice(0, -1).join(" ")}
                  </span>
                  <button
                    onClick={() => startEdit(cat)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#64748b",
                      cursor: "pointer",
                      padding: "4px",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#94a3b8"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}
                    title="Edit"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeCategory(cat.value)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#64748b",
                      cursor: "pointer",
                      padding: "4px",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#f87171"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}
                    title="Remove"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" /><path d="M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add new category */}
        <div
          style={{
            padding: "16px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.02)",
            border: "1px dashed rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Add New Category
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <select
              value={newCatEmoji}
              onChange={(e) => setNewCatEmoji(e.target.value)}
              style={{ ...inputStyle, width: "60px", padding: "10px 4px", flexShrink: 0 }}
            >
              {EMOJI_OPTIONS.map((em) => (
                <option key={em} value={em}>{em}</option>
              ))}
            </select>
            <input
              style={{ ...inputStyle, flex: 1 }}
              placeholder="Category name…"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
            />
            <button
              onClick={addCategory}
              disabled={!newCatName.trim()}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: "none",
                background: newCatName.trim() ? "linear-gradient(135deg, #2563eb, #3b82f6)" : "rgba(255,255,255,0.06)",
                color: newCatName.trim() ? "#fff" : "#475569",
                fontSize: "13px",
                fontWeight: 700,
                cursor: newCatName.trim() ? "pointer" : "not-allowed",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
            >
              + Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export helper so other components can read categories
export function getStoredCategories() {
  try {
    const saved = localStorage.getItem("habitCategories");
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return DEFAULT_CATEGORIES;
}
