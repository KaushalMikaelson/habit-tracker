import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeModal() {
  const {
    theme,
    themeMode,
    activePreset,
    isCustom,
    customPrimary,
    customBg,
    presets,
    quickColors,
    setPreset,
    setThemeMode,
    setCustomPrimary,
    setCustomBg,
    resetToDefault,
    isThemeModalOpen,
    setIsThemeModalOpen,
  } = useTheme();

  const [activeTab, setActiveTab] = useState("presets"); // "presets" | "custom"
  const [useCustomBg, setUseCustomBg] = useState(Boolean(customBg));

  if (!isThemeModalOpen) return null;

  const isLight = themeMode === "light";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "fadeIn 0.2s ease-out",
        fontFamily: "'Inter', sans-serif",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsThemeModalOpen(false);
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "680px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--color-surface, #0f172a)",
          border: "1px solid var(--color-border, rgba(255, 255, 255, 0.12))",
          borderRadius: "20px",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px var(--color-border)",
          overflow: "hidden",
          color: "var(--color-text, #f8fafc)",
          animation: "scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--color-border, rgba(255, 255, 255, 0.08))",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--color-surface, #0f172a)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, var(--theme-1, #2563eb), var(--theme-2, #38bdf8))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
              }}
            >
              🎨
            </div>
            <div>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  margin: 0,
                  color: "var(--color-text, #f8fafc)",
                  letterSpacing: "-0.01em",
                }}
              >
                Page Theme & Colors
              </h2>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--color-text-muted, #94a3b8)",
                  margin: "2px 0 0 0",
                }}
              >
                Customize the whole page: light, dark, color presets or any custom color
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsThemeModalOpen(false)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-text-muted, #94a3b8)",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-text, #fff)";
              e.currentTarget.style.background = "var(--color-border, rgba(255,255,255,0.06))";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-text-muted, #94a3b8)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* MODAL BODY */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {/* QUICK LIGHT / DARK TOGGLE BAR */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              borderRadius: "14px",
              background: "var(--color-surface-2, rgba(255,255,255,0.04))",
              border: "1px solid var(--color-border, rgba(255,255,255,0.08))",
              marginBottom: "20px",
            }}
          >
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-text, #f8fafc)" }}>
                Theme Mode
              </div>
              <div style={{ fontSize: "12px", color: "var(--color-text-muted, #94a3b8)", marginTop: "2px" }}>
                Switch whole page between Dark and Light mode
              </div>
            </div>

            <div style={{ display: "flex", gap: "6px", background: "rgba(0,0,0,0.2)", padding: "4px", borderRadius: "10px" }}>
              <button
                onClick={() => setThemeMode("dark")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 700,
                  transition: "all 0.2s ease",
                  background: !isLight ? "var(--color-accent, #2563eb)" : "transparent",
                  color: !isLight ? "#ffffff" : "var(--color-text-muted, #94a3b8)",
                  boxShadow: !isLight ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
                }}
              >
                <span>🌙</span> Dark
              </button>
              <button
                onClick={() => setThemeMode("light")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 700,
                  transition: "all 0.2s ease",
                  background: isLight ? "var(--color-accent, #2563eb)" : "transparent",
                  color: isLight ? "#ffffff" : "var(--color-text-muted, #94a3b8)",
                  boxShadow: isLight ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
                }}
              >
                <span>☀️</span> Light
              </button>
            </div>
          </div>

          {/* TABS SELECTOR */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid var(--color-border, rgba(255,255,255,0.08))",
              marginBottom: "20px",
              gap: "16px",
            }}
          >
            <button
              onClick={() => setActiveTab("presets")}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: activeTab === "presets" ? "2px solid var(--color-accent, #2563eb)" : "2px solid transparent",
                padding: "8px 4px 12px 4px",
                fontSize: "14px",
                fontWeight: activeTab === "presets" ? 700 : 500,
                color: activeTab === "presets" ? "var(--color-accent, #2563eb)" : "var(--color-text-muted, #94a3b8)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Curated Theme Presets
            </button>

            <button
              onClick={() => setActiveTab("custom")}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: activeTab === "custom" ? "2px solid var(--color-accent, #2563eb)" : "2px solid transparent",
                padding: "8px 4px 12px 4px",
                fontSize: "14px",
                fontWeight: activeTab === "custom" ? 700 : 500,
                color: activeTab === "custom" ? "var(--color-accent, #2563eb)" : "var(--color-text-muted, #94a3b8)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>Custom Color (Any Color)</span>
              <span
                style={{
                  fontSize: "10px",
                  background: "var(--color-accent, #2563eb)",
                  color: "#fff",
                  padding: "1px 6px",
                  borderRadius: "10px",
                  fontWeight: 800,
                }}
              >
                LIVE
              </span>
            </button>
          </div>

          {/* TAB 1: PRESET THEMES */}
          {activeTab === "presets" && (
            <div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "12px",
                }}
              >
                {presets.map((preset) => {
                  const isSelected = !isCustom && activePreset === preset.id && themeMode === preset.mode;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => setPreset(preset.id)}
                      style={{
                        padding: "14px",
                        borderRadius: "14px",
                        background: isSelected
                          ? "var(--color-surface-2, rgba(255,255,255,0.08))"
                          : "var(--color-surface, rgba(255,255,255,0.02))",
                        border: isSelected
                          ? "2px solid var(--color-accent, #2563eb)"
                          : "1px solid var(--color-border, rgba(255,255,255,0.08))",
                        cursor: "pointer",
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        boxShadow: isSelected ? "0 4px 16px rgba(0,0,0,0.25)" : "none",
                        transform: isSelected ? "scale(1.02)" : "scale(1)",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = "var(--color-accent, #2563eb)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = "var(--color-border, rgba(255,255,255,0.08))";
                          e.currentTarget.style.transform = "scale(1)";
                        }
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "16px" }}>{preset.icon}</span>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-text, #f8fafc)" }}>
                            {preset.name}
                          </span>
                        </div>
                        {isSelected && (
                          <div
                            style={{
                              width: "18px",
                              height: "18px",
                              borderRadius: "50%",
                              background: "var(--color-accent, #2563eb)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "11px",
                              color: "#fff",
                              fontWeight: 800,
                            }}
                          >
                            ✓
                          </div>
                        )}
                      </div>

                      <div style={{ fontSize: "11px", color: "var(--color-text-muted, #94a3b8)", lineHeight: 1.3 }}>
                        {preset.description}
                      </div>

                      {/* SWATCH PILLS */}
                      <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "2px" }}>
                        {preset.swatch.map((col, idx) => (
                          <div
                            key={idx}
                            style={{
                              flex: 1,
                              height: "14px",
                              borderRadius: "4px",
                              background: col,
                              border: "1px solid rgba(255,255,255,0.15)",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM COLOR (ANY COLOR!) */}
          {activeTab === "custom" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* PRIMARY ACCENT COLOR PICKER */}
              <div
                style={{
                  padding: "16px",
                  borderRadius: "14px",
                  background: "var(--color-surface-2, rgba(255,255,255,0.03))",
                  border: "1px solid var(--color-border, rgba(255,255,255,0.08))",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-text, #f8fafc)" }}>
                      1. Pick Primary Accent Color
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--color-text-muted, #94a3b8)", marginTop: "2px" }}>
                      Choose any color to dynamically generate harmonious gradients & whole-page styling
                    </div>
                  </div>

                  {/* HTML5 Native Color Picker + HEX Code */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="color"
                      value={customPrimary}
                      onChange={(e) => setCustomPrimary(e.target.value)}
                      style={{
                        width: "36px",
                        height: "36px",
                        padding: 0,
                        border: "2px solid #ffffff",
                        borderRadius: "8px",
                        cursor: "pointer",
                        background: "transparent",
                      }}
                    />
                    <input
                      type="text"
                      value={customPrimary.toUpperCase()}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (!val.startsWith("#")) val = "#" + val;
                        if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                          if (val.length === 7) setCustomPrimary(val);
                        }
                      }}
                      style={{
                        width: "82px",
                        padding: "6px 8px",
                        borderRadius: "8px",
                        border: "1px solid var(--color-border, rgba(255,255,255,0.15))",
                        background: "var(--color-input-bg, rgba(255,255,255,0.05))",
                        color: "var(--color-text, #f8fafc)",
                        fontSize: "13px",
                        fontFamily: "monospace",
                        textAlign: "center",
                        fontWeight: 700,
                      }}
                    />
                  </div>
                </div>

                {/* POPULAR COLOR SWATCHES */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "14px" }}>
                  {quickColors.map((qc) => {
                    const isSelected = isCustom && customPrimary.toLowerCase() === qc.hex.toLowerCase();
                    return (
                      <button
                        key={qc.hex}
                        onClick={() => setCustomPrimary(qc.hex)}
                        title={qc.name}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          background: qc.hex,
                          border: isSelected ? "3px solid #ffffff" : "1px solid rgba(255,255,255,0.2)",
                          cursor: "pointer",
                          boxShadow: isSelected ? `0 0 12px ${qc.hex}` : "none",
                          transform: isSelected ? "scale(1.15)" : "scale(1)",
                          transition: "all 0.15s ease",
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* OPTIONAL CUSTOM BACKGROUND COLOR PICKER */}
              <div
                style={{
                  padding: "16px",
                  borderRadius: "14px",
                  background: "var(--color-surface-2, rgba(255,255,255,0.03))",
                  border: "1px solid var(--color-border, rgba(255,255,255,0.08))",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-text, #f8fafc)" }}>
                      2. Custom Background Color (Optional)
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--color-text-muted, #94a3b8)", marginTop: "2px" }}>
                      {useCustomBg
                        ? "Currently overriding background color directly"
                        : "Automatically harmonized with your chosen accent color"}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      onClick={() => {
                        const next = !useCustomBg;
                        setUseCustomBg(next);
                        if (!next) setCustomBg(null);
                        else setCustomBg(theme.bg);
                      }}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--color-border, rgba(255,255,255,0.15))",
                        background: useCustomBg ? "var(--color-accent, #2563eb)" : "transparent",
                        color: useCustomBg ? "#fff" : "var(--color-text-muted, #94a3b8)",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {useCustomBg ? "Custom Active" : "Auto Tint"}
                    </button>

                    {useCustomBg && (
                      <input
                        type="color"
                        value={customBg || theme.bg}
                        onChange={(e) => setCustomBg(e.target.value)}
                        style={{
                          width: "36px",
                          height: "36px",
                          padding: 0,
                          border: "2px solid #ffffff",
                          borderRadius: "8px",
                          cursor: "pointer",
                          background: "transparent",
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* LIVE MINI PREVIEW OF CUSTOM PALETTE */}
              <div
                style={{
                  padding: "16px",
                  borderRadius: "14px",
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-accent)", marginBottom: "10px" }}>
                  Live Preview in Current Theme
                </div>
                <div
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: "linear-gradient(135deg, var(--theme-1), var(--theme-2))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "14px",
                      }}
                    >
                      ✓
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-text)" }}>
                        Card Title & Text
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                        Muted subtitle preview
                      </div>
                    </div>
                  </div>

                  <button
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: "none",
                      background: "linear-gradient(135deg, var(--theme-1), var(--theme-2))",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "default",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                    }}
                  >
                    Action Button
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--color-border, rgba(255, 255, 255, 0.08))",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--color-surface, #0f172a)",
          }}
        >
          <button
            onClick={resetToDefault}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid var(--color-border, rgba(255,255,255,0.1))",
              background: "transparent",
              color: "var(--color-text-muted, #94a3b8)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-text, #fff)";
              e.currentTarget.style.borderColor = "var(--color-accent, #2563eb)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-text-muted, #94a3b8)";
              e.currentTarget.style.borderColor = "var(--color-border, rgba(255,255,255,0.1))";
            }}
          >
            Reset to Default
          </button>

          <button
            onClick={() => setIsThemeModalOpen(false)}
            style={{
              padding: "10px 24px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, var(--theme-1, #2563eb), var(--theme-2, #38bdf8))",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
