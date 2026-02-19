import { useEffect, useState } from "react";

const DEFAULT_DATA = {
  name: "Your Name",
  quote: "Your Quote.",
};

function KpiIntroBox() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [editing, setEditing] = useState(false);

  // 🔹 Load saved data
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

        background: "linear-gradient(180deg, #020617, #020617)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
        color: "#e5e7eb",

        position: "relative",
      }}
    >
      {/* EDIT BUTTON */}
      <button
        onClick={() => setEditing((e) => !e)}
        style={{
          position: "absolute",
          top: "10px",
          right: "12px",
          background: "none",
          border: "none",
          color: "#38bdf8",
          fontSize: "12px",
          cursor: "pointer",
          opacity: 0.8,
        }}
      >
        {editing ? "Save" : "Edit"}
      </button>

      {/* WELCOME */}
      <div
        style={{
          fontSize: "14px",
          opacity: 0.7,
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
            opacity: 0.6,
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
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "8px",
  padding: "6px 8px",
  color: "#f8fafc",
  outline: "none",
  marginBottom: "6px",
};

export default KpiIntroBox;
