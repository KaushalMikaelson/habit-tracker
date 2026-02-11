import KpiRing from "./KpiRing";

function KpiRingRow({ kpis, isCurrentMonth }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "24px",
        alignItems: "center",
        justifyItems: "center",
        width: "100%",
      }}
    >
      {/* MOMENTUM */}
      <KpiRing
        value={kpis.momentum}
        direction={kpis.momentumDirection}
        label="Momentum"
        color="#38bdf8"
      />

      {/* DAILY */}
      <KpiRing
        value={kpis.daily}
        direction={kpis.dailyDirection}
        label="Today"
        color="#22c55e"
        disabled={!isCurrentMonth}
      />

      {/* WEEKLY */}
      <KpiRing
        value={kpis.weekly}
        direction={kpis.weeklyDirection}
        label="Weekly"
        color="#a855f7"
        disabled={!isCurrentMonth}
      />

      {/* MONTHLY */}
      <KpiRing
        value={kpis.monthly}
        direction={kpis.monthlyDirection}
        label="Monthly"
        color="#facc15"
      />
    </div>
  );
}

export default KpiRingRow;
