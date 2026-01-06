import { BASE_URL, API_URL } from "../config";

const READINGS_API_URL = `${API_URL}/readings`;


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

export const ReadingsService = {
    getSummary: async () => {
        const response = await fetch(`${API_URL}/dashboard/summary`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch dashboard summary");
        return response.json();
    },

    getHistory: async ({ machine_id, start_date, end_date, status, page = 1, limit = 50 }) => {
        const params = new URLSearchParams({ page, limit });
        if (machine_id) params.append("machine_id", machine_id);
        if (start_date) params.append("start_date", start_date);
        if (end_date) params.append("end_date", end_date);
        if (status) params.append("status", status);

        const response = await fetch(`${READINGS_API_URL}/history?${params.toString()}`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch history");
        return response.json();
    },

    ingest: async (data) => {
        const response = await fetch(`${READINGS_API_URL}/ingest`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to ingest reading");
        return response.json();
    },

    acknowledgeAlert: async (readingId, note) => {
        const response = await fetch(`${API_URL}/alerts/acknowledge`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ reading_id: readingId, note }),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "Failed to acknowledge alert");
        }
        return response.json();
    },
};
