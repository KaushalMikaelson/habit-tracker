import { useMemo } from "react";
import { motion } from "framer-motion";

/**
 * MomentumFlame — 6-Stage Growth Reactor
 *
 * Stage 0: Negative (momentumDelta ≤ 0)  — Burnt wood + smoke drift
 * Stage 1: Spark           (level 1)      — Dim ember flicker
 * Stage 2: Ember Flame     (level 2–3)   — Warm amber
 * Stage 3: Rising Flame    (level 4–5)   — Crimson combustion
 * Stage 4: Blue Acceleration (level 6–7) — Electric blue, sharp
 * Stage 5: Plasma Energy   (level 8–9)   — White-hot plasma + sparks
 * Stage 6: Apex Reactor    (level 10)    — Cyan + violet + rotating aura
 *
 * growthScore = (monthly × 0.6) + (momentum × 2.2) + (momentumDelta × 2.5)
 * level = Math.ceil(normalized × 10)
 */

/* ── Utility ────────────────────────────────────────────────────────────── */
function withAlpha(rgba, alpha) {
    return rgba.replace(/,[\d.]+\)$/, `,${alpha})`);
}

/* ── Palettes ────────────────────────────────────────────────────────────── */
const PALETTES = {

    // 1 — Radiant Ignition (White + Yellow)
    1: {
        outer: "#2b1d00",
        mid: "#facc15",
        core: "#fde047",
        tip: "#fffbea",
        hotcore: "#ffffff",
        base: "#140f02",
        glow: "rgba(250,204,21,0.45)",
        accent: null,
    },

    // 2 — Solar Combustion (Yellow + Red)
    2: {
        outer: "#3b0d02",
        mid: "#ef4444",
        core: "#f59e0b",
        tip: "#fff7ed",
        hotcore: "#ffffff",
        base: "#1a0502",
        glow: "rgba(239,68,68,0.55)",
        accent: null,
    },
    

    // 4 — Electric Acceleration (Blue)
    3: {
        outer: "#0a1124",
        mid: "#2563eb",
        core: "#60a5fa",
        tip: "#e0f2fe",
        hotcore: "#ffffff",
        base: "#020617",
        glow: "rgba(37,99,235,0.80)",
        accent: null,
    },

    // 5 — Apex Plasma (Purple)
    4: {
        outer: "#1e0033",
        mid: "#7c3aed",
        core: "#c084fc",
        tip: "#f5f3ff",
        hotcore: "#ffffff",
        base: "#0c0014",
        glow: "rgba(124,58,237,0.95)",
        accent: "#a78bfa",
    },

    // 6 — Quantum Reactor (Cosmic Violet + Magenta)
    // 6 — Obsidian Apex (Premium Black)
    5: {
        outer: "#050505",        // deep matte black
        mid: "#1c1c1c",          // graphite layer
        core: "#2a2a2a",         // dense inner black
        tip: "#e5e5e5",          // subtle silver highlight
        hotcore: "#ffffff",      // white center (controlled energy)
        base: "#000000",         // pure black base
        glow: "rgba(212,175,55,0.8)", // subtle gold aura // dark shadow aura
        accent: "#d4af37",       // premium gold accent (optional)
    }

};

/* ── Stage mapping ───────────────────────────────────────────────────────── */
function getStage(level) {
    if (level >= 10) return 5;
    if (level >= 8) return 4;
    if (level >= 6) return 3;
    if (level >= 2) return 2;
    return 1;
}

function getBlur(stage) {
    const OUTER = [1.6, 1.5, 1.0, 0.45, 0.2, 0.08];
    const MID = [0.9, 0.8, 0.5, 0.18, 0.07, 0.02];
    const i = Math.min(stage - 1, 5);
    return { outer: OUTER[i], mid: MID[i] };
}

/* ── Flame SVG paths (viewBox 0 0 28 38) ────────────────────────────────── */
const P_OUTER = `
  M14 37 C10 37 5.5 33.5 4 29 C2.5 24.5 3.5 20 6.5 17
  C7 20.5 8 23.5 9.5 25 C7.5 21.5 7 15.5 10 10
  C10.5 14 11.5 18 13 19.5 C12.5 16.5 12 10.5 13.5 4.5
  C14 2.5 14.5 1 14 0 C13.5 1 14 2.5 14.5 4.5
  C16 10.5 15.5 16.5 15 19.5 C16.5 18 17.5 14 18 10
  C21 15.5 20.5 21.5 18.5 25 C20 23.5 21 20.5 21.5 17
  C24.5 20 25.5 24.5 24 29 C22.5 33.5 18 37 14 37Z`;

const P_MID = `
  M14 37 C11 37 7.5 34 6.5 30 C5.5 26.5 6.5 22.5 8.5 20
  C9 23 10 26 11.5 27.5 C9.5 24 9 18.5 11.5 13.5
  C12 17 12.5 21 14 22.5 C15.5 21 16 17 16.5 13.5
  C19 18.5 18.5 24 16.5 27.5 C18 26 19 23 19.5 20
  C21.5 22.5 22.5 26.5 21.5 30 C20.5 34 17 37 14 37Z`;

const P_CORE = `
  M14 37 C12 37 10 35 9.5 32.5 C9 30 10 27.5 11.5 26
  C12 28.5 12.5 31 13 32 C12 29.5 11.5 25 13 20.5
  C13.5 23.5 14 27 14 27 C14 27 14.5 23.5 15 20.5
  C16.5 25 16 29.5 15 32 C15.5 31 16 28.5 16.5 26
  C18 27.5 19 30 18.5 32.5 C18 35 16 37 14 37Z`;

const P_TIP = `
  M14 0 C14.5 3 14.8 7 14.2 10.5 C14.8 8.5 15.5 6 15.5 3.5
  C16.8 6.5 16.5 11 15.5 14.5 C15 12.5 14.5 9.5 14 8
  C13.5 9.5 13 12.5 12.5 14.5 C11.5 11 11.2 6.5 12.5 3.5
  C12.5 6 13.2 8.5 13.8 10.5 C13.2 7 13.5 3 14 0Z`;

const P_HOTCORE = `
  M14 37 C13.4 37 13 36.2 13 35 C13 32 13.2 28.5 13.5 25.5
  C13.6 23 13.8 20 14 18 C14.2 20 14.4 23 14.5 25.5
  C14.8 28.5 15 32 15 35 C15 36.2 14.6 37 14 37Z`;

/* ── Stage 0: Burnt wood + smoke ─────────────────────────────────────────── */
const SMOKE_PUFFS = [
    { cx: 13, delay: 0.0, dur: 3.2, xEnd: 10 },
    { cx: 15, delay: 1.2, dur: 3.8, xEnd: 18 },
    { cx: 12, delay: 2.4, dur: 3.0, xEnd: 9 },
];

function SmokeState() {
    return (
        <div
            style={{
                position: "relative",
                width: "48px", height: "60px",
                display: "flex", alignItems: "flex-end", justifyContent: "center",
                opacity: 0.92, flexShrink: 0,
            }}
            title="Growth stalled — no forward acceleration"
        >
            <svg
                width="48" height="60" viewBox="0 0 28 40"
                fill="none"
                style={{ position: "absolute", inset: 0, overflow: "visible" }}
            >
                {/* Back log — lighter grey-brown so it reads on dark bg */}
                <path
                    d="M6 40 C5.5 40 5 34 7.5 28 L10 23.5 L14 26 L18 23.5 L20.5 28 C23 34 22.5 40 22 40 Z"
                    fill="#5a3e28" opacity="1"
                />
                {/* Front log — slightly darker charcoal with warm tint */}
                <path
                    d="M9.5 40 C9.5 37 10 31.5 11.5 28.5 L14 31 L16.5 28.5 C18 31.5 18.5 37 18.5 40 Z"
                    fill="#3b2618" opacity="1"
                />
                {/* Ash highlights — light grey streaks on log surface */}
                <path d="M10.5 34 Q14 33 17.5 34" stroke="#9e8060" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.8" />
                <path d="M11 37 Q14 36.2 17 37" stroke="#8a6e50" strokeWidth="0.6" strokeLinecap="round" fill="none" opacity="0.6" />
                {/* Hot ember cracks — orange-red glow lines */}
                <path d="M13 30 Q14 29 15 30" stroke="#c0440a" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.9" />
                <path d="M11.5 33 Q12.5 32.2 14 33" stroke="#a03508" strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.8" />
                <path d="M15 32 Q16 31.4 17 32" stroke="#b03a08" strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.75" />
                {/* Ember glow spots */}
                <ellipse cx="12.5" cy="30.5" rx="1.2" ry="0.7" fill="#e05010" opacity="0.7" />
                <ellipse cx="15.5" cy="31.8" rx="1.0" ry="0.6" fill="#c04008" opacity="0.6" />
                <ellipse cx="14" cy="28.5" rx="1.5" ry="0.8" fill="#d04810" opacity="0.75" />
                {/* Ash grey dust on top */}
                <ellipse cx="14" cy="26.5" rx="5" ry="1.2" fill="#7a6a58" opacity="0.35" />

                {/* Animated smoke puffs */}
                {SMOKE_PUFFS.map((p, i) => (
                    <motion.ellipse
                        key={i}
                        cx={p.cx} cy={22} rx={2} ry={2.5}
                        fill="#8a8078"
                        animate={{
                            cy: [22, 10, 0],
                            cx: [p.cx, (p.cx + p.xEnd) / 2, p.xEnd],
                            opacity: [0, 0.55, 0],
                            rx: [2, 5.5, 9],
                            ry: [2.5, 5, 7.5],
                        }}
                        transition={{ delay: p.delay, duration: p.dur, repeat: Infinity, ease: "easeOut" }}
                    />
                ))}
            </svg>
        </div>
    );
}

/* ── Stage 1: Spark flicker ──────────────────────────────────────────────── */
function SparkState() {
    const p = PALETTES[1];

    return (
        <motion.div
            style={{
                width: "48px",
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                position: "relative",
                filter: `drop-shadow(0 0 10px ${p.glow})`,
            }}
            
        
            title="Growth spark — ignition beginning"
        >
            {/* Micro heat aura */}
            <motion.div
                style={{
                    position: "absolute",
                    width: "40px",
                    height: "50px",
                    borderRadius: "50%",
                    background: `radial-gradient(ellipse at 50% 70%, ${p.glow} 0%, transparent 70%)`,
                    filter: "blur(6px)",
                }}
                animate={{
                    scale: [0.9, 1.3, 0.9],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 2,
                    ease: "easeOut",
                    repeat: Infinity,
                }}
            />

            <svg width="20" height="30" viewBox="0 0 28 38" fill="none">
                <defs>
                    <linearGradient
                        id="spark_g"
                        x1="14"
                        y1="12"
                        x2="14"
                        y2="38"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0%" stopColor={p.tip} stopOpacity="0.95" />
                        <stop offset="60%" stopColor={p.core} stopOpacity="0.85" />
                        <stop offset="100%" stopColor={p.mid} stopOpacity="1" />
                    </linearGradient>
                </defs>

                {/* Core spark */}
                <path d={P_CORE} fill="url(#spark_g)" />

                {/* White-hot needle */}
                <path
                    d={P_HOTCORE}
                    fill={p.hotcore}
                    opacity="0.7"
                    style={{ mixBlendMode: "screen" }}
                />
            </svg>

            {/* Tiny rising sparks */}
            {[0, 0.6, 1.2].map((delay, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: "absolute",
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: p.tip,
                        top: "32px",
                        left: `${20 + i * 4}px`,
                        pointerEvents: "none",
                    }}
                    animate={{
                        y: [-2, -16],
                        opacity: [0, 1, 0],
                        scale: [0.8, 1, 0.4],
                    }}
                    transition={{
                        delay,
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeOut",
                    }}
                />
            ))}
        </motion.div>
    );
}

/* ── Spark particles (Stage 5–6) ─────────────────────────────────────────── */
const SPARK_DEFS = [
    { sx: 10, sy: 26, ex: 5, ey: 14, delay: 0.00 },
    { sx: 18, sy: 24, ex: 23, ey: 12, delay: 0.45 },
    { sx: 12, sy: 20, ex: 7, ey: 8, delay: 0.90 },
    { sx: 16, sy: 22, ex: 21, ey: 9, delay: 1.35 },
    { sx: 14, sy: 17, ex: 11, ey: 4, delay: 1.80 },
    { sx: 13, sy: 15, ex: 17, ey: 3, delay: 0.65 },
];

function SparkParticles({ color, count }) {
    return (
        <svg
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}
            viewBox="0 0 28 38"
        >
            {SPARK_DEFS.slice(0, count).map((s, i) => (
                <motion.circle
                    key={i} cx={s.sx} cy={s.sy} r={0.65}
                    fill={color}
                    animate={{
                        cx: [s.sx, s.ex],
                        cy: [s.sy, s.ey],
                        opacity: [0, 1, 0],
                        r: [0.65, 0.28, 0],
                    }}
                    transition={{ delay: s.delay, duration: 1.1, repeat: Infinity, ease: "easeOut" }}
                />
            ))}
        </svg>
    );
}

