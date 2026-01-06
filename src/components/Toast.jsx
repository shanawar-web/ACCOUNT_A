
import { useEffect, useState } from "react";

const Toast = ({ message, type = "info", onClose, duration = 5000 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Allow animation to finish
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColors = {
        info: "bg-blue-50 border-blue-200 text-blue-800",
        success: "bg-emerald-50 border-emerald-200 text-emerald-800",
        warning: "bg-amber-50 border-amber-200 text-amber-800",
        error: "bg-rose-50 border-rose-200 text-rose-800",
        critical: "bg-rose-100 border-rose-300 text-rose-900"
    };

    const icons = {
        info: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        success: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        warning: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        error: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        critical: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        )
    };

    return (
        <div
            className={`relative flex items-start w-full max-w-sm overflow-hidden bg-white border rounded-xl shadow-2xl transition-all duration-300 transform ${isVisible ? "translate-y-0 opacity-100 scale-100" : "-translate-y-4 opacity-0 scale-95 pointer-events-none"
                } ${bgColors[type] || bgColors.info}`}
        >
            <div className="p-4 flex gap-4 w-full">
                <div className="flex-shrink-0 mt-0.5">
                    {icons[type] || icons.info}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.15em] opacity-90 mb-1">
                        {type === 'critical' ? 'Critical Alert' : 'System Notice'}
                    </h3>
                    <p className="text-[13px] font-bold opacity-100 leading-tight truncate-two-lines">
                        {message}
                    </p>
                </div>
                <div className="flex-shrink-0 ml-1">
                    <button
                        onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
                        className="p-1 hover:bg-black/5 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
            <div
                className="absolute bottom-0 left-0 h-0.5 bg-current opacity-20 transition-all ease-linear"
                style={{ width: isVisible ? '0%' : '100%', transitionDuration: `${duration}ms` }}
            />
        </div>
    );
};

export default Toast;
