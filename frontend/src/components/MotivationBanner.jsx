import React, { useState, useEffect, useCallback } from "react";

const CACHE_KEY = "ariaMotivation";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // refresh every 6 hours

function MotivationBanner({ habits }) {
  const [data, setData] = useState(null);   // { message, emoji, date }
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  const fetchMotivation = useCallback(async (force = false) => {
    // Check cache first
    if (!force) {
      try {
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
        if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
          setData(cached);
          setTimeout(() => setVisible(true), 80);
          return;
        }
      } catch (_) {}
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai/motivation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habits }),
      });
      const json = await res.json();
      if (json.message) {
        const payload = { ...json, ts: Date.now() };
        localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
        setData(payload);
        setTimeout(() => setVisible(true), 80);
      }
    } catch (e) {
      // silently fail — it's a motivational banner, not critical
    }
    setLoading(false);
  }, [habits]);

  useEffect(() => {
    if (habits && habits.length > 0) {
      fetchMotivation(false);
    }
  }, []); // eslint-disable-line

  if (dismissed) return null;

  return (
    <>
      <style>{`
        @keyframes bannerIn {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(56,189,248,0.15); }
          50%       { box-shadow: 0 0 24px 4px rgba(56,189,248,0.25); }
        }
        .motivation-banner {
          opacity: 0;
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .motivation-banner.visible {
          opacity: 1;
          animation: bannerIn 0.45s cubic-bezier(.4,0,.2,1) forwards;
        }
        .refresh-btn:hover { opacity: 1 !important; transform: rotate(180deg); }
        .dismiss-btn:hover { opacity: 1 !important; background: rgba(255,255,255,0.1) !important; }
      `}</style>

      <div
        className={`motivation-banner${visible ? " visible" : ""}`}
        style={{
          margin: "0 24px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(99,102,241,0.1) 50%, rgba(168,85,247,0.08) 100%)",
          border: "1px solid rgba(56,189,248,0.2)",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          position: "relative",
          overflow: "hidden",
          animation: "pulse-glow 4s ease-in-out infinite",
        }}
      >
        {/* Decorative gradient line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "2px",
          background: "linear-gradient(90deg, #0ea5e9, #6366f1, #a855f7)",
        }} />

        {/* Emoji / Loading orb */}
        {loading ? (
          <div style={{
            width: "40px", height: "40px", borderRadius: "12px", flexShrink: 0,
            background: "linear-gradient(90deg, rgba(56,189,248,0.1) 25%, rgba(56,189,248,0.25) 50%, rgba(56,189,248,0.1) 75%)",
            backgroundSize: "800px 100%",
            animation: "shimmer 1.5s infinite linear",
          }} />
        ) : (
          <div style={{
            width: "40px", height: "40px", borderRadius: "12px", flexShrink: 0,
            background: "linear-gradient(135deg, rgba(14,165,233,0.2), rgba(99,102,241,0.25))",
            border: "1px solid rgba(56,189,248,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px",
          }}>
            {data?.emoji || "💪"}
          </div>
        )}

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Coach Aria · Daily Motivation
            </span>
          </div>
          {loading ? (
            <div style={{
              height: "14px", borderRadius: "7px", width: "70%",
              background: "linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)",
              backgroundSize: "800px 100%",
              animation: "shimmer 1.5s infinite linear",
            }} />
          ) : (
            <p style={{
              margin: 0, fontSize: "14px", color: "#cbd5e1", lineHeight: "1.55", fontWeight: 500,
              fontStyle: "italic",
            }}>
              {data?.message || "Loading your daily motivation..."}
            </p>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          {/* Refresh button */}
          <button
            className="refresh-btn"
            onClick={() => { setVisible(false); setTimeout(() => fetchMotivation(true), 100); }}
            disabled={loading}
            title="Refresh motivation"
            style={{
              width: "30px", height: "30px", borderRadius: "8px",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", opacity: 0.7, transition: "all 0.3s ease",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>
          {/* Dismiss button */}
          <button
            className="dismiss-btn"
            onClick={() => { setVisible(false); setTimeout(() => setDismissed(true), 400); }}
            title="Dismiss"
            style={{
              width: "30px", height: "30px", borderRadius: "8px",
              background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
              color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", opacity: 0.7, transition: "all 0.2s ease",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default MotivationBanner;
