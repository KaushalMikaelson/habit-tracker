import { createContext, useContext, useState, useEffect } from "react";


const AuthContext = createContext(null);

function AuthProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // ✅ LOGIN (single source of truth)
    const login = (authData) => {
        // authData = { token, user: { id, email } }

        localStorage.setItem("token", authData.token);

        const userData = {
            id: authData.user.id,
            email: authData.user.email,
        };

        localStorage.setItem("authUser", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
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

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
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
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export { AuthProvider, useAuth };
