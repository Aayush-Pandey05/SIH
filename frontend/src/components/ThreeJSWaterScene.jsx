import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const ThreeJSWaterScene = () => {
  const mountRef = useRef();
  const sceneRef = useRef();
  const animationIdRef = useRef();

  useEffect(() => {
    if (!mountRef.current) return;

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

    const geometry = new THREE.PlaneGeometry(20, 20, 128, 128);

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
      side: THREE.DoubleSide,
    });

    const water = new THREE.Mesh(geometry, material);
    water.rotation.x = -Math.PI * 0.3;
    scene.add(water);

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 150;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30;
      positions[i + 1] = Math.random() * 15 - 5;
      positions[i + 2] = (Math.random() - 0.5) * 30;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: 0.08,
      transparent: true,
      opacity: 0.7,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const dropGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const dropMaterial = new THREE.MeshPhongMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.8,
      shininess: 100,
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

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;
      material.uniforms.time.value = time;

      particles.rotation.y = time * 0.05;
      particles.rotation.x = time * 0.02;

      drops.forEach((drop, index) => {
        drop.position.y = 5 + Math.sin(time + index) * 3;
        drop.rotation.y = time + index;
      });

      camera.position.x = Math.sin(time * 0.1) * 3;
      camera.position.z = 18 + Math.cos(time * 0.1) * 2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

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

export default ThreeJSWaterScene;
