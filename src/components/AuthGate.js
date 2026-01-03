import React from "react";
import { useAuth } from "../auth/AuthContext";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

function AuthGate() {
  const { isAuthenticated, logout, loading } = useAuth(); // get auth state and logout function
  if (loading) {
    return <h2>Checking authentication...</h2>;
    }


  if((!isAuthenticated)) {
    return <Login />; // if not authenticated, show login page
  }
    return (
        <>
            <button onClick={logout}>Logout</button>
            <Dashboard />
        </>
    ); // if authenticated, show dashboard with logout button
}
export default AuthGate;