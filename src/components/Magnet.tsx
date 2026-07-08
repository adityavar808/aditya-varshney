import React, { useRef, useState, useEffect } from 'react';

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      // Trigger if mouse is within element radius + padding
      const maxTriggerDistance = Math.max(rect.width, rect.height) / 2 + padding;

      if (distance < maxTriggerDistance) {
        setIsNear(true);
        // Smoothly pull element towards mouse
        const targetX = distanceX / strength;
        const targetY = distanceY / strength;
        setTransform({ x: targetX, y: targetY });
      } else {
        setIsNear(false);
        setTransform({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setIsNear(false);
      setTransform({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [padding, strength]);

  const style: React.CSSProperties = {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0px)`,
    transition: isNear ? activeTransition : inactiveTransition,
    willChange: 'transform',
  };

  return (
    <div
      ref={containerRef}
      style={style}
      className={className}
    >
      {children}
    </div>
  );
};
export default Magnet;
