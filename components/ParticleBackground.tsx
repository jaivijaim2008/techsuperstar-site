"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Check prefers-reduced-motion and mobile
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || isMobile) {
      // Disable global particles on mobile to save battery and performance
      return;
    }

    const w = window.innerWidth;
    const h = window.innerHeight;

    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 100;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // limit pixel ratio
    containerRef.current.appendChild(renderer.domElement);

    // Particle field - reduced counts for performance
    const PARTICLE_COUNT = 200;
    
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesPos = new Float32Array(PARTICLE_COUNT * 3);
    const particlesColors = new Float32Array(PARTICLE_COUNT * 3);
    const particlesVelocities: {x: number, y: number}[] = [];
    
    const colorPalette = [
      new THREE.Color(0xff4d00),
      new THREE.Color(0xff6622),
      new THREE.Color(0xff3300),
      new THREE.Color(0x222222), // Add some dark particles for depth
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particlesPos[i * 3] = (Math.random() - 0.5) * 300; // x
      particlesPos[i * 3 + 1] = (Math.random() - 0.5) * 300; // y
      particlesPos[i * 3 + 2] = (Math.random() - 0.5) * 300; // z

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      particlesColors[i * 3] = c.r;
      particlesColors[i * 3 + 1] = c.g;
      particlesColors[i * 3 + 2] = c.b;

      particlesVelocities.push({
        y: (Math.random() * 0.05 + 0.01),
        x: (Math.random() - 0.5) * 0.02
      });
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPos, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particlesColors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    const handleResize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();
    
    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      // Frame rate limiting logic could go here if needed
      if (time - lastTime < 16) return; // Target ~60fps
      lastTime = time;

      const positions = particleSystem.geometry.attributes.position.array as Float32Array;
      
      for(let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i*3 + 1] += particlesVelocities[i].y; // y
        positions[i*3] += particlesVelocities[i].x; // x
        
        if (positions[i*3 + 1] > 150) {
          positions[i*3 + 1] = -150;
        }
        if (positions[i*3] > 150 || positions[i*3] < -150) {
          positions[i*3] = (Math.random() - 0.5) * 300;
        }
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;
      
      // Slow rotation
      particleSystem.rotation.y += 0.0002;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: -1, // Behind everything
        willChange: "transform",
        transform: "translateZ(0)",
      }} 
    />
  );
}
