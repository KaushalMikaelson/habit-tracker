import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null); // If someone uses auth without provider → we detect it

function AuthProvider({ children }) {
    const [loading, setLoading] = useState(true); // to manage loading state during login/logout
    const [user, setUser] = useState(null); // null means no user is logged in, Object means user is logged in

    const login = (userData) => {  //this will call API to login
        localStorage.setItem("authUser", JSON.stringify(userData));
        setUser(userData); // after successful login, set the user data
    }

    const logout = () => {
        console.log("🔥 LOGOUT FUNCTION CALLED");

        localStorage.removeItem("authUser");
        localStorage.removeItem("token");

        console.log("🧪 token after removal:", localStorage.getItem("token"));

        setUser(null);

        // ❌ TEMPORARILY COMMENT THIS
        // window.location.href = "/login";
    };


    useEffect(() => {
        // simulate auth check (later this will be backend / storage)
        const storedUser = localStorage.getItem("authUser");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false); // auth check is done
    }, []);


    const isAuthenticated = !!user; // true if user is logged in, false otherwise

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
        </AuthContext.Provider>  // exposes auth globally. //we wrap children with AuthContext provider so that all children can access auth state
    )
}

function useAuth() { // custom hook to use auth context - makes it easier and safe to access auth state in components
    const context = useContext(AuthContext); // get the context value 
    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider"); // if context is null, it means we are not within AuthProvider
    }
    return context; // return the context value
}

export { AuthProvider, useAuth };