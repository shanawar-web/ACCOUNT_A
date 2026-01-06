import { BASE_URL } from "../config";


export const UtilityService = {
    checkHealth: async () => {
        const response = await fetch(`${BASE_URL}/test`);
        if (!response.ok) throw new Error("Health check failed");
        return response.json();
    },

    checkDbHealth: async () => {
        const response = await fetch(`${BASE_URL}/db-test`);
        if (!response.ok) throw new Error("DB health check failed");
        return response.json();
    }
};
