import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import RightPanelSignup from "../components/RightPanelSignup";
import assets from '../assets/assets'

const Signup = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { signUp, isSigningUp } = useAuthStore();
  const [focusedInput, setFocusedInput] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      alert(t('signupPage.alerts.fullNameRequired'));
      return false;
    }
    if (!formData.email.trim()) {
      alert(t('signupPage.alerts.emailRequired'));
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert(t('signupPage.alerts.invalidEmail'));
      return false;
    }
    if (!formData.password) {
      alert(t('signupPage.alerts.passwordRequired'));
      return false;
    }
    if (formData.password.length < 6) {
      alert(t('signupPage.alerts.passwordTooShort'));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      alert(t('signupPage.alerts.passwordsNoMatch'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { confirmPassword: _, ...signUpData } = formData;
      try {
        await signUp(signUpData);
        navigate("/");
      } catch (error) {
        console.error("Signup failed:", error);
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-700/50"></div>

        <div className="relative z-10 w-full max-w-md space-y-6">
          {/* Logo Section */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 mb-6">
              <img src={assets.logo} alt="JalSetu Logo" className="h-10 w-10 rounded-full"/>
              <h1 className="text-2xl font-bold text-white">{t('signupPage.brandName')}</h1>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">
                {t('signupPage.title')}
              </h2>
              <p className="text-slate-400 text-base">
                {t('signupPage.subtitle')}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Full Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                {t('signupPage.fullNameLabel')}
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  id="fullName"
                  type="text"
                  placeholder={t('signupPage.fullNamePlaceholder')}
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  onFocus={() => setFocusedInput("fullName")}
                  onBlur={() => setFocusedInput(null)}
                  className={`w-full bg-slate-800/60 border-2 ${
                    focusedInput === "fullName"
                      ? "border-cyan-500"
                      : "border-slate-700"
                  } rounded-xl px-11 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all duration-300 backdrop-blur-sm`}
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                {t('signupPage.emailLabel')}
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  id="email"
                  type="email"
                  placeholder={t('signupPage.emailPlaceholder')}
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                  className={`w-full bg-slate-800/60 border-2 ${
                    focusedInput === "email"
                      ? "border-cyan-500"
                      : "border-slate-700"
                  } rounded-xl px-11 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all duration-300 backdrop-blur-sm`}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                {t('signupPage.passwordLabel')}
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('signupPage.passwordPlaceholder')}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput(null)}
                  className={`w-full bg-slate-800/60 border-2 ${
                    focusedInput === "password"
                      ? "border-cyan-500"
                      : "border-slate-700"
                  } rounded-xl px-11 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all duration-300 backdrop-blur-sm pr-12`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                {t('signupPage.confirmPasswordLabel')}
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t('signupPage.confirmPasswordPlaceholder')}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  onFocus={() => setFocusedInput("confirmPassword")}
                  onBlur={() => setFocusedInput(null)}
                  className={`w-full bg-slate-800/60 border-2 ${
                    focusedInput === "confirmPassword"
                      ? "border-cyan-500"
                      : "border-slate-700"
                  } rounded-xl px-11 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all duration-300 backdrop-blur-sm pr-12`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors p-1"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSigningUp}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.01] disabled:scale-100 disabled:cursor-not-allowed shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:shadow-none flex items-center justify-center space-x-2 mt-6"
            >
              {isSigningUp ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('signupPage.creatingAccountButton')}</span>
                </>
              ) : (
                <>
                  <span>{t('signupPage.createAccountButton')}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <span className="text-slate-400">
              {t('signupPage.alreadyHaveAccountPrompt')}{" "}
              <a
                href="/login"
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                {t('signupPage.signInLink')}
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel - Three.js Scene */}
      <RightPanelSignup />
    </div>
  );
};

export default Signup;