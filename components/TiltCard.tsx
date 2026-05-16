"use client";
import React, { useRef, useState, useEffect } from 'react';

export default function TiltCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    
    setRotation({ x: rotateX, y: rotateY });
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
  };

  const handleMouseEnter = () => !isMobile && setIsHovered(true);
  const handleMouseLeave = () => {
    if (isMobile) return;
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const skipEffects = isMobile || prefersReducedMotion;

  if (skipEffects) {
    return <div className={className} style={{ width: '100%', height: '100%' }}>{children}</div>;
  }

  return (
    <div
      className={className}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        width: '100%',
        height: '100%',
      }}
    >
      {/* Visual transform layer - no interaction */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
          transform: `translateZ(0) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          pointerEvents: 'none',
          zIndex: 0,
          borderRadius: 'inherit',
        }}
      >
        {/* Glare effect */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease-out',
            pointerEvents: 'none',
            borderRadius: 'inherit',
            mixBlendMode: 'overlay',
            willChange: 'opacity',
          }}
        />
      </div>

      {/* Content layer - fully interactive */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 1,
          pointerEvents: 'auto',
        }}
      >
        {children}
      </div>
    </div>
  );
}