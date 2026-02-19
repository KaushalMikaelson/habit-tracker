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
            <style>{`
                @keyframes blobFloat1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33%       { transform: translate(30px, -30px) scale(1.08); }
                    66%       { transform: translate(-20px, 20px) scale(0.95); }
                }
                @keyframes blobFloat2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33%       { transform: translate(-25px, 25px) scale(1.06); }
                    66%       { transform: translate(20px, -20px) scale(0.97); }
                }
                @keyframes cardIn {
                    from { opacity: 0; transform: translateY(24px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                .login-input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border-radius: 10px;
                    border: 1px solid rgba(255,255,255,0.15);
                    background: rgba(255,255,255,0.07);
                    color: #f1f5f9;
                    font-size: 0.9rem;
                    font-family: 'Inter', sans-serif;
                    transition: border 0.2s ease, box-shadow 0.2s ease;
                    box-sizing: border-box;
                }
                .login-input:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.2);
                }
                .login-input::placeholder { color: #475569; }
                .login-input:disabled { opacity: 0.5; cursor: not-allowed; }

                .login-btn {
                    width: 100%;
                    padding: 0.85rem;
                    margin-top: 0.5rem;
                    background: linear-gradient(135deg, #6366f1, #22d3ee);
                    color: #020617;
                    font-weight: 700;
                    font-size: 0.95rem;
                    font-family: 'Inter', sans-serif;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
                    box-shadow: 0 8px 24px rgba(99,102,241,0.35);
                    letter-spacing: 0.01em;
                }
                .login-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px rgba(99,102,241,0.5);
                }
                .login-btn:active:not(:disabled) {
                    transform: translateY(0);
                }
                .login-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .pw-box {
                    display: flex;
                    align-items: center;
                    border-radius: 10px;
                    border: 1px solid rgba(255,255,255,0.15);
                    background: rgba(255,255,255,0.07);
                    transition: border 0.2s ease, box-shadow 0.2s ease;
                }
                .pw-box:focus-within {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.2);
                }
                .pw-input {
                    flex: 1;
                    padding: 0.75rem 1rem;
                    border: none;
                    background: transparent;
                    color: #f1f5f9;
                    font-size: 0.9rem;
                    font-family: 'Inter', sans-serif;
                    outline: none;
                }
                .pw-input::placeholder { color: #475569; }
                .pw-toggle {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0 0.85rem;
                    font-size: 1rem;
                    color: #64748b;
                    transition: color 0.15s ease;
                }
                .pw-toggle:hover { color: #94a3b8; }
            `}</style>

            {/* Animated blobs */}
            <div style={{ ...styles.blob, ...styles.blobOne }} />
            <div style={{ ...styles.blob, ...styles.blobTwo }} />

            <form style={styles.card} onSubmit={handleSubmit}>
                {/* Logo mark */}
                <div style={styles.logoMark}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#6366f1" strokeWidth="2" />
                        <path d="M8 12l3 3 5-5" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <h2 style={styles.title}>Welcome back</h2>
                <p style={styles.subtitle}>Log in to continue tracking your habits</p>

                {error && (
                    <div style={styles.error}>
                        <span>⚠</span> {error}
                    </div>
                )}

                <div style={styles.group}>
                    <label style={styles.label}>Email</label>
                    <input
                        className="login-input"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        disabled={loading}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </div>

                <div style={styles.group}>
                    <label style={styles.label}>Password</label>
                    <div className="pw-box">
                        <input
                            className="pw-input"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            disabled={loading}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="pw-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            title={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                </div>

                <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? (
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                                <circle cx="12" cy="12" r="10" stroke="rgba(2,6,23,0.3)" strokeWidth="3" />
                                <path d="M12 2a10 10 0 0 1 10 10" stroke="#020617" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                            Logging in...
                        </span>
                    ) : "Login"}
                </button>

                <p style={styles.footer}>
                    Don&apos;t have an account?{" "}
                    <a href="/signup" style={styles.link}>Sign up</a>
                </p>
            </form>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #020617 100%)",
        fontFamily: "'Inter', system-ui, sans-serif",
    },
    blob: {
        position: "absolute",
        borderRadius: "50%",
        filter: "blur(60px)",
        pointerEvents: "none",
    },
    blobOne: {
        width: "480px",
        height: "480px",
        background: "radial-gradient(circle, rgba(99,102,241,0.5), transparent 70%)",
        top: "-160px",
        left: "-160px",
        animation: "blobFloat1 12s ease-in-out infinite",
    },
    blobTwo: {
        width: "420px",
        height: "420px",
        background: "radial-gradient(circle, rgba(34,211,238,0.4), transparent 70%)",
        bottom: "-140px",
        right: "-140px",
        animation: "blobFloat2 14s ease-in-out infinite",
    },
    card: {
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: "420px",
        padding: "2.5rem",
        borderRadius: "20px",
        background: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        color: "#f1f5f9",
        animation: "cardIn 0.5s cubic-bezier(.4,0,.2,1) both",
    },
    logoMark: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "52px",
        height: "52px",
        borderRadius: "14px",
        background: "rgba(99,102,241,0.15)",
        border: "1px solid rgba(99,102,241,0.3)",
        margin: "0 auto 1.25rem",
    },
    title: {
        textAlign: "center",
        fontSize: "1.6rem",
        fontWeight: 800,
        marginBottom: "0.3rem",
        letterSpacing: "-0.02em",
        color: "#f1f5f9",
    },
    subtitle: {
        textAlign: "center",
        fontSize: "0.875rem",
        color: "#64748b",
        marginBottom: "1.75rem",
    },
    error: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "rgba(239,68,68,0.12)",
        border: "1px solid rgba(239,68,68,0.25)",
        color: "#fca5a5",
        padding: "0.65rem 0.85rem",
        borderRadius: "10px",
        marginBottom: "1rem",
        fontSize: "0.85rem",
    },
    group: {
        marginBottom: "1.25rem",
    },
    label: {
        fontSize: "0.8rem",
        fontWeight: 600,
        marginBottom: "0.4rem",
        display: "block",
        color: "#94a3b8",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
    },
    footer: {
        textAlign: "center",
        marginTop: "1.5rem",
        fontSize: "0.85rem",
        color: "#64748b",
    },
    link: {
        color: "#818cf8",
        fontWeight: 600,
        textDecoration: "none",
    },
};

export default Login;
