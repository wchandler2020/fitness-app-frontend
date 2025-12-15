import React, { useState } from 'react';
import { User, Mail, Lock, Phone, Dumbbell, ArrowRight, Check } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import axiosClient from '../../api/axiosClient';

import { useNavigate } from 'react-router-dom';

// API helpers using your DRF + SimpleJWT setup
async function loginApi(payload) {
    const res = await axiosClient.post('/token/', payload);
    return res.data;
}

async function registerApi(payload) {
    const res = await axiosClient.post('/register/', payload);
    return res.data;
}

const FitnessAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        phone_number: '',
        role: 'client',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loginStore = useAuthStore(state => state.login);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (!isLogin && formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!isLogin) {
            if (!formData.full_name) {
                newErrors.full_name = 'Full name is required';
            }
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setErrors(prev => ({ ...prev, form: '' }));

        try {
            if (isLogin) {
                // LOGIN
                const payload = {
                    email: formData.email,
                    password: formData.password,
                };

                const data = await loginApi(payload);
                // { access, refresh, user, detail }
                loginStore({
                    user: data.user,
                    role: data.user.role,
                    accessToken: data.access,
                });

                localStorage.setItem('accessToken', data.access);
                localStorage.setItem('refreshToken', data.refresh);
                // go to homepage after login
                navigate('/', { replace: true });

                alert('Login successful.');
            } else {
                // REGISTER
                const payload = {
                    full_name: formData.full_name,
                    email: formData.email,
                    phone_number: formData.phone_number || '',
                    password: formData.password,
                    password2: formData.confirmPassword,
                    role: formData.role,
                };

                const data = await registerApi(payload);
                alert(
                    data?.message ||
                    'Registration successful! Please check your email to verify your account.'
                );

                setIsLogin(true);
                setFormData({
                    email: formData.email,
                    password: '',
                    full_name: '',
                    phone_number: '',
                    role: 'client',
                    confirmPassword: '',
                });
                setErrors({});
            }
        } catch (err) {
            if (err.response?.data) {
                const data = err.response.data;
                const fieldErrors = {};

                if (typeof data === 'object') {
                    Object.entries(data).forEach(([key, value]) => {
                        if (Array.isArray(value)) {
                            fieldErrors[key] = value.join(' ');
                        } else if (typeof value === 'string') {
                            // typical DRF error shape: {"detail": "..."} or {"password": ["..."]}
                            if (key === 'detail' || key === 'message') {
                                fieldErrors.form = value;
                            } else {
                                fieldErrors[key] = value;
                            }
                        }
                    });
                }

                setErrors(prev => ({
                    ...prev,
                    ...fieldErrors,
                    form:
                        fieldErrors.form ||
                        data.detail ||
                        data.message ||
                        'Something went wrong.',
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    form: 'Network error. Please try again.',
                }));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const switchMode = () => {
        setIsLogin(prev => !prev);
        setFormData({
            email: '',
            password: '',
            full_name: '',
            phone_number: '',
            role: 'client',
            confirmPassword: '',
        });
        setErrors({});
    };

    return (
        <div className="min-h-screen w-full bg-slate-950 text-white">
            <div className="relative min-h-screen flex items-center justify-center px-4">
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2023/02/The-most-popular-exercises-for-men-and-women.jpg?fit=2061%2C1376&ssl=1')",
                    }}
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/70 to-emerald-900/60" />

                {/* Content */}
                <div className="relative z-10 max-w-6xl w-full flex flex-col lg:flex-row items-center gap-12">
                    {/* Left hero copy */}
                    <div className="flex-1 max-w-xl text-center lg:text-left space-y-4">
                        <div className="inline-flex items-center justify-center lg:justify-start gap-2 rounded-full bg-slate-900/60 px-3 py-1 border border-emerald-400/40 text-xs font-medium text-emerald-300">
                            <Dumbbell className="w-4 h-4" />
                            <span>Train smarter, not harder</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            Your all‑in‑one
                            <span className="text-emerald-400"> fitness coaching </span>
                            platform
                        </h1>
                        <p className="text-slate-300 text-sm md:text-base">
                            Connect with certified trainers, follow custom workout plans, and
                            track your progress from any device.
                        </p>
                        <ul className="text-sm md:text-base text-slate-200 space-y-1">
                            <li className="flex items-center justify-center lg:justify-start gap-2">
                                <Check className="w-4 h-4 text-emerald-400" />
                                <span>Personalized workout and nutrition plans</span>
                            </li>
                            <li className="flex items-center justify-center lg:justify-start gap-2">
                                <Check className="w-4 h-4 text-emerald-400" />
                                <span>Trainer and client accounts in one place</span>
                            </li>
                            <li className="flex items-center justify-center lg:justify-start gap-2">
                                <Check className="w-4 h-4 text-emerald-400" />
                                <span>Progress tracking, check‑ins, and messaging</span>
                            </li>
                        </ul>
                    </div>

                    {/* Right auth card */}
                    <div className="flex-1 max-w-md w-full">
                        {/* Logo/Header */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl mb-3 shadow-lg shadow-emerald-500/40">
                                <Dumbbell className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold mb-1">Fitness Hub</h2>
                            <p className="text-slate-300 text-sm">
                                Login or create your account to start training.
                            </p>
                        </div>

                        {/* Auth Card */}
                        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/60 overflow-hidden">
                            {/* Tab Switcher */}
                            <div className="flex border-b border-slate-700/60">
                                <button
                                    type="button"
                                    onClick={() => isLogin || switchMode()}
                                    className={`flex-1 py-3 text-sm font-medium transition-all ${
                                        isLogin
                                            ? 'text-white bg-slate-900/80 border-b-2 border-emerald-400'
                                            : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    onClick={() => !isLogin || switchMode()}
                                    className={`flex-1 py-3 text-sm font-medium transition-all ${
                                        !isLogin
                                            ? 'text-white bg-slate-900/80 border-b-2 border-emerald-400'
                                            : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    Register
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-7 space-y-5">
                                {errors.form && (
                                    <p className="text-xs text-red-400 mb-1">{errors.form}</p>
                                )}

                                {/* Full Name - Register Only */}
                                {!isLogin && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-200 mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="text"
                                                name="full_name"
                                                value={formData.full_name}
                                                onChange={handleChange}
                                                className={`w-full pl-11 pr-4 py-3 bg-slate-950/70 border ${
                                                    errors.full_name
                                                        ? 'border-red-500'
                                                        : 'border-slate-700'
                                                } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all`}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        {errors.full_name && (
                                            <p className="mt-1 text-xs text-red-400">
                                                {errors.full_name}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-200 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full pl-11 pr-4 py-3 bg-slate-950/70 border ${
                                                errors.email ? 'border-red-500' : 'border-slate-700'
                                            } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all`}
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Phone - Register Only */}
                                {!isLogin && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-200 mb-2">
                                            Phone Number{' '}
                                            <span className="text-slate-500">(Optional)</span>
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="tel"
                                                name="phone_number"
                                                value={formData.phone_number}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-950/70 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Role - Register Only */}
                                {!isLogin && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-200 mb-2">
                                            I am a
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setFormData(prev => ({ ...prev, role: 'client' }))
                                                }
                                                className={`py-3 px-4 rounded-xl border-2 transition-all ${
                                                    formData.role === 'client'
                                                        ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400'
                                                        : 'border-slate-700 text-slate-300 hover:border-slate-500'
                                                }`}
                                            >
                                                <div className="flex items-center justify-center space-x-2">
                                                    {formData.role === 'client' && (
                                                        <Check className="w-4 h-4" />
                                                    )}
                                                    <span className="font-medium text-sm">Client</span>
                                                </div>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setFormData(prev => ({ ...prev, role: 'trainer' }))
                                                }
                                                className={`py-3 px-4 rounded-xl border-2 transition-all ${
                                                    formData.role === 'trainer'
                                                        ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400'
                                                        : 'border-slate-700 text-slate-300 hover:border-slate-500'
                                                }`}
                                            >
                                                <div className="flex items-center justify-center space-x-2">
                                                    {formData.role === 'trainer' && (
                                                        <Check className="w-4 h-4" />
                                                    )}
                                                    <span className="font-medium text-sm">Trainer</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-200 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`w-full pl-11 pr-4 py-3 bg-slate-950/70 border ${
                                                errors.password
                                                    ? 'border-red-500'
                                                    : 'border-slate-700'
                                            } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all`}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password - Register Only */}
                                {!isLogin && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-200 mb-2">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className={`w-full pl-11 pr-4 py-3 bg-slate-950/70 border ${
                                                    errors.confirmPassword
                                                        ? 'border-red-500'
                                                        : 'border-slate-700'
                                                } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all`}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="mt-1 text-xs text-red-400">
                                                {errors.confirmPassword}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Forgot Password - Login Only */}
                                {isLogin && (
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl text-sm font-semibold hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-emerald-400/30 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                  <span>
                    {isSubmitting
                        ? 'Processing...'
                        : isLogin
                            ? 'Login'
                            : 'Create Account'}
                  </span>
                                    {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                                </button>
                            </form>
                        </div>

                        {/* Footer Text */}
                        <p className="text-center text-slate-300 text-xs mt-4">
                            {isLogin ? "Don't have an account? " : 'Already have an account? '}
                            <button
                                type="button"
                                onClick={switchMode}
                                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                            >
                                {isLogin ? 'Register' : 'Login'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FitnessAuth;
