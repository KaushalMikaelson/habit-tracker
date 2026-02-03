import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import HeroImage from "../Photos/hero.png";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      {/* ================= HEADER ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.5rem 2.5rem",
        }}
      >
        <h2 style={{ margin: 0, fontWeight: 600, color: "#f9fafb" }}>
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

      {/* ================= HERO SECTION ================= */}
      {/* ================= HERO SECTION ================= */}
<section
  style={{
    position: "relative",
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    overflow: "hidden",
  }}
>
  {/* BACKGROUND IMAGE */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundImage: `url(${HeroImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: "blur(0px)",
      transform: "scale(1.05)",
    }}
  />

  {/* DARK OVERLAY */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(135deg, rgba(2,6,23,0.85), rgba(15,23,42,0.85))",
    }}
  />

  {/* CONTENT */}
  <div
    style={{
      position: "relative",
      zIndex: 1,
      padding: "2rem",
      maxWidth: "900px",
    }}
  >
    <h1
      style={{
        fontSize: "3.2rem",
        fontWeight: 700,
        color: "#f9fafb",
        marginBottom: "1rem",
      }}
    >
      Track Your Habits Everyday.
    </h1>

    <p
      style={{
        fontSize: "1.25rem",
        lineHeight: 1.6,
        color: "#cbd5f5",
        marginBottom: "2.8rem",
      }}
    >
      Every day, it gets a little easier.
      <br />
      Consistency is the key to success.
    </p>

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
</section>


      {/* ================= VALUE PROPOSITION ================= */}
      {/* ================= STRIPE VALUE SECTION ================= */}
<section
  style={{
    width: "100%",
    padding: "6rem 2rem",
    background: "linear-gradient(135deg, #0f766e, #0891b2)",
  }}
>
  <div
    style={{
      maxWidth: "1100px",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "3rem",
      textAlign: "center",
      color: "#ecfeff",
    }}
  >
    <div>
      <div style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>💧</div>
      <h3 style={{ marginBottom: "0.6rem", fontSize: "1.2rem" }}>
        Do it every day
      </h3>
      <p style={{ fontSize: "0.95rem", lineHeight: 1.6, opacity: 0.95 }}>
        Build discipline by showing up daily. Small actions create powerful
        habits.
      </p>
    </div>

    <div>
      <div style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>🔗</div>
      <h3 style={{ marginBottom: "0.6rem", fontSize: "1.2rem" }}>
        Don’t break the chain
      </h3>
      <p style={{ fontSize: "0.95rem", lineHeight: 1.6, opacity: 0.95 }}>
        Maintain streaks and stay motivated with visual accountability.
      </p>
    </div>

    <div>
      <div style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>📊</div>
      <h3 style={{ marginBottom: "0.6rem", fontSize: "1.2rem" }}>
        Visualize progress
      </h3>
      <p style={{ fontSize: "0.95rem", lineHeight: 1.6, opacity: 0.95 }}>
        Get a clear overview of habits, streaks, and long-term growth.
      </p>
    </div>
  </div>
</section>


      {/* ================= PRODUCT PREVIEW PLACEHOLDER ================= */}
      <section
        style={{
          padding: "6rem 2rem",
          textAlign: "center",
          color: "#cbd5f5",
        }}
      >
        <h2
          style={{
            fontSize: "2.2rem",
            color: "#f9fafb",
            marginBottom: "1rem",
          }}
        >
          Designed to keep you consistent
        </h2>

        <p
          style={{
            maxWidth: "650px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          A clean, distraction-free interface that helps you focus on what
          matters — building habits that stick.
        </p>

        {/* Placeholder box for future screenshots */}
        <div
          style={{
            marginTop: "3rem",
            height: "260px",
            maxWidth: "800px",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />
      </section>

      {/* ================= FINAL CTA ================= */}
      <section
        style={{
          padding: "6rem 2rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "2.4rem",
            color: "#f9fafb",
            marginBottom: "1rem",
          }}
        >
          Start building better habits today
        </h2>

        <p
          style={{
            color: "#cbd5f5",
            marginBottom: "2.5rem",
          }}
        >
          It only takes a minute to begin.
        </p>

        <button
          onClick={() => navigate("/signup")}
          style={{
            padding: "1rem 3rem",
            fontSize: "1rem",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            background: "#22c55e",
            color: "#022c22",
            fontWeight: 700,
          }}
        >
          Create your account
        </button>
      </section>
    </AuthLayout>
  );
}
