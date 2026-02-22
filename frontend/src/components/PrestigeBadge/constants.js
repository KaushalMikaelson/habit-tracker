/**
 * Prestige Badge — Tier Definitions
 * 
 * Lifetime-based ranking system. NEVER resets.
 * Each tier reflects long-term discipline, not monthly spikes.
 */

export const PRESTIGE_TIERS = [
    {
        key: "top5",
        label: "TOP 5%",
        min: 95,
        max: 100,
        isTop5: true,
        gradient: "linear-gradient(135deg, #0a0a0a, #1a1a2e)",
        borderGradient: "conic-gradient(from 0deg, #b8860b, #ffd700, #daa520, #b8860b, #ffd700)",
        glowColor: "rgba(255, 215, 0, 0.35)",
        textColor: "#ffd700",
        ringColor: "#ffd700",
        badgeShadow: "0 0 18px rgba(255,215,0,0.35), 0 0 40px rgba(255,215,0,0.12)",
    },
    {
        key: "platinum",
        label: "Platinum Master",
        min: 85,
        max: 94,
        isTop5: false,
        gradient: "linear-gradient(135deg, #b0c4de, #e8e8e8, #cbd5e1)",
        borderGradient: null,
        glowColor: "rgba(176, 196, 222, 0.3)",
        textColor: "#e2e8f0",
        ringColor: "#b0c4de",
        badgeShadow: "0 0 14px rgba(176,196,222,0.3), 0 0 30px rgba(176,196,222,0.1)",
    },
    {
        key: "gold",
        label: "Gold Elite",
        min: 70,
        max: 84,
        isTop5: false,
        gradient: "linear-gradient(135deg, #b8860b, #daa520, #cd9b1d)",
        borderGradient: null,
        glowColor: "rgba(218, 165, 32, 0.25)",
        textColor: "#fde68a",
        ringColor: "#daa520",
        badgeShadow: "0 0 12px rgba(218,165,32,0.25), 0 0 24px rgba(218,165,32,0.08)",
    },
    {
        key: "silver",
        label: "Silver Performer",
        min: 50,
        max: 69,
        isTop5: false,
        gradient: "linear-gradient(135deg, #6b7280, #9ca3af, #6b7280)",
        borderGradient: null,
        glowColor: "rgba(156, 163, 175, 0.2)",
        textColor: "#d1d5db",
        ringColor: "#9ca3af",
        badgeShadow: "0 0 10px rgba(156,163,175,0.2), 0 0 20px rgba(156,163,175,0.06)",
    },
    {
        key: "bronze",
        label: "Bronze Builder",
        min: 30,
        max: 49,
        isTop5: false,
        gradient: "linear-gradient(135deg, #92400e, #b45309, #92400e)",
        borderGradient: null,
        glowColor: "rgba(180, 83, 9, 0.2)",
        textColor: "#fbbf24",
        ringColor: "#b45309",
        badgeShadow: "0 0 8px rgba(180,83,9,0.2), 0 0 16px rgba(180,83,9,0.05)",
    },
    {
        key: "initiate",
        label: "Initiate",
        min: 0,
        max: 29,
        isTop5: false,
        gradient: "linear-gradient(135deg, #374151, #4b5563, #374151)",
        borderGradient: null,
        glowColor: "rgba(75, 85, 99, 0.15)",
        textColor: "#9ca3af",
        ringColor: "#4b5563",
        badgeShadow: "0 0 6px rgba(75,85,99,0.15)",
    },
];

/**
 * Returns the tier object for a given lifetime score.
 */
export function getTier(score) {
    const clamped = Math.max(0, Math.min(100, score));
    return (
        PRESTIGE_TIERS.find((t) => clamped >= t.min && clamped <= t.max) ||
        PRESTIGE_TIERS[PRESTIGE_TIERS.length - 1]
    );
}

/**
 * Returns the NEXT tier above the current score, or null if at TOP 5%.
 */
export function getNextTier(score) {
    const clamped = Math.max(0, Math.min(100, score));
    const currentTier = getTier(clamped);
    const currentIndex = PRESTIGE_TIERS.indexOf(currentTier);
    return currentIndex > 0 ? PRESTIGE_TIERS[currentIndex - 1] : null;
}

/**
 * Flame Tiers — Monthly Progress
 * Mirrors MomentumFlame component stages.
 */
export const FLAME_TIERS = [
    {
        key: "apex",
        label: "Apex Reactor",
        min: 91,
        max: 100,
        color: "#d4af37", // Gold
        gradient: "linear-gradient(135deg, #050505, #1c1c1c)",
    },
    {
        key: "plasma",
        label: "Plasma Energy",
        min: 71,
        max: 90,
        color: "#c084fc", // Purple
        gradient: "linear-gradient(135deg, #1e0033, #7c3aed)",
    },
    {
        key: "blue",
        label: "Blue Acceleration",
        min: 51,
        max: 70,
        color: "#60a5fa", // Blue
        gradient: "linear-gradient(135deg, #0a1124, #2563eb)",
    },
    {
        key: "ember",
        label: "Ember Flame",
        min: 11,
        max: 50,
        color: "#f59e0b", // Orange-Red
        gradient: "linear-gradient(135deg, #3b0d02, #ef4444)",
    },
    {
        key: "spark",
        label: "Spark",
        min: 0,
        max: 10,
        color: "#fde047", // Yellow
        gradient: "linear-gradient(135deg, #140f02, #2b1d00)",
    },
];

export function getFlameTier(score) {
    const clamped = Math.max(0, Math.min(100, score));
    return (
        FLAME_TIERS.find((t) => clamped >= t.min && clamped <= t.max) ||
        FLAME_TIERS[FLAME_TIERS.length - 1]
    );
}

export function getNextFlameTier(score) {
    const clamped = Math.max(0, Math.min(100, score));
    const currentTier = getFlameTier(clamped);
    const currentIndex = FLAME_TIERS.indexOf(currentTier);
    return currentIndex > 0 ? FLAME_TIERS[currentIndex - 1] : null;
}
