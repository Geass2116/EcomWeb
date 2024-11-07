import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext(false);

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    const handleAuth = () => {
        const token = localStorage.getItem("access");
        if (token) {
            const decoded = jwtDecode(token);
            const expiry_date = decoded.exp;
            const current_time = Date.now() / 1000;

            if (expiry_date >= current_time) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        handleAuth();
    }, [isAuthenticated]);

    const authValue = { isAuthenticated, setIsAuthenticated};
    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
}
