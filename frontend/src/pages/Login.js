import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    // ✅ Prefill last used email
    useEffect(() => {
        const savedEmail = localStorage.getItem("lastLoggedInEmail");
        if (savedEmail) setEmail(savedEmail);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setError("");
        setLoading(true);

        try {
            const res = await api.post("/auth/login", { email, password });

            localStorage.setItem("lastLoggedInEmail", email);

            login(res.data);
        } catch (err) {
            if (!err.response) {
                setError("Server unavailable. Please try again later.");
            } else if (err.response.status === 401) {
                setError("Invalid email or password.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            {/* Decorative blurred shapes */}
            <div style={styles.blobOne} />
            <div style={styles.blobTwo} />

            <form style={styles.card} onSubmit={handleSubmit}>
                <h2 style={styles.title}>Welcome Back 👋</h2>
                <p style={styles.subtitle}>
                    Log in to continue tracking your habits
                </p>

                {error && <div style={styles.error}>{error}</div>}

                <div style={styles.group}>
                    <label style={styles.label}>Email</label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        disabled={loading}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        style={styles.input}
                    />
                </div>

                <div style={styles.group}>
                    <label style={styles.label}>Password</label>
                    <div style={styles.passwordBox}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            disabled={loading}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            style={styles.passwordInput}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={styles.eye}
                            title={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                </div>

                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p style={styles.footer}>
                    Don&apos;t have an account?{" "}
                    <a href="/signup" style={styles.link}>
                        Sign up
                    </a>
                </p>
            </form>
        </div>
    );
}

/* ================= STYLES ================= */

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background:
            "linear-gradient(135deg, #0f172a, #1e293b, #020617)",
        fontFamily: "Inter, system-ui, sans-serif",
    },

    blobOne: {
        position: "absolute",
        width: "420px",
        height: "420px",
        background: "radial-gradient(circle, #6366f1, transparent 70%)",
        top: "-120px",
        left: "-120px",
        filter: "blur(40px)",
    },

    blobTwo: {
        position: "absolute",
        width: "380px",
        height: "380px",
        background: "radial-gradient(circle, #22d3ee, transparent 70%)",
        bottom: "-120px",
        right: "-120px",
        filter: "blur(40px)",
    },

    card: {
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: "400px",
        padding: "2.75rem",
        borderRadius: "16px",
        background: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 25px 50px rgba(0,0,0,0.35)",
        color: "#f9fafb",
    },

    title: {
        textAlign: "center",
        fontSize: "1.6rem",
        fontWeight: 700,
        marginBottom: "0.25rem",
    },

    subtitle: {
        textAlign: "center",
        fontSize: "0.9rem",
        color: "#cbd5f5",
        marginBottom: "1.75rem",
    },

    error: {
        background: "rgba(239,68,68,0.15)",
        color: "#fecaca",
        padding: "0.6rem",
        borderRadius: "8px",
        marginBottom: "1rem",
        textAlign: "center",
        fontSize: "0.85rem",
    },

    group: {
        marginBottom: "1.25rem",
    },

    label: {
        fontSize: "0.85rem",
        marginBottom: "0.35rem",
        display: "block",
        color: "#e5e7eb",
    },

    input: {
        width: "100%",
        padding: "0.7rem",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.25)",
        background: "rgba(255,255,255,0.12)",
        color: "#fff",
        outline: "none",
    },

    passwordBox: {
        display: "flex",
        alignItems: "center",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.25)",
        background: "rgba(255,255,255,0.12)",
    },

    passwordInput: {
        flex: 1,
        padding: "0.7rem",
        border: "none",
        background: "transparent",
        color: "#fff",
        outline: "none",
    },

    eye: {
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "0 0.75rem",
        fontSize: "1rem",
        color: "#e5e7eb",
    },

    button: {
        width: "100%",
        padding: "0.8rem",
        marginTop: "0.5rem",
        background: "linear-gradient(135deg, #6366f1, #22d3ee)",
        color: "#020617",
        fontWeight: 700,
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        opacity: 1,
    },

    footer: {
        textAlign: "center",
        marginTop: "1.25rem",
        fontSize: "0.85rem",
        color: "#e5e7eb",
    },

    link: {
        color: "#67e8f9",
        fontWeight: 600,
        textDecoration: "none",
    },
};

export default Login;
