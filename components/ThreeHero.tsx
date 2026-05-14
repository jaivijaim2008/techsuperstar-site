"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;

    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 150;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Particle field
    const isMobile = w < 640;
    const PARTICLE_COUNT = isMobile ? 300 : 800;
    
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesPos = new Float32Array(PARTICLE_COUNT * 3);
    const particlesColors = new Float32Array(PARTICLE_COUNT * 3);
    
    const colorPalette = [
      new THREE.Color(0xff4d00),
      new THREE.Color(0xff6622),
      new THREE.Color(0xff9933),
      new THREE.Color(0xffaa44),
      new THREE.Color(0xff3300),
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particlesPos[i * 3] = (Math.random() - 0.5) * 400; // x
      particlesPos[i * 3 + 1] = (Math.random() - 0.5) * 400; // y
      particlesPos[i * 3 + 2] = (Math.random() - 0.5) * 400; // z

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      particlesColors[i * 3] = c.r;
      particlesColors[i * 3 + 1] = c.g;
      particlesColors[i * 3 + 2] = c.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPos, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particlesColors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // Wireframe Geometries
    const shapes: { mesh: THREE.LineSegments, rx: number, ry: number, rz: number }[] = [];
    
    const addShape = (geometry: THREE.BufferGeometry, color: number, x: number, y: number, z: number, scale: number) => {
      const edges = new THREE.EdgesGeometry(geometry);
      const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.3 });
      const line = new THREE.LineSegments(edges, material);
      line.position.set(x, y, z);
      line.scale.set(scale, scale, scale);
      scene.add(line);
      shapes.push({
        mesh: line,
        rx: (Math.random() - 0.5) * 0.01,
        ry: (Math.random() - 0.5) * 0.01,
        rz: (Math.random() - 0.5) * 0.01,
      });
    };

    const SHAPE_COUNT = isMobile ? 5 : 12;
    for(let i = 0; i < SHAPE_COUNT; i++) {
      const type = Math.floor(Math.random() * 3);
      let geom: THREE.BufferGeometry;
      if (type === 0) geom = new THREE.IcosahedronGeometry(10);
      else if (type === 1) geom = new THREE.TorusKnotGeometry(8, 2, 64, 8);
      else geom = new THREE.OctahedronGeometry(10);
      
      const px = (Math.random() - 0.5) * 200;
      const py = (Math.random() - 0.5) * 150;
      const pz = (Math.random() - 0.5) * 100 - 50;
      const scale = Math.random() * 1.5 + 0.5;
      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)].getHex();
      
      addShape(geom, c, px, py, pz, scale);
    }

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2);
      mouseY = (e.clientY - window.innerHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      if (!containerRef.current) return;
      const nw = containerRef.current.clientWidth;
      const nh = containerRef.current.clientHeight;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    let time = 0;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        time += 0.005;
          
        // Camera tilt based on mouse
        camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.05 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
  
        // Rotate particle system slowly
        particleSystem.rotation.y += 0.001;
        particleSystem.rotation.x += 0.0005;
  
        // Float shapes
        shapes.forEach((s, i) => {
          s.mesh.rotation.x += s.rx;
          s.mesh.rotation.y += s.ry;
          s.mesh.rotation.z += s.rz;
          
          s.mesh.position.y += Math.sin(time * 2 + i) * 0.1;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Cleanup geometries and materials
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      shapes.forEach(s => {
        (s.mesh.geometry as THREE.BufferGeometry).dispose();
        (s.mesh.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.85
      }} 
    />
  );
}
