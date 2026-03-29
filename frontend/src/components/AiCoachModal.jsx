import React, { useState, useEffect, useRef, useCallback } from "react";
import dayjs from "dayjs";

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant",
  content:
    "Hey! I'm **Coach Aria**, your personal habit coach powered by Groq. I've already analyzed your habit data and I'm ready to help you improve. Ask me anything — your streaks, how to stay consistent, what to focus on next, or just say **\"analyze my habits\"** to get started!",
  time: dayjs().format("hh:mm A"),
};

function parseMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/s, "<ul style='margin:8px 0 0 16px;padding:0;list-style:disc;'>$1</ul>")
    .replace(/\n/g, "<br/>");
}

function getRiskColor(score) {
  if (score >= 60) return "#ef4444";
  if (score >= 35) return "#f59e0b";
  return "#22c55e";
}

function getRiskLabel(score) {
  if (score >= 60) return "High Risk";
  if (score >= 35) return "Medium";
  return "Stable";
}

function getTrendIcon(trend) {
  if (trend > 0) return { icon: "↑", color: "#22c55e" };
  if (trend < 0) return { icon: "↓", color: "#ef4444" };
  return { icon: "→", color: "#94a3b8" };
}

// ─── Tab: Chat ────────────────────────────────────────────────────────────────
function ChatTab({ habits }) {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200);
  }, []);

  async function sendMessage(text) {
    if (!text.trim() || loading) return;
    setInput("");

    const userMsg = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      time: dayjs().format("hh:mm A"),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habits,
          messages: newMessages
            .filter((m) => m.id !== "welcome")
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const json = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "_ai",
          role: "assistant",
          content: json.reply || json.error || "Something went wrong.",
          time: dayjs().format("hh:mm A"),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "_err",
          role: "assistant",
          content: "Network error — make sure your backend is running on port 5000.",
          time: dayjs().format("hh:mm A"),
        },
      ]);
    }
    setLoading(false);
  }

  const QUICK_PROMPTS = [
    "Analyze my habits",
    "What should I focus on?",
    "How to improve my streak?",
    "Give me a weekly plan",
  ];

  return (
    <>
      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: msg.role === "user" ? "flex-end" : "flex-start",
              animation: `fadeUp 0.3s ease ${i * 0.02}s backwards`,
            }}
          >
            {msg.role === "assistant" && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <div
                  style={{
                    width: "26px", height: "26px", borderRadius: "8px", flexShrink: 0,
                    background: "linear-gradient(135deg, #0369a1, #0284c7)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px",
                  }}
                >
                  ✦
                </div>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#38bdf8" }}>Coach Aria</span>
                <span style={{ fontSize: "11px", color: "#475569" }}>{msg.time}</span>
              </div>
            )}
            <div
              className={msg.role === "user" ? "ai-bubble-user" : "ai-bubble-ai"}
              style={{ maxWidth: "80%", padding: "14px 18px", fontSize: "15px", lineHeight: "1.6" }}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }}
            />
            {msg.role === "user" && (
              <span style={{ fontSize: "11px", color: "#475569", marginTop: "4px" }}>{msg.time}</span>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px", animation: "fadeUp 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "26px", height: "26px", borderRadius: "8px",
                  background: "linear-gradient(135deg, #0369a1, #0284c7)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px",
                }}
              >
                ✦
              </div>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#38bdf8" }}>Coach Aria</span>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "18px 18px 18px 4px", padding: "14px 20px",
                display: "flex", gap: "5px", alignItems: "center",
              }}
            >
              {[0, 0.15, 0.3].map((delay, i) => (
                <span
                  key={i}
                  style={{
                    width: "7px", height: "7px", borderRadius: "50%", background: "#38bdf8",
                    display: "inline-block", animation: `blink 1.2s ${delay}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div style={{ padding: "0 24px 12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              className="quick-chip"
              style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#94a3b8", padding: "7px 14px", borderRadius: "20px",
                fontSize: "13px", fontWeight: 600, cursor: "pointer",
                transition: "all 0.2s", fontFamily: "inherit",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        style={{
          padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex", gap: "12px", alignItems: "flex-end", flexShrink: 0,
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
          }}
          placeholder="Ask Coach Aria anything about your habits..."
          rows={1}
          className="chat-input"
          style={{
            flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "14px", padding: "12px 16px", color: "#f1f5f9", fontSize: "15px",
            resize: "none", lineHeight: "1.5", fontFamily: "inherit", maxHeight: "120px",
            transition: "border 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(56,189,248,0.5)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="send-btn"
          style={{
            width: "46px", height: "46px", borderRadius: "13px", border: "none",
            background: input.trim() && !loading ? "#0369a1" : "rgba(255,255,255,0.06)",
            color: input.trim() && !loading ? "#fff" : "#475569",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            transition: "all 0.2s", flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </>
  );
}

// ─── Tab: Predictions ─────────────────────────────────────────────────────────
function PredictionsTab({ habits }) {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchPredictions = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habits }),
      });
      const json = await res.json();
      setPredictions(json.predictions || []);
    } catch {
      setPredictions([]);
    }
    setLoading(false);
    setFetched(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habits]);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  if (loading) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {[0, 0.15, 0.3].map((delay, i) => (
            <span key={i} style={{
              width: "10px", height: "10px", borderRadius: "50%", background: "#38bdf8",
              display: "inline-block", animation: `blink 1.2s ${delay}s infinite`,
            }} />
          ))}
        </div>
        <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>Aria is analyzing your habit patterns…</p>
      </div>
    );
  }

  if (fetched && predictions.length === 0) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
        <span style={{ fontSize: "40px" }}>📊</span>
        <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>No active habits to predict yet.</p>
        <p style={{ color: "#475569", fontSize: "13px", margin: 0 }}>Add some habits and come back!</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
        <div>
          <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>AI-powered predictions for each active habit based on your recent patterns.</p>
        </div>
        <button
          onClick={fetchPredictions}
          style={{
            background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)",
            color: "#38bdf8", borderRadius: "10px", padding: "6px 14px",
            fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.2s", whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(56,189,248,0.15)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(56,189,248,0.08)"; }}
        >
          ↻ Refresh
        </button>
      </div>

      {predictions.map((p, i) => {
        const riskColor = getRiskColor(p.riskScore);
        const riskLabel = getRiskLabel(p.riskScore);
        const trend = getTrendIcon(p.trend);

        return (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderLeft: `3px solid ${riskColor}`,
              borderRadius: "14px",
              padding: "16px 18px",
              animation: `fadeUp 0.35s ease ${i * 0.06}s backwards`,
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            {/* Habit header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#f1f5f9" }}>{p.title}</div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{p.category}</div>
              </div>
              <span
                style={{
                  fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "20px",
                  background: `${riskColor}18`, color: riskColor, border: `1px solid ${riskColor}33`,
                }}
              >
                {riskLabel}
              </span>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "12px", flexWrap: "wrap" }}>
              {[
                { label: "Streak", value: `${p.streak}d` },
                { label: "Last 7 Days", value: `${p.last7Rate}%` },
                { label: "This Month", value: `${p.monthRate}%` },
                { label: "Trend", value: `${trend.icon} ${p.trend > 0 ? "+" : ""}${p.trend}`, color: trend.color },
              ].map((stat) => (
                <div key={stat.label} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "10px", color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</span>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: stat.color || "#f8fafc" }}>{stat.value}</span>
                </div>
              ))}

              {/* Risk bar */}
              <div style={{ flex: 1, minWidth: "100px", display: "flex", flexDirection: "column", gap: "4px", justifyContent: "flex-end" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "10px", color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Risk Score</span>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: riskColor }}>{p.riskScore}/100</span>
                </div>
                <div style={{ height: "5px", borderRadius: "4px", background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: "4px",
                    width: `${p.riskScore}%`,
                    background: riskColor,
                    transition: "width 0.8s ease",
                  }} />
                </div>
              </div>
            </div>

            {/* Projected streak */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span style={{ fontSize: "12px", color: "#64748b" }}>Projected in 30 days:</span>
              <span style={{ fontSize: "14px", fontWeight: 800, color: "#38bdf8" }}>{p.projected30} day streak</span>
            </div>

            {/* AI insight */}
            <div style={{
              background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.12)",
              borderRadius: "10px", padding: "10px 14px",
              display: "flex", gap: "8px", alignItems: "flex-start",
            }}>
              <span style={{ fontSize: "14px", flexShrink: 0 }}>✦</span>
              <p style={{ margin: 0, fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5" }}>{p.insight}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Tab: Motivation ──────────────────────────────────────────────────────────
function MotivationTab({ habits }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchMotivation = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/motivation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habits }),
      });
      const json = await res.json();
      setData(json);
    } catch {
      setData(null);
    }
    setLoading(false);
    setFetched(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habits]);

  useEffect(() => {
    fetchMotivation();
  }, [fetchMotivation]);

  const activeHabits = (habits || []).filter((h) => h.status === "active");
  const topStreak = activeHabits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
  const completedToday = activeHabits.filter((h) => {
    const today = new Date().toISOString().split("T")[0];
    return h.completions && h.completions[today];
  }).length;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Main message card */}
      <div style={{
        background: "linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(56,189,248,0.06) 100%)",
        border: "1px solid rgba(56,189,248,0.2)", borderRadius: "20px",
        padding: "28px 24px", textAlign: "center", position: "relative", overflow: "hidden",
        animation: "fadeUp 0.4s ease",
      }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", top: "-40px", left: "50%", transform: "translateX(-50%)",
          width: "200px", height: "200px",
          background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "20px 0" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              {[0, 0.15, 0.3].map((delay, i) => (
                <span key={i} style={{
                  width: "10px", height: "10px", borderRadius: "50%", background: "#38bdf8",
                  display: "inline-block", animation: `blink 1.2s ${delay}s infinite`,
                }} />
              ))}
            </div>
            <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>Aria is crafting your message…</p>
          </div>
        ) : data ? (
          <>
            <div style={{ fontSize: "52px", marginBottom: "16px", animation: "fadeUp 0.4s ease 0.1s backwards" }}>{data.emoji}</div>
            <p style={{
              fontSize: "18px", fontWeight: 600, color: "#e2e8f0", lineHeight: "1.7",
              margin: "0 0 16px 0", animation: "fadeUp 0.4s ease 0.15s backwards",
            }}>
              {data.message}
            </p>
            <p style={{ fontSize: "12px", color: "#475569", margin: 0 }}>{data.date}</p>
          </>
        ) : fetched ? (
          <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>Could not load your motivation. Please try again.</p>
        ) : null}
      </div>

      {/* Refresh button */}
      <button
        onClick={fetchMotivation}
        disabled={loading}
        style={{
          alignSelf: "center",
          background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)",
          color: loading ? "#475569" : "#38bdf8", borderRadius: "12px", padding: "10px 22px",
          fontSize: "13px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit", transition: "all 0.2s",
        }}
        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "rgba(56,189,248,0.15)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(56,189,248,0.08)"; }}
      >
        ✨ Get new message
      </button>

      {/* Today's snapshot */}
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px", padding: "20px", animation: "fadeUp 0.4s ease 0.2s backwards",
      }}>
        <div style={{ fontSize: "12px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
          Today's Snapshot
        </div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {[
            { label: "Active Habits", value: activeHabits.length, emoji: "📋" },
            { label: "Completed Today", value: `${completedToday}/${activeHabits.length}`, emoji: "✅" },
            { label: "Top Streak", value: `${topStreak}d`, emoji: "🔥" },
          ].map((stat) => (
            <div key={stat.label} style={{
              flex: 1, minWidth: "120px", background: "rgba(255,255,255,0.03)",
              borderRadius: "12px", padding: "14px 16px", textAlign: "center",
            }}>
              <div style={{ fontSize: "24px", marginBottom: "6px" }}>{stat.emoji}</div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#f8fafc", marginBottom: "4px" }}>{stat.value}</div>
              <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Habit quick status */}
      {activeHabits.length > 0 && (
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px", padding: "20px", animation: "fadeUp 0.4s ease 0.3s backwards",
        }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
            Habit Status
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {activeHabits.slice(0, 6).map((h, i) => {
              const today = new Date().toISOString().split("T")[0];
              const done = h.completions && h.completions[today];
              const riskColor = getRiskColor(h.streak === 0 ? 70 : h.streak < 3 ? 40 : 10);
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "8px", height: "8px", borderRadius: "50%",
                      background: done ? "#22c55e" : riskColor, flexShrink: 0,
                    }} />
                    <span style={{ fontSize: "14px", color: "#cbd5e1" }}>{h.title}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>🔥 {h.streak || 0}d</span>
                    <span style={{
                      fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px",
                      background: done ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.1)",
                      color: done ? "#22c55e" : "#f87171",
                    }}>
                      {done ? "Done" : "Pending"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "chat", label: "Chat", icon: "💬" },
  { id: "predictions", label: "Predictions", icon: "📈" },
  { id: "motivation", label: "Motivation", icon: "✨" },
];

function AiCoachModal({ show, onClose, habits }) {
  const [activeTab, setActiveTab] = useState("chat");

  if (!show) return null;

  return (
    <>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes blink {
          0%,100% { opacity: 1; } 50% { opacity: 0.3; }
        }
        .ai-bubble-user {
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          color: #fff;
          border-radius: 18px 18px 4px 18px;
          align-self: flex-end;
        }
        .ai-bubble-ai {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: #e2e8f0;
          border-radius: 18px 18px 18px 4px;
          align-self: flex-start;
        }
        .chat-input:focus { outline: none; }
        .quick-chip:hover {
          background: rgba(56,189,248,0.15) !important;
          border-color: rgba(56,189,248,0.4) !important;
          color: #38bdf8 !important;
        }
        .send-btn:hover:not(:disabled) {
          transform: scale(1.05);
          background: #0284c7 !important;
        }
        .ai-tab-btn {
          transition: all 0.2s;
        }
        .ai-tab-btn:hover {
          background: rgba(255,255,255,0.06) !important;
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(2,6,23,0.8)", backdropFilter: "blur(16px)",
          zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px",
        }}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%", maxWidth: "780px", height: "88vh",
            background: "linear-gradient(160deg, #0b101e 0%, #020617 100%)",
            border: "1px solid rgba(56,189,248,0.2)",
            borderRadius: "24px", overflow: "hidden",
            display: "flex", flexDirection: "column",
            boxShadow: "0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)",
            animation: "modalIn 0.35s cubic-bezier(.4,0,.2,1)",
          }}
        >
          {/* ── Header ── */}
          <div style={{
            display: "flex", alignItems: "center", gap: "14px",
            padding: "18px 24px 0", flexShrink: 0,
          }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "14px",
              background: "linear-gradient(135deg, rgba(14,165,233,0.25), rgba(56,189,248,0.35))",
              border: "1px solid rgba(56,189,248,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#38bdf8", flexShrink: 0,
              boxShadow: "0 4px 16px rgba(14,165,233,0.3)",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#f8fafc", margin: 0, letterSpacing: "-0.01em" }}>
                Coach Aria
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>
                  Online · Groq Intelligence · {habits?.filter((h) => h.status === "active").length || 0} active habits
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.05)", border: "none", color: "#64748b",
                width: "36px", height: "36px", borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#f8fafc"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#64748b"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* ── Tabs ── */}
          <div style={{
            display: "flex", gap: "4px", padding: "14px 24px 0",
            borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0,
          }}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="ai-tab-btn"
                  style={{
                    padding: "8px 18px 12px",
                    background: "transparent",
                    border: "none",
                    borderBottom: isActive ? "2px solid #38bdf8" : "2px solid transparent",
                    color: isActive ? "#38bdf8" : "#64748b",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "14px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    display: "flex", alignItems: "center", gap: "6px",
                    borderRadius: "0",
                    marginBottom: "-1px",
                    transition: "color 0.2s",
                  }}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ── Tab content ── */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {activeTab === "chat" && <ChatTab habits={habits} />}
            {activeTab === "predictions" && <PredictionsTab habits={habits} />}
            {activeTab === "motivation" && <MotivationTab habits={habits} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default AiCoachModal;
