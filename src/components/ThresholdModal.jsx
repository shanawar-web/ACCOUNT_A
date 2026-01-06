import React, { useState, useEffect } from "react";
import { ThresholdService } from "../services/thresholdService";

const ThresholdModal = ({ isOpen, onClose, machineId, machineName }) => {
    const [thresholds, setThresholds] = useState({
        min_ratio: 0.90,
        max_ratio: 1.10,
        target_ratio: 1.00
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen && machineId) {
            fetchThresholds();
        }
    }, [isOpen, machineId]);

    const fetchThresholds = async () => {
        setLoading(true);
        try {
            const data = await ThresholdService.getThresholds(machineId);
            setThresholds({
                min_ratio: data.min_ratio || 0.90,
                max_ratio: data.max_ratio || 1.10,
                target_ratio: data.target_ratio || 1.00
            });
        } catch (err) {
            console.error("Failed to fetch thresholds:", err);
            // Fallback to defaults if API fails or not set
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await ThresholdService.updateThresholds({
                machine_id: machineId,
                ...thresholds
            });
            onClose();
        } catch (err) {
            setError(err.message || "Failed to update thresholds");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Configure Thresholds</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18"></path></svg>
                    </button>
                </div>

                <p className="text-sm text-gray-500 mb-6">Setting standards for <span className="font-bold text-gray-700">{machineName}</span></p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Target Ratio</label>
                        <input
                            type="number" step="0.01"
                            value={thresholds.target_ratio}
                            onChange={(e) => setThresholds({ ...thresholds, target_ratio: parseFloat(e.target.value) })}
                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Min Ratio</label>
                            <input
                                type="number" step="0.01"
                                value={thresholds.min_ratio}
                                onChange={(e) => setThresholds({ ...thresholds, min_ratio: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Max Ratio</label>
                            <input
                                type="number" step="0.01"
                                value={thresholds.max_ratio}
                                onChange={(e) => setThresholds({ ...thresholds, max_ratio: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition"
                                required
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <div className="flex gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save Settings"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ThresholdModal;
