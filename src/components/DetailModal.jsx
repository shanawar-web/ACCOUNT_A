import React from "react";
import MeterGraph from "./MeterGraph";

// Helper to get status for history items (duplicated from mockData logic for now, or import it)
// Ideally we should import, but I'll replicate simple logic for display or import if I can.
// Let's import from services/mockData to be clean.
import { getStatus } from "../services/mockData";

const DetailModal = ({ machine, onClose }) => {
    if (!machine) return null;

    const currentRatio = machine.history[0]?.ratio || 0;
    const currentStatus = getStatus(currentRatio);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800">{machine.name} Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Meter Graph (Visual) */}
                    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Current Status</h3>
                        {/* We use the latest history item for the current status shown in meter */}
                        <MeterGraph value={currentRatio} status={currentStatus} />

                        <div className="w-full mt-6 space-y-3">
                            <div className="flex justify-between text-sm px-4">
                                <span className="text-gray-500">Adhesive:</span>
                                <span className="font-semibold">{machine.history[0]?.adhesive} kg</span>
                            </div>
                            <div className="flex justify-between text-sm px-4">
                                <span className="text-gray-500">Resin:</span>
                                <span className="font-semibold">{machine.history[0]?.resin} kg</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: History Table (Report) */}
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Last Month Report</h3>
                        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Date</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Adhesive</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Resin</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Ratio</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {machine.history && machine.history.map((record, index) => {
                                        const status = getStatus(record.ratio);
                                        return (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 text-gray-600 font-medium whitespace-nowrap">{record.date}</td>
                                                <td className="px-4 py-2 text-gray-500">{record.adhesive}</td>
                                                <td className="px-4 py-2 text-gray-500">{record.resin}</td>
                                                <td className="px-4 py-2 text-gray-800 font-bold">{record.ratio}</td>
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {(!machine.history || machine.history.length === 0) && (
                                <div className="p-4 text-center text-gray-400 text-sm">No history data available.</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailModal;
