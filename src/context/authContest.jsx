import { createContext, useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthData({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem("user");
            return stored ? JSON.parse(stored) : null;
        } catch (err) {
            console.error("Invalid JSON in localStorage:", err);
            return null;
        }
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    const logout = async () => {
        try {
            await axios.post("http://localhost:1800/api/auth/logout", {}, {withCredentials: true});
            setUser(null);
        } catch (error) {
            console.log(error);
        }
    };

    const [postId, setPostId] = useState(null);

    return <AuthContext.Provider value={{ user, setUser, logout, postId, setPostId }}>
        {children}
    </AuthContext.Provider>
};

export function useAuthData() {
    return useContext(AuthContext);
}