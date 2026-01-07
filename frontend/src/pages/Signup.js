import React, { useState } from "react";
import api from "../api/axios";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            await api.post("/auth/register", {
                email,
                password,
            });

            setMessage("Signup successful. Please login.");
            setEmail("");
            setPassword("");
        } catch (err) {
            console.error(err);
            setError("Signup failed. Email may already exist.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form style={styles.card} onSubmit={handleSubmit}>
                <h2 style={styles.title}>Create Account</h2>
                <p style={styles.subtitle}>Sign up to get started</p>

                {message && <div style={styles.success}>{message}</div>}
                {error && <div style={styles.error}>{error}</div>}

                <div style={styles.group}>
                    <label style={styles.label}>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>

                <div style={styles.group}>
                    <label style={styles.label}>Password</label>
                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>

                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? "Signing up..." : "Sign Up"}
                </button>

                <p style={styles.footer}>
                    Already have an account?{" "}
                    <a href="/login" style={styles.link}>
                        Login
                    </a>
                </p>
            </form>
        </div>
    );
}

/* ---------- Inline Styles ---------- */

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        fontFamily: "Arial, sans-serif",
    },
    card: {
        background: "#fff",
        padding: "2.5rem",
        width: "100%",
        maxWidth: "380px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    },
    title: {
        textAlign: "center",
        marginBottom: "0.25rem",
    },
    subtitle: {
        textAlign: "center",
        color: "#666",
        marginBottom: "1.5rem",
    },
    success: {
        background: "#e6fffa",
        color: "#065f46",
        padding: "0.6rem",
        borderRadius: "6px",
        fontSize: "0.9rem",
        marginBottom: "1rem",
        textAlign: "center",
    },
    error: {
        background: "#ffe5e5",
        color: "#d8000c",
        padding: "0.6rem",
        borderRadius: "6px",
        fontSize: "0.9rem",
        marginBottom: "1rem",
        textAlign: "center",
    },
    group: {
        marginBottom: "1.25rem",
    },
    label: {
        display: "block",
        fontSize: "0.9rem",
        marginBottom: "0.4rem",
        color: "#333",
    },
    input: {
        width: "100%",
        padding: "0.65rem",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "0.95rem",
    },
    button: {
        width: "100%",
        padding: "0.75rem",
        background: "#667eea",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        fontSize: "1rem",
        cursor: "pointer",
        marginTop: "0.5rem",
    },
    footer: {
        textAlign: "center",
        marginTop: "1rem",
        fontSize: "0.9rem",
    },
    link: {
        color: "#667eea",
        textDecoration: "none",
        fontWeight: "bold",
    },
};

export default Signup;
