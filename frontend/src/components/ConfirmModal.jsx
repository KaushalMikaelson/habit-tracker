import React from "react";

export default function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  confirmText = "Confirm", 
  confirmColor = "#ef4444", // default red for danger
  onConfirm, 
  onCancel 
}) {
  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translate(-50%, -47%) scale(0.97); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes modalOverlay {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
      
      <div 
        onClick={onCancel}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          zIndex: 99998,
          animation: "modalOverlay 0.2s ease-out",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "400px",
          background: "#020617",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "18px",
          padding: "24px 28px",
          zIndex: 99999,
          boxShadow: "0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
          animation: "modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <h3 style={{ margin: "0 0 8px 0", fontSize: "19px", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.01em" }}>
          {title}
        </h3>
        <p style={{ margin: "0 0 28px 0", fontSize: "15px", color: "#94a3b8", lineHeight: 1.6 }}>
          {message}
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent",
              color: "#cbd5e1",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#f1f5f9"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#cbd5e1"; }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel(); // Close modal on confirm too
            }}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              border: "none",
              background: confirmColor,
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: `0 8px 16px ${confirmColor}30`,
              transition: "transform 0.15s ease, filter 0.15s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.15)"}
            onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
}
