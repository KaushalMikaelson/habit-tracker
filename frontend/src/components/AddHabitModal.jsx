function AddHabitModal({
    showModal,
    setShowModal,
    newHabit,
    setNewHabit,
    addHabit,
}) {
    if (!showModal) return null;

    const isDisabled = newHabit.trim() === "";

    return (
        <>
            {/* ================= Overlay ================= */}
            <div
                onClick={() => {
                    setShowModal(false);
                    setNewHabit("");
                }}
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(17, 24, 39, 0.45)", // dark slate overlay
                    backdropFilter: "blur(4px)",
                    zIndex: 1000,
                }}
            />

            {/* ================= Modal ================= */}
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "380px",
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "22px",
                    zIndex: 1001,
                    boxShadow:
                        "0 30px 60px rgba(0,0,0,0.25), 0 10px 20px rgba(0,0,0,0.08)",
                }}
            >
                {/* Header */}
                <div style={{ marginBottom: "14px" }}>
                    <h2
                        style={{
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#111827",
                            marginBottom: "4px",
                        }}
                    >
                        Add new habit
                    </h2>
                    <p
                        style={{
                            fontSize: "13px",
                            color: "#6b7280",
                        }}
                    >
                        Build consistency by tracking something meaningful
                    </p>
                </div>

                {/* Input */}
                <input
                    type="text"
                    placeholder="e.g. Drink water, Read 10 pages"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    autoFocus
                    style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: "1px solid #e5e7eb",
                        fontSize: "14px",
                        outline: "none",
                        transition: "border 0.15s ease, box-shadow 0.15s ease",
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.border = "1px solid #2563eb";
                        e.currentTarget.style.boxShadow =
                            "0 0 0 3px rgba(37,99,235,0.15)";
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.border = "1px solid #e5e7eb";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                />

                {/* Actions */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                        marginTop: "18px",
                    }}
                >
                    <button
                        onClick={() => {
                            setShowModal(false);
                            setNewHabit("");
                        }}
                        style={{
                            padding: "8px 14px",
                            borderRadius: "10px",
                            border: "none",
                            background: "#f3f4f6",
                            color: "#374151",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {
                            addHabit();
                            setShowModal(false);
                            setNewHabit("");
                        }}
                        disabled={isDisabled}
                        style={{
                            padding: "8px 18px",
                            borderRadius: "10px",
                            border: "none",
                            background: isDisabled ? "#d1d5db" : "#2563eb",
                            color: "#ffffff",
                            fontSize: "13px",
                            fontWeight: 700,
                            cursor: isDisabled ? "not-allowed" : "pointer",
                            boxShadow: isDisabled
                                ? "none"
                                : "0 6px 14px rgba(37,99,235,0.35)",
                            transition: "all 0.15s ease",
                        }}
                    >
                        Save habit
                    </button>
                </div>
            </div>
        </>
    );
}

export default AddHabitModal;