/* ── Heat bloom ripples (replaces rotating ring) ────────────────────────── */
// Real flames radiate heat outward in expanding pulses, not spinning rings.
function HeatBloom({ glow, duration, intensity }) {
    const delays = [0, duration * 0.4, duration * 0.8];
    return (
        <>
            {delays.map((delay, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: "absolute",
                        // Ellipse flattened at bottom — heat rises up, not sideways
                        left: "50%", bottom: "0",
                        transform: "translateX(-50%)",
                        width: `${60 + i * 10}px`,
                        height: `${70 + i * 10}px`,
                        borderRadius: "50%",
                        background: `radial-gradient(ellipse at 50% 80%, ${glow} 0%, transparent 70%)`,
                        filter: "blur(6px)",
                        pointerEvents: "none",
                    }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                        scale: [0.8, 1.5 + intensity * 0.6, 1.9 + intensity * 0.6],
                        opacity: [intensity * 0.6, intensity * 0.3, 0],
                    }}
                    transition={{
                        delay,
                        duration: duration * 1.8,
                        repeat: Infinity,
                        ease: "easeOut",
                    }}
                />
            ))}
        </>
    );
}

/* ── Main component ──────────────────────────────────────────────────────── */
function MomentumFlame({ momentumDelta = 0, momentum = 0, monthly = 0 }) {
    const computed = useMemo(() => {
        // Balanced growth formula: discipline + improvement + acceleration
        const score = Math.max(0, Math.min(100, monthly));

        // Stage 0 (smoke): below ignition threshold
        if (score < 1) return { stage: 0, level: 0, normalized: 0 };

        const norm = score / 100;
        const level = Math.max(1, Math.ceil(norm * 10));
        const stage = getStage(level);
        const palette = PALETTES[stage];
        const { outer: blurOuter, mid: blurMid } = getBlur(stage);

        const flameW = Math.round(20 + norm * 24);
        const flameH = Math.round(27 + norm * 31);

        return {
            stage, level, normalized: norm, palette, blurOuter, blurMid,
            flameW, flameH,
            glowPx: 8 + norm * 38,
            duration: 2.2 - norm * 1.3,
        };

    }, [monthly]); // 🔥 dependency updated

    const { stage, level, normalized, palette, blurOuter, blurMid, flameW, flameH, glowPx, duration } = computed;

    /* Stage 0 & 1 */
    if (stage === 0) return <SmokeState />;
    if (stage === 1) return <SparkState />;

    /* Stage 2–6: Full flame */
    const id = `fg_s${stage}`;
    const isApex = stage === 6;
    const isPlasma = stage >= 5;

    const wrapW = flameW + 20;
    const wrapH = flameH + 16;

    const baseGlow = Math.max(12, glowPx); // ensures minimum glow
const glowFilter = `
  drop-shadow(0 0 ${baseGlow}px ${palette.glow})
  drop-shadow(0 0 ${baseGlow * 0.6}px ${palette.glow})
  brightness(1.15)
`;
    const glowFilterHot = `drop-shadow(0 0 ${glowPx * 1.8}px ${palette.glow})`;
    const bloomIntensity = 0.5 + normalized * 0.5;

    return (
        <div
            style={{
                position: "relative",
                width: `${wrapW}px`, height: `${wrapH}px`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                
            }}
            title={`Growth Reactor · Level ${level} · Stage ${stage}`}
        >
            <HeatBloom
                glow={withAlpha(palette.glow, 0.22)}
                duration={duration}
                intensity={bloomIntensity}
            />

            {isPlasma && (
                <SparkParticles color={palette.hotcore} count={isApex ? 6 : 4} />
            )}

            <motion.div
                style={{
                    filter: glowFilter,
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}
                animate={{
                    y: [0, -1.5, -0.5, -2, 0],
                    x: [0, 0.9, -0.7, 0.4, 0],
                    scaleX: [1, 0.96, 1.03, 0.97, 1],
                    opacity: [1, 0.95, 0.98, 0.94, 1],
                    filter: [glowFilter, glowFilterHot, glowFilter, glowFilterHot, glowFilter],
                }}
                
            >

                <svg width={flameW} height={flameH} viewBox="0 0 28 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        {/* Stage-aware blur: hot = sharp, cool = soft */}
                        <filter id={`${id}_bo`} x="-25%" y="-8%" width="150%" height="118%">
                            <feGaussianBlur stdDeviation={blurOuter} />
                        </filter>
                        <filter id={`${id}_bm`} x="-20%" y="-5%" width="140%" height="112%">
                            <feGaussianBlur stdDeviation={blurMid} />
                        </filter>

                        {/* Outer body: very dark edge → vivid mid */}
                        <linearGradient id={`${id}_og`} x1="14" y1="0" x2="14" y2="38" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor={palette.outer} stopOpacity="0" />
                            <stop offset="20%" stopColor={palette.mid} stopOpacity="0.65" />
                            <stop offset="55%" stopColor={palette.outer} stopOpacity="0.96" />
                            <stop offset="100%" stopColor={palette.outer} stopOpacity="1" />
                        </linearGradient>

                        {/* Mid flame */}
                        <linearGradient id={`${id}_mg`} x1="14" y1="4" x2="14" y2="38" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor={palette.tip} stopOpacity="0" />
                            <stop offset="18%" stopColor={palette.core} stopOpacity="0.65" />
                            <stop offset="55%" stopColor={palette.mid} stopOpacity="0.94" />
                            <stop offset="100%" stopColor={palette.mid} stopOpacity="1" />
                        </linearGradient>

                        {/* Inner bright core */}
                        <linearGradient id={`${id}_cg`} x1="14" y1="10" x2="14" y2="38" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor={palette.tip} stopOpacity="0.95" />
                            <stop offset="38%" stopColor={palette.core} stopOpacity="1" />
                            <stop offset="100%" stopColor={palette.mid} stopOpacity="0.72" />
                        </linearGradient>

                        {/* Tip tongue */}
                        <linearGradient id={`${id}_tg`} x1="14" y1="0" x2="14" y2="15" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor={palette.tip} stopOpacity="0.95" />
                            <stop offset="100%" stopColor={palette.core} stopOpacity="0" />
                        </linearGradient>

                        {/* Combustion base (reduced opacity — eye focuses on core) */}
                        <radialGradient id={`${id}_base`} cx="50%" cy="100%" r="35%" gradientUnits="objectBoundingBox">
                            <stop offset="0%" stopColor={palette.base} stopOpacity={0.22 + normalized * 0.18} />
                            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </radialGradient>

                        {/* White-hot needle core */}
                        <linearGradient id={`${id}_hc`} x1="14" y1="16" x2="14" y2="37" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor={palette.hotcore} stopOpacity="0" />
                            <stop offset="25%" stopColor={palette.hotcore} stopOpacity="0.90" />
                            <stop offset="65%" stopColor={palette.hotcore} stopOpacity="0.70" />
                            <stop offset="100%" stopColor={palette.hotcore} stopOpacity="0" />
                        </linearGradient>

                        {/* Radial inner core (Stage 4+) */}
                        {stage >= 4 && (
                            <radialGradient id={`${id}_rc`} cx="50%" cy="72%" r="28%" gradientUnits="objectBoundingBox">
                                <stop offset="0%" stopColor={palette.core} stopOpacity={Math.min(0.98, 0.35 + (normalized - 0.55) * 1.6)} />
                                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                            </radialGradient>
                        )}

                        {/* Apex violet accent layer */}
                        {isApex && (
                            <radialGradient id={`${id}_acc`} cx="50%" cy="58%" r="42%" gradientUnits="objectBoundingBox">
                                <stop offset="0%" stopColor={palette.accent} stopOpacity="0.20" />
                                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                            </radialGradient>
                        )}
                    </defs>

                    {/* L1: diffuse outer body */}
                    <path d={P_OUTER} fill={`url(#${id}_og)`} filter={`url(#${id}_bo)`} opacity="0.9" />
                    {/* L2: mid flame */}
                    <path d={P_MID} fill={`url(#${id}_mg)`} filter={`url(#${id}_bm)`} opacity="0.95" />
                    {/* L3: inner core */}
                    <path d={P_CORE} fill={`url(#${id}_cg)`} />
                    {/* L4: tip tongue */}
                    <path d={P_TIP} fill={`url(#${id}_tg)`} opacity="0.85" />
                    {/* L5: combustion base */}
                    <path d={P_MID} fill={`url(#${id}_base)`} />
                    {/* L6: white-hot needle — visual gravity anchor */}
                    <path d={P_HOTCORE} fill={`url(#${id}_hc)`} style={{ mixBlendMode: "screen" }} />
                    {/* L7: radial inner core (Stage 4+) */}
                    {stage >= 4 && <path d={P_CORE} fill={`url(#${id}_rc)`} />}
                    {/* L8: apex violet accent */}
                    {isApex && <path d={P_MID} fill={`url(#${id}_acc)`} />}
                </svg>
            </motion.div>

            {isApex && (
                <motion.div
                    style={{
                        position: "absolute", inset: 0, borderRadius: "4px", pointerEvents: "none",
                        background: `radial-gradient(ellipse at 50% 62%, ${palette.core}28 0%, transparent 70%)`,
                    }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
                />
            )}
        </div>
    );
}


export default MomentumFlame;