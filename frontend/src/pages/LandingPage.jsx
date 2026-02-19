import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import HeroImage from "../Photos/hero.png";
import Graph from "../Photos/Graph.png";
import Top from "../Photos/Top.png";
import KPI from "../Photos/KPI.png"
import { Link } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      {/* ================= GLOBAL STYLES ================= */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
        .hero-headline {
          background: linear-gradient(135deg, #f1f5f9, #38bdf8, #22c55e, #f1f5f9);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 6s ease infinite;
        }
        .lp-cta-btn {
          padding: 1rem 3.2rem;
          font-size: 1rem;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #fff;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 16px 40px rgba(34,197,94,0.4);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          letter-spacing: 0.01em;
        }
        .lp-cta-btn:hover {
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 22px 55px rgba(34,197,94,0.55);
        }
        .lp-cta-btn-sm {
          padding: 0.8rem 2.2rem;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #fff;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 12px 30px rgba(34,197,94,0.35);
          transition: transform 0.25s ease;
        }
        .lp-cta-btn-sm:hover { transform: scale(1.05); }
        .lp-login-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 0.9rem;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          transition: color 0.15s ease;
          padding: 0.4rem 0.8rem;
        }
        .lp-login-btn:hover { color: #f1f5f9; }
        .lp-signup-btn {
          padding: 0.45rem 1.4rem;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #fff;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          box-shadow: 0 6px 18px rgba(34,197,94,0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .lp-signup-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(34,197,94,0.5);
        }
      `}</style>

      {/* ================= HEADER ================= */}
      <div
        style={{
          background: "rgba(2,6,23,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: ".5px solid rgba(255,255,255,0.07)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.2rem 2.5rem",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "30px",
            height: "30px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #2563eb, #38bdf8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(37,99,235,0.4)",
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            </svg>
          </div>
          <h2 style={{ margin: 0, fontWeight: 800, color: "#f1f5f9", fontSize: "1.05rem", letterSpacing: "-0.01em" }}>
            Habit Tracker
          </h2>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button className="lp-login-btn" onClick={() => navigate("/login")}>Login</button>
          <button className="lp-signup-btn" onClick={() => navigate("/signup")}>Sign up</button>
        </div>
      </div>

      {/* ================= HERO SECTION ================= */}
      <section
        style={{
          width: "100%",
          padding: "3.5rem 1rem 7rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* HERO CARD WRAPPER */}
        <div
          style={{
            maxWidth: "1400px",
            width: "100%",
            position: "relative",
            perspective: "1400px",
          }}
        >
          {/* GLOW */}
          <div
            id="hero-glow"
            style={{
              position: "absolute",
              inset: "-16px",
              borderRadius: "36px",
              background:
                "linear-gradient(135deg, rgba(56,189,248,0.4), rgba(34,197,94,0.4))",
              filter: "blur(40px)",
              opacity: 0.45,
              transition: "opacity 0.4s ease",
              pointerEvents: "none",
            }}
          />

          {/* IMAGE CARD */}
          <div
            style={{
              position: "relative",
              minHeight: "420px",
              borderRadius: "28px",
              padding: "5rem 3.5rem",
              backgroundImage: `
          linear-gradient(
            180deg,
            rgba(2,6,23,0.35),
            rgba(2,6,23,0.75)
          ),
          url(${HeroImage})
        `,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
              color: "#f9fafb",
              textAlign: "center",

              /* animation */
              transform: "scale(1)",
              transition:
                "transform 0.45s ease, box-shadow 0.45s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow =
                "0 55px 120px rgba(0,0,0,0.7)";
              document.getElementById("hero-glow").style.opacity = "0.75";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 40px 90px rgba(0,0,0,0.55)";
              document.getElementById("hero-glow").style.opacity = "0.45";
            }}
          >
            {/* CONTENT ON IMAGE */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              <div style={{
                display: "inline-block",
                padding: "5px 14px",
                borderRadius: "999px",
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.25)",
                color: "#4ade80",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                marginBottom: "1.5rem",
                textTransform: "uppercase",
              }}>
                ✦ Build Better Habits
              </div>
              <h1
                className="hero-headline"
                style={{
                  fontSize: "3.4rem",
                  fontWeight: 900,
                  marginBottom: "1.2rem",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                }}
              >
                Track Your Habits,<br />Every Single Day.
              </h1>

              <p
                style={{
                  fontSize: "1.2rem",
                  lineHeight: 1.7,
                  color: "rgba(203,213,245,0.85)",
                  marginBottom: "3rem",
                  maxWidth: "560px",
                  margin: "0 auto 3rem",
                }}
              >
                Every day, it gets a little easier.
                <br />
                Consistency is the key to success.
              </p>

              <button
                className="lp-cta-btn"
                onClick={() => navigate("/signup")}
              >
                Get Started — It&apos;s Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VALUE PROPOSITION ================= */}
      {/* ================= STRIPE VALUE SECTION ================= */}
      <section
        style={{
          width: "100%",
          padding: "7rem 2rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* WRAPPER (perspective + glow container) */}
        <div
          style={{
            maxWidth: "1300px",
            width: "100%",
            position: "relative",
            perspective: "1400px",
          }}
        >
          {/* GLOW */}
          <div
            id="kpi-glow"
            style={{
              position: "absolute",
              inset: "-14px",
              borderRadius: "32px",
              background:
                "linear-gradient(135deg, rgba(56,189,248,0.35), rgba(34,197,94,0.35))",
              filter: "blur(34px)",
              opacity: 0.45,
              transition: "opacity 0.35s ease",
              pointerEvents: "none",
            }}
          />

          {/* CARD */}
          <div
            style={{
              minHeight: "200px",
              borderRadius: "26px",
              padding: "5rem 3rem",
              backgroundImage: `
          linear-gradient(
            180deg,
            rgba(0,0,0,0.30),
            rgba(0,0,0,0.45)
          ),
          url(${KPI})
        `,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "0 34px 80px rgba(0,0,0,0.45)",
              position: "relative",
              zIndex: 1,

              /* 🔑 Correct hinge behavior */
              transformOrigin: "bottom center",
              transform: "rotateX(0deg)",
              transition:
                "transform 0.45s ease, box-shadow 0.45s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "rotateX(10deg) scale(1.02)";
              e.currentTarget.style.boxShadow =
                "0 45px 95px rgba(0,0,0,0.6)";
              document.getElementById("kpi-glow").style.opacity = "0.7";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "rotateX(0deg) scale(1)";
              e.currentTarget.style.boxShadow =
                "0 34px 80px rgba(0,0,0,0.45)";
              document.getElementById("kpi-glow").style.opacity = "0.45";
            }}
          >
            {/* CONTENT */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "3.5rem",
                textAlign: "center",
                color: "#ecfeff",
              }}
            >
              <div>
                <div style={{ fontSize: "2.4rem", marginBottom: "1rem" }}>💧</div>
                <h3 style={{ marginBottom: "0.7rem", fontSize: "1.25rem" }}>
                  Do it every day
                </h3>
                <p style={{ fontSize: "1rem", lineHeight: 1.65, opacity: 0.95 }}>
                  Build discipline by showing up daily. Small actions create powerful
                  habits.
                </p>
              </div>

              <div>
                <div style={{ fontSize: "2.4rem", marginBottom: "1rem" }}>🔗</div>
                <h3 style={{ marginBottom: "0.7rem", fontSize: "1.25rem" }}>
                  Don’t break the chain
                </h3>
                <p style={{ fontSize: "1rem", lineHeight: 1.65, opacity: 0.95 }}>
                  Maintain streaks and stay motivated with visual accountability.
                </p>
              </div>

              <div>
                <div style={{ fontSize: "2.4rem", marginBottom: "1rem" }}>📊</div>
                <h3 style={{ marginBottom: "0.7rem", fontSize: "1.25rem" }}>
                  Visualize progress
                </h3>
                <p style={{ fontSize: "1rem", lineHeight: 1.65, opacity: 0.95 }}>
                  Get a clear overview of habits, streaks, and long-term growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRODUCT PREVIEW PLACEHOLDER ================= */}
      <section
        style={{
          padding: "7rem 2rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "4rem",
            maxWidth: "1200px",
            width: "100%",
            alignItems: "center",
            perspective: "1200px",
          }}
        >
          {/* IMAGE CARD */}
          <div
            style={{
              flex: "1.4",
              height: "400px",
              borderRadius: "20px",
              backgroundImage: `url(${Graph})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
              transform: "rotateY(10deg) rotateX(4deg)", // 👈 opposite inward tilt
              transition: "transform 0.45s ease, box-shadow 0.45s ease",
              transformStyle: "preserve-3d",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "rotateY(4deg) rotateX(0deg) scale(1.03)"; // 👈 opposite outward
              e.currentTarget.style.boxShadow =
                "0 40px 80px rgba(0,0,0,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "rotateY(10deg) rotateX(4deg) scale(1)";
              e.currentTarget.style.boxShadow =
                "0 30px 60px rgba(0,0,0,0.45)";
            }}
          />

          {/* CONTENT */}
          <div style={{ flex: "1", color: "#cbd5f5" }}>
            <h2
              style={{
                fontSize: "2.4rem",
                color: "#f9fafb",
                marginBottom: "1.2rem",
                lineHeight: 1.25,
              }}
            >
              Designed to keep you consistent
            </h2>

            <p
              style={{
                maxWidth: "520px",
                lineHeight: 1.7,
                fontSize: "1.1rem",
              }}
            >
              A clean, distraction-free interface that helps you focus on what
              matters — building habits that stick, day after day.
            </p>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section
        style={{
          padding: "6rem 2rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "4rem",
            maxWidth: "1200px",
            width: "100%",
            alignItems: "center",
            perspective: "1200px",
          }}
        >
          {/* CONTENT */}
          <div style={{ flex: "1", textAlign: "left" }}>
            <h2
              style={{
                fontSize: "2.4rem",
                fontWeight: 800,
                color: "#f1f5f9",
                marginBottom: "1rem",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Start building better habits today
            </h2>

            <p
              style={{
                color: "#64748b",
                marginBottom: "2.5rem",
                fontSize: "1.05rem",
              }}
            >
              It only takes a minute to begin.
            </p>

            <button
              className="lp-cta-btn"
              onClick={() => navigate("/signup")}
            >
              Create your account
            </button>
          </div>

          {/* IMAGE CARD (RIGHT) */}
          <div
            style={{
              flex: "1.3",
              height: "360px",
              borderRadius: "20px",
              backgroundImage: `url(${Top})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 26px 52px rgba(0,0,0,0.4)",
              transform: "rotateY(-10deg) rotateX(3deg)", // 👈 opposite tilt
              transition: "transform 0.45s ease, box-shadow 0.45s ease",
              transformStyle: "preserve-3d",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "rotateY(-4deg) rotateX(0deg) scale(1.02)";
              e.currentTarget.style.boxShadow =
                "0 36px 70px rgba(0,0,0,0.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "rotateY(-10deg) rotateX(3deg) scale(1)";
              e.currentTarget.style.boxShadow =
                "0 26px 52px rgba(0,0,0,0.4)";
            }}
          />
        </div>
      </section>


      {/* ================= FOOTER ================= */}
      {/* ================= FOOTER ================= */}
      <>
        {/* Responsive + animation styles */}
        <style>
          {`
      .footer-grid {
        display: grid;
        grid-template-columns: 1.5fr 1fr 1fr 1fr;
        gap: 3rem;
      }

      @media (max-width: 900px) {
        .footer-grid {
          grid-template-columns: 1fr 1fr;
        }
      }

      @media (max-width: 560px) {
        .footer-grid {
          grid-template-columns: 1fr;
          gap: 2.5rem;
        }
      }

      .footer-link {
        color: #cbd5f5;
        text-decoration: none;
        font-size: 0.95rem;
      }

      .footer-link:hover {
        color: #ffffff;
      }
    `}
        </style>

        <footer
          ref={(el) => {
            if (!el) return;
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting) {
                  entry.target.style.opacity = "1";
                  entry.target.style.transform = "translateY(0)";
                }
              },
              { threshold: 0.15 }
            );
            observer.observe(el);
          }}
          style={{
            width: "100%",
            padding: "5rem 2rem 3rem",
            background:
              "linear-gradient(180deg, rgba(2,6,23,0.95), rgba(2,6,23,1))",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            opacity: 0,
            transform: "translateY(40px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",

          }}
        >
          <div
            className="footer-grid"
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              color: "#cbd5f5",
            }}
          >
            {/* BRAND */}
            <div>
              <h3 style={{ color: "#f9fafb", marginBottom: "1rem" }}>
                Habit Tracker
              </h3>
              <p style={{ maxWidth: "280px", lineHeight: 1.6 }}>
                Build consistency, stay accountable, and create habits that actually
                stick — one day at a time.
              </p>

              {/* SOCIAL ICONS */}
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                <a
                  href="https://github.com/KaushalMikaelson"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: "1.4rem", textDecoration: "none" }}
                >
                  Github
                </a>
                <a
                  href="www.linkedin.com/in/kaushal-kumar-370293281"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: "1.4rem", textDecoration: "none" }}
                >
                  LinkedIn
                </a>
              </div>
            </div>

            {/* PRODUCT */}
            <div>
              <h4 style={{ color: "#f9fafb", marginBottom: "1rem" }}>
                Product
              </h4>
              <ul style={{ listStyle: "none", padding: 0, lineHeight: 2 }}>
                <li>
                  <Link className="footer-link" to="/features">
                    Features
                  </Link>
                </li>
                <li>
                  <Link className="footer-link" to="/calendar">
                    Habit Calendar
                  </Link>
                </li>
                <li>
                  <Link className="footer-link" to="/streaks">
                    Streak Tracking
                  </Link>
                </li>
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h4 style={{ color: "#f9fafb", marginBottom: "1rem" }}>
                Company
              </h4>
              <ul style={{ listStyle: "none", padding: 0, lineHeight: 2 }}>
                <li>
                  <Link className="footer-link" to="/about">
                    About
                  </Link>
                </li>
                <li>
                  <Link className="footer-link" to="/privacy">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link className="footer-link" to="/terms">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div>
              <h4 style={{ color: "#f9fafb", marginBottom: "1rem" }}>
                Get Started
              </h4>
              <p style={{ marginBottom: "1.5rem" }}>
                Start building better habits today.
              </p>
              <button
                className="lp-cta-btn-sm"
                onClick={() => navigate("/signup")}
              >
                Sign up free
              </button>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div
            style={{
              marginTop: "4rem",
              paddingTop: "2rem",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              textAlign: "center",
              color: "#9ca3af",
              fontSize: "0.85rem",
            }}
          >
            © {new Date().getFullYear()} Habit Tracker. All rights reserved.
          </div>
        </footer>
      </>



    </AuthLayout>
  );
}
