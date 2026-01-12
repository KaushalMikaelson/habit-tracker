import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // ✅ LOGIN — now accepts JWT token
    const login = (token) => {
        localStorage.setItem("token", token);

        const decoded = jwtDecode(token);

        const userData = {
            userId: decoded.id,
            email: decoded.email,
        };

        localStorage.setItem("authUser", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        console.log("🔥 LOGOUT FUNCTION CALLED");

        localStorage.removeItem("authUser");
        localStorage.removeItem("token");

        setUser(null);
    };

    // ✅ Restore auth on refresh
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("authUser");

        if (storedToken && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem("authUser");
                localStorage.removeItem("token");
                setUser(null);
            }
        }

        setLoading(false);
    }, []);

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                login,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export { AuthProvider, useAuth };
