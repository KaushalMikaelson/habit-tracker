function KpiRing({
    value = 78,           // percentage (0–100)
    label = "Momentum",   // text below ring
    color = "#38bdf8",    // ring color
}) {
    /**
     * SVG math explanation:
     * radius = 36
     * circumference = 2 * π * r ≈ 226
     */
    const radius = 36;
    const circumference = 2 * Math.PI * radius;

    // how much of the ring should be hidden
    const offset =
        circumference - (value / 100) * circumference;

    return (
        <div
            style={{
                width: "160px",
                height: "160px",

                // 👇 premium glass card
                background:
                    "linear-gradient(180deg, rgba(30,41,59,0.85), rgba(15,23,42,0.85))",

                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.10)",
                backdropFilter: "blur(10px)",

                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",

                color: "#e5e7eb",
                position: "relative",

                // 👇 subtle depth
                boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            }}
        >

            {/* ===== SVG RING ===== */}
            <svg width="90" height="90">
                {/* background ring */}
                <circle
                    cx="45"
                    cy="45"
                    r={radius}
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="8"
                    fill="none"
                />

                {/* progress ring */}
                <circle
                    cx="45"
                    cy="45"
                    r={radius}
                    stroke={color}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 45 45)" // start from top
                />
            </svg>

            {/* percentage text */}
            <div
                style={{
                    position: "absolute",
                    fontSize: "22px",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    color: "#f8fafc",
                }}
            >
                {value}%
            </div>

            {/* label */}
            <div
                style={{
                    marginTop: "14px",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#94a3b8",
                    letterSpacing: "0.12em",
                }}
            >
                {label.toUpperCase()}
            </div>
        </div>
    );
}

export default KpiRing;
