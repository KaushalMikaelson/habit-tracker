import { useState } from "react";
import { getStoredCategories } from "../pages/Dashboard/SettingsView";

function AddHabitModal({
    showModal,
    setShowModal,
    newHabit,
    setNewHabit,
    newCategory,
    setNewCategory,
    addHabit,
}) {
    const [localStatus, setLocalStatus] = useState("active");
    const categories = getStoredCategories();

    if (!showModal) return null;

    const isDisabled = newHabit.trim() === "";

    function handleAdd() {
        addHabit(localStatus);
    }

    return (
        <>
            <style>{`
                @keyframes modalOverlayIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes modalCardIn {
                    from { opacity: 0; transform: translate(-50%, -48%) scale(0.94); }
                    to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
                .habit-modal-input {
                    width: 100%;
                    padding: 12px 16px;
                    border-radius: 10px;
                    border: 1px solid rgba(255,255,255,0.12);
                    background: rgba(255,255,255,0.06);
                    color: #f1f5f9;
                    font-size: 14px;
                    font-family: 'Inter', sans-serif;
                    transition: border 0.2s ease, box-shadow 0.2s ease;
                    box-sizing: border-box;
                    outline: none;
                }
                .habit-modal-input:focus {
                    border-color: #2563eb;
                    box-shadow: 0 0 0 3px rgba(37,99,235,0.2);
                }
                .habit-modal-input::placeholder { color: #475569; }
                .habit-modal-cancel {
                    padding: 9px 18px;
                    border-radius: 10px;
                    border: 1px solid rgba(255,255,255,0.12);
                    background: rgba(255,255,255,0.06);
                    color: #94a3b8;
                    font-size: 13px;
                    font-weight: 600;
                    font-family: 'Inter', sans-serif;
                    cursor: pointer;
                    transition: background 0.15s ease, color 0.15s ease;
                }
                .habit-modal-cancel:hover {
                    background: rgba(255,255,255,0.1);
                    color: #f1f5f9;
                }
                .habit-modal-save {
                    padding: 9px 22px;
                    border-radius: 10px;
                    border: none;
                    font-size: 13px;
                    font-weight: 700;
                    font-family: 'Inter', sans-serif;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    letter-spacing: 0.01em;
                }
                .habit-modal-save:not(:disabled) {
                    background: linear-gradient(135deg, #2563eb, #3b82f6);
                    color: #ffffff;
                    box-shadow: 0 6px 18px rgba(37,99,235,0.4);
                }
                .habit-modal-save:not(:disabled):hover {
                    transform: translateY(-1px);
                    box-shadow: 0 10px 24px rgba(37,99,235,0.5);
                }
                .habit-modal-save:disabled {
                    background: rgba(255,255,255,0.08);
                    color: #475569;
                    cursor: not-allowed;
                }
                .modal-field-label {
                    font-size: 11px;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 6px;
                    margin-top: 14px;
                    display: block;
                }
            `}</style>

            {/* Overlay */}
            <div
                onClick={() => { setShowModal(false); setNewHabit(""); }}
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(18, 24, 38, 0.7)",
                    backdropFilter: "blur(6px)",
                    zIndex: 1000,
                    animation: "modalOverlayIn 0.2s ease",
                }}
            />

            {/* Modal */}
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "420px",
                    background: "linear-gradient(160deg, #020617, #1A2031)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "20px",
                    padding: "28px",
                    zIndex: 1001,
                    boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
                    animation: "modalCardIn 0.25s cubic-bezier(.4,0,.2,1) both",
                }}
            >
                {/* Header */}
                <div style={{ marginBottom: "20px" }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "6px",
                    }}>
                        <div style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            background: "rgba(37,99,235,0.2)",
                            border: "1px solid rgba(37,99,235,0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                        }}>
                            ✦
                        </div>
                        <h2 style={{
                            fontSize: "17px",
                            fontWeight: 700,
                            color: "#f1f5f9",
                            margin: 0,
                        }}>
                            Add new habit
                        </h2>
                    </div>
                    <p style={{
                        fontSize: "13px",
                        color: "#64748b",
                        margin: 0,
                        paddingLeft: "42px",
                    }}>
                        Build consistency by tracking something meaningful
                    </p>
                </div>

                {/* Habit Name */}
                <label className="modal-field-label">Habit Name</label>
                <input
                    className="habit-modal-input"
                    type="text"
                    placeholder="e.g. Drink water, Read 10 pages…"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !isDisabled) handleAdd(); }}
                    autoFocus
                />

                {/* Category Dropdown */}
                <label className="modal-field-label">Category</label>
                <select
                    className="habit-modal-input"
                    style={{ cursor: "pointer", color: newCategory === "" ? "#94a3b8" : "#f1f5f9" }}
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                >
                    <option value="" disabled>Select category…</option>
                    {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                </select>

                {/* Status */}
                <label className="modal-field-label">Status</label>
                <div style={{ display: "flex", gap: "8px" }}>
                    {[
                        { value: "active", label: "Active" },
                        { value: "archived", label: "Archived" },
                    ].map((s) => (
                        <button
                            key={s.value}
                            type="button"
                            onClick={() => setLocalStatus(s.value)}
                            style={{
                                flex: 1,
                                padding: "9px 12px",
                                borderRadius: "10px",
                                border: localStatus === s.value
                                    ? "1.5px solid #2563eb"
                                    : "1.5px solid rgba(255,255,255,0.1)",
                                background: localStatus === s.value
                                    ? "rgba(37,99,235,0.15)"
                                    : "rgba(255,255,255,0.04)",
                                color: localStatus === s.value ? "#60a5fa" : "#64748b",
                                fontSize: "13px",
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "'Inter', sans-serif",
                                transition: "all 0.2s ease",
                            }}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                <div style={{ marginTop: "8px", fontSize: "11px", color: "#334155", textAlign: "right" }}>
                    Press Enter to save
                </div>

                {/* Actions */}
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginTop: "20px",
                }}>
                    <button
                        className="habit-modal-cancel"
                        onClick={() => { setShowModal(false); setNewHabit(""); }}
                    >
                        Cancel
                    </button>
                    <button
                        className="habit-modal-save"
                        onClick={handleAdd}
                        disabled={isDisabled}
                    >
                        Save habit
                    </button>
                </div>
            </div>
        </>
    );
}

export default AddHabitModal;
