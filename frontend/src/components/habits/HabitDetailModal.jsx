import React, { useState } from 'react';
import dayjs from 'dayjs';
import { calculateHabitStreak } from '../../utils/habitUtils';
import ConfirmModal from '../ConfirmModal';

export default function HabitDetailModal({ habit, monthDates, onClose, isFutureDate, toggleHabit, updateHabit, updateNote }) {
  const [archiving, setArchiving] = useState(false);
  const [pausing, setPausing] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(null); // null | 'archived' | 'active' | 'paused'
  const [confirmState, setConfirmState] = useState({ isOpen: false, action: null });
  const [selectedNoteDate, setSelectedNoteDate] = useState(dayjs().format("YYYY-MM-DD"));

  if (!habit) return null;

  const todayStr = dayjs().format("YYYY-MM-DD");
  const streak = calculateHabitStreak(habit, todayStr);
  
  const totalCompleted = (habit.completedDates || []).length;
  const startedOn = habit.createdAt ? dayjs(habit.createdAt).format('MMM D, YYYY') : 'Unknown';
  const currentNote = habit.notes?.[selectedNoteDate] || '';

  function requestConfirm(action) {
    setConfirmState({ isOpen: true, action });
  }

  async function executeConfirm() {
    const { action } = confirmState;
    setConfirmState({ isOpen: false, action: null });
    if (!action) return;

    if (action === "freeze" || action === "unfreeze") {
      const newStatus = habit.status === 'archived' ? 'active' : 'archived';
      setArchiving(true);
      try {
        await updateHabit(habit._id, undefined, undefined, newStatus);
        setArchiveSuccess(newStatus);
        setTimeout(() => onClose(), 1200);
      } catch (_) {
        setArchiving(false);
      }
    } else if (action === "pause" || action === "resume") {
      const newStatus = habit.status === 'paused' ? 'active' : 'paused';
      setPausing(true);
      try {
        await updateHabit(habit._id, undefined, undefined, newStatus);
        setArchiveSuccess(newStatus);
        setTimeout(() => onClose(), 1200);
      } catch (_) {
        setPausing(false);
      }
    }
  }

  function getConfirmProps() {
    const { action } = confirmState;
    if (!action) return {};
    switch (action) {
      case "freeze": return { title: "Freeze Habit", message: `Are you sure you want to freeze "${habit.title}"?`, confirmColor: "#38bdf8", confirmText: "Freeze" };
      case "unfreeze": return { title: "Unfreeze Habit", message: `Are you sure you want to unfreeze "${habit.title}"?`, confirmColor: "#fb923c", confirmText: "Unfreeze" };
      case "pause": return { title: "Pause Habit", message: `Are you sure you want to pause "${habit.title}"?`, confirmColor: "#a855f7", confirmText: "Pause" };
      case "resume": return { title: "Resume Habit", message: `Are you sure you want to resume "${habit.title}"?`, confirmColor: "#60a5fa", confirmText: "Resume" };
      default: return {};
    }
  }

  function handleArchiveToggle() {
    requestConfirm(habit.status === 'archived' ? 'unfreeze' : 'freeze');
  }

  function handlePauseToggle() {
    requestConfirm(habit.status === 'paused' ? 'resume' : 'pause');
  }

  const isArchived = habit.status === 'archived';
  const isPaused = habit.status === 'paused';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div style={{
        background: '#020617', borderRadius: '20px', padding: '32px',
        width: '520px', maxWidth: '92vw', border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
        position: 'relative', color: '#f8fafc',
        fontFamily: "'Inter', sans-serif",
      }}>
        {/* Close button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
          color: '#94a3b8', cursor: 'pointer', padding: '6px', display: 'flex',
          alignItems: 'center', transition: 'all 0.15s ease',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#f8fafc'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8'; }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {/* Archive status badge */}
        {isArchived && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '4px 10px', borderRadius: '20px', marginBottom: '12px',
            background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.25)',
            fontSize: '12px', fontWeight: 600, color: '#fb923c',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
            </svg>
            Frozen
          </div>
        )}

        {isPaused && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '4px 10px', borderRadius: '20px', marginBottom: '12px',
            background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.25)',
            fontSize: '12px', fontWeight: 600, color: '#c4b5fd',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
            </svg>
            Paused
          </div>
        )}

        {/* Header */}
        <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 6px 0', color: '#60a5fa', paddingRight: '40px' }}>{habit.title}</h2>
        <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#64748b', marginBottom: '24px', flexWrap: 'wrap' }}>
          {habit.category && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#60a5fa', display: 'inline-block' }} />
              {habit.category}
            </div>
          )}
          <div>Started: <strong style={{ color: '#94a3b8' }}>{startedOn}</strong></div>
        </div>

        {/* Stats row */}
        <div className="resp-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(251,146,60,0.08)', padding: '14px 12px', borderRadius: '12px', border: '1px solid rgba(251,146,60,0.15)', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Streak</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#fb923c' }}>🔥 {streak}</div>
          </div>
          <div style={{ background: 'rgba(52,211,153,0.08)', padding: '14px 12px', borderRadius: '12px', border: '1px solid rgba(52,211,153,0.15)', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Completed</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#34d399' }}>✓ {totalCompleted}</div>
          </div>
          <div style={{ background: 'rgba(96,165,250,0.08)', padding: '14px 12px', borderRadius: '12px', border: '1px solid rgba(96,165,250,0.15)', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Status</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: isArchived ? '#fb923c' : isPaused ? '#c4b5fd' : '#34d399', marginTop: '4px' }}>
              {isArchived ? 'Frozen' : isPaused ? 'Paused' : 'Active'}
            </div>
          </div>
        </div>

        {/* Journal Note */}
        <div style={{ marginBottom: '24px', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', color: '#94a3b8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              Journal note
            </div>
            <input 
              type="date"
              value={selectedNoteDate}
              max={todayStr}
              onChange={(e) => setSelectedNoteDate(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f1f5f9',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '12px',
                fontFamily: 'inherit',
                outline: 'none',
                colorScheme: 'dark'
              }}
            />
          </div>
          <textarea
            key={selectedNoteDate}
            placeholder={`How did this habit go ${selectedNoteDate === todayStr ? 'today' : 'on ' + selectedNoteDate}?`}
            defaultValue={currentNote}
            onBlur={(e) => updateNote(habit._id, selectedNoteDate, e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box', height: '80px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px', padding: '12px', color: '#f1f5f9',
              fontFamily: 'inherit', fontSize: '13px', resize: 'none', outline: 'none',
              transition: 'border 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.4)'}
            onBlurCapture={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '20px', gap: '12px' }}>
          
          {/* Archive / Unarchive */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {archiveSuccess === 'paused' || archiveSuccess === 'active' || archiveSuccess === 'archived' ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                color: archiveSuccess === 'active' ? '#34d399' : archiveSuccess === 'paused' ? '#c4b5fd' : '#fb923c',
                fontSize: '13px', fontWeight: 600,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {archiveSuccess === 'active' ? 'Status updated!' : archiveSuccess === 'paused' ? 'Paused successfully!' : 'Frozen successfully!'}
              </div>
            ) : (
              <>
                <button
                  onClick={handlePauseToggle}
                  disabled={pausing || archiving}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: isPaused ? 'rgba(52,211,153,0.1)' : 'rgba(168,162,158,0.1)',
                    border: isPaused ? '1px solid rgba(52,211,153,0.25)' : '1px solid rgba(168,162,158,0.25)',
                    padding: '9px 16px', borderRadius: '10px',
                    color: isPaused ? '#34d399' : '#a8a29e',
                    cursor: (pausing || archiving) ? 'wait' : 'pointer',
                    fontWeight: 600, fontSize: '13px',
                    fontFamily: 'inherit', transition: 'all 0.2s ease',
                    opacity: (pausing || archiving) ? 0.6 : 1,
                  }}
                  onMouseEnter={e => { if (!(pausing || archiving)) e.currentTarget.style.opacity = '0.85'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  {isPaused ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {pausing ? 'Resuming…' : 'Resume Habit'}
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                      </svg>
                      {pausing ? 'Pausing…' : 'Pause Habit'}
                    </>
                  )}
                </button>

                <button
                  onClick={handleArchiveToggle}
                  disabled={archiving || pausing}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: isArchived ? 'rgba(52,211,153,0.1)' : 'rgba(251,146,60,0.1)',
                border: isArchived ? '1px solid rgba(52,211,153,0.25)' : '1px solid rgba(251,146,60,0.25)',
                padding: '9px 16px', borderRadius: '10px',
                color: isArchived ? '#34d399' : '#fb923c',
                cursor: archiving ? 'wait' : 'pointer',
                fontWeight: 600, fontSize: '13px',
                fontFamily: 'inherit', transition: 'all 0.2s ease',
                opacity: archiving ? 0.6 : 1,
              }}
              onMouseEnter={e => { if (!archiving) e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              {isArchived ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/>
                    <polyline points="10 12 12 10 14 12"/><line x1="12" y1="10" x2="12" y2="16"/>
                  </svg>
                  {archiving ? 'Unfreezing…' : 'Unfreeze Habit'}
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
                  </svg>
                  {archiving ? 'Freezing…' : 'Freeze Habit'}
                </>
              )}
            </button>
          </>
        )}
      </div>

          <button
            onClick={onClose}
            style={{
              padding: '9px 20px', borderRadius: '10px',
              border: 'none', background: 'rgba(96,165,250,0.15)',
              color: '#60a5fa', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(96,165,250,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(96,165,250,0.15)'}
          >
            Done
          </button>
        </div>
      </div>

      <ConfirmModal 
        isOpen={confirmState.isOpen}
        onCancel={() => setConfirmState({ isOpen: false, action: null })}
        onConfirm={executeConfirm}
        {...getConfirmProps()}
      />
    </div>
  );
}
