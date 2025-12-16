import React from "react";
import { Dumbbell, Home, Activity, Utensils, HeartPulse, Target, BarChart3, Settings } from "lucide-react";

const ClientDashboard = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Background + overlay for consistency with auth */}
            <div className="fixed inset-0 bg-cover bg-center opacity-20 pointer-events-none"
                 style={{
                     backgroundImage:
                         "url('https://www.cnet.com/a/img/resize/7768189eac216e19e71970ff3de7e1151fb03a83/hub/2022/03/31/c95b9020-34d2-4966-91c6-c22c5ad64692/squat-kazuma-seki.jpg?auto=webp&fit=crop&height=900&width=1200')",
                 }}
            />
            <div className="fixed inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/90 to-emerald-900/60" />

            {/* Main layout */}
            <div className="relative z-10 flex min-h-screen">
                {/* LEFT: Sidebar */}
                <aside className="w-64 border-r border-slate-800/60 bg-slate-950/70 backdrop-blur-xl hidden md:flex flex-col">
                    {/* Logo / header */}
                    <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/60">
                        <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-lg shadow-emerald-500/40">
                            <Dumbbell className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Client Dashboard</p>
                            <h1 className="text-lg font-semibold">Fitness Hub</h1>
                        </div>
                    </div>

                    {/* Menu */}
                    <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
                        <SidebarItem icon={Home} label="Dashboard" active />
                        <SidebarItem icon={Activity} label="Workout" />
                        <SidebarItem icon={Utensils} label="Nutrition" />
                        <SidebarItem icon={HeartPulse} label="Health Stats" />
                        <SidebarItem icon={Target} label="Goals" />
                        <SidebarItem icon={BarChart3} label="Analytics" />
                    </nav>

                    {/* Bottom settings */}
                    <div className="px-3 py-4 border-t border-slate-800/60">
                        <SidebarItem icon={Settings} label="Settings" />
                    </div>
                </aside>

                {/* RIGHT: 3-section grid */}
                <main className="flex-1 px-4 py-4 md:px-6 md:py-6">
                    {/* Top bar */}
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <div>
                            <h2 className="text-xl md:text-2xl font-semibold">User's, Performance Dashboard</h2>
                            <p className="text-xs md:text-sm text-slate-400">
                                Here is an overview of your workouts, nutrition, and health stats.
                            </p>
                        </div>
                        {/* Placeholder for avatar / quick actions */}
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-xs text-slate-400">Today</p>
                                <p className="text-sm font-medium text-slate-100">Mon, Dec 15</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border border-emerald-300/70" />
                        </div>
                    </div>
                        {/*GRID SECTION WILL GO HERE*/}
                </main>
            </div>
        </div>
    );
};

const SidebarItem = ({ icon: Icon, label, active }) => (
    <button
        type="button"
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
            active
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                : "text-slate-300 hover:bg-slate-900/70 hover:text-white"
        }`}
    >
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium">{label}</span>
    </button>
);

export default ClientDashboard;
