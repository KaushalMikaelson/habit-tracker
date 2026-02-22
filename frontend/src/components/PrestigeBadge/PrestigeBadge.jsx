import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTier, getNextTier, getFlameTier, getNextFlameTier } from "./constants";
import { calculateLifetimeStats } from "./scoring";
import "./PrestigeBadge.css";

/**
 * PrestigeBadge — Premium Lifetime Prestige Indicator
 *
 * Sits beside the profile avatar in the navbar.
 * Clickable → opens a premium stats dropdown.
 * Score is PERSISTENT and NEVER resets.
 *
 * @param {{ habits: Array }} props
 */
export default function PrestigeBadge({ habits }) {
    const [open, setOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const wrapperRef = useRef(null);

    /* ---- Compute lifetime stats ---- */
    const stats = useMemo(() => calculateLifetimeStats(habits), [habits]);
    const tier = useMemo(() => getTier(stats.lifetimeScore), [stats.lifetimeScore]);
    const nextTier = useMemo(() => getNextTier(stats.lifetimeScore), [stats.lifetimeScore]);

    /* ---- Close on outside click ---- */
    useEffect(() => {
        if (!open) return;
        function handleClick(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    /* ---- Progress to next tier ---- */
    const progressPercent = nextTier
        ? Math.round(
            ((stats.lifetimeScore - tier.min) / (nextTier.min - tier.min)) * 100
        )
        : 100;

    /* ---- Flame Progress ---- */
    const currentFlame = useMemo(() => getFlameTier(stats.monthlyScore), [stats.monthlyScore]);
    const nextFlame = useMemo(() => getNextFlameTier(stats.monthlyScore), [stats.monthlyScore]);

    const flameProgressPercent = nextFlame
        ? Math.round(
            ((stats.monthlyScore - currentFlame.min) / Math.max(1, (nextFlame.min - currentFlame.min))) * 100
        )
        : 100;

    const tasksNeededForNextFlame = nextFlame
        ? Math.max(0, Math.ceil((nextFlame.min / 100) * stats.monthlyPossible) - stats.monthlyCompleted)
        : 0;

    return (
        <div className="prestige-badge-wrapper" ref={wrapperRef}>
            {/* ---- The Badge ---- */}
            <motion.div
                className="prestige-badge"
                onClick={() => setOpen((prev) => !prev)}
                onMouseEnter={() => !open && setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                style={{
                    background: tier.gradient,
                    boxShadow: tier.badgeShadow,
                    border: tier.isTop5 ? "none" : `2px solid ${tier.ringColor}`,
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
                {/* TOP 5% animated conic border */}
                {tier.isTop5 && (
                    <div
                        className="prestige-top5-border"
                        style={{ background: tier.borderGradient }}
                    />
                )}

                {/* Breathing glow (Platinum + TOP 5%) */}
                {(tier.isTop5 || tier.key === "platinum") && (
                    <div
                        className="prestige-glow"
                        style={{ background: tier.glowColor }}
                    />
                )}

                {/* Shine sweep (TOP 5% only) */}
                {tier.isTop5 && <div className="prestige-shine" />}

                {/* Crown (TOP 5% only) */}
                {tier.isTop5 && <span className="prestige-crown">👑</span>}

                {/* Shield Icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: tier.textColor, zIndex: 3, opacity: 0.9 }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>

                {/* Percentage text */}
                <span
                    className="prestige-badge-text"
                    style={{ color: tier.textColor }}
                >
                    {stats.lifetimeScore}
                </span>
            </motion.div>

            {/* ---- Tooltip (TOP 5% hover) ---- */}
            <AnimatePresence>
                {tier.isTop5 && showTooltip && !open && (
                    <motion.div
                        className="prestige-tooltip"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                    >
                        Top 5% — Exceptional Long-Term Discipline
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ---- Dropdown Panel ---- */}
            <AnimatePresence>
                {open && (
                    <>
                        <div
                            className="prestige-dropdown-overlay"
                            onClick={() => setOpen(false)}
                        />
                        <motion.div
                            className="prestige-dropdown"
                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.97 }}
                            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        >
                            {/* Rank Title */}
                            <div
                                className="prestige-dropdown-rank"
                                style={{ color: tier.textColor }}
                            >
                                <span>🏆</span>
                                <span>{tier.label}</span>
                            </div>

                            {/* Stats Grid */}
                            <div>
                                <StatRow
                                    icon="📊"
                                    label="Lifetime Completion"
                                    value={`${stats.lifetimeScore}%`}
                                    valueColor={tier.textColor}
                                />
                                <StatRow
                                    icon="📈"
                                    label="Total Tasks Completed"
                                    value={stats.totalCompleted.toLocaleString()}
                                />
                                <StatRow
                                    icon="🔥"
                                    label="Current Streak"
                                    value={`${stats.currentStreak} day${stats.currentStreak !== 1 ? "s" : ""}`}
                                />
                            </div>

                            {/* Next Tier Progress */}
                            {nextTier && (
                                <div className="prestige-next-tier">
                                    <div className="prestige-next-label">
                                        🎯 Next: {nextTier.label} ({nextTier.min}%)
                                    </div>

                                    <div className="prestige-progress-track">
                                        <motion.div
                                            className="prestige-progress-fill"
                                            style={{
                                                background: nextTier.gradient,
                                            }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercent}%` }}
                                            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                                        />
                                    </div>

                                    <div className="prestige-progress-text">
                                        <span>{stats.lifetimeScore}%</span>
                                        <span>{nextTier.min}%</span>
                                    </div>
                                </div>
                            )}

                            {/* Flame Progress */}
                            <div className="prestige-next-tier" style={{ marginTop: "16px" }}>
                                <div className="prestige-next-label">
                                    🔥 Next Flame: {nextFlame ? nextFlame.label : "Apex Achieved"} {nextFlame ? `(${nextFlame.min}%)` : ""}
                                </div>

                                <div className="prestige-progress-track">
                                    <motion.div
                                        className="prestige-progress-fill"
                                        style={{
                                            background: nextFlame ? nextFlame.gradient : currentFlame.gradient,
                                        }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, Math.max(0, flameProgressPercent))}%` }}
                                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                                    />
                                </div>

                                <div className="prestige-progress-text">
                                    <span>{stats.monthlyScore}%</span>
                                    <span>{nextFlame ? nextFlame.min : 100}%</span>
                                </div>

                                {nextFlame && (
                                    <div style={{ marginTop: "8px", fontSize: "11px", color: "#94a3b8", textAlign: "center", fontWeight: 500, letterSpacing: "0.02em" }}>
                                        Complete <span style={{ color: nextFlame.color, fontWeight: 700 }}>{tasksNeededForNextFlame}</span> more task{tasksNeededForNextFlame !== 1 ? 's' : ''} this month for next stage!
                                    </div>
                                )}
                            </div>

                            {/* At max tier */}
                            {!nextTier && (
                                <div
                                    style={{
                                        marginTop: "14px",
                                        padding: "10px",
                                        borderRadius: "10px",
                                        background: "rgba(255,215,0,0.06)",
                                        border: "1px solid rgba(255,215,0,0.12)",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        color: "#ffd700",
                                        textAlign: "center",
                                        letterSpacing: "0.02em",
                                    }}
                                >
                                    ✦ Maximum Prestige Achieved ✦
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ---- Stat Row Sub-Component ---- */

function StatRow({ icon, label, value, valueColor = "#f1f5f9" }) {
    return (
        <div className="prestige-stat-row">
            <span className="prestige-stat-label">
                <span>{icon}</span>
                <span>{label}</span>
            </span>
            <span className="prestige-stat-value" style={{ color: valueColor }}>
                {value}
            </span>
        </div>
    );
}
