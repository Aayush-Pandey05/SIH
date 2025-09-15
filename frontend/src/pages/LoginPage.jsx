import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { assets } from "../assets/assets"; // Make sure this path is correct

// Reusable Input component for consistent styling
const FormInput = ({ id, type, placeholder, value, onChange, icon: Icon }) => (
    <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800 w-5 h-5" />
        <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full border rounded-lg px-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 placeholder-gray-400 border-gray-900 hover:border-blue-800"
            required
        />
    </div>
);

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });

    // --- Backend and state logic ---
    const { login, isLoggingIn } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
            navigate("/"); // Navigate on successful login
        } catch (error) {
            toast.error("Login failed. Please check your credentials.");
            console.error("Login failed:", error);
        }
    };
    
    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };
    // --- End of logic section ---

    const container = useRef();

    useGSAP(() => {
        gsap.from(".form-panel", { x: -50, opacity: 0, duration: 0.8, ease: "power2.out" });
        gsap.from(".image-panel", { x: 50, opacity: 0, duration: 0.8, ease: "power2.out" });
    }, { scope: container });

    return (
        <div ref={container} className="min-h-screen flex bg-gray-200">
            {/* Left Panel: Form */}
            <div className="form-panel w-full md:w-1/2 flex items-center justify-center px-6 py-10">
                <div className="w-full max-w-md">
                    <div className="flex items-center space-x-3 mb-6">
                        <img
                            src={assets.logo}
                            alt="JalSetu Logo"
                            className="h-12 w-12 object-contain rounded-full border border-gray-300"
                        />
                        <h2 className="text-3xl font-bold text-blue-950">JalSetu</h2>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-600 mt-2 text-balance">
                        Sign in to your account to continue managing your water resources.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-950">Email address</label>
                            <div className="mt-1">
                                <FormInput
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    icon={Mail}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
                            <div className="relative mt-1">
                                <FormInput
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    icon={Lock}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-end text-sm">
                             <Link to="/forgot-password" className="font-medium text-blue-600 hover:underline">
                                Forgot Password?
                             </Link>
                        </div>


                        {/* Submit Button */}
                        <button type="submit" className="w-full py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold flex items-center justify-center gap-2 transition-colors duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed" disabled={isLoggingIn}>
                            {isLoggingIn ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : "Sign In"}
                        </button>

                        <div className="text-center">
                            <span className="text-sm text-gray-600">
                                Don't have an account?{" "}
                                <Link to="/signup" className="text-blue-600 font-medium hover:underline underline-offset-4">Sign up</Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Panel: Image Overlay */}
            <div className="image-panel hidden md:flex w-1/2 relative overflow-hidden">
                <img
                    src={assets.bgsignup} // Assuming you want to use the same background
                    alt="Water conservation"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-10 bg-black/40 text-center">
                    <h2 className="text-3xl font-bold text-white text-balance drop-shadow-lg">
                        Continue Your Impact
                    </h2>
                    <p className="text-gray-200 mt-3 text-lg text-balance drop-shadow-md">
                        Access your dashboard and make every drop count.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;