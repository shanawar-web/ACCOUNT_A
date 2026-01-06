import { API_URL } from "../config";

const THRESHOLDS_API_URL = `${API_URL}/thresholds`;


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

export const ThresholdService = {
    getThresholds: async (machineId) => {
        const response = await fetch(`${THRESHOLDS_API_URL}/${machineId}`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch thresholds");
        return response.json();
    },

    updateThresholds: async (data) => {
        const response = await fetch(`${THRESHOLDS_API_URL}/update`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to update thresholds");
        }
        return response.json();
    },
};
