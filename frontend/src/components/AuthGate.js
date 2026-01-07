import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Signup from "../pages/Signup";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function AuthGate() {
  const { isAuthenticated, logout, loading, user } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 2;
      setScrolled(!atBottom);
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return <h2>Checking authentication...</h2>;

  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <div
      style={{
        height: "100vh",               // 🔑 FIX 1 (not minHeight)
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        overflow: "hidden",            // 🔑 FIX 2
      }}
    >
      {/* ================= CONTENT ================= */}
      <main
        style={{
          flex: 1,
          minHeight: 0,                // 🔑 FIX 3 (MOST IMPORTANT)
          overflow: "auto",            // scroll only when needed
        }}
      >
        <Dashboard />
      </main>

      {/* ================= FOOTER ================= */}
      <footer
        style={{
          height: "48px",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 16px",
          background: "#ffffff",
          flexShrink: 0,
          boxShadow: scrolled
            ? "0 -6px 16px rgba(0,0,0,0.08)"
            : "none",
          transition: "box-shadow 0.2s ease",
        }}
      >
        <div style={{ fontSize: "13px", color: "#6b7280" }}>
          Signed in as{" "}
          <strong style={{ color: "#111827" }}>
            {user?.email}
          </strong>
        </div>

        <button
          onClick={() => setShowConfirm(true)}
          style={{
            padding: "6px 14px",
            borderRadius: "8px",
            border: "1px solid #fecaca",
            background: "#fff1f2",
            color: "#b91c1c",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </footer>

      {/* ================= CONFIRM MODAL ================= */}
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
                onClick={logout}
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