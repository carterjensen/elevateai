'use client';

import { useEffect, useState } from 'react';

export default function MouseCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.tagName === 'A' || 
                           target.tagName === 'BUTTON' || 
                           !!target.closest('a') || 
                           !!target.closest('button') ||
                           target.classList.contains('cursor-interactive');
      setIsHovering(isInteractive);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Custom cursor dot */}
      <div
        className={`cursor-dot transition-all duration-150 ${
          isHovering ? 'scale-150 bg-blue-500' : 'scale-100'
        }`}
        style={{
          left: mousePosition.x - 4,
          top: mousePosition.y - 4,
        }}
      />
      
      {/* Custom cursor ring */}
      <div
        className={`cursor-ring transition-all duration-300 ${
          isHovering 
            ? 'scale-150 border-blue-500 border-4' 
            : 'scale-100 border-blue-600 border-2'
        }`}
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
        }}
      />
    </>
  );
}