import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import ConfirmModal from "../../components/ConfirmModal";

const MOODS = [
  { emoji: "✨", label: "Inspired", color: "#fcd34d", bg: "rgba(252,211,77,0.15)" },
  { emoji: "⚡", label: "Energetic", color: "#60a5fa", bg: "rgba(96,165,250,0.15)" },
  { emoji: "🌿", label: "Peaceful", color: "#34d399", bg: "rgba(52,211,153,0.15)" },
  { emoji: "🎯", label: "Focused", color: "#a78bfa", bg: "rgba(167,139,250,0.15)" },
  { emoji: "💭", label: "Thoughtful", color: "#f472b6", bg: "rgba(244,114,182,0.15)" },
  { emoji: "🌧️", label: "Heavy", color: "#94a3b8", bg: "rgba(148,163,184,0.15)" }
];

export default function JournalView({ user }) {
  const [entries, setEntries] = useState([]);
  const [activeDoc, setActiveDoc] = useState(null); // null = list view

  // Document internal states
  const [docTitle, setDocTitle] = useState("");
  const [docContent, setDocContent] = useState("");
  const [docMood, setDocMood] = useState(MOODS[0]);

  const [confirmState, setConfirmState] = useState({ isOpen: false, id: null });

  const storageKey = `identity_journal_${user?.email || "guest"}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setEntries(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load journal entries", e);
    }
  }, [storageKey]);

  function saveToStorage(newEntries) {
    setEntries(newEntries);
    localStorage.setItem(storageKey, JSON.stringify(newEntries));
  }

  function openDocument(entry) {
    setActiveDoc(entry);
    setDocTitle(entry.title || "");
    setDocContent(entry.content || "");
    setDocMood(entry.mood || MOODS[0]);
  }

  function createNewDocument() {
    const newDoc = {
      id: Date.now().toString(),
      date: dayjs().format("YYYY-MM-DD"),
      time: dayjs().format("hh:mm A"),
      title: "Untitled Document",
      content: "",
      mood: MOODS[0],
    };
    setActiveDoc(newDoc);
    setDocTitle(newDoc.title);
    setDocContent(newDoc.content);
    setDocMood(newDoc.mood);
  }

  function saveCurrentDocument() {
    if (!activeDoc) return;
    
    // Auto-save logic
    const updatedDoc = {
      ...activeDoc,
      title: docTitle.trim() || "Untitled Document",
      content: docContent,
      mood: docMood,
      lastModified: dayjs().format("YYYY-MM-DD hh:mm A")
    };

    let alreadyExists = false;
    const newEntries = entries.map(e => {
      if (e.id === activeDoc.id) {
        alreadyExists = true;
        return updatedDoc;
      }
      return e;
    });

    if (!alreadyExists) {
      newEntries.unshift(updatedDoc);
    }
    
    saveToStorage(newEntries);
    setActiveDoc(updatedDoc); // Keep reference updated
  }

  function closeDocument() {
    saveCurrentDocument();
    setActiveDoc(null);
  }

  function handleDeleteRequest(id) {
    setConfirmState({ isOpen: true, id });
  }

  function executeDelete() {
    if (confirmState.id) {
      saveToStorage(entries.filter((e) => e.id !== confirmState.id));
      if (activeDoc && activeDoc.id === confirmState.id) {
        setActiveDoc(null);
      }
    }
    setConfirmState({ isOpen: false, id: null });
  }

  // Effect to auto-save periodically when active doc changes
  useEffect(() => {
    if (!activeDoc) return;
    const timeoutId = setTimeout(() => {
      saveCurrentDocument();
    }, 1000);
    return () => clearTimeout(timeoutId);
  // eslint-disable-next-line
  }, [docTitle, docContent, docMood]);


  // -------- RENDER LIST VIEW --------
  if (!activeDoc) {
    return (
      <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", width: "100%", boxSizing: "border-box", fontFamily: "'Inter', sans-serif" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#f8fafc", margin: "0 0 8px 0", letterSpacing: "-0.02em" }}>
              My Space
            </h1>
            <p style={{ fontSize: "16px", color: "#94a3b8", margin: 0 }}>
              Your personal library of documents and thoughts.
            </p>
          </div>
          <button
            onClick={createNewDocument}
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              color: "#fff",
              border: "none",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
              display: "flex", alignItems: "center", gap: "8px", transition: "transform 0.15s ease"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Document
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px" }}>
          
          {/* New Doc Card Wrapper relative size */}
          <div
            onClick={createNewDocument}
            style={{
              aspectRatio: "1 / 1.1",
              background: "rgba(255,255,255,0.02)",
              border: "2px dashed rgba(255,255,255,0.1)",
              borderRadius: "16px",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#94a3b8", transition: "all 0.2s ease"
            }}
            onMouseEnter={e => { e.currentTarget.style.border = "2px dashed #60a5fa"; e.currentTarget.style.color = "#60a5fa"; e.currentTarget.style.background = "rgba(96,165,250,0.05)" }}
            onMouseLeave={e => { e.currentTarget.style.border = "2px dashed rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "rgba(255,255,255,0.02)" }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "16px" }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
              <path d="M14 3v5h5M12 18v-6M9 15h6" />
            </svg>
            <span style={{ fontWeight: 600, fontSize: "15px" }}>Create Blank Document</span>
          </div>

          {/* Document Cards */}
          {entries.map(entry => (
            <div
              key={entry.id}
              onClick={() => openDocument(entry)}
              style={{
                aspectRatio: "1 / 1.1",
                background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "24px",
                display: "flex", flexDirection: "column",
                cursor: "pointer", position: "relative",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)" }}
            >
              {/* Doc Header Icon + Mood */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <div style={{ 
                  width: "40px", height: "40px", background: "rgba(96,165,250,0.1)", borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa"
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                {entry.mood && (
                  <span style={{ 
                    background: entry.mood.bg, border: `1px solid ${entry.mood.color}40`, 
                    padding: "4px 8px", borderRadius: "8px", fontSize: "14px", height: "fit-content" 
                  }}>
                    {entry.mood.emoji}
                  </span>
                )}
              </div>

              {/* Title & Preview */}
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#f1f5f9", margin: "0 0 8px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {entry.title}
              </h3>
              <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0, flex: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", lineHeight: "1.5" }}>
                {entry.content || "Empty document..."}
              </p>

              {/* Footer */}
              <div style={{ marginTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
                  {dayjs(entry.date).format("MMM D, YYYY")}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteRequest(entry.id); }}
                  style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer", padding: "4px" }}
                  title="Delete Document"
                  onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
                  onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m4 0V4a2 2 0 012-2h2a2 2 0 012 2v2"/>
                  </svg>
                </button>
              </div>

            </div>
          ))}
        </div>

        <ConfirmModal 
          isOpen={confirmState.isOpen}
          onCancel={() => setConfirmState({ isOpen: false, id: null })}
          onConfirm={executeDelete}
          title="Delete Document"
          message="Are you sure you want to delete this document? This cannot be undone."
          confirmColor="#ef4444"
          confirmText="Delete"
        />
      </div>
    );
  }

  // -------- RENDER EDITOR VIEW --------
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Editor Top Bar */}
      <div style={{ 
        display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", 
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "sticky", top: 0, zIndex: 10, background: "#0b101e"
      }}>
        <button
          onClick={closeDocument}
          style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0",
            padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s ease"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back to My Space
        </button>

        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
           <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
             {docContent.length > 0 ? `${docContent.split(/\s+/).filter(w=>w.length>0).length} words` : "0 words"}
           </span>
           <span style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.1)" }} />
           <span style={{ fontSize: "12px", color: "#34d399", display: "flex", alignItems: "center", gap: "4px" }}>
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
             Auto-saved
           </span>
        </div>
      </div>

      {/* Editor Main Canvas Wrapper */}
      <div style={{ flex: 1, overflowY: "auto", padding: "40px 20px" }}>
        {/* Document Page Canvas */}
        <div style={{ 
          maxWidth: "800px", margin: "0 auto", minHeight: "80vh",
          background: "#020617", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", padding: "60px 80px",
          display: "flex", flexDirection: "column"
        }}>
          
          {/* Mood inside document */}
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "16px", marginBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {MOODS.map(mood => (
              <button
                key={mood.label}
                onClick={() => setDocMood(mood)}
                title={mood.label}
                style={{
                  padding: "6px 10px",
                  borderRadius: "8px",
                  border: docMood.label === mood.label ? `1px solid ${mood.color}` : "1px solid transparent",
                  background: docMood.label === mood.label ? mood.bg : "transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  filter: docMood.label === mood.label ? "none" : "grayscale(0.8) opacity(0.5)",
                }}
                onMouseEnter={e => e.currentTarget.style.filter = "none"}
                onMouseLeave={e => {
                  if (docMood.label !== mood.label) e.currentTarget.style.filter = "grayscale(0.8) opacity(0.5)";
                }}
              >
                <span style={{ fontSize: "14px" }}>{mood.emoji}</span>
                {docMood.label === mood.label && (
                   <span style={{ color: mood.color, fontSize: "12px", fontWeight: 600 }}>{mood.label}</span>
                )}
              </button>
            ))}
          </div>

          <input
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            placeholder="Document Title..."
            style={{
              width: "100%", background: "transparent", border: "none", outline: "none",
              color: "#f8fafc", fontSize: "36px", fontWeight: 800, marginBottom: "24px",
              fontFamily: "inherit", letterSpacing: "-0.02em", padding: 0
            }}
          />

          {/* Auto-growing textarea for the document body */}
          <textarea
            value={docContent}
            onChange={(e) => {
              setDocContent(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            placeholder="Start typing your document here..."
            style={{
              flex: 1, width: "100%", background: "transparent", border: "none", outline: "none",
              color: "#cbd5e1", fontSize: "16px", lineHeight: "1.8", resize: "none",
              fontFamily: "inherit", minHeight: "400px", overflow: "hidden"
            }}
          />
        </div>
      </div>
    </div>
  );
}
