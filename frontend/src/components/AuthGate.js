import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthContext";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import { Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";

function AuthGate() {
  const { isAuthenticated, logout, loading, user } = useAuth();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showFooter, setShowFooter] = useState(true);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();

  /* ================= Scroll logic ================= */
  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY;

      if (currentY > lastScrollY.current) {
        // scrolling DOWN → show footer
        setShowFooter(true);
      } else {
        // scrolling UP → hide footer
        setShowFooter(false);
      }

      lastScrollY.current = currentY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= Auth states ================= */
  if (loading) return <h2>Checking authentication...</h2>;

  if (!isAuthenticated) {
    return (

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>

    );
  }

  /* ================= App ================= */
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ================= CONTENT ================= */}
      <main
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
        }}
      >
        <Dashboard />
      </main>

      {/* ================= FOOTER ================= */}
      <footer
        style={{
          height: "48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 16px",
          flexShrink: 0,

          background: "rgba(30, 41, 59, 0.75)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",

          /* 👇 hide / show animation */
          transform: showFooter ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.25s ease-in-out",
          willChange: "transform",
        }}
      >
        {/* LEFT */}
        <div style={{ fontSize: "13px", color: "#94a3b8" }}>
          Signed in as{" "}
          <strong style={{ color: "#e5e7eb", fontWeight: 600 }}>
            {user?.email}
          </strong>
        </div>

        {/* RIGHT */}
        <button
          onClick={() => setShowConfirm(true)}
          style={{
            padding: "6px 14px",
            borderRadius: "8px",
            border: "none",
            background: "#2563eb",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </footer>

      {/* ================= CONFIRM LOGOUT ================= */}
      {showConfirm && (
        <>
          <div
            onClick={() => setShowConfirm(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(3px)",
              zIndex: 2000,
            }}
          />

          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "360px",
              background: "#ffffff",
              borderRadius: "14px",
              padding: "20px",
              zIndex: 2001,
            }}
          >
            <h3 style={{ fontWeight: 700 }}>Sign out?</h3>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              You’ll need to log in again.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "18px",
              }}
            >
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#f3f4f6",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);   // close modal
                  logout();                // clear auth
                  navigate("/", { replace: true }); // go to landing
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#dc2626",
                  color: "#ffffff",
                  fontWeight: 700,
                }}
              >
                Logout
              </button>

            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AuthGate;
