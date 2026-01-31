import dayjs from "dayjs";
import { useState, useMemo } from "react";

/* ===============================
   HELPERS
================================ */

function normalizeMonth(month) {
  if (!month) return dayjs();
  if (dayjs.isDayjs(month)) return month;
  if (month instanceof Date) return dayjs(month);
  if (typeof month === "string") return dayjs(month);

  if (
    typeof month === "object" &&
    month.year != null &&
    month.month != null
  ) {
    return dayjs().year(month.year).month(month.month);
  }

  return dayjs();
}

/* ===============================
   DATA
================================ */

function getMonthlyProgress(habits, baseMonth, isCurrentMonth) {
  const end = baseMonth.endOf("month");
  const today = dayjs();

  const lastDay = isCurrentMonth
    ? Math.min(today.date(), end.date())
    : end.date();

  const data = [];

  for (let day = 1; day <= lastDay; day++) {
    const dateObj = baseMonth.date(day);
    let completed = 0;

    habits.forEach((habit) => {
      if (!Array.isArray(habit.completedDates)) return;
      habit.completedDates.forEach((d) => {
        if (
          dayjs(d).isSame(dateObj, "day") &&
          dayjs(d).isSame(baseMonth, "month")
        ) {
          completed++;
        }
      });
    });

    data.push({
      date: dateObj.format("YYYY-MM-DD"),
      label: dateObj.format("DD"),
      value: completed,
    });
  }

  return data;
}

/* ===============================
   SVG PATH
================================ */

function buildCrispPath(points) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const dx = (curr.x - prev.x) * 0.3;

    d += ` C ${prev.x + dx} ${prev.y},
              ${curr.x - dx} ${curr.y},
              ${curr.x} ${curr.y}`;
  }
  return d;
}

/* ===============================
   COMPONENT
================================ */

function HabitGraphs({ habits = [], month, isCurrentMonth }) {
  const baseMonth = useMemo(() => normalizeMonth(month), [month]);
  const daily = useMemo(
    () => getMonthlyProgress(habits, baseMonth, isCurrentMonth),
    [habits, baseMonth, isCurrentMonth]
  );

  const maxValue = Math.max(...daily.map(d => d.value), 1);
  const [hover, setHover] = useState(null);
  const todayKey = dayjs().format("YYYY-MM-DD");

  /* GEOMETRY (UNCHANGED) */
  const width = 1000;
  const height = 320;
  const paddingX = 56;
  const paddingTop = 24;
  const paddingBottom = 44;

  const points = daily.map((d, i) => {
    const x =
      paddingX +
      (i / Math.max(daily.length - 1, 1)) *
        (width - paddingX * 2);

    const y =
      height -
      paddingBottom -
      (d.value / maxValue) *
        (height - paddingTop - paddingBottom);

    return { ...d, x: Math.round(x), y: Math.round(y) };
  });

  const linePath = buildCrispPath(points);
  const areaPath =
    `${linePath} L ${width - paddingX} ${height - paddingBottom}` +
    ` L ${paddingX} ${height - paddingBottom} Z`;

  return (
    <div
      style={{
        marginTop: "28px",
        padding: "22px",
        borderRadius: "20px",
        background: "linear-gradient(180deg, #020617, #020617cc)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
        color: "#e5e7eb",
      }}
    >
      {/* HEADER */}
      <div style={{
        fontSize: "16px",
        fontWeight: 800,
        letterSpacing: "0.14em",
        color: "#93c5fd",
        marginBottom: "6px",
      }}>
        HABIT ANALYTICS
      </div>

      <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "14px" }}>
        {baseMonth.format("MMMM YYYY")} • DAILY PROGRESS
      </div>

      {/* GRAPH */}
      <div style={{ position: "relative" }}>
        {hover && (
          <div
            style={{
              position: "absolute",
              left: hover.x - 42,
              top: hover.y - 60,
              background: "#020617",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "6px 8px",
              borderRadius: "8px",
              fontSize: "11px",
              pointerEvents: "none",
            }}
          >
            <div style={{ color: "#93c5fd" }}>
              {dayjs(hover.date).format("DD MMM")}
            </div>
            <div>{hover.value} habits</div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height="300"
          shapeRendering="geometricPrecision"
        >
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </linearGradient>

            {/* subtle line glow */}
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="1.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* GRID */}
          {[0, 0.5, 1].map((g, i) => {
            const y =
              height -
              paddingBottom -
              g * (height - paddingTop - paddingBottom);

            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  x2={width - paddingX}
                  y1={y}
                  y2={y}
                  stroke="rgba(255,255,255,0.1)"
                  strokeDasharray="4 6"
                />
                <text
                  x={paddingX - 12}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#9ca3af"
                >
                  {Math.round(g * maxValue)}
                </text>
              </g>
            );
          })}

          {/* X LABELS */}
          {points.map((p, i) =>
            i % Math.ceil(points.length / 12) === 0 ? (
              <text
                key={i}
                x={p.x}
                y={height - 16}
                textAnchor="middle"
                fontSize="11"
                fill="#9ca3af"
              >
                {daily[i].label}
              </text>
            ) : null
          )}

          {/* AREA */}
          <path d={areaPath} fill="url(#areaFill)" />

          {/* LINE */}
          <path
            d={linePath}
            fill="none"
            stroke="#22c55e"
            strokeWidth="2.8"
            strokeLinecap="round"
            filter="url(#softGlow)"
            vectorEffect="non-scaling-stroke"
          />

          {/* POINTS */}
          {points.map((p, i) => {
            const isToday = isCurrentMonth && p.date === todayKey;
            return (
              <g key={i}>
                {isToday && (
                  <>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="10"
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="2"
                      opacity="0.6"
                    />
                    <text
                      x={p.x + 10}
                      y={p.y - 10}
                      fontSize="10"
                      fill="#60a5fa"
                    >
                      Today
                    </text>
                  </>
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isToday ? 6 : 4.5}
                  fill={isToday ? "#60a5fa" : "#22c55e"}
                  stroke="#020617"
                  strokeWidth="1.2"
                  onMouseEnter={() => setHover(p)}
                  onMouseLeave={() => setHover(null)}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
export default HabitGraphs;
