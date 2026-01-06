import { useState, useContext, useEffect } from "react";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import { RIGHTS } from "../services/mockData";
import { UserService } from "../services/userService";

const Users = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [sortOrder, setSortOrder] = useState("newest");
    const [roleFilter, setRoleFilter] = useState("all");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await UserService.getUsers();
            const userList = data.data || (Array.isArray(data) ? data : []);
            setUsers(userList);
            setError("");
        } catch (err) {
            console.error("Fetch users error:", err);
            setError("Failed to load users from API.");
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.login?.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesRole = roleFilter === "all" || user.rights === parseInt(roleFilter);

        return matchesSearch && matchesRole;
    });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (sortOrder === "newest") return b.id - a.id;
        return a.id - b.id;
    });

    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (user?.rights !== 1) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 4h.01M5.07 19.48a9 9 0 1113.86 0" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Restricted Access</h2>
                    <p className="text-sm font-medium text-slate-400">Administrative clearance required to view user records.</p>
                </div>
            </Layout>
        );
    }

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, roleFilter]);

    const getRoleInfo = (rights) => {
        if (rights === 1) return { label: "Administrator", color: "bg-purple-100/50 text-purple-600 border-purple-200" };
        if (rights === 2) return { label: "Technical Specialist", color: "bg-blue-100/50 text-blue-600 border-blue-200" };
        return { label: "Field Operator", color: "bg-emerald-100/50 text-emerald-600 border-emerald-200" };
    };

    return (
        <Layout>
            <div className="mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Active Identities</h1>
                    <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">Read-only personnel directory</p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="glass-card p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 relative w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search identities by name or ID..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-48">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none"
                    >
                        <option value="all">All Roles</option>
                        <option value={RIGHTS.ADMIN}>Administrator</option>
                        <option value={RIGHTS.SPECIALIST}>Technical Specialist</option>
                        <option value={RIGHTS.OPERATOR}>Field Operator</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-8 font-bold text-sm">
                    {error}
                </div>
            )}

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Employee</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Username</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">ID Card</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-bold">Synchronizing personnel data...</td>
                                </tr>
                            ) : currentUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-bold">No identities found matching the criteria.</td>
                                </tr>
                            ) : (
                                currentUsers.map((u) => {
                                    const role = getRoleInfo(u.rights);
                                    return (
                                        <tr key={u.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-sm font-bold text-slate-500 border border-white shadow-sm group-hover:scale-110 transition-transform">
                                                        {u.name?.[0] || 'U'}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-800">{u.name}</span>
                                                        <span className="text-[11px] font-bold text-slate-400 italic">{u.designation}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <code className="text-[11px] font-bold bg-slate-100 px-2 py-1 rounded-md text-slate-600 uppercase tracking-wider">{u.login}</code>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-slate-500">{u.cnic || 'N/A'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border border-transparent shadow-sm ${role.color}`}>
                                                    {role.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8 items-center gap-4">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-[11px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
                    >
                        Previous
                    </button>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Page <span className="text-slate-800">{currentPage}</span> of {totalPages}
                    </div>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-[11px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
                    >
                        Next
                    </button>
                </div>
            )}
        </Layout>
    );
};

export default Users;
