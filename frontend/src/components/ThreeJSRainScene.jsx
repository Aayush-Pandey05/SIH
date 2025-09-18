import React, { useRef, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import * as THREE from "three";
const ThreeJSRainScene = () => {
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

      surfaceMaterial.uniforms.time.value = time;

      molecules.forEach((molecule, index) => {
        molecule.position.y += Math.sin(time + index) * 0.01;
        molecule.rotation.x = time + index;
        molecule.rotation.y = time * 0.5 + index;
      });

      camera.position.x = 8 + Math.sin(time * 0.1) * 2;
      camera.position.z = 15 + Math.cos(time * 0.1) * 2;
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

export default ThreeJSRainScene;
