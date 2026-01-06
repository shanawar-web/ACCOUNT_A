import { API_URL, API_V1_URL } from "../config";

const API_URL_USERS = `${API_V1_URL}/users`;
const AUTH_URL = API_URL;


// Helper to get auth header
const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
        };
    }
    return { "Content-Type": "application/json" };
};

export const UserService = {
    // Login
    login: async (credentials) => {
        const response = await fetch(`${AUTH_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed");
        }
        return response.json();
    },

    // Get all users
    getUsers: async () => {
        const response = await fetch(API_URL_USERS, {
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        return response.json();
    },

    // Get user detail
    getUserDetail: async (id) => {
        const response = await fetch(`${API_URL_USERS}/detail/${id}`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error("Failed to fetch user details");
        }
        return response.json();
    },
};

