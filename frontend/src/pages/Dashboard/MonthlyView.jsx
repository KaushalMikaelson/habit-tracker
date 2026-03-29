import React, { useState, useMemo, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import html2pdf from 'html2pdf.js';
import { AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

/* ─── helpers ─────────────────────────────────────────────────── */
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getMonthDates(monthStart) {
  const daysInMonth = monthStart.daysInMonth();
  return Array.from({ length: daysInMonth }, (_, i) =>
    monthStart.add(i, 'day').format('YYYY-MM-DD')
  );
}

function pct(n, d) { return d > 0 ? Math.round((n / d) * 100) : 0; }

/* ─── tiny components ─────────────────────────────────────────── */
function KpiCard({ value, label, sub, accent }) {
  return (
    <div style={{
      background: '#020617',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '12px',
      padding: '18px 16px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: accent }} />
      <div style={{ fontSize: '26px', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '11px', color: accent, fontWeight: 600 }}>{sub}</div>}
      <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', letterSpacing: '0.07em', textTransform: 'uppercase', textAlign: 'center' }}>{label}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */
export default function MonthlyView({ habits = [] }) {
  const todayStr = dayjs().format('YYYY-MM-DD');
  const [monthStart, setMonthStart] = useState(() => dayjs().startOf('month'));

  const monthDates = useMemo(() => getMonthDates(monthStart), [monthStart]);
  const isCurrentMonth = monthStart.isSame(dayjs().startOf('month'), 'month');

  const chartContainerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(800);

  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        setChartWidth(chartContainerRef.current.clientWidth);
      }
    };
    handleResize(); // trigger on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* ── daily summary (how many habits done per day) ── */
  const dailySummary = useMemo(() => {
    return monthDates.map(date => {
      const isFuture = date > todayStr;
      const count = habits.filter(h =>
        (h.completedDates || []).includes(date)
      ).length;
      return { date, count, isFuture, isToday: date === todayStr };
    });
  }, [habits, monthDates, todayStr]);

  const chartData = useMemo(() => {
    return dailySummary.map(d => {
      const dayObj = dayjs(d.date);
      return {
        name: dayObj.date(), // just the day number for chart X-axis
        pct: d.isFuture ? null : (habits.length > 0 ? pct(d.count, habits.length) : 0),
        count: d.count,
        isFuture: d.isFuture,
      };
    });
  }, [dailySummary, habits.length]);

  /* ── month-level KPIs ── */
  const monthKpis = useMemo(() => {
    const totalPossible = dailySummary.filter(d => !d.isFuture).length * habits.length;
    const totalDone = dailySummary.filter(d => !d.isFuture).reduce((s, d) => s + d.count, 0);
    const consistency = pct(totalDone, totalPossible);
    // filter to only valid past days, sort by count descending
    const pastDays = dailySummary.filter(d => !d.isFuture);
    const bestDay = pastDays.length > 0 ? [...pastDays].sort((a, b) => b.count - a.count)[0] : null;
    const perfectDays = pastDays.filter(d => d.count === habits.length && habits.length > 0).length;
    return { consistency, totalDone, totalPossible, bestDay, perfectDays };
  }, [dailySummary, habits]);

  const reportRef = useRef(null);

  const handleDownloadPDF = () => {
    if (!reportRef.current) return;
    const elem = reportRef.current;

    // We must use 'scroll' dimensions here so the export includes the whole content height!
    const w = elem.scrollWidth || Math.max(1000, window.innerWidth);
    const h = elem.scrollHeight || 1500;

    const opt = {
      margin: [20, 20, 20, 20],
      filename: `habit-tracker-month-${monthStart.format('YYYY-MM')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#0b101e' },
      jsPDF: { unit: 'px', format: [w + 40, h + 40], orientation: w > h ? 'landscape' : 'portrait' }
    };
    html2pdf().set(opt).from(elem).save();
  };

  /* ── month label ── */
  const monthLabel = `${MONTH_FULL[monthStart.month()]} ${monthStart.year()}`;

  /* ── calendar grid build ── */
  // pad to start on correct week day
  const startPad = monthStart.day(); // 0 = Sun
  const padCells = Array(startPad).fill(null);

  /* ─── styles ─────────────────────────────────────────────────── */
  const card = {
    background: '#020617',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '14px',
    padding: '20px 24px',
  };

  /* ─── empty state ─────────────────────────────────────────────── */
  if (habits.length === 0) {
    return (
      <div style={{ flex: 1, padding: '40px', color: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div style={{ fontSize: '48px' }}>📆</div>
        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>No habits to show</h3>
        <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Add habits on the Dashboard to see your monthly view.</p>
      </div>
    );
  }

  return (
    <div ref={reportRef} style={{ flex: 1, overflowY: 'auto', padding: '32px', color: '#f8fafc', boxSizing: 'border-box' }}>

      {/* ── PAGE HEADER + NAVIGATION ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#60a5fa' }}>Monthly View</h1>
          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            {monthLabel}
          </div>
        </div>

        <div data-html2canvas-ignore="true" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* prev month */}
          <button
            onClick={() => setMonthStart(ws => ws.subtract(1, 'month'))}
            style={navBtn}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* month indicator */}
          <div style={{
            ...navBtn,
            padding: '6px 16px', fontSize: '13px', fontWeight: 700,
            color: '#f8fafc',
            cursor: 'default', pointerEvents: 'none'
          }}>
            {monthStart.format('MMMM YYYY')}
          </div>

          {/* next month */}
          <button
            onClick={() => setMonthStart(ws => ws.add(1, 'month'))}
            style={navBtn}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* today shortcut */}
          {!isCurrentMonth && (
            <button
              onClick={() => setMonthStart(dayjs().startOf('month'))}
              style={{ ...navBtn, padding: '6px 14px', fontSize: '12px', fontWeight: 700, color: '#60a5fa', border: '1px solid rgba(96,165,250,0.3)', marginLeft: '8px' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(96,165,250,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            >
              Current Month
            </button>
          )}

          {/* download pdf */}
          <button
            onClick={handleDownloadPDF}
            style={{ ...navBtn, padding: '6px 12px', fontSize: '12px', fontWeight: 600, marginLeft: '8px', color: '#f8fafc', background: 'rgba(255,255,255,0.1)' }}
            title="Download PDF Report"
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <KpiCard value={`${monthKpis.consistency}%`} label="Monthly Consistency" accent="#34d399" />
        <KpiCard
          value={monthKpis.totalDone}
          label="Total Completions"
          sub={`out of ${monthKpis.totalPossible}`}
          accent="#60a5fa"
        />
        <KpiCard value={monthKpis.perfectDays} label="Perfect Days" accent="#a78bfa" sub={monthKpis.perfectDays > 0 ? '🔥' : null} />
        <KpiCard
          value={monthKpis.bestDay ? dayjs(monthKpis.bestDay.date).format('MMM D') : '—'}
          label="Best Day"
          sub={monthKpis.bestDay ? `${monthKpis.bestDay.count}/${habits.length} done` : null}
          accent="#fb923c"
        />
      </div>

      {/* ── MONTHLY TREND CHART ── */}
      <div style={{ ...card, marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.08em', marginBottom: '24px' }}>
          MONTHLY COMPLETION TREND
        </div>
        <div ref={chartContainerRef} style={{ height: '280px', width: '100%', paddingRight: '16px' }}>
          <AreaChart
            width={Math.max(chartWidth, 600)}
            height={280}
            data={chartData}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorMonthPct" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={v => `${v}%`}
            />
            <Tooltip
              cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 2, strokeDasharray: '4 4' }}
              contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f8fafc', padding: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
              formatter={(value, name, props) => [`${value}% (${props.payload.count}/${habits.length})`, 'Completed']}
              labelStyle={{ fontWeight: 800, marginBottom: '6px', color: '#94a3b8' }}
            />
            <Area
              type="monotone"
              dataKey="pct"
              stroke="#a78bfa"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorMonthPct)"
              isAnimationActive={false}
              connectNulls={false}
            />
          </AreaChart>
        </div>
      </div>

      {/* ── CALENDAR HEATMAP ── */}
      <div style={card}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.08em', marginBottom: '20px' }}>
          MONTHLY HEATMAP
        </div>

        {/* calendar wrapper to constrain size */}
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          {/* day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px' }}>
            {DAY_NAMES.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#64748b', paddingBottom: '8px' }}>
                {d.toUpperCase()}
              </div>
            ))}
          </div>

          {/* dates grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {padCells.map((_, i) => <div key={`pad-${i}`} />)}

            {dailySummary.map(({ date, count, isFuture, isToday }) => {
              const dObj = dayjs(date);
              const fillPct = habits.length > 0 ? count / habits.length : 0;

              let cellBg = 'rgba(255,255,255,0.03)';
              if (count > 0 && !isFuture) {
                if (fillPct >= 1) cellBg = '#34d399';
                else if (fillPct >= 0.75) cellBg = 'rgba(52, 211, 153, 0.7)';
                else if (fillPct >= 0.5) cellBg = 'rgba(52, 211, 153, 0.4)';
                else cellBg = 'rgba(52, 211, 153, 0.2)';
              }

              return (
                <div
                  key={date}
                  style={{
                    aspectRatio: '1/1',
                    borderRadius: '10px',
                    background: isFuture ? 'rgba(255,255,255,0.01)' : cellBg,
                    border: isToday ? '2px solid #60a5fa' : isFuture ? '1px dashed rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    fontSize: '13px',
                    fontWeight: isToday ? 800 : 700,
                    color: isToday ? '#60a5fa' : isFuture ? '#334155' : (fillPct >= 0.75 ? '#064e3b' : '#cbd5e1'),
                    zIndex: 2
                  }}>
                    {dObj.date()}
                  </div>
                  {!isFuture && (
                    <div style={{ fontSize: '9px', marginTop: '2px', fontWeight: 700, color: fillPct >= 0.75 ? '#064e3b' : '#64748b' }}>
                      {count}/{habits.length}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}

/* ─── nav button base style ─────────────────────────────────────── */
const navBtn = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  color: '#94a3b8',
  cursor: 'pointer',
  padding: '6px 10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.2s ease',
  fontFamily: 'inherit',
};
