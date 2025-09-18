import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import * as THREE from "three";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const ThreeJSRainScene = () => {
  const mountRef = useRef();
  const sceneRef = useRef();
  const animationIdRef = useRef();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    const container = mountRef.current;
    const updateSize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    updateSize();
    container.appendChild(renderer.domElement);

    // Create rain drops
    const rainGeometry = new THREE.BufferGeometry();
    const rainCount = 800;
    const positions = new Float32Array(rainCount * 3);
    const velocities = new Float32Array(rainCount * 3);

    for (let i = 0; i < rainCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = Math.random() * 50 + 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

      velocities[i * 3] = 0;
      velocities[i * 3 + 1] = -Math.random() * 0.3 - 0.1;
      velocities[i * 3 + 2] = 0;
    }

    rainGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const rainMaterial = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: 0.1,
      transparent: true,
      opacity: 0.8,
    });

    const rain = new THREE.Points(rainGeometry, rainMaterial);
    scene.add(rain);

    // Create collection surface with ripple effect
    const surfaceGeometry = new THREE.PlaneGeometry(25, 25, 64, 64);
    const surfaceMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x1e40af) },
      },
      vertexShader: `
                uniform float time;
                varying vec2 vUv;
                varying float vElevation;
                
                void main() {
                    vUv = uv;
                    vec3 pos = position;
                    
                    // Create ripple effects
                    float dist = length(pos.xy);
                    pos.z = sin(dist * 2.0 - time * 3.0) * 0.3 * exp(-dist * 0.1);
                    pos.z += sin(dist * 4.0 - time * 2.0) * 0.1 * exp(-dist * 0.2);
                    
                    vElevation = pos.z;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
      fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                varying float vElevation;
                
                void main() {
                    vec3 finalColor = color + vElevation * 0.5;
                    float alpha = 0.7 + vElevation * 0.3;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
    surface.rotation.x = -Math.PI / 2;
    surface.position.y = -5;
    scene.add(surface);

    // Create water collection tanks
    const tankGeometry = new THREE.CylinderGeometry(1, 1.2, 3, 8);
    const tankMaterial = new THREE.MeshPhongMaterial({
      color: 0x334155,
      transparent: true,
      opacity: 0.8,
    });

    const tanks = [];
    for (let i = 0; i < 3; i++) {
      const tank = new THREE.Mesh(tankGeometry, tankMaterial);
      tank.position.set((i - 1) * 8, -2, -12);
      tanks.push(tank);
      scene.add(tank);
    }

    // Add floating water molecules
    const moleculeGeometry = new THREE.SphereGeometry(0.05, 6, 6);
    const moleculeMaterial = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.6,
    });

    const molecules = [];
    for (let i = 0; i < 50; i++) {
      const molecule = new THREE.Mesh(moleculeGeometry, moleculeMaterial);
      molecule.position.set(
        (Math.random() - 0.5) * 20,
        Math.random() * 15,
        (Math.random() - 0.5) * 20
      );
      molecules.push(molecule);
      scene.add(molecule);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x06b6d4, 0.8);
    directionalLight.position.set(5, 15, 5);
    scene.add(directionalLight);

    const spotLight = new THREE.SpotLight(0x3b82f6, 1);
    spotLight.position.set(0, 20, 10);
    spotLight.target.position.set(0, 0, 0);
    scene.add(spotLight);
    scene.add(spotLight.target);

    camera.position.set(8, 12, 15);
    camera.lookAt(0, 0, 0);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Update rain
      const positions = rainGeometry.attributes.position.array;
      for (let i = 0; i < rainCount; i++) {
        positions[i * 3 + 1] -= 0.3;

        if (positions[i * 3 + 1] < -5) {
          positions[i * 3 + 1] = 15 + Math.random() * 20;
          positions[i * 3] = (Math.random() - 0.5) * 50;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
        }
      }
      rainGeometry.attributes.position.needsUpdate = true;

      // Update surface ripples
      surfaceMaterial.uniforms.time.value = time;

      // Animate molecules
      molecules.forEach((molecule, index) => {
        molecule.position.y += Math.sin(time + index) * 0.01;
        molecule.rotation.x = time + index;
        molecule.rotation.y = time * 0.5 + index;
      });

      // Gentle camera movement
      camera.position.x = 8 + Math.sin(time * 0.1) * 2;
      camera.position.z = 15 + Math.cos(time * 0.1) * 2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      updateSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      rainGeometry.dispose();
      rainMaterial.dispose();
      surfaceGeometry.dispose();
      surfaceMaterial.dispose();
      tankGeometry.dispose();
      tankMaterial.dispose();
      moleculeGeometry.dispose();
      moleculeMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};

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
  const [focusedInput, setFocusedInput] = useState(null);
  const Navigate = useNavigate();

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      alert("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      alert("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Invalid email format");
      return false;
    }
    if (!formData.password) {
      alert("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
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
    <div className="min-h-screen flex bg-slate-950">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-8 relative">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-700/50"></div>

        <div className="relative z-10 w-full max-w-md space-y-6">
          {/* Logo Section */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <span className="text-white font-bold text-xl">J</span>
              </div>
              <h1 className="text-2xl font-bold text-white">JalSetu</h1>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">
                Create your account
              </h2>
              <p className="text-slate-400 text-base">
                Join the mission for sustainable water management
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Full Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
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
                Email address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
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
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
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
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
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
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <span className="text-slate-400">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Sign in
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel - Three.js Scene */}
      <div className="hidden lg:flex w-1/2 relative">
        {/* Three.js Rain Animation */}
        <div className="absolute inset-0">
          <ThreeJSRainScene />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/20 flex items-center justify-center">
          <div className="text-center px-12 space-y-6">
            <div className="space-y-4">
              <h3 className="text-4xl font-bold text-white leading-tight">
                Every Drop Counts
              </h3>
              <p className="text-xl text-slate-200 leading-relaxed">
                Join thousands of communities already making a difference
                through intelligent water harvesting
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">24/7</div>
                <div className="text-sm text-slate-300">Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">AI</div>
                <div className="text-sm text-slate-300">Predictions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
