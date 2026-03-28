import React from "react";
import { useAuth } from "../auth/AuthContext";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";

function AuthGate() {
  const { isAuthenticated, logout, loading, user } = useAuth();

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
        <Dashboard user={user} logout={logout} />
      </main>
    </div>
  );
}

export default AuthGate;
