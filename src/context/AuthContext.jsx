import { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    );

    const login = (data) => {
        // data should contain { user, token } or be the user object with token property
        const userObj = data.user || data;
        const token = data.token || userObj.token;

        localStorage.setItem("user", JSON.stringify(userObj));
        if (token) {
            localStorage.setItem("token", token);
        }
        setUser(userObj);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
