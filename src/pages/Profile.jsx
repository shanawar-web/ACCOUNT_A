
import { useContext } from "react";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
    const { user } = useContext(AuthContext);

    return (

        <Layout>
            <div className="mb-6 md:mb-8">
                <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Personnel Profile</h1>
                <p className="text-[10px] md:text-xs font-semibold text-slate-400 mt-0.5 md:mt-1 uppercase tracking-widest">Verified System Identity</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="glass-card p-6 md:p-8 flex flex-col items-center text-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-2xl md:text-3xl font-black text-white shadow-xl shadow-blue-500/20 mb-6">
                        {user?.name?.[0] || 'U'}
                    </div>
                    <h2 className="text-xl font-black text-slate-800 mb-1">{user?.name}</h2>
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest border border-blue-100 mb-6">
                        {user?.role || 'Field Operator'}
                    </span>

                    <div className="w-full pt-6 border-t border-slate-100 flex justify-around">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</span>
                            <span className="text-xs font-black text-emerald-500">Active</span>
                        </div>
                        <div className="w-px h-8 bg-slate-100"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Clearance</span>
                            <span className="text-xs font-black text-slate-700">Level {user?.rights ?? 0}</span>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 md:p-8 space-y-6">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-4">Identity Details</h3>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Login ID</span>
                            <span className="text-sm font-black text-slate-700">{user?.login}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Designation</span>
                            <span className="text-sm font-black text-slate-700 italic">{user?.designation || 'Specialist'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">ID Card</span>
                            <span className="text-sm font-black text-slate-700">{user?.cnic || 'Verified'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Employee UID</span>
                            <span className="text-sm font-black text-slate-400">#{user?.id}</span>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                            <p className="text-[10px] font-bold text-amber-600 leading-relaxed uppercase">
                                Your access is strictly monitored for security compliance. Please notify administration if you suspect credentials compromise.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};


export default Profile;
