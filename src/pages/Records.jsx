import { useState, useEffect, useContext } from "react";
import Layout from "../components/Layout";
import { ReadingsService } from "../services/readingsService";
import { getStatus, calculateRatio } from "../services/mockData";
import { MachineService } from "../services/machineService";
import { UserService } from "../services/userService";
import { AuthContext } from "../context/AuthContext";

const Records = () => {
    const { user } = useContext(AuthContext);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        machine_id: "",
        status: "",
        start_date: "",
        end_date: ""
    });
    const [machines, setMachines] = useState([]);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            // 1. Fetch Full User Details if machine information is missing
            let currentUser = user;
            if (user?.id && user?.rights !== 1 && !user?.requested_machines) {
                try {
                    console.log("Records: Fetching full user details...");
                    const detailRes = await UserService.getUserDetail(user.id);
                    const fullProfile = detailRes.data || detailRes;
                    if (fullProfile) currentUser = { ...user, ...fullProfile };
                } catch (profileErr) {
                    console.error("Failed to fetch full user profile:", profileErr);
                }
            }

            // 2. Determine applied filtering
            const getAssignedId = (u) => {
                const req = u?.requested_machines;
                if (Array.isArray(req) && req.length > 0) {
                    const first = req[0];
                    return String(first.id || first.machine_id || first);
                }
                return req ? String(req) : (u?.machine_id ? String(u.machine_id) : null);
            };

            const assignedId = getAssignedId(currentUser);
            const appliedMachineId = (currentUser?.rights !== 1 && assignedId) ? assignedId : filters.machine_id;

            console.log("Records.jsx: Fetching records with filters:", filters);

            // Fetch broader history to ensure client-side filter has data to work with
            // We do NOT send status to backend because backend status filtering is unreliable
            const response = await ReadingsService.getHistory({
                ...filters,
                status: "", // Force empty status to fetch all types
                machine_id: appliedMachineId,
                page,
                limit: 200
            });

            console.log("Records.jsx: Raw history response:", response);
            let data = response.data || response.results || (Array.isArray(response) ? response : []);

            // Client-Side Filter for Consistency
            if (filters.status) {
                data = data.filter(record => {
                    const rowAdhesive = Number(record.adhesive_weight ?? record.adhesive ?? 0);
                    const rowResin = Number(record.resin_weight ?? record.resin ?? 0);
                    const rowRatio = record.calculated_ratio !== undefined && record.calculated_ratio !== null
                        ? record.calculated_ratio
                        : calculateRatio(rowAdhesive, rowResin);

                    const status = getStatus(rowRatio);
                    // Match exact capitalized status from dropdown
                    return status.label === filters.status;
                });
            }

            console.log("Records.jsx: Processed records for table:", data);
            setRecords(data);
            setTotalPages(response.totalPages || 1);
            setError("");
        } catch (err) {
            console.error("Fetch records error:", err);
            setError("Failed to load records from API.");
        } finally {
            setLoading(false);
        }
    };

    const fetchMachines = async () => {
        try {
            console.log("Records.jsx: Calling MachineService.getMachines()...");
            const data = await MachineService.getMachines();
            console.log("Records.jsx: Machine data received:", data);
            let machineList = Array.isArray(data) ? data : [];

            // 1. Fetch Full User Details if missing (defensive)
            let currentUser = user;
            if (user?.id && user?.rights !== 1 && !user?.requested_machines) {
                try {
                    const detailRes = await UserService.getUserDetail(user.id);
                    const fullProfile = detailRes.data || detailRes;
                    if (fullProfile) currentUser = { ...user, ...fullProfile };
                } catch (e) { }
            }

            // 2. Filter machine list for dropdown if not admin
            const getAssignedId = (u) => {
                const req = u?.requested_machines;
                if (Array.isArray(req) && req.length > 0) {
                    const first = req[0];
                    return String(first.id || first.machine_id || first);
                }
                return req ? String(req) : (u?.machine_id ? String(u.machine_id) : null);
            };

            const assignedId = getAssignedId(currentUser);
            if (currentUser?.rights !== 1 && assignedId) {
                machineList = machineList.filter(m => String(m.id) === assignedId);
            }
            setMachines(machineList);
        } catch (err) {
            console.error("Records.jsx: Fetch machines error:", err);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [page, filters]);

    useEffect(() => {
        fetchMachines();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        setPage(1);
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString();
    };

    return (
        <Layout>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Machine Records</h1>
                    <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">History of all machine readings</p>
                </div>
                <button
                    onClick={fetchRecords}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                >
                    {loading ? "Refreshing..." : "Refresh Records"}
                </button>
            </div>

            {/* Filters Section */}
            <div className="glass-card p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Select Machine</label>
                    <select
                        name="machine_id"
                        value={filters.machine_id}
                        onChange={handleFilterChange}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none"
                    >
                        <option value="">All Machines</option>
                        {machines.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Status</label>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none"
                    >
                        <option value="">All Statuses</option>
                        <option value="Normal">Normal</option>
                        <option value="Warning">Warning</option>
                        <option value="Critical">Critical</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Page</label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 p-3 rounded-xl transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="flex-[2] bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-sm font-bold text-slate-600">
                            Page {page}
                        </div>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= totalPages}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 p-3 rounded-xl transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Records Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Machine Name</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Operator</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Reading (kg)</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Ratio</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {records.map((record) => {
                                // 1. Robust weight and ratio detection
                                const rowAdhesive = Number(record.adhesive_weight ?? record.adhesive ?? 0);
                                const rowResin = Number(record.resin_weight ?? record.resin ?? 0);
                                const rowRatio = record.calculated_ratio !== undefined && record.calculated_ratio !== null
                                    ? record.calculated_ratio
                                    : calculateRatio(rowAdhesive, rowResin);

                                const status = getStatus(rowRatio);

                                // 2. Robust machine lookup
                                const mRef = machines.find(m => String(m.id) === String(record.machine_id));
                                const machineName = mRef?.name || record.Machine?.name || `ID: ${record.machine_id}`;

                                // 3. Robust operator identity detection
                                const operatorName = record.User?.name || record.Operator?.name || record.operator?.name || record.operator_name || "System Agent";
                                const operatorInitial = operatorName[0] || 'S';

                                return (
                                    <tr key={record.id || Math.random()} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-700">{new Date(record.timestamp).toLocaleDateString()}</span>
                                                <span className="text-[11px] font-medium text-slate-400 italic">{new Date(record.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{machineName}</span>
                                                <span className="text-[11px] font-bold text-slate-300">MAC-{record.machine_id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center text-[11px] font-bold text-slate-500 border border-white shadow-sm">
                                                    {operatorInitial}
                                                </div>
                                                <span className="text-xs font-bold text-slate-600">{operatorName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center items-center gap-4">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Adhesive</span>
                                                    <span className="text-sm font-bold text-slate-600">{rowAdhesive}</span>
                                                </div>
                                                <div className="w-px h-6 bg-slate-100"></div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Resin</span>
                                                    <span className="text-sm font-bold text-slate-600">{rowResin}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-bold text-blue-600 bg-blue-50/50 border border-blue-100/50 px-4 py-1.5 rounded-full shadow-sm">
                                                {Number(rowRatio).toFixed(3)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`status-badge ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-center">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.3em]">End of Log Stream</span>
                </div>
            </div>
        </Layout>
    );
};

export default Records;
