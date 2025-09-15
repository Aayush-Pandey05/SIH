import React, { useState, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

import { useGSAP } from "@gsap/react"; // 1. Import useGSAP
import gsap from "gsap"; // Import gsap core
import { assets } from "../assets/assets";

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const { signUp, isSigningUp } = useAuthStore();
    
    // 2. Create a ref for the main container to scope our animations
    const container = useRef();

    // 3. useGSAP for animations
    useGSAP(() => {
        // Animate the form panel
        gsap.from(".form-panel", {
            x: -50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
        });

        // Animate the image panel
        gsap.from(".image-panel", {
            x: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
        });

        // Animate the image inside the panel with a slight delay
        gsap.from(".promo-image", {
            scale: 0.9,
            opacity: 0,
            delay: 0.3,
            duration: 0.6,
        });

    }, { scope: container }); // Scope animations to the container ref

    // No changes to logic functions (validateForm, handleSubmit, handleChange)
    const validateForm = () => {
        if (!formData.fullName.trim()) return toast.error("Full name is required");
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
        if (!formData.password) return toast.error("Password is required");
        if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
        if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const { confirmPassword: _, ...signUpData } = formData;
            try {
                await signUp(signUpData);
                Navigate("/");
            } catch (error) {
                console.error("Signup failed:", error);
            }
        }
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        // Add the ref to the main container div
        <div ref={container} className="min-h-screen flex bg-gray-200">
            {/* Left Panel: Form */}
            {/* Added a class "form-panel" for GSAP to target */}
            <div className="form-panel w-full md:w-1/2 flex items-center justify-center px-6 py-10">
                <div className="w-full max-w-md">
                    <div className="flex items-center space-x-3 mb-6">
                        <img
                                src={assets.logo}
                                alt="JalSetu Logo"
                                className="h-12 w-12 object-contain rounded-full border border-gray-300"
                              />
                        <h2 className="text-3xl font-bold text-blue-950">JalSetu </h2>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
                    <p className="text-gray-600 mt-2 text-balance">
                        Join JalSetu and start your journey towards efficient rainwater harvesting and water conservation.
                    </p>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        {/* Full Name Input */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-900">Full Name</label>
                            <div className="relative mt-1">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900 w-5 h-5" />
                                <input id="fullName" type="text" placeholder="Enter your full name" value={formData.fullName} onChange={(e) => handleChange("fullName", e.target.value)} className="w-full border rounded-lg px-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 placeholder-gray-400 border-gray-900 hover:border-blue-800" required />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-950">Email address</label>
                            <div className="relative mt-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800 w-5 h-5" />
                                <input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} className="w-full border rounded-lg px-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 placeholder-gray-400 border-gray-900 hover:border-blue-800" required />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
                            <div className="relative mt-1">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input id="password" type={showPassword ? "text" : "password"} placeholder="Create a password" value={formData.password} onChange={(e) => handleChange("password", e.target.value)} className="w-full border rounded-lg px-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 placeholder-gray-400 border-gray-800 hover:border-blue-800" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">Confirm Password</label>
                            <div className="relative mt-1">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" value={formData.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} className="w-full border rounded-lg px-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 placeholder-gray-400 border-gray-800 hover:border-blue-800" required />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors">
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="w-full py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold flex items-center justify-center gap-2 transition-colors duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed" disabled={isSigningUp}>
                            {isSigningUp ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" />
                                    <span>Signing up...</span>
                                </>
                            ) : "Create Account"}
                        </button>

                        <div className="text-center">
                            <span className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link to="/login" className="text-blue-600 font-medium hover:underline underline-offset-4">Sign in</Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Panel: Image */}
    

<div className="image-panel hidden md:flex w-1/2 relative overflow-hidden"> {/* Added 'relative' and 'overflow-hidden' */}
    {/* Background Image: Position it absolutely to cover the entire panel */}
    <img
        src={assets.bgsignup}
        alt="Rainwater harvesting"
        className="absolute inset-0 w-full h-full object-cover" // Ensure it covers the whole area
    />
    
    {/* Text Overlay: Position it absolutely on top of the image */}
    <div className="absolute inset-0 flex flex-col items-center justify-center p-10 bg-black/40 text-center"> {/* Added transparent overlay */}
        <h2 className="text-3xl font-bold text-white text-balance drop-shadow-lg"> {/* Changed text color to white */}
            Every Drop Counts. Every Citizen Matters.
        </h2>
        <p className="text-gray-200 mt-3 text-m text-balance drop-shadow-md"> {/* Changed text color to lighter gray */}
            Empowering India to harvest rainwater efficiently with JalSetu.
        </p>
    </div>
</div>
        </div>
    );
};

export default Signup;