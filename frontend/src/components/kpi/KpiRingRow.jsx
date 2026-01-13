import KpiRing from "./KpiRing";
import KpiIntroBox from "./KpiIntroBox";

function KpiRingRow() {
    return (
        // Full-width background strip
        <div
            style={{
                width: "100%",
                background:
                    "linear-gradient(180deg, rgba(15,23,42,0.85), rgba(2,6,23,0.85))",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                padding: "14px 0",
            }}
        >
            {/* Centered content container */}
            <div
                style={{
                    maxWidth: "1400px",
                    margin: "0 auto",
                    padding: "0 16px",

                    display: "grid",
                    gridTemplateColumns: "1.2fr repeat(4, 1fr)", // 🔑 intro + 4 KPIs
                    gap: "24px",
                    alignItems: "center",
                }}
            >
                {/* Intro / Motivation Box */}
                <KpiIntroBox />

                {/* KPI Rings */}
                <KpiRing value={78} label="Momentum" color="#38bdf8" />
                <KpiRing value={56} label="Daily" color="#22c55e" />
                <KpiRing value={84} label="Weekly" color="#a855f7" />
                <KpiRing value={72} label="Monthly" color="#facc15" />
            </div>
        </div>
    );
}

export default KpiRingRow;
