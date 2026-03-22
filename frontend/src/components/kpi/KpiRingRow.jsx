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
        delta={kpis.momentumDelta}
        label="Momentum"
        color="#22c55e"
      />

      {/* DAILY */}
      <KpiRing
        value={kpis.daily}
        direction={kpis.dailyDirection}
        delta={kpis.dailyDelta}
        label="Today"
        color="#ef4444"
        disabled={!isCurrentMonth}
      />

      {/* WEEKLY */}
      <KpiRing
        value={kpis.weekly}
        direction={kpis.weeklyDirection}
        delta={kpis.weeklyDelta}
        label="Weekly"
        color="#a855f7"
        disabled={!isCurrentMonth}
      />

      {/* MONTHLY */}
      <KpiRing
        value={kpis.monthly}
        direction={kpis.monthlyDirection}
         delta={kpis.monthlyDelta}
        label="Monthly"
        color="#ef4444"
      />
    </div>
  );
}

export default KpiRingRow;
