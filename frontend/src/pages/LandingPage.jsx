import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.5rem 2.5rem",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontWeight: 600,
            color: "#f9fafb",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          Habit Tracker
        </h2>

        <div style={{ display: "flex", gap: "1.2rem" }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "transparent",
              border: "none",
              color: "#e5e7eb",
              cursor: "pointer",
              fontSize: "0.95rem",
            }}
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            style={{
              padding: "0.45rem 1.3rem",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              background: "#22c55e",
              color: "#022c22",
              fontWeight: 700,
            }}
          >
            Sign up
          </button>
        </div>
      </div>

      {/* CENTER CONTENT */}
      <div
        style={{
          minHeight: "calc(100vh - 80px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1
          style={{
            fontSize: "3.2rem",
            marginBottom: "1rem",
            fontWeight: 700,
            color: "#f9fafb",
          }}
        >
          Track Your Habits Everyday.
        </h1>

        <p
          style={{
            fontSize: "1.25rem",
            maxWidth: "620px",
            lineHeight: 1.6,
            color: "#cbd5f5",
          }}
        >
          Every day, it gets a little easier.
          <br />
          Consistency is the key to success.
        </p>

        <div style={{ marginTop: "2.8rem" }}>
          <button
            onClick={() => navigate("/signup")}
            style={{
              padding: "0.95rem 2.8rem",
              fontSize: "1rem",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              background: "#22c55e",
              color: "#022c22",
              fontWeight: 700,
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
