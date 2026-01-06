import { API_URL, API_V1_URL } from "../config";

const MACHINES_API_URL = `${API_URL}/machines`;


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

export const MachineService = {
    getMachines: async () => {
        const headers = getAuthHeaders();
        const endpoints = [
            `${API_URL}/machines`,
            `${API_V1_URL}/machines`
        ];

        for (const url of endpoints) {
            try {
                console.log(`MachineService: Attempting fetch from ${url}`);
                const response = await fetch(url, { headers });

                if (response.ok) {
                    const data = await response.json();
                    console.log(`MachineService: Success from ${url}. Raw data:`, data);

                    // Greedy search for the machine array
                    if (Array.isArray(data)) return data;
                    if (data.data && Array.isArray(data.data)) return data.data;
                    if (data.results && Array.isArray(data.results)) return data.results;
                    if (data.machines && Array.isArray(data.machines)) return data.machines;
                    if (data.data?.machines && Array.isArray(data.data.machines)) return data.data.machines;

                    // If no array found yet, return the whole object as a last resort
                    return data;
                } else {
                    console.warn(`MachineService: ${url} returned status ${response.status}`);
                }
            } catch (err) {
                console.error(`MachineService: Error fetching from ${url}:`, err);
            }
        }

        throw new Error("Failed to fetch machines from all attempted endpoints.");
    }
};
