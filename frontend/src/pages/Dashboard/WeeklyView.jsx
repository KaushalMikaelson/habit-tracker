import React, { useState, useMemo, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import { calculateHabitStreak } from '../../utils/habitUtils';

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

/* ─── helpers ─────────────────────────────────────────────────── */
const DAY_NAMES  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_FULL   = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getWeekDates(weekStart) {
  // weekStart is Monday (isoWeek)
  return Array.from({ length: 7 }, (_, i) =>
    weekStart.add(i, 'day').format('YYYY-MM-DD')
  );
}

function pct(n, d) { return d > 0 ? Math.round((n / d) * 100) : 0; }

const PALETTE = [
  '#34d399','#60a5fa','#f472b6','#fb923c',
  '#a78bfa','#facc15','#38bdf8','#4ade80',
  '#f87171','#2dd4bf',
];
function habitColor(i) { return PALETTE[i % PALETTE.length]; }

/* ─── tiny components ─────────────────────────────────────────── */
function KpiCard({ value, label, sub, accent }) {
  return (
    <div style={{
      background: '#111827',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '12px',
      padding: '18px 16px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background: accent }} />
      <div style={{ fontSize:'26px', fontWeight:800, color:'#f8fafc', lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:'11px', color: accent, fontWeight:600 }}>{sub}</div>}
      <div style={{ fontSize:'10px', fontWeight:700, color:'#64748b', letterSpacing:'0.07em', textTransform:'uppercase', textAlign:'center' }}>{label}</div>
    </div>
  );
}

function CheckCircle({ done, color }) {
  return done ? (
    <div style={{
      width:'32px', height:'32px', borderRadius:'50%',
      background: color + '22',
      border: `2px solid ${color}`,
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  ) : (
    <div style={{
      width:'32px', height:'32px', borderRadius:'50%',
      background: 'rgba(255,255,255,0.03)',
      border: '2px solid rgba(255,255,255,0.08)',
    }} />
  );
}

/* ════════════════════════════════════════════════════════════════ */
/* Calendar Popup ─ pick any week in any month / year              */
function CalendarPopup({ currentWeekStart, onSelect, onClose }) {
  const [view, setView] = useState(() =>
    currentWeekStart.startOf('month')
  );

  // Build the grid: pad to start on Sunday
  const firstOfMonth = view.startOf('month');
  const startPad     = firstOfMonth.day(); // 0 = Sun
  const daysInMonth  = view.daysInMonth();
  const cells = [
    ...Array(startPad).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) =>
      firstOfMonth.add(i, 'day')
    ),
  ];
  // pad tail to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const todayStr = dayjs().format('YYYY-MM-DD');

  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
        zIndex: 500,
        background: '#1e293b',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '14px',
        padding: '16px',
        boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
        minWidth: '280px',
      }}
    >
      {/* month / year header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
        <button onClick={() => setView(v => v.subtract(1, 'month'))} style={popBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span style={{ fontSize:'14px', fontWeight:700, color:'#f8fafc' }}>
          {view.format('MMMM YYYY')}
        </span>
        <button onClick={() => setView(v => v.add(1, 'month'))} style={popBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      {/* day-of-week labels */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'2px', marginBottom:'4px' }}>
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} style={{ textAlign:'center', fontSize:'10px', fontWeight:700, color:'#475569', padding:'2px 0' }}>{d}</div>
        ))}
      </div>

      {/* week rows — click a row to jump to that ISO week */}
      {rows.map((row, ri) => {
        // find the Monday of this row's week
        const firstReal = row.find(Boolean);
        if (!firstReal) return null;
        const isoMonday = firstReal.startOf('isoWeek');
        const isSelected = isoMonday.isSame(currentWeekStart, 'day');

        return (
          <div
            key={ri}
            onClick={() => { onSelect(isoMonday); onClose(); }}
            style={{
              display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'2px',
              borderRadius:'6px', padding:'2px',
              background: isSelected ? 'rgba(96,165,250,0.12)' : 'transparent',
              border: isSelected ? '1px solid rgba(96,165,250,0.35)' : '1px solid transparent',
              cursor:'pointer',
              transition:'background 0.15s',
            }}
            onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background='transparent'; }}
          >
            {row.map((day, di) => {
              if (!day) return <div key={di} style={{ padding:'4px' }} />;
              const ds = day.format('YYYY-MM-DD');
              const isToday = ds === todayStr;
              return (
                <div key={di} style={{
                  textAlign:'center', fontSize:'12px', fontWeight: isToday ? 800 : 400,
                  color: isToday ? '#60a5fa' : day.month() !== view.month() ? '#334155' : '#cbd5e1',
                  padding:'4px 2px', borderRadius:'4px',
                }}>
                  {day.date()}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* today shortcut inside popup */}
      <button
        onClick={() => { onSelect(dayjs().startOf('isoWeek')); onClose(); }}
        style={{ ...popBtn, width:'100%', marginTop:'10px', justifyContent:'center', fontSize:'12px', color:'#60a5fa', padding:'7px' }}
      >
        Jump to today
      </button>
    </div>
  );
}

const popBtn = {
  background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)',
  borderRadius:'6px', color:'#94a3b8', cursor:'pointer', padding:'4px 8px',
  display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'inherit',
  transition:'background 0.15s',
};

/* ════════════════════════════════════════════════════════════════ */
export default function WeeklyView({ habits = [] }) {
  const todayStr = dayjs().format('YYYY-MM-DD');
  const [weekStart, setWeekStart] = useState(() => dayjs().startOf('isoWeek'));
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  // close picker on outside click
  useEffect(() => {
    if (!showPicker) return;
    function handle(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [showPicker]);

  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);

  const isCurrentWeek = weekStart.isSame(dayjs().startOf('isoWeek'), 'day');

  /* ── per-habit stats for this week ── */
  const habitRows = useMemo(() => {
    return habits.map((h, i) => {
      const completed = Array.isArray(h.completedDates) ? h.completedDates : [];
      const days = weekDates.map(d => ({
        date: d,
        done: completed.includes(d),
        isFuture: d > todayStr,
        isToday: d === todayStr,
      }));
      const doneDays    = days.filter(d => !d.isFuture && d.done).length;
      const possible    = days.filter(d => !d.isFuture).length;
      const weekPct     = pct(doneDays, possible);
      const streak      = calculateHabitStreak(h, todayStr);
      return { h, days, doneDays, possible, weekPct, streak, color: habitColor(i) };
    });
  }, [habits, weekDates, todayStr]);

  /* ── daily summary (how many habits done per day) ── */
  const dailySummary = useMemo(() => {
    return weekDates.map(date => {
      const isFuture = date > todayStr;
      const count = habits.filter(h =>
        (h.completedDates || []).includes(date)
      ).length;
      return { date, count, isFuture, isToday: date === todayStr };
    });
  }, [habits, weekDates, todayStr]);

  /* ── week-level KPIs ── */
  const weekKpis = useMemo(() => {
    const totalPossible = dailySummary.filter(d => !d.isFuture).length * habits.length;
    const totalDone     = dailySummary.filter(d => !d.isFuture).reduce((s, d) => s + d.count, 0);
    const consistency   = pct(totalDone, totalPossible);
    const bestDay       = [...dailySummary].filter(d => !d.isFuture).sort((a, b) => b.count - a.count)[0];
    const perfectDays   = dailySummary.filter(d => !d.isFuture && d.count === habits.length).length;
    const todayDone     = habits.filter(h => (h.completedDates || []).includes(todayStr)).length;
    return { consistency, totalDone, totalPossible, bestDay, perfectDays, todayDone };
  }, [dailySummary, habits, todayStr]);

  /* ── week label ── */
  const weekEnd    = weekStart.add(6, 'day');
  const sameMonth  = weekStart.month() === weekEnd.month();
  const weekLabel  = sameMonth
    ? `${MONTH_ABBR[weekStart.month()]} ${weekStart.date()} – ${weekEnd.date()}, ${weekStart.year()}`
    : `${MONTH_ABBR[weekStart.month()]} ${weekStart.date()} – ${MONTH_ABBR[weekEnd.month()]} ${weekEnd.date()}, ${weekEnd.year()}`;

  /* ─── styles ─────────────────────────────────────────────────── */
  const card = {
    background: '#111827',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '14px',
    padding: '20px 24px',
  };

  /* ─── empty state ─────────────────────────────────────────────── */
  if (habits.length === 0) {
    return (
      <div style={{ flex:1, padding:'40px', color:'#f8fafc', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px' }}>
        <div style={{ fontSize:'48px' }}>📅</div>
        <h3 style={{ margin:0, fontSize:'20px', fontWeight:700 }}>No habits to show</h3>
        <p style={{ margin:0, color:'#64748b', fontSize:'14px' }}>Add habits on the Dashboard to see your weekly view.</p>
      </div>
    );
  }

  return (
    <div style={{ flex:1, overflowY:'auto', padding:'32px', color:'#f8fafc', boxSizing:'border-box' }}>

      {/* ── PAGE HEADER + NAVIGATION ── */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h1 style={{ margin:0, fontSize:'20px', fontWeight:700, color:'#60a5fa' }}>Weekly View</h1>
          <div style={{ fontSize:'13px', color:'#64748b', marginTop:'4px' }}>
            Week {weekStart.isoWeek()} · {weekLabel}
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'8px', position:'relative' }} ref={pickerRef}>
          {/* prev week */}
          <button
            onClick={() => setWeekStart(ws => ws.subtract(1, 'week'))}
            style={navBtn}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.04)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* calendar picker trigger */}
          <button
            onClick={() => setShowPicker(p => !p)}
            style={{
              ...navBtn,
              padding:'6px 12px', gap:'6px', fontSize:'12px', fontWeight:600,
              color: showPicker ? '#60a5fa' : '#94a3b8',
              border: showPicker ? '1px solid rgba(96,165,250,0.4)' : '1px solid rgba(255,255,255,0.08)',
              background: showPicker ? 'rgba(96,165,250,0.08)' : 'rgba(255,255,255,0.04)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {weekStart.format('MMM YYYY')}
          </button>

          {/* calendar popup */}
          {showPicker && (
            <CalendarPopup
              currentWeekStart={weekStart}
              onSelect={setWeekStart}
              onClose={() => setShowPicker(false)}
            />
          )}

          {/* today shortcut */}
          {!isCurrentWeek && (
            <button
              onClick={() => setWeekStart(dayjs().startOf('isoWeek'))}
              style={{ ...navBtn, padding:'6px 14px', fontSize:'12px', fontWeight:600, color:'#60a5fa', border:'1px solid rgba(96,165,250,0.3)' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(96,165,250,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.04)'}
            >
              Today
            </button>
          )}

          {/* next week — no restriction */}
          <button
            onClick={() => setWeekStart(ws => ws.add(1, 'week'))}
            style={navBtn}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.04)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'14px', marginBottom:'24px' }}>
        <KpiCard value={`${weekKpis.consistency}%`} label="Week Consistency" accent="#34d399" />
        <KpiCard
          value={`${weekKpis.todayDone}/${habits.length}`}
          label="Done Today"
          sub={weekKpis.todayDone === habits.length ? '🎉 Perfect!' : null}
          accent="#60a5fa"
        />
        <KpiCard value={weekKpis.perfectDays} label="Perfect Days" accent="#a78bfa" sub={weekKpis.perfectDays > 0 ? '🔥' : null} />
        <KpiCard
          value={weekKpis.bestDay ? DAY_NAMES[dayjs(weekKpis.bestDay.date).isoWeekday() - 1] : '—'}
          label="Best Day"
          sub={weekKpis.bestDay ? `${weekKpis.bestDay.count}/${habits.length} done` : null}
          accent="#fb923c"
        />
      </div>

      {/* ── DAILY COLUMN HEADERS + MINI SUMMARY BARS ── */}
      <div style={{ ...card, marginBottom:'20px', padding:'16px 24px' }}>
        <div style={{
          display:'grid',
          gridTemplateColumns:`180px repeat(7, 1fr)`,
          gap:'8px',
          alignItems:'center',
        }}>
          {/* habit name col header */}
          <div style={{ fontSize:'11px', fontWeight:700, color:'#64748b', letterSpacing:'0.07em' }}>HABIT</div>

          {/* day headers */}
          {dailySummary.map(({ date, count, isFuture, isToday }) => {
            const d = dayjs(date);
            const fillPct = habits.length > 0 ? pct(count, habits.length) : 0;
            return (
              <div key={date} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
                <div style={{
                  fontSize:'11px', fontWeight: isToday ? 800 : 600,
                  color: isToday ? '#60a5fa' : isFuture ? '#334155' : '#94a3b8',
                  letterSpacing:'0.05em',
                }}>
                  {DAY_NAMES[d.isoWeekday() - 1]}
                </div>
                <div style={{
                  width:'30px', height:'30px', borderRadius:'50%',
                  background: isToday ? 'rgba(96,165,250,0.15)' : 'rgba(255,255,255,0.04)',
                  border: isToday ? '2px solid #60a5fa' : '2px solid transparent',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'13px', fontWeight:700,
                  color: isToday ? '#60a5fa' : isFuture ? '#334155' : '#f8fafc',
                }}>
                  {d.date()}
                </div>
                {/* completion bar */}
                <div style={{ width:'100%', height:'4px', background:'rgba(255,255,255,0.06)', borderRadius:'2px', overflow:'hidden' }}>
                  <div style={{
                    height:'100%',
                    width: isFuture ? '0%' : `${fillPct}%`,
                    background: fillPct === 100 ? '#34d399' : '#60a5fa',
                    borderRadius:'2px',
                    transition:'width 0.4s ease',
                  }} />
                </div>
                <div style={{ fontSize:'10px', color: isFuture ? '#334155' : '#64748b' }}>
                  {isFuture ? '—' : `${count}/${habits.length}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── HABIT ROWS GRID ── */}
      <div style={{ ...card, marginBottom:'20px', padding:'0' }}>
        {habitRows.map(({ h, days, doneDays, possible, weekPct, streak, color }, ri) => (
          <div
            key={h._id}
            style={{
              display:'grid',
              gridTemplateColumns:`180px repeat(7, 1fr)`,
              gap:'8px',
              alignItems:'center',
              padding:'14px 24px',
              borderBottom: ri < habitRows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              borderLeft: `3px solid ${color}`,
            }}
          >
            {/* habit name + week pct */}
            <div style={{ minWidth:0 }}>
              <div style={{
                fontSize:'14px', fontWeight:600, color:'#f8fafc',
                whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
              }}>
                {h.name || h.title}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginTop:'4px' }}>
                <div style={{ flex:1, height:'4px', background:'rgba(255,255,255,0.06)', borderRadius:'2px', overflow:'hidden', maxWidth:'80px' }}>
                  <div style={{
                    height:'100%', width:`${weekPct}%`,
                    background: weekPct === 100 ? '#34d399' : color,
                    borderRadius:'2px', transition:'width 0.4s ease',
                  }} />
                </div>
                <span style={{ fontSize:'11px', color, fontWeight:700 }}>{weekPct}%</span>
                {streak > 0 && (
                  <span style={{ fontSize:'11px', color:'#fb923c', fontWeight:600 }}>🔥{streak}</span>
                )}
              </div>
            </div>

            {/* 7 day check cells */}
            {days.map(({ date, done, isFuture, isToday }) => (
              <div key={date} style={{ display:'flex', justifyContent:'center' }}>
                {isFuture ? (
                  <div style={{
                    width:'32px', height:'32px', borderRadius:'50%',
                    background:'rgba(255,255,255,0.02)',
                    border:'2px dashed rgba(255,255,255,0.06)',
                  }} />
                ) : (
                  <CheckCircle done={done} color={color} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ── WEEKLY SUMMARY TABLE ── */}
      <div style={card}>
        <div style={{ fontSize:'11px', fontWeight:800, color:'#94a3b8', letterSpacing:'0.08em', marginBottom:'16px' }}>
          WEEKLY SUMMARY
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {habitRows.map(({ h, doneDays, possible, weekPct, color }, i) => (
            <div key={h._id} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{
                width:'8px', height:'8px', borderRadius:'50%',
                background: color, flexShrink:0,
              }} />
              <div style={{ width:'160px', fontSize:'13px', color:'#94a3b8', flexShrink:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {h.name || h.title}
              </div>
              <div style={{ flex:1, height:'8px', background:'rgba(255,255,255,0.06)', borderRadius:'4px', overflow:'hidden' }}>
                <div style={{
                  height:'100%', width:`${weekPct}%`,
                  background: weekPct === 100 ? '#34d399' : color,
                  borderRadius:'4px', transition:'width 0.5s ease',
                }} />
              </div>
              <div style={{ width:'80px', textAlign:'right', fontSize:'12px', color:'#64748b', flexShrink:0 }}>
                {doneDays}/{possible} days
              </div>
              <div style={{ width:'36px', textAlign:'right', fontSize:'13px', fontWeight:700, color: weekPct === 100 ? '#34d399' : '#f8fafc', flexShrink:0 }}>
                {weekPct}%
              </div>
            </div>
          ))}
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
