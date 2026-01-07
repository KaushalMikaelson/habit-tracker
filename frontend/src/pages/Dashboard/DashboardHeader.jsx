function DashboardHeader({
  monthLabel,
  goToPreviousMonth,
  goToNextMonth,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        height: "52px",
        background: "#f9fafb",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      {/* Previous Month */}
      <button
        onClick={goToPreviousMonth}
        aria-label="Previous month"
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "8px",
          border: "none",
          background: "#ffffff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          fontSize: "16px",
          cursor: "pointer",
          color: "#374151",
          transition: "background 0.15s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "#f3f4f6")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "#ffffff")
        }
      >
        ◀
      </button>

      {/* Month Label */}
      <div
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "#111827",
          letterSpacing: "0.02em",
        }}
      >
        {monthLabel}
      </div>

      {/* Next Month */}
      <button
        onClick={goToNextMonth}
        aria-label="Next month"
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "8px",
          border: "none",
          background: "#ffffff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          fontSize: "16px",
          cursor: "pointer",
          color: "#374151",
          transition: "background 0.15s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "#f3f4f6")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "#ffffff")
        }
      >
        ▶
      </button>
    </div>
  );
}

export default DashboardHeader;
