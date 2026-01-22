import KpiRing from "./KpiRing";

function KpiRingRow() {
    return (
        <div
            style={{
                padding: "16px",

                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: "24px",
                alignItems: "center",

                background:
                    "linear-gradient(180deg, rgba(15,23,42,0.85), rgba(2,6,23,0.85))",
                borderRadius: "18px",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
            }}
        >
            <KpiRing value={78} label="Momentum" color="#38bdf8" />
            <KpiRing value={56} label="Daily" color="#22c55e" />
            <KpiRing value={84} label="Weekly" color="#a855f7" />
            <KpiRing value={72} label="Monthly" color="#facc15" />
        </div>
    );
}

export default KpiRingRow;
