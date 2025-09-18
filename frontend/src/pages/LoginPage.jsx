import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import * as THREE from "three";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ThreeJSWaterScene = () => {
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

        // Create water-like geometry
        const geometry = new THREE.PlaneGeometry(20, 20, 128, 128);

        // Create flowing water material
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color(0x06b6d4) }, // cyan-500
                color2: { value: new THREE.Color(0x3b82f6) }, // blue-500
                color3: { value: new THREE.Color(0x1e40af) }, // blue-700
            },
            vertexShader: `
                uniform float time;
                varying vec2 vUv;
                varying float vElevation;
                
                void main() {
                    vUv = uv;
                    
                    vec3 pos = position;
                    
                    // Create flowing wave patterns
                    float wave1 = sin(pos.x * 0.5 + time * 2.0) * 0.8;
                    float wave2 = sin(pos.y * 0.3 + time * 1.5) * 0.6;
                    float wave3 = sin((pos.x + pos.y) * 0.2 + time * 1.0) * 1.0;
                    
                    pos.z = wave1 + wave2 + wave3;
                    vElevation = pos.z;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color1;
                uniform vec3 color2;
                uniform vec3 color3;
                varying vec2 vUv;
                varying float vElevation;
                
                void main() {
                    float mixStrength = (vElevation + 2.0) * 0.25;
                    
                    vec3 color = mix(color3, color1, mixStrength);
                    color = mix(color, color2, sin(time * 0.5 + vUv.x * 10.0) * 0.5 + 0.5);
                    
                    // Add flowing lines effect
                    float lines = sin(vUv.y * 20.0 + time * 3.0) * 0.1 + 0.9;
                    color *= lines;
                    
                    // Add transparency for depth
                    float alpha = 0.8 + sin(time + vUv.x * 5.0) * 0.1;
                    
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const water = new THREE.Mesh(geometry, material);
        water.rotation.x = -Math.PI * 0.3;
        scene.add(water);

        // Add floating particles
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 150;
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 30;
            positions[i + 1] = Math.random() * 15 - 5;
            positions[i + 2] = (Math.random() - 0.5) * 30;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0x06b6d4,
            size: 0.08,
            transparent: true,
            opacity: 0.7
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // Create geometric water drops
        const dropGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const dropMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x06b6d4, 
            transparent: true, 
            opacity: 0.8,
            shininess: 100
        });

        const drops = [];
        for (let i = 0; i < 20; i++) {
            const drop = new THREE.Mesh(dropGeometry, dropMaterial);
            drop.position.set(
                (Math.random() - 0.5) * 25,
                Math.random() * 10 + 5,
                (Math.random() - 0.5) * 25
            );
            drops.push(drop);
            scene.add(drop);
        }

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0x06b6d4, 1.0);
        directionalLight.position.set(10, 10, 5);
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0x3b82f6, 1.2, 50);
        pointLight.position.set(-10, 8, 10);
        scene.add(pointLight);

        camera.position.set(0, 12, 18);
        camera.lookAt(0, 0, 0);

        // Animation loop
        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);

            const time = Date.now() * 0.001;
            material.uniforms.time.value = time;

            // Rotate particles slowly
            particles.rotation.y = time * 0.05;
            particles.rotation.x = time * 0.02;
            
            // Animate water drops
            drops.forEach((drop, index) => {
                drop.position.y = 5 + Math.sin(time + index) * 3;
                drop.rotation.y = time + index;
            });
            
            // Subtle camera movement
            camera.position.x = Math.sin(time * 0.1) * 3;
            camera.position.z = 18 + Math.cos(time * 0.1) * 2;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            updateSize();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            particleGeometry.dispose();
            particleMaterial.dispose();
            dropGeometry.dispose();
            dropMaterial.dispose();
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} className="w-full h-full" />;
};

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
            navigate("/"); // Navigate on successful login
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
                {/* Subtle background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-700/50"></div>
                
                <div className="relative z-10 w-full max-w-md space-y-8">
                    {/* Logo Section */}
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

                    {/* Form */}
                    <div className="space-y-6">
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
                                    onChange={handleChange}
                                    onFocus={() => setFocusedInput('email')}
                                    onBlur={() => setFocusedInput(null)}
                                    className={`w-full bg-slate-800/60 border-2 ${focusedInput === 'email' ? 'border-cyan-500' : 'border-slate-700'} rounded-xl px-11 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all duration-300 backdrop-blur-sm`}
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

                        {/* Forgot Password */}
                        <div className="text-right">
                            <a href="#forgot" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                                Forgot your password?
                            </a>
                        </div>

                        {/* Submit Button */}
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

                    {/* Sign Up Link */}
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
            <div className="hidden lg:flex w-1/2 relative">
                {/* Three.js Water Animation */}
                <div className="absolute inset-0">
                    <ThreeJSWaterScene />
                </div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/20 flex items-center justify-center">
                    <div className="text-center px-12 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-4xl font-bold text-white leading-tight">
                                Empowering Water Intelligence
                            </h3>
                            <p className="text-xl text-slate-200 leading-relaxed">
                                Advanced analytics and AI-driven insights for sustainable water management across communities
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-6 pt-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-cyan-400">50K+</div>
                                <div className="text-sm text-slate-300">Liters Saved</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-cyan-400">100+</div>
                                <div className="text-sm text-slate-300">Communities</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-cyan-400">95%</div>
                                <div className="text-sm text-slate-300">Efficiency</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;