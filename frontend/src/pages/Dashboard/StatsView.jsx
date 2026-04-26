import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import {
  calculateMonthlyCompletion,
  calculateWeeklyCompletion,
  calculateHabitStreak,
  getEffectiveStartDate,
} from '../../utils/habitUtils';
import { PALETTES, getStage } from '../../components/MomentumFlame';

/* ─── tiny helpers ────────────────────────────────────────────── */
const today = dayjs().startOf('day');
const todayStr = today.format('YYYY-MM-DD');

function pct(n, d) {
  return d > 0 ? Math.round((n / d) * 100) : 0;
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

/* per-habit stats used in multiple sections */
function buildHabitStats(habits) {
  return habits.map((h) => {
    const completedDates = Array.isArray(h.completedDates) ? h.completedDates : [];
    const totalCompletions = completedDates.length;

    // streak (live calc)
    const currentStreak = calculateHabitStreak(h, todayStr);
    const bestStreak = h.highestStreak ?? currentStreak;

    // monthly (current)
    const { completed: mComp, total: mTotal } = calculateMonthlyCompletion(h, today, today);
    const monthlyPct = pct(mComp, mTotal);

    // monthly (prev)
    const { completed: pmComp, total: pmTotal } = calculateMonthlyCompletion(
      h,
      today.subtract(1, 'month'),
      today
    );
    const prevMonthlyPct = pct(pmComp, pmTotal);

    // weekly (current)
    const { completed: wComp, total: wTotal } = calculateWeeklyCompletion(h, today, today);
    const weeklyPct = pct(wComp, wTotal);

    // weekly (prev)
    const prevWeekStart = today.subtract(1, 'week').startOf('week');
    const { completed: pwComp, total: pwTotal } = calculateWeeklyCompletion(h, prevWeekStart, today);
    const prevWeeklyPct = pct(pwComp, pwTotal);

    // last-30 consistency
    const start30 = today.subtract(29, 'day');
    const effectiveStart = getEffectiveStartDate(h);
    const rangeStart = effectiveStart.isAfter(start30) ? effectiveStart : start30;
    const possible30 = today.diff(rangeStart, 'day') + 1;
    let done30 = 0;
    for (let i = 0; i < possible30; i++) {
      const d = rangeStart.add(i, 'day').format('YYYY-MM-DD');
      if (completedDates.includes(d)) done30++;
    }
    const consistency30 = pct(done30, possible30);

    return {
      _id: h._id,
      name: h.name || h.title || 'Unnamed',
      color: h.color,
      totalCompletions,
      currentStreak,
      bestStreak,
      monthlyPct,
      prevMonthlyPct,
      weeklyPct,
      prevWeeklyPct,
      consistency30,
      done30,
      possible30,
      completedDates,
      createdAt: h.createdAt,
    };
  });
}

/* last-365-day activity map: date → count of habits completed */
function buildActivityMap(habits) {
  const map = {};
  for (let i = 0; i < 365; i++) {
    const d = today.subtract(364 - i, 'day').format('YYYY-MM-DD');
    map[d] = 0;
  }
  habits.forEach((h) => {
    (h.completedDates || []).forEach((d) => {
      if (map[d] !== undefined) map[d]++;
    });
  });
  return map;
}


/* ─── colour palette ──────────────────────────────────────────── */
const PALETTE = [
  '#34d399', '#60a5fa', '#f472b6', '#fb923c',
  '#a78bfa', '#facc15', '#38bdf8', '#4ade80',
];
function habitColor(idx) {
  return PALETTE[idx % PALETTE.length];
}

/* ─── tiny sub-components ─────────────────────────────────────── */

function StatCard({ value, label, sub, accent = '#34d399' }) {
  return (
    <div style={{
      background: '#020617',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '14px',
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '2px', background: accent,
      }} />
      <div style={{ fontSize: '32px', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '13px', color: accent, fontWeight: 600 }}>{sub}</div>}
      <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  );
}

function ConsistencyBar({ label, pct: p, color = '#34d399' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: '130px', fontSize: '13px', color: '#94a3b8', flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {label}
      </div>
      <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${clamp(p, 0, 100)}%`,
          background: color,
          borderRadius: '4px',
          transition: 'width 0.6s ease',
        }} />
      </div>
      <div style={{ width: '38px', textAlign: 'right', fontSize: '13px', fontWeight: 700, color: '#f8fafc', flexShrink: 0 }}>
        {p}%
      </div>
    </div>
  );
}

/* heatmap cell colour based on fraction 0-1 and active palette */
function heatColor(fraction, paletteColor = '#10b981') {
  if (fraction === 0) return 'rgba(255,255,255,0.04)';
  
  // convert hex to rgba
  let hex = paletteColor.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c+c).join('');
  const r = parseInt(hex.substring(0, 2), 16) || 16;
  const g = parseInt(hex.substring(2, 4), 16) || 185;
  const b = parseInt(hex.substring(4, 6), 16) || 129;

  if (fraction < 0.34) return `rgba(${r},${g},${b},0.35)`;
  if (fraction < 0.67) return `rgba(${r},${g},${b},0.60)`;
  return paletteColor;
}

/* ─── Tab labels ──────────────────────────────────────────────── */
const TABS = ['Overview', 'Per-Habit Detail', 'Activity'];

/* ═══════════════════════════════════════════════════════════════ */
export default function StatsView({ habits = [] }) {
  const [tab, setTab] = useState('Overview');

  const habitStats = useMemo(() => buildHabitStats(habits), [habits]);
  const activityMap = useMemo(() => buildActivityMap(habits), [habits]);
  const habitCount = habits.length;

  /* ── global aggregates ── */
  const totalCompletions = useMemo(
    () => habitStats.reduce((s, h) => s + h.totalCompletions, 0),
    [habitStats]
  );

  const bestStreak = useMemo(
    () => Math.max(0, ...habitStats.map((h) => h.bestStreak)),
    [habitStats]
  );

  /* overall 30-day consistency */
  const overallConsistency = useMemo(() => {
    const totalPoss = habitStats.reduce((s, h) => s + h.possible30, 0);
    const totalDone = habitStats.reduce((s, h) => s + h.done30, 0);
    return pct(totalDone, totalPoss);
  }, [habitStats]);

  /* overall weekly */
  const overallWeekly = useMemo(() => {
    let wC = 0, wT = 0;
    habits.forEach((h) => {
      const { completed, total } = calculateWeeklyCompletion(h, today, today);
      wC += completed; wT += total;
    });
    return pct(wC, wT);
  }, [habits]);

  /* overall monthly */
  const overallMonthly = useMemo(() => {
    let mC = 0, mT = 0;
    habits.forEach((h) => {
      const { completed, total } = calculateMonthlyCompletion(h, today, today);
      mC += completed; mT += total;
    });
    return pct(mC, mT);
  }, [habits]);

  /* today completed */
  const todayCompleted = useMemo(
    () => habits.filter((h) => (h.completedDates || []).includes(todayStr)).length,
    [habits]
  );

  const sorted30 = useMemo(
    () => [...habitStats].filter(h => !h.isDeleted).sort((a, b) => b.consistency30 - a.consistency30),
    [habitStats]
  );

  const mostConsistent = sorted30[0];
  const needsWork = sorted30[sorted30.length - 1];

  const currentStage = getStage(overallMonthly);
  const activePalette = PALETTES[currentStage];
  
  const usePremium = overallMonthly >= 80 || overallMonthly < 50;
  
  const defaultMain = '#10b981';
  const defaultTip = '#06b6d4';
  
  const activeMainColor = usePremium ? (activePalette.mid || defaultMain) : defaultMain;
  const activeTipColor = usePremium ? (activePalette.tip || defaultTip) : defaultTip;

  /* ─── shared tab-bar ─── */
  function TabBar() {
    return (
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '32px' }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: tab === t ? 700 : 500,
              color: tab === t ? '#f8fafc' : '#64748b',
              borderBottom: tab === t ? '2px solid #34d399' : '2px solid transparent',
              marginBottom: '-1px',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { if (tab !== t) e.currentTarget.style.color = '#94a3b8'; }}
            onMouseLeave={(e) => { if (tab !== t) e.currentTarget.style.color = '#64748b'; }}
          >
            {t}
          </button>
        ))}
      </div>
    );
  }

  /* ─── empty state ─────────────────────────────────────────────── */
  if (habitCount === 0) {
    return (
      <div style={{ padding: '40px', color: '#f8fafc', flex: 1 }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#34d399', margin: '0 0 8px 0' }}>
          Stats & Insights
        </h1>
        <TabBar />
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', marginTop: '80px', gap: '16px',
        }}>
          <div style={{ fontSize: '48px' }}>📊</div>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#f8fafc' }}>No data yet</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Add some habits and start tracking to see your stats here.</p>
        </div>
      </div>
    );
  }

  /* ════════════════════════ OVERVIEW ══════════════════════════════ */
  function OverviewTab() {
    return (
      <>
        {/* 6-card KPI row */}
        <div className="resp-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <StatCard value={habitCount} label="Total Habits" accent="#60a5fa" />
          <StatCard value={totalCompletions} label="Total Completions" accent="#34d399" />
          <StatCard value={`${bestStreak} 🔥`} label="Best Streak" accent="#fb923c" />
          <StatCard value={`${overallConsistency}%`} label="30-Day Consistency" accent="#34d399" />
          <StatCard value={`${overallWeekly}%`} label="This Week" accent="#a78bfa" />
          <StatCard
            value={`${todayCompleted}/${habitCount}`}
            label="Done Today"
            sub={todayCompleted === habitCount ? '🎉 Perfect day!' : null}
            accent="#f472b6"
          />
        </div>

        {/* Overall consistency bar */}
        <div style={{
          background: '#020617', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '14px', padding: '20px 24px', marginBottom: '24px',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.08em', marginBottom: '14px' }}>
            30-DAY OVERALL CONSISTENCY
          </div>
          <div style={{ width: '100%', height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '7px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${clamp(overallConsistency, 1, 100)}%`,
              background: `linear-gradient(90deg, ${activeMainColor}, ${activeTipColor})`,
              borderRadius: '7px',
              transition: 'width 0.6s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>0%</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: activeMainColor }}>{overallConsistency}%</span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>100%</span>
          </div>
        </div>

        {/* Two-column bottom */}
        <div className="resp-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* habit consistency list */}
          <div style={{
            background: '#020617', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px', padding: '20px 24px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.08em', marginBottom: '16px' }}>
              HABIT CONSISTENCY (30 DAYS)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sorted30.map((h, i) => (
                <ConsistencyBar
                  key={h._id}
                  label={h.name}
                  pct={h.consistency30}
                  color={habitColor(i)}
                />
              ))}
            </div>
          </div>

          {/* comparison card */}
          <div style={{
            background: '#020617', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px', padding: '20px 24px', display: 'flex',
            flexDirection: 'column', gap: '16px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.08em' }}>
              HIGHLIGHTS
            </div>
            {mostConsistent && (
              <HighlightRow
                icon="⭐"
                label="Most Consistent"
                name={mostConsistent.name}
                value={`${mostConsistent.consistency30}%`}
                color="#34d399"
              />
            )}
            {needsWork && needsWork._id !== mostConsistent?._id && (
              <HighlightRow
                icon="⚠️"
                label="Needs Attention"
                name={needsWork.name}
                value={`${needsWork.consistency30}%`}
                color="#ef4444"
              />
            )}
            <HighlightRow
              icon="📅"
              label="This Month"
              name="Overall"
              value={`${overallMonthly}%`}
              color="#60a5fa"
            />
            <HighlightRow
              icon="🔥"
              label="Best Streak"
              name={habitStats.find(h => h.bestStreak === bestStreak)?.name || '—'}
              value={`${bestStreak} days`}
              color="#fb923c"
            />
          </div>
        </div>
      </>
    );
  }

  /* ════════════════════════ PER-HABIT DETAIL ════════════════════ */
  function PerHabitTab() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {habitStats.filter(h => !h.isDeleted).map((h, i) => {
          const color = habitColor(i);
          const monthDelta = h.monthlyPct - h.prevMonthlyPct;
          const weekDelta  = h.weeklyPct  - h.prevWeeklyPct;
          return (
            <div key={h._id} style={{
              background: '#020617',
              border: `1px solid rgba(255,255,255,0.06)`,
              borderLeft: `3px solid ${color}`,
              borderRadius: '14px',
              padding: '20px 24px',
            }}>
              {/* header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '12px' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>{h.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    Since {dayjs(h.createdAt).format('MMM D, YYYY')} · {h.totalCompletions} completions
                  </div>
                </div>
                {/* two delta badges */}
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <DeltaBadge delta={weekDelta} label="vs last week" />
                  <DeltaBadge delta={monthDelta} label="vs last month" />
                </div>
              </div>

              {/* mini stat row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                <MiniStat label="This Week" value={`${h.weeklyPct}%`} color={color} />
                <MiniStat label="This Month" value={`${h.monthlyPct}%`} color={color} />
                <MiniStat label="30-Day" value={`${h.consistency30}%`} color={color} />
                <MiniStat label="Current Streak" value={`${h.currentStreak} 🔥`} color={color} />
              </div>

              {/* last 30 days dot row */}
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.06em' }}>
                  LAST 30 DAYS
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {Array.from({ length: 30 }, (_, i) => {
                    const d = today.subtract(29 - i, 'day').format('YYYY-MM-DD');
                    const done = h.completedDates.includes(d);
                    return (
                      <div
                        key={d}
                        title={`${d}: ${done ? '✅' : '—'}`}
                        style={{
                          width: '16px', height: '16px',
                          borderRadius: '3px',
                          background: done ? color : 'rgba(255,255,255,0.05)',
                          opacity: done ? 1 : 0.5,
                          transition: 'transform 0.15s',
                          cursor: 'default',
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /* ════════════════════════ ACTIVITY HEATMAP ════════════════════ */
  function ActivityTab() {
    const entries = Object.entries(activityMap); // [date, count]
    const maxCount = Math.max(1, ...entries.map(([, c]) => c));

    // group by week (7 columns)
    const weeks = [];
    for (let i = 0; i < 30; i += 7) {
      weeks.push(entries.slice(i, i + 7));
    }

    return (
      <>
        {/* heatmap */}
        <div style={{
          background: '#020617', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '14px', padding: '20px 24px', marginBottom: '24px',
          overflowX: 'auto',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.08em', marginBottom: '14px' }}>
            ACTIVITY HEATMAP — LAST 12 MONTHS
          </div>

          {/* ── build 53-week columns from the 365-day entries ── */}
          {(() => {
            const CELL = 13;   // px per cell
            const GAP  = 3;    // px gap
            const DOW_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

            // pad entries array so index-0 is a Sunday
            const allEntries = Object.entries(activityMap); // oldest → newest
            // day-of-week of first entry (0=Sun)
            const firstDow = dayjs(allEntries[0][0]).day();
            const padded = [
              ...Array(firstDow).fill(null),  // empty slots before first day
              ...allEntries,
            ];
            // chunk into weeks (columns of 7)
            const weekCols = [];
            for (let i = 0; i < padded.length; i += 7) {
              weekCols.push(padded.slice(i, i + 7));
            }

            // month label positions
            const monthLabels = [];
            let lastMonth = null;
            weekCols.forEach((col, wi) => {
              const firstReal = col.find(Boolean);
              if (firstReal) {
                const m = dayjs(firstReal[0]).format('MMM');
                if (m !== lastMonth) { monthLabels.push({ wi, label: m }); lastMonth = m; }
              }
            });

            return (
              <div style={{ display: 'flex', gap: `${GAP}px`, alignItems: 'flex-start' }}>
                {/* day-of-week labels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px`, marginTop: `${CELL + GAP + 4}px`, flexShrink: 0 }}>
                  {DOW_LABELS.map((lbl, i) => (
                    <div key={i} style={{ height: `${CELL}px`, lineHeight: `${CELL}px`, fontSize: '10px', color: '#475569', width: '24px', textAlign: 'right', paddingRight: '4px' }}>
                      {lbl}
                    </div>
                  ))}
                </div>

                {/* week columns + month labels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}>
                  {/* month label row */}
                  <div style={{ display: 'flex', gap: `${GAP}px`, height: `${CELL}px`, position: 'relative' }}>
                    {weekCols.map((_, wi) => {
                      const hit = monthLabels.find(m => m.wi === wi);
                      return (
                        <div key={wi} style={{ width: `${CELL}px`, flexShrink: 0, fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'visible' }}>
                          {hit ? hit.label : ''}
                        </div>
                      );
                    })}
                  </div>

                  {/* cell grid */}
                  <div style={{ display: 'flex', gap: `${GAP}px` }}>
                    {weekCols.map((col, wi) => (
                      <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}>
                        {col.map((entry, di) => {
                          if (!entry) {
                            return <div key={di} style={{ width: `${CELL}px`, height: `${CELL}px` }} />;
                          }
                          const [date, count] = entry;
                          const frac = count / maxCount;
                          return (
                            <div
                              key={date}
                              title={`${dayjs(date).format('MMM D, YYYY')} — ${count} habit${count !== 1 ? 's' : ''} completed`}
                              style={{
                                width: `${CELL}px`,
                                height: `${CELL}px`,
                                background: heatColor(frac, activeMainColor),
                                borderRadius: '2px',
                                cursor: 'default',
                              }}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Less</span>
            {[0, 0.2, 0.5, 0.8, 1].map((f) => (
              <div key={f} style={{ width: '12px', height: '12px', background: heatColor(f, activeMainColor), borderRadius: '2px' }} />
            ))}
            <span style={{ fontSize: '11px', color: '#64748b' }}>More</span>
          </div>
        </div>

        {/* daily activity list */}
        <div style={{
          background: '#020617', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '14px', padding: '20px 24px',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.08em', marginBottom: '16px' }}>
            RECENT DAILY ACTIVITY
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[...entries].reverse().slice(0, 14).map(([date, count]) => {
              const isToday = date === todayStr;
              return (
                <div key={date} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '8px 12px', borderRadius: '8px',
                  background: isToday ? 'rgba(52,211,153,0.06)' : 'transparent',
                  border: isToday ? '1px solid rgba(52,211,153,0.15)' : '1px solid transparent',
                }}>
                  <div style={{ width: '80px', fontSize: '13px', color: isToday ? activeMainColor : '#94a3b8', fontWeight: isToday ? 700 : 400, flexShrink: 0 }}>
                    {isToday ? 'Today' : dayjs(date).format('MMM D')}
                  </div>
                  <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct(count, habitCount)}%`,
                      background: count === habitCount ? activeMainColor : count > 0 ? activeTipColor : 'transparent',
                      borderRadius: '3px',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                  <div style={{ width: '60px', textAlign: 'right', fontSize: '12px', color: '#64748b', flexShrink: 0 }}>
                    {count}/{habitCount}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  /* ─── main render ─────────────────────────────────────────────── */
  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '32px',
      color: '#f8fafc',
      boxSizing: 'border-box',
    }}>
      <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#34d399', margin: '0 0 24px 0' }}>
        Stats &amp; Insights
      </h1>

      <TabBar />

      {tab === 'Overview' && <OverviewTab />}
      {tab === 'Per-Habit Detail' && <PerHabitTab />}
      {tab === 'Activity' && <ActivityTab />}
    </div>
  );
}

/* ─── micro-components ────────────────────────────────────────── */
function MiniStat({ label, value, color }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '10px',
      padding: '12px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '18px', fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>{label}</div>
    </div>
  );
}

function DeltaBadge({ delta, label }) {
  const up = delta >= 0;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      background: up ? 'rgba(52,211,153,0.10)' : 'rgba(239,68,68,0.10)',
      border: `1px solid ${up ? 'rgba(52,211,153,0.25)' : 'rgba(239,68,68,0.25)'}`,
      borderRadius: '20px',
      padding: '4px 11px',
      fontSize: '12px',
      fontWeight: 700,
      color: up ? '#34d399' : '#ef4444',
      whiteSpace: 'nowrap',
    }}>
      {up ? '↑' : '↓'} {Math.abs(delta)}% {label}
    </div>
  );
}

function HighlightRow({ icon, label, name, value, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '10px', padding: '12px 14px', gap: '12px',
    }}>
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
      </div>
      <div style={{ fontSize: '14px', fontWeight: 800, color, flexShrink: 0 }}>{value}</div>
    </div>
  );
}
