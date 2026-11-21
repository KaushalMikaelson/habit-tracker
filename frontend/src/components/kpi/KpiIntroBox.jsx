import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";

const Edit2 = ({ size = 12 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

function KpiIntroBox() {
  const { user } = useAuth();

  const [data, setData] = useState({
    name: user?.name?.split(' ')[0] || "User",
    quote: user?.quote || "No rest for me in this world. Perhaps in the next.",
  });
  const [editing, setEditing] = useState(false);

  // 🔹 If user data loads asynchronously, sync it
  useEffect(() => {
    if (user) {
      setData({
        name: user.name?.split(' ')[0] || "User",
        quote: user.quote || "No rest for me in this world. Perhaps in the next.",
      });
    }
  }, [user]);

  // 🔹 Load saved local data if any (combines with auth user state)
  useEffect(() => {
    const saved = localStorage.getItem("kpiIntroBox");
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  // 🔹 Persist changes
  useEffect(() => {
    localStorage.setItem("kpiIntroBox", JSON.stringify(data));
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      style={{
        height: "180px",
        borderRadius: "16px",
        padding: "16px",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "var(--color-surface, #020617)",
        border: "var(--color-card-border, none)",
        boxShadow: "var(--color-card-shadow, none)",
        color: "var(--color-text, #e5e7eb)",

        position: "relative",
      }}
    >
      {/* EDIT BUTTON */}
      <button
        onClick={() => setEditing((e) => !e)}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: "none",
          border: "none",
          color: "var(--color-accent, #38bdf8)",
          fontSize: "11px",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          opacity: 0.9,
        }}
      >
        {!editing && <Edit2 size={12} />}
        {editing ? "Save" : "Edit"}
      </button>

      {/* WELCOME */}
      <div
        style={{
          fontSize: "14px",
          color: "var(--color-text-muted, #94a3b8)",
          marginBottom: "6px",
        }}
      >
        Welcome back
      </div>

      {/* NAME */}
      {editing ? (
        <input
          name="name"
          value={data.name}
          onChange={handleChange}
          style={inputStyle}
        />
      ) : (
        <div
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--color-text-title, #ffffff)",
            marginBottom: "8px",
          }}
        >
          {data.name} 👋
        </div>
      )}

      {/* QUOTE */}
      {editing ? (
        <textarea
          name="quote"
          value={data.quote}
          onChange={handleChange}
          rows={2}
          style={{
            ...inputStyle,
            resize: "none",
            fontSize: "13px",
          }}
        />
      ) : (
        <div
          style={{
            fontSize: "13px",
            color: "var(--color-text-muted, #94a3b8)",
            lineHeight: 1.4,
            fontStyle: "italic",
          }}
        >
          “{data.quote}”
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  background: "var(--color-input-bg, rgba(255,255,255,0.06))",
  border: "1px solid var(--color-input-border, rgba(255,255,255,0.12))",
  borderRadius: "8px",
  padding: "6px 8px",
  color: "var(--color-text, #f8fafc)",
  outline: "none",
  marginBottom: "6px",
};

export default KpiIntroBox;
