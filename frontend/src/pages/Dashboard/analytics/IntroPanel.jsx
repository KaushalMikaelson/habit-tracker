function IntroPanel() {
    return (
        <div
            style={{
                height: "100%",
                borderRadius: "18px",
                padding: "20px",

                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",

                background: "linear-gradient(180deg, #020617, #020617)",
                boxShadow:
                    "inset 0 0 0 1px rgba(255,255,255,0.06), 0 10px 30px rgba(0,0,0,0.4)",
                color: "#e5e7eb",
            }}
        >
            {/* Header */}
            <div>
                <div
                    style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        marginBottom: "4px",
                    }}
                >
                    January
                </div>

                <div
                    style={{
                        fontSize: "12px",
                        letterSpacing: "0.12em",
                        opacity: 0.6,
                    }}
                >
                    HABIT TRACKER
                </div>
            </div>

            {/* Stats */}
            <div>
                <div
                    style={{
                        fontSize: "13px",
                        opacity: 0.7,
                        marginBottom: "6px",
                    }}
                >
                    Completed
                </div>
                <div
                    style={{
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "#22c55e",
                    }}
                >
                    254
                </div>

                <div
                    style={{
                        fontSize: "13px",
                        opacity: 0.7,
                        marginTop: "14px",
                        marginBottom: "6px",
                    }}
                >
                    Remaining
                </div>
                <div
                    style={{
                        fontSize: "22px",
                        fontWeight: 600,
                        color: "#f87171",
                    }}
                >
                    70
                </div>
            </div>

            {/* Quote */}
            <div
                style={{
                    fontSize: "13px",
                    opacity: 0.6,
                    fontStyle: "italic",
                    lineHeight: 1.5,
                }}
            >
                “Consistency beats motivation.”
            </div>
        </div>
    );
}

export default IntroPanel;
