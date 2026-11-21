import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

// Helper: Parse Hex to RGB
function hexToRgb(hex) {
  let c = hex.replace("#", "").trim();
  if (c.length === 3) {
    c = c.split("").map((ch) => ch + ch).join("");
  }
  const num = parseInt(c, 16);
  if (isNaN(num) || c.length !== 6) {
    return { r: 37, g: 99, b: 235 }; // fallback blue
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Helper: RGB to HSL
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h = Math.round(h * 60);
  }
  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Helper: HSL to Hex
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

// Helper: Perceived Luminance
function getLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Standard Curated Preset Themes
export const PRESET_THEMES = [
  {
    id: "midnight",
    name: "Midnight Slate",
    mode: "dark",
    icon: "🌙",
    description: "Classic deep obsidian & sapphire",
    bg: "#0b101e",
    surface: "#020617",
    surface2: "#131b2e",
    headerBg: "rgba(11, 16, 30, 0.88)",
    sidebarBg: "#0b101e",
    border: "rgba(255, 255, 255, 0.08)",
    borderSubtle: "rgba(255, 255, 255, 0.04)",
    text: "#f8fafc",
    textTitle: "#ffffff",
    textMuted: "#94a3b8",
    accent: "#2563eb",
    accent2: "#38bdf8",
    swatch: ["#0b101e", "#020617", "#2563eb"],
  },
  {
    id: "light",
    name: "Clean Snow",
    mode: "light",
    icon: "☀️",
    description: "Modern crisp & high-contrast light mode",
    bg: "#f8fafc",
    surface: "#ffffff",
    surface2: "#f1f5f9",
    headerBg: "rgba(248, 250, 252, 0.95)",
    sidebarBg: "#ffffff",
    border: "rgba(0, 0, 0, 0.09)",
    borderSubtle: "rgba(0, 0, 0, 0.05)",
    text: "#0f172a",
    textTitle: "#020617",
    textMuted: "#64748b",
    accent: "#2563eb",
    accent2: "#0284c7",
    swatch: ["#f8fafc", "#ffffff", "#2563eb"],
  },
  {
    id: "emerald",
    name: "Emerald Forest",
    mode: "dark",
    icon: "🌿",
    description: "Deep pine & vibrant botanical mint",
    bg: "#041610",
    surface: "#07231a",
    surface2: "#0d3629",
    headerBg: "rgba(4, 22, 16, 0.9)",
    sidebarBg: "#041610",
    border: "rgba(16, 185, 129, 0.18)",
    borderSubtle: "rgba(16, 185, 129, 0.08)",
    text: "#ecfdf5",
    textTitle: "#ffffff",
    textMuted: "#6ee7b7",
    accent: "#10b981",
    accent2: "#34d399",
    swatch: ["#041610", "#07231a", "#10b981"],
  },
  {
    id: "violet",
    name: "Cyberpunk Violet",
    mode: "dark",
    icon: "🔮",
    description: "Neon magenta & cosmic purple",
    bg: "#0e041c",
    surface: "#180a2f",
    surface2: "#26114b",
    headerBg: "rgba(14, 4, 28, 0.9)",
    sidebarBg: "#0e041c",
    border: "rgba(168, 85, 247, 0.22)",
    borderSubtle: "rgba(168, 85, 247, 0.1)",
    text: "#f5f3ff",
    textTitle: "#ffffff",
    textMuted: "#c084fc",
    accent: "#a855f7",
    accent2: "#ec4899",
    swatch: ["#0e041c", "#180a2f", "#a855f7"],
  },
  {
    id: "rose",
    name: "Sunset Crimson",
    mode: "dark",
    icon: "🌇",
    description: "Rich burgundy, rose & peach glow",
    bg: "#18060c",
    surface: "#280d17",
    surface2: "#3f1525",
    headerBg: "rgba(24, 6, 12, 0.9)",
    sidebarBg: "#18060c",
    border: "rgba(244, 63, 94, 0.2)",
    borderSubtle: "rgba(244, 63, 94, 0.08)",
    text: "#fff1f2",
    textTitle: "#ffffff",
    textMuted: "#fda4af",
    accent: "#f43f5e",
    accent2: "#fb7185",
    swatch: ["#18060c", "#280d17", "#f43f5e"],
  },
  {
    id: "ocean",
    name: "Ocean Sapphire",
    mode: "dark",
    icon: "🌊",
    description: "Deep marine abyss & electric cyan",
    bg: "#031427",
    surface: "#071e3b",
    surface2: "#0d2f5c",
    headerBg: "rgba(3, 20, 39, 0.9)",
    sidebarBg: "#031427",
    border: "rgba(14, 165, 233, 0.22)",
    borderSubtle: "rgba(14, 165, 233, 0.09)",
    text: "#f0f9ff",
    textTitle: "#ffffff",
    textMuted: "#7dd3fc",
    accent: "#0ea5e9",
    accent2: "#38bdf8",
    swatch: ["#031427", "#071e3b", "#0ea5e9"],
  },
  {
    id: "amber",
    name: "Solar Amber",
    mode: "dark",
    icon: "🔥",
    description: "Warm bronze & glowing golden ember",
    bg: "#170f03",
    surface: "#271b07",
    surface2: "#3d2a0b",
    headerBg: "rgba(23, 15, 3, 0.9)",
    sidebarBg: "#170f03",
    border: "rgba(245, 158, 11, 0.22)",
    borderSubtle: "rgba(245, 158, 11, 0.09)",
    text: "#fefce8",
    textTitle: "#ffffff",
    textMuted: "#fde047",
    accent: "#f59e0b",
    accent2: "#fbbf24",
    swatch: ["#170f03", "#271b07", "#f59e0b"],
  },
  {
    id: "charcoal",
    name: "Nordic Charcoal",
    mode: "dark",
    icon: "🌑",
    description: "Pure sleek monochrome dark aesthetic",
    bg: "#09090b",
    surface: "#141417",
    surface2: "#202025",
    headerBg: "rgba(9, 9, 11, 0.9)",
    sidebarBg: "#09090b",
    border: "rgba(255, 255, 255, 0.1)",
    borderSubtle: "rgba(255, 255, 255, 0.05)",
    text: "#fafafa",
    textTitle: "#ffffff",
    textMuted: "#a1a1aa",
    accent: "#e4e4e7",
    accent2: "#a1a1aa",
    swatch: ["#09090b", "#141417", "#e4e4e7"],
  },
  {
    id: "cream",
    name: "Warm Cream",
    mode: "light",
    icon: "📜",
    description: "Gentle parchment & cozy sepia tones",
    bg: "#faf5eb",
    surface: "#ffffff",
    surface2: "#f3ebda",
    headerBg: "rgba(250, 245, 235, 0.9)",
    sidebarBg: "#ffffff",
    border: "rgba(120, 53, 15, 0.12)",
    borderSubtle: "rgba(120, 53, 15, 0.06)",
    text: "#292524",
    textTitle: "#1c1917",
    textMuted: "#78716c",
    accent: "#d97706",
    accent2: "#b45309",
    swatch: ["#faf5eb", "#ffffff", "#d97706"],
  },
];

// Quick selection swatches for any-color generator
export const QUICK_ACCENT_COLORS = [
  { name: "Sapphire Blue", hex: "#2563eb" },
  { name: "Sky Cyan", hex: "#06b6d4" },
  { name: "Ocean Teal", hex: "#0d9488" },
  { name: "Emerald Green", hex: "#10b981" },
  { name: "Lime Mint", hex: "#84cc16" },
  { name: "Golden Amber", hex: "#f59e0b" },
  { name: "Sunset Orange", hex: "#f97316" },
  { name: "Crimson Red", hex: "#ef4444" },
  { name: "Rose Pink", hex: "#f43f5e" },
  { name: "Hot Fuchsia", hex: "#d946ef" },
  { name: "Electric Purple", hex: "#a855f7" },
  { name: "Royal Violet", hex: "#7c3aed" },
  { name: "Indigo", hex: "#6366f1" },
  { name: "Nordic Silver", hex: "#94a3b8" },
  { name: "Warm Bronze", hex: "#b45309" },
  { name: "Midnight Black", hex: "#3b82f6" },
];

// Dynamically generate a complete full-page theme from ANY color!
export function generateCustomTheme(primaryHex, customBgHex = null, mode = "dark") {
  const { r, g, b } = hexToRgb(primaryHex);
  const { h, s, l } = rgbToHsl(r, g, b);

  const isLight = mode === "light";

  let bg;
  let surface;
  let surface2;
  let headerBg;
  let sidebarBg;
  let text;
  let textTitle;
  let textMuted;
  let border;
  let borderSubtle;

  if (customBgHex) {
    bg = customBgHex;
    const bgLum = getLuminance(customBgHex);
    const bgIsLight = bgLum > 0.45;
    const { r: br, g: bgCol, b: bb } = hexToRgb(customBgHex);
    const { h: bh, s: bs, l: bl } = rgbToHsl(br, bgCol, bb);

    if (bgIsLight) {
      surface = "#ffffff";
      surface2 = hslToHex(bh, Math.min(bs, 25), Math.max(bl - 6, 85));
      headerBg = `${bg}e6`;
      sidebarBg = surface;
      text = "#0f172a";
      textTitle = "#020617";
      textMuted = "#475569";
      border = `hsla(${bh}, ${Math.min(bs, 20)}%, 20%, 0.10)`;
      borderSubtle = `hsla(${bh}, ${Math.min(bs, 20)}%, 20%, 0.05)`;
    } else {
      surface = hslToHex(bh, Math.min(bs, 35), Math.min(bl + 4, 15));
      surface2 = hslToHex(bh, Math.min(bs, 30), Math.min(bl + 8, 22));
      headerBg = `${bg}e6`;
      sidebarBg = bg;
      text = "#f8fafc";
      textTitle = "#ffffff";
      textMuted = hslToHex(bh, Math.min(bs, 40), 75);
      border = `hsla(${bh}, ${Math.min(bs, 40)}%, 70%, 0.16)`;
      borderSubtle = `hsla(${bh}, ${Math.min(bs, 40)}%, 70%, 0.08)`;
    }
  } else if (isLight) {
    // Pure or tinted light mode
    bg = hslToHex(h, Math.min(s, 22), 97);
    surface = "#ffffff";
    surface2 = hslToHex(h, Math.min(s, 25), 93);
    headerBg = `hsla(${h}, ${Math.min(s, 25)}%, 98%, 0.95)`;
    sidebarBg = "#ffffff";
    text = "#0f172a";
    textTitle = "#020617";
    textMuted = "#64748b";
    border = `hsla(${h}, ${Math.min(s, 20)}%, 20%, 0.09)`;
    borderSubtle = `hsla(${h}, ${Math.min(s, 20)}%, 20%, 0.05)`;
  } else {
    // Rich tinted dark mode
    bg = hslToHex(h, Math.min(s, 38), 6);
    surface = hslToHex(h, Math.min(s, 35), 11);
    surface2 = hslToHex(h, Math.min(s, 30), 18);
    headerBg = `hsla(${h}, ${Math.min(s, 38)}%, 6%, 0.92)`;
    sidebarBg = hslToHex(h, Math.min(s, 38), 5);
    text = "#f8fafc";
    textTitle = "#ffffff";
    textMuted = hslToHex(h, Math.min(s, 40), 75);
    border = `hsla(${h}, ${Math.min(s, 50)}%, 70%, 0.16)`;
    borderSubtle = `hsla(${h}, ${Math.min(s, 50)}%, 70%, 0.08)`;
  }

  // Accent gradients
  const accent = primaryHex;
  const accent2 = isLight
    ? hslToHex(h, Math.min(s + 10, 100), Math.max(l - 12, 35))
    : hslToHex(h, Math.min(s + 10, 100), Math.min(l + 15, 75));

  return {
    id: "custom",
    name: "Custom Theme",
    mode,
    icon: "🎨",
    description: `Custom ${mode} theme centered on ${primaryHex}`,
    bg,
    surface,
    surface2,
    headerBg,
    sidebarBg,
    border,
    borderSubtle,
    text,
    textTitle,
    textMuted,
    accent,
    accent2,
    swatch: [bg, surface, accent],
  };
}

const STORAGE_KEY = "habit_app_theme_v3";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Load saved config
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      activePreset: "midnight",
      mode: "dark",
      customPrimary: "#2563eb",
      customBg: null,
      isCustom: false,
    };
  });

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Compute active theme
  const currentTheme = useMemo(() => {
    if (config.isCustom || config.activePreset === "custom") {
      return generateCustomTheme(config.customPrimary, config.customBg, config.mode);
    }
    const found = PRESET_THEMES.find((p) => p.id === config.activePreset);
    if (!found) return PRESET_THEMES[0];
    
    // If user explicitly toggled mode on a preset
    if (found.mode !== config.mode) {
      return generateCustomTheme(found.accent, null, config.mode);
    }
    return found;
  }, [config]);

  // Apply to document :root
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.style.setProperty("--color-bg", currentTheme.bg);
    root.style.setProperty("--color-surface", currentTheme.surface);
    root.style.setProperty("--color-surface-2", currentTheme.surface2);
    root.style.setProperty("--color-header-bg", currentTheme.headerBg);
    root.style.setProperty("--color-sidebar-bg", currentTheme.sidebarBg);
    root.style.setProperty("--color-border", currentTheme.border);
    root.style.setProperty("--color-border-subtle", currentTheme.borderSubtle);
    root.style.setProperty("--color-text", currentTheme.text);
    root.style.setProperty("--color-text-title", currentTheme.textTitle);
    root.style.setProperty("--color-text-muted", currentTheme.textMuted);
    root.style.setProperty("--color-accent", currentTheme.accent);
    root.style.setProperty("--color-accent-2", currentTheme.accent2);
    root.style.setProperty("--theme-1", currentTheme.accent);
    root.style.setProperty("--theme-2", currentTheme.accent2);
    root.style.setProperty("--color-card-bg", currentTheme.surface);
    root.style.setProperty(
      "--color-input-bg",
      currentTheme.mode === "light" ? "#f1f5f9" : "#1A2031"
    );
    root.style.setProperty(
      "--color-input-border",
      currentTheme.mode === "light" ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.1)"
    );
    root.style.setProperty(
      "--color-card-border",
      currentTheme.mode === "light" ? "1px solid rgba(0, 0, 0, 0.08)" : "none"
    );
    root.style.setProperty(
      "--color-card-shadow",
      currentTheme.mode === "light"
        ? "0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.04)"
        : "none"
    );
    // Crucial aliases used across components
    root.style.setProperty("--text-primary", currentTheme.text);
    root.style.setProperty("--text-muted", currentTheme.textMuted);
    root.style.setProperty("--color-muted", currentTheme.textMuted);

    root.setAttribute("data-theme-mode", currentTheme.mode);
    root.setAttribute("data-theme-preset", currentTheme.id);

    if (body) {
      body.style.backgroundColor = currentTheme.bg;
      body.style.color = currentTheme.text;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      // Backwards compatibility with appAccentTheme
      localStorage.setItem("appAccentTheme", config.activePreset);
    } catch (_) {}
  }, [currentTheme, config]);

  // Actions
  const setPreset = useCallback((presetId) => {
    const preset = PRESET_THEMES.find((p) => p.id === presetId);
    if (!preset) return;
    setConfig((prev) => ({
      ...prev,
      activePreset: presetId,
      mode: preset.mode,
      isCustom: false,
    }));
  }, []);

  const setThemeMode = useCallback((newMode) => {
    setConfig((prev) => ({
      ...prev,
      mode: newMode,
      activePreset: prev.isCustom
        ? "custom"
        : newMode === "light" && prev.activePreset === "midnight"
        ? "light"
        : newMode === "dark" && prev.activePreset === "light"
        ? "midnight"
        : prev.activePreset,
    }));
  }, []);

  const toggleThemeMode = useCallback(() => {
    setConfig((prev) => {
      const nextMode = prev.mode === "dark" ? "light" : "dark";
      let nextPreset = prev.activePreset;
      if (!prev.isCustom) {
        if (nextMode === "light" && prev.activePreset === "midnight") nextPreset = "light";
        else if (nextMode === "dark" && prev.activePreset === "light") nextPreset = "midnight";
      }
      return {
        ...prev,
        mode: nextMode,
        activePreset: nextPreset,
      };
    });
  }, []);

  const setCustomPrimary = useCallback((hex) => {
    setConfig((prev) => ({
      ...prev,
      customPrimary: hex,
      isCustom: true,
      activePreset: "custom",
    }));
  }, []);

  const setCustomBg = useCallback((hex) => {
    setConfig((prev) => ({
      ...prev,
      customBg: hex,
      isCustom: true,
      activePreset: "custom",
    }));
  }, []);

  const resetToDefault = useCallback(() => {
    setConfig({
      activePreset: "midnight",
      mode: "dark",
      customPrimary: "#2563eb",
      customBg: null,
      isCustom: false,
    });
  }, []);

  const value = {
    theme: currentTheme,
    themeMode: currentTheme.mode,
    activePreset: config.activePreset,
    isCustom: config.isCustom,
    customPrimary: config.customPrimary,
    customBg: config.customBg,
    presets: PRESET_THEMES,
    quickColors: QUICK_ACCENT_COLORS,
    setPreset,
    setThemeMode,
    toggleThemeMode,
    setCustomPrimary,
    setCustomBg,
    resetToDefault,
    isThemeModalOpen,
    setIsThemeModalOpen,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
