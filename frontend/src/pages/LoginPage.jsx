import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import RightPannel from "../components/RightPannel";


const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [focusedInput, setFocusedInput] = useState(null);
     const { login, isLoggingIn } = useAuthStore();
     const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
            navigate("/"); 
        } catch (error) {
            toast.error("Login failed. Please check your credentials.");
            console.error("Login failed:", error);
        }
    };
    
    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    return (
        <div className="min-h-screen flex bg-slate-950">
            {/* Left Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-700/50"></div>
                
                <div className="relative z-10 w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="inline-flex items-center space-x-3 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                                <span className="text-white font-bold text-xl">J</span>
                            </div>
                            <h1 className="text-2xl font-bold text-white">JalSetu</h1>
                        </div>
                        
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-white">Welcome back</h2>
                            <p className="text-slate-400 text-base">
                                Sign in to continue to your dashboard
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">
                                Email address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedInput('email')}
                                    onBlur={() => setFocusedInput(null)}
                                    className={`w-full bg-slate-800/60 border-2 ${focusedInput === 'email' ? 'border-cyan-500' : 'border-slate-700'} rounded-xl px-11 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all duration-300 backdrop-blur-sm`}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">
                                Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedInput('password')}
                                    onBlur={() => setFocusedInput(null)}
                                    className={`w-full bg-slate-800/60 border-2 ${focusedInput === 'password' ? 'border-cyan-500' : 'border-slate-700'} rounded-xl px-11 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all duration-300 backdrop-blur-sm pr-12`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="text-right">
                            <a href="#forgot" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                                Forgot your password?
                            </a>
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoggingIn}
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.01] disabled:scale-100 disabled:cursor-not-allowed shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:shadow-none flex items-center justify-center space-x-2"
                        >
                            {isLoggingIn ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign in</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <span className="text-slate-400">
                            Don't have an account?{" "}
                            <a href="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                                Create account
                            </a>
                        </span>
                    </div>
                </div>
            </div>

            {/* Right Panel - Three.js Scene */}
            <RightPannel />
        </div>
    );
};

export default Login;