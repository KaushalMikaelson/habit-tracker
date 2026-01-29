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
      <KpiRing
        value={kpis.momentum}
        label="Momentum"
        color="#38bdf8"
      />

      <KpiRing
        value={kpis.daily}
        label="Today"
        color="#22c55e"
        disabled={!isCurrentMonth}
      />

      <KpiRing
        value={kpis.weekly}
        label="Weekly"
        color="#a855f7"
        disabled={!isCurrentMonth}
      />

      <KpiRing
        value={kpis.monthly}
        label="Monthly"
        color="#facc15"
      />
    </div>
  );
}

export default KpiRingRow;
