import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { RIGHTS, ROLES } from "../services/mockData";
import { UserService } from "../services/userService";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        login: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError(""); // Clear error on typing
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { login: loginField, password } = formData;

        // Basic Validation
        if (!loginField || !password) {
            setError("Please fill in all fields.");
            return;
        }

        // API Login Implementation
        const performLogin = async () => {
            setIsLoading(true);
            try {
                setError("");

                const data = await UserService.login({ login: loginField, password });

                if (data && data.token) {
                    const userProfile = data.user;

                    // Map Rights to Role
                    let role = "user";
                    if (userProfile.rights === 1) role = ROLES.ADMIN;
                    else if (userProfile.rights === 2) role = ROLES.SPECIALIST;
                    else if (userProfile.rights === 0) role = ROLES.OPERATOR;

                    login({
                        ...userProfile,
                        role: role,
                        token: data.token,
                    });
                    navigate("/dashboard");
                } else {
                    setError("Invalid login or password.");
                }
            } catch (err) {
                console.error("Login error:", err);
                setError(err.message || "Network error. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };


        performLogin();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Sign In
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Login ID
                        </label>
                        <input
                            type="text"
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            placeholder="Enter Login ID"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Ai123@"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full font-bold py-2 px-4 rounded transition duration-200 ${isLoading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                    >
                        {isLoading ? "Signing In..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );

};

export default Login;
