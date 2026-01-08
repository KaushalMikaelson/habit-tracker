import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/auth/login", { email, password });
            const decodedToken = jwtDecode(res.data.token);
            console.log("DECODED TOKEN OBJECT:", decodedToken);
            localStorage.setItem("token", res.data.token);

            login({
                userId: decodedToken.id,
                email: decodedToken.email,

            });
        } catch (err) {
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form style={styles.card} onSubmit={handleSubmit}>
                <h2 style={styles.title}>Welcome Back</h2>
                <p style={styles.subtitle}>Login to continue</p>

                {error && <div style={styles.error}>{error}</div>}

                <div style={styles.group}>
                    <label>Email</label>
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
                    <label>Password</label>
                    <div style={styles.passwordBox}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
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

/* ---------- Styles ---------- */

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
    title: { textAlign: "center" },
    subtitle: {
        textAlign: "center",
        color: "#666",
        marginBottom: "1.5rem",
    },
    error: {
        background: "#ffe5e5",
        color: "#d8000c",
        padding: "0.6rem",
        borderRadius: "6px",
        marginBottom: "1rem",
        textAlign: "center",
    },
    group: { marginBottom: "1.25rem" },
    input: {
        width: "100%",
        padding: "0.65rem",
        borderRadius: "6px",
        border: "1px solid #ccc",
    },
    passwordBox: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #ccc",
        borderRadius: "6px",
    },
    passwordInput: {
        flex: 1,
        padding: "0.65rem",
        border: "none",
        outline: "none",
    },
    eye: {
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "0 0.75rem",
        fontSize: "1rem",
    },
    button: {
        width: "100%",
        padding: "0.75rem",
        background: "#667eea",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
    footer: {
        textAlign: "center",
        marginTop: "1rem",
        fontSize: "0.9rem",
    },
    link: {
        color: "#667eea",
        fontWeight: "bold",
        textDecoration: "none",
    },
};

export default Login;
