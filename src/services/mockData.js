export const ROLES = {
    ADMIN: "admin",
    OPERATOR: "operator",
    SPECIALIST: "specialist",
};

export const RIGHTS = {
    ADMIN: 1,
    OPERATOR: 0,
    SPECIALIST: 2,
};

export const machineData = [
    {
        id: 1,
        name: "Machine A",
        adhesive: 100,
        resin: 100,
        history: [
            { date: "2024-12-23T08:30:00", adhesive: 100, resin: 100, ratio: 1.0 },
            { date: "2024-12-22T09:15:00", adhesive: 98, resin: 100, ratio: 0.98 },
            { date: "2024-12-21T08:45:00", adhesive: 102, resin: 100, ratio: 1.02 },
            { date: "2024-12-20T10:00:00", adhesive: 99, resin: 100, ratio: 0.99 },
            { date: "2024-12-19T14:20:00", adhesive: 101, resin: 100, ratio: 1.01 },
        ],
    }, // Perfect ratio (1.0)
    {
        id: 2,
        name: "Machine B",
        adhesive: 96,
        resin: 100,
        history: [
            { date: "2024-12-23T11:00:00", adhesive: 96, resin: 100, ratio: 0.96 },
            { date: "2024-12-22T13:30:00", adhesive: 95, resin: 100, ratio: 0.95 },
            { date: "2024-12-21T09:00:00", adhesive: 97, resin: 100, ratio: 0.97 },
            { date: "2024-12-20T08:15:00", adhesive: 94, resin: 100, ratio: 0.94 },
            { date: "2024-12-19T16:45:00", adhesive: 96, resin: 100, ratio: 0.96 },
        ],
    }, // Normal (0.96)
    {
        id: 3,
        name: "Machine C",
        adhesive: 92,
        resin: 100,
        history: [
            { date: "2024-12-23T07:45:00", adhesive: 92, resin: 100, ratio: 0.92 },
            { date: "2024-12-22T12:10:00", adhesive: 91, resin: 100, ratio: 0.91 },
            { date: "2024-12-21T15:30:00", adhesive: 93, resin: 100, ratio: 0.93 },
            { date: "2024-12-20T11:20:00", adhesive: 90, resin: 100, ratio: 0.9 },
            { date: "2024-12-19T09:50:00", adhesive: 92, resin: 100, ratio: 0.92 },
        ],
    }, // Warning (0.92)
    {
        id: 4,
        name: "Machine D",
        adhesive: 108,
        resin: 100,
        history: [
            { date: "2024-12-23T10:30:00", adhesive: 108, resin: 100, ratio: 1.08 },
            { date: "2024-12-22T08:00:00", adhesive: 107, resin: 100, ratio: 1.07 },
            { date: "2024-12-21T14:15:00", adhesive: 109, resin: 100, ratio: 1.09 },
            { date: "2024-12-20T16:50:00", adhesive: 106, resin: 100, ratio: 1.06 },
            { date: "2024-12-19T13:40:00", adhesive: 110, resin: 100, ratio: 1.1 },
        ],
    }, // Warning (1.08)
    {
        id: 5,
        name: "Machine E",
        adhesive: 85,
        resin: 100,
        history: [
            { date: "2024-12-23T09:25:00", adhesive: 85, resin: 100, ratio: 0.85 },
            { date: "2024-12-22T15:55:00", adhesive: 80, resin: 100, ratio: 0.8 },
            { date: "2024-12-21T11:45:00", adhesive: 88, resin: 100, ratio: 0.88 },
            { date: "2024-12-20T10:10:00", adhesive: 82, resin: 100, ratio: 0.82 },
            { date: "2024-12-19T17:30:00", adhesive: 86, resin: 100, ratio: 0.86 },
        ],
    }, // Critical (0.85)
    {
        id: 6,
        name: "Machine F",
        adhesive: 120,
        resin: 100,
        history: [
            { date: "2024-12-23T12:00:00", adhesive: 120, resin: 100, ratio: 1.2 },
            { date: "2024-12-22T14:40:00", adhesive: 118, resin: 100, ratio: 1.18 },
            { date: "2024-12-21T08:20:00", adhesive: 122, resin: 100, ratio: 1.22 },
            { date: "2024-12-20T09:55:00", adhesive: 115, resin: 100, ratio: 1.15 },
            { date: "2024-12-19T11:10:00", adhesive: 125, resin: 100, ratio: 1.25 },
        ],
    }, // Critical (1.20)
];

export const calculateRatio = (adhesive, resin) => {
    if (resin === 0) return 0;
    return Number((adhesive / resin).toFixed(3));
};

export const getStatus = (ratio) => {
    const r = parseFloat(ratio);
    // Treat 0 as Normal (Offline/Empty) to prevent Critical alerts
    if (r === 0) return { label: "Normal", color: "bg-emerald-50 text-emerald-600" };

    if (r >= 0.95 && r <= 1.05)
        return { label: "Normal", color: "bg-emerald-50 text-emerald-600" };
    if ((r >= 0.9 && r < 0.95) || (r > 1.05 && r <= 1.1))
        return { label: "Warning", color: "bg-amber-50 text-amber-600" };
    return { label: "Critical", color: "bg-rose-50 text-rose-600" };
};
