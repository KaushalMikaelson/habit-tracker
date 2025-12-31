function DashboardHeader({ monthLabel, goToPreviousMonth, goToNextMonth }) {
  return (
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
  );
}

export default DashboardHeader;
