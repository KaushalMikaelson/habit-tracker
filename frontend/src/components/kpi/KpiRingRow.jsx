import KpiRing from "./KpiRing";

function KpiRingRow({ kpis, isCurrentMonth }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        width: "100%",
        height: "100%",
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

      {/* TODAY */}
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
        color="#f97316"
      />
    </div>
  );
}

export default KpiRingRow;