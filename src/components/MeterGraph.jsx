import React from "react";
import { getStatus } from "../services/mockData";

const MeterGraph = ({ ratio }) => {
    const currentRatio = parseFloat(ratio) || 1.0;

    // Rescale meter: Center at 1.0, Range: 0.8 to 1.2
    // Calculation: (ratio - 0.8) / (1.2 - 0.8)
    const normalizedRatio = Math.min(Math.max((currentRatio - 0.8) / 0.4, 0), 1);
    const rotation = normalizedRatio * 180 - 90; // -90 to 90 degrees

    const { label } = getStatus(currentRatio);

    // Explicit mapping for semantic color consistency
    let statusColor = "slate";
    if (label === "Normal") statusColor = "emerald";
    else if (label === "Warning") statusColor = "amber";
    else if (label === "Critical") statusColor = "rose";

    return (
        <div className="flex flex-col items-center justify-center p-8 relative">
            <div className="relative w-72 h-44 overflow-hidden">
                {/* Background Arch */}
                <svg viewBox="0 0 200 110" className="w-full h-full">
                    <defs>
                        <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ef4444" /> {/* Red */}
                            <stop offset="25%" stopColor="#f59e0b" /> {/* Orange */}
                            <stop offset="50%" stopColor="#10b981" /> {/* Green */}
                            <stop offset="75%" stopColor="#f59e0b" /> {/* Orange */}
                            <stop offset="100%" stopColor="#ef4444" /> {/* Red */}
                        </linearGradient>
                    </defs>

                    {/* Track */}
                    <path
                        d="M20,100 A80,80 0 0,1 180,100"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="12"
                        strokeLinecap="round"
                    />

                    {/* Gradient Value Track */}
                    <path
                        d="M20,100 A80,80 0 0,1 180,100"
                        fill="none"
                        stroke="url(#meterGradient)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeOpacity="0.8"
                    />

                    {/* Needle */}
                    <g transform={`rotate(${rotation}, 100, 100)`} className="transition-transform duration-1000 ease-in-out">
                        <line
                            x1="100" y1="100"
                            x2="100" y2="30"
                            stroke="#1e293b"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        <circle cx="100" cy="100" r="6" fill="#1e293b" />
                        <circle cx="100" cy="100" r="3" fill="#ffffff" />
                    </g>
                </svg>

                {/* Scale Labels */}
                <div className="absolute bottom-0 left-4 text-[11px] font-bold text-rose-400 uppercase tracking-tighter">Critical</div>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[11px] font-bold text-emerald-500 uppercase tracking-widest">Optimal</div>
                <div className="absolute bottom-0 right-4 text-[11px] font-bold text-rose-400 uppercase tracking-tighter">Critical</div>
            </div>

            <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-3 mb-1">
                    <div className={`w-3 h-3 rounded-full animate-pulse bg-${statusColor}-500 shadow-lg shadow-${statusColor}-500/50`}></div>
                    <span className={`text-[11px] font-bold uppercase tracking-[0.2em] bg-${statusColor}-50 text-${statusColor}-600 px-3 py-1 rounded-full border border-${statusColor}-100/50`}>
                        {label}
                    </span>
                </div>
                <h4 className="text-2xl font-bold text-slate-800 tracking-tighter mt-2">{currentRatio.toFixed(3)}</h4>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Consistency Index</p>
            </div>
        </div>
    );
};

export default MeterGraph;
