export default function AuthLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #0f172a, #1e293b, #020617)",
        color: "#e5e7eb",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* TOP LEFT BLUR GLOW */}
      <div
        style={{
          position: "absolute",
          width: "420px",
          height: "420px",
          background: "radial-gradient(circle, #6366f1, transparent 70%)",
          top: "-120px",
          left: "-120px",
          filter: "blur(40px)",
        }}
      />

      {/* BOTTOM RIGHT BLUR GLOW */}
      <div
        style={{
          position: "absolute",
          width: "380px",
          height: "380px",
          background: "radial-gradient(circle, #22d3ee, transparent 70%)",
          bottom: "-120px",
          right: "-120px",
          filter: "blur(40px)",
        }}
      />

      {/* PAGE CONTENT */}
      <div
        style={{
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}
