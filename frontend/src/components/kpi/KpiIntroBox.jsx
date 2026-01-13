function KpiIntroBox() {
    return (
        <div
            style={{
                height: "140px",
                width: "200px",
                borderRadius: "16px",
                padding: "16px",

                display: "flex",
                flexDirection: "column",
                justifyContent: "center",

                background: "linear-gradient(180deg, #020617, #020617)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
                color: "#e5e7eb",
            }}
        >
            <div
                style={{
                    fontSize: "14px",
                    opacity: 0.7,
                    marginBottom: "6px",
                }}
            >
                Welcome back
            </div>

            <div
                style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    marginBottom: "8px",
                }}
            >
                Kaushal 👋
            </div>

            <div
                style={{
                    fontSize: "13px",
                    opacity: 0.6,
                    lineHeight: 1.4,
                }}
            >
                “Consistency beats motivation.”
            </div>
        </div>
    );
}

export default KpiIntroBox;
