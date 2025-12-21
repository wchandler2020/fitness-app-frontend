// components/home/dashboard/ClientDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { 
    Dumbbell, Home, Activity, Utensils, HeartPulse, Target, BarChart3, Settings,
    TrendingUp, Calendar, Award, Clock, Plus, Star, Copy, Zap, Sparkles,
    User, LogOut, ChevronDown
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { getWorkoutsApi, getWorkoutStatsApi } from '../../../api/workoutsApi';
import useAuthStore from '../../../store/authStore';
import WorkoutLogger from '../../../components/workout/WorkoutLogger';
import AIWorkoutGenerator from "../../workout/AIWorkoutGenerator";

const ClientDashboard = () => {
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);
    const [stats, setStats] = useState(null);
    const [recentWorkouts, setRecentWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showWorkoutLogger, setShowWorkoutLogger] = useState(false);
    const [showAIGenerator, setShowAIGenerator] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            
            // Load stats
            const statsData = await getWorkoutStatsApi();
            setStats(statsData);

            // Load recent workouts (last 7 days)
            const today = new Date();
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);

            const workouts = await getWorkoutsApi({
                start_date: weekAgo.toISOString().split('T')[0],
                end_date: today.toISOString().split('T')[0]
            });
            
            setRecentWorkouts(workouts);

        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num) => {
        if (!num) return '0';
        return new Intl.NumberFormat().format(Math.round(num));
    };

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

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
                        <SidebarItem 
                            icon={User} 
                            label="Profile" 
                            onClick={() => navigate('/profile')}
                        />
                        <SidebarItem icon={Settings} label="Settings" />
                    </div>
                </aside>

                {/* RIGHT: Main content */}
                <main className="flex-1 px-4 py-4 md:px-6 md:py-6">
                    {/* Top bar */}
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <div>
                            <h2 className="text-xl md:text-2xl font-semibold">
                                {user?.full_name?.split(' ')[0] || 'User'}'s Performance Dashboard
                            </h2>
                            <p className="text-xs md:text-sm text-slate-400">
                                Here is an overview of your workouts, nutrition, and health stats.
                            </p>
                        </div>
                        
                        {/* User menu */}
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-slate-400">Today</p>
                                <p className="text-sm font-medium text-slate-100">
                                    {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </p>
                            </div>
                            
                            {/* Avatar Dropdown */}
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-800/50 transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border border-emerald-300/70 flex items-center justify-center text-sm font-bold">
                                        {user?.full_name?.charAt(0) || 'U'}
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                                        {/* User Info Header */}
                                        <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/50">
                                            <p className="text-sm font-semibold text-white">{user?.full_name}</p>
                                            <p className="text-xs text-slate-400">{user?.email}</p>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-2">
                                            <button
                                                onClick={() => {
                                                    navigate('/profile');
                                                    setShowUserMenu(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800 transition-colors text-left"
                                            >
                                                <User className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm text-slate-300">My Profile</span>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setShowUserMenu(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800 transition-colors text-left"
                                            >
                                                <Settings className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm text-slate-300">Settings</span>
                                            </button>

                                            <div className="my-2 border-t border-slate-700" />

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors text-left group"
                                            >
                                                <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-400" />
                                                <span className="text-sm text-slate-300 group-hover:text-red-400">Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* GRID SECTION */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <Dumbbell className="w-12 h-12 mx-auto mb-4 animate-pulse text-emerald-400" />
                                <p className="text-slate-400">Loading your dashboard...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                            {/* LEFT COLUMN: Stats Cards */}
                            <div className="lg:col-span-2 space-y-4 md:space-y-6">
                                {/* Quick Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                                    <StatCard 
                                        icon={Calendar} 
                                        label="Streak" 
                                        value={`${stats?.current_streak_days || 0}d`}
                                        color="emerald"
                                    />
                                    <StatCard 
                                        icon={Dumbbell} 
                                        label="This Week" 
                                        value={`${stats?.workouts_this_week || 0}/6`}
                                        color="blue"
                                    />
                                    <StatCard 
                                        icon={TrendingUp} 
                                        label="Total Volume" 
                                        value={`${formatNumber(stats?.total_volume || 0)}`}
                                        subtext="lbs"
                                        color="purple"
                                    />
                                    <StatCard 
                                        icon={Activity} 
                                        label="Workouts" 
                                        value={stats?.total_workouts || 0}
                                        color="orange"
                                    />
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-4 md:p-6">
                                    <h3 className="text-sm font-semibold mb-3 text-slate-300">Quick Actions</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <ActionButton 
                                            icon={Plus} 
                                            label="Start Workout"
                                            subtitle="Log new session"
                                            primary
                                            onClick={() => setShowWorkoutLogger(true)}
                                        />
                                        <ActionButton 
                                            icon={Sparkles} 
                                            label="AI Generate"
                                            subtitle="Create with AI"
                                            gradient="purple"
                                            onClick={() => setShowAIGenerator(true)}
                                        />
                                        <ActionButton 
                                            icon={Copy} 
                                            label="Repeat Last"
                                            subtitle="Copy previous"
                                        />
                                        <ActionButton 
                                            icon={Star} 
                                            label="Favorites"
                                            subtitle="Saved templates"
                                        />
                                    </div>
                                </div>

                                {/* Recent Workouts */}
                                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-4 md:p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-emerald-400" />
                                            Recent Workouts
                                        </h3>
                                        <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                                            View All →
                                        </button>
                                    </div>
                                    
                                    {recentWorkouts.length > 0 ? (
                                        <div className="space-y-3">
                                            {recentWorkouts.slice(0, 4).map(workout => (
                                                <WorkoutItem key={workout.id} workout={workout} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-slate-500">
                                            <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                            <p className="text-sm">No workouts yet</p>
                                            <p className="text-xs mt-1">Start your first workout!</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT COLUMN: PRs & Activity */}
                            <div className="space-y-4 md:space-y-6">
                                {/* Recent PRs */}
                                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-4 md:p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Award className="w-4 h-4 text-yellow-400" />
                                        <h3 className="text-sm font-semibold text-slate-300">Recent PRs</h3>
                                    </div>
                                    {stats?.recent_prs && stats.recent_prs.length > 0 ? (
                                        <div className="space-y-2">
                                            {stats.recent_prs.slice(0, 5).map((pr, idx) => (
                                                <PRItem key={idx} pr={pr} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-slate-500">
                                            <Award className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                            <p className="text-xs">No PRs yet</p>
                                            <p className="text-xs mt-1">Keep pushing!</p>
                                        </div>
                                    )}
                                </div>

                                {/* Favorite Exercises */}
                                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-4 md:p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Zap className="w-4 h-4 text-emerald-400" />
                                        <h3 className="text-sm font-semibold text-slate-300">Top Exercises</h3>
                                    </div>
                                    {stats?.favorite_exercises && stats.favorite_exercises.length > 0 ? (
                                        <div className="space-y-2">
                                            {stats.favorite_exercises.slice(0, 5).map((exercise, idx) => (
                                                <div key={idx} className="flex items-center justify-between bg-slate-800/40 rounded-lg px-3 py-2 border border-slate-700/40">
                                                    <span className="text-xs text-slate-300">
                                                        {exercise.exercise__name}
                                                    </span>
                                                    <span className="text-xs font-semibold text-emerald-400">
                                                        {exercise.count}x
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-slate-500">
                                            <Dumbbell className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                            <p className="text-xs">No data yet</p>
                                        </div>
                                    )}
                                </div>

                                {/* This Month Progress */}
                                <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-500/30 rounded-2xl p-4 md:p-6">
                                    <h3 className="text-sm font-semibold text-slate-300 mb-3">This Month</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex items-baseline justify-between mb-1">
                                                <span className="text-xs text-slate-400">Workouts</span>
                                                <span className="text-lg font-bold text-emerald-400">
                                                    {stats?.workouts_this_month || 0}
                                                </span>
                                            </div>
                                            <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                                                    style={{ width: `${Math.min(((stats?.workouts_this_month || 0) / 20) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="pt-2 border-t border-slate-700/50">
                                            <p className="text-xs text-slate-400">
                                                Great progress! Keep it up 💪
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Workout Logger Modal */}
            <WorkoutLogger
                isOpen={showWorkoutLogger}
                onClose={() => setShowWorkoutLogger(false)}
                onSuccess={loadDashboardData}
            />

            {/* AI Workout Generator Modal */}
            <AIWorkoutGenerator
                isOpen={showAIGenerator}
                onClose={() => setShowAIGenerator(false)}
                onWorkoutGenerated={loadDashboardData}
            />
        </div>
    );
};

// Sidebar Item Component
const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        type="button"
        onClick={onClick}
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

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, subtext, color = 'emerald' }) => {
    const colorMap = {
        emerald: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/30',
        blue: 'from-blue-500/10 to-blue-500/5 border-blue-500/30',
        purple: 'from-purple-500/10 to-purple-500/5 border-purple-500/30',
        orange: 'from-orange-500/10 to-orange-500/5 border-orange-500/30',
    };

    const iconColorMap = {
        emerald: 'text-emerald-400',
        blue: 'text-blue-400',
        purple: 'text-purple-400',
        orange: 'text-orange-400',
    };

    return (
        <div className={`bg-gradient-to-br ${colorMap[color]} backdrop-blur-xl border rounded-xl p-3`}>
            <Icon className={`w-4 h-4 mb-2 ${iconColorMap[color]}`} />
            <p className="text-xs text-slate-400 mb-0.5">{label}</p>
            <p className="text-lg font-bold text-white">
                {value}
                {subtext && <span className="text-xs text-slate-400 ml-1">{subtext}</span>}
            </p>
        </div>
    );
};

// Action Button Component
const ActionButton = ({ icon: Icon, label, subtitle, primary, gradient, onClick }) => {
    let buttonClass = 'text-left p-3 rounded-xl transition-all ';
    
    if (primary) {
        buttonClass += 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25';
    } else if (gradient === 'purple') {
        buttonClass += 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25';
    } else {
        buttonClass += 'bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60';
    }
    
    return (
        <button onClick={onClick} className={buttonClass}>
            <Icon className="w-5 h-5 mb-2" />
            <p className="text-xs font-semibold">{label}</p>
            <p className="text-xs opacity-75 mt-0.5">{subtitle}</p>
        </button>
    );
};

// Workout Item Component
const WorkoutItem = ({ workout }) => (
    <div className="bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/40 rounded-xl p-3 transition-all cursor-pointer group">
        <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
                <h4 className="text-sm font-semibold group-hover:text-emerald-400 transition-colors">
                    {workout.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(workout.workout_date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                    })}
                </p>
            </div>
            {workout.is_favorite && (
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            )}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {workout.exercise_count}
            </span>
            <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {workout.duration_minutes}m
            </span>
            <span className="text-emerald-400 font-medium">
                {new Intl.NumberFormat().format(Math.round(workout.total_volume))} lbs
            </span>
        </div>
    </div>
);

// PR Item Component
const PRItem = ({ pr }) => (
    <div className="bg-slate-800/40 rounded-lg px-3 py-2 border border-slate-700/40">
        <div className="flex items-start justify-between">
            <div className="flex-1">
                <p className="text-xs font-semibold text-slate-200">{pr.exercise_name}</p>
                <p className="text-xs text-emerald-400 font-medium mt-0.5">
                    {pr.pr_type === 'max_weight' && `${pr.weight} lbs`}
                    {pr.pr_type === 'max_volume' && `${Math.round(pr.volume)} lbs total`}
                    {pr.pr_type === 'max_reps' && `${pr.reps} reps`}
                </p>
            </div>
            <span className="text-xs text-slate-500">
                {new Date(pr.date_achieved).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
        </div>
    </div>
);

export default ClientDashboard;