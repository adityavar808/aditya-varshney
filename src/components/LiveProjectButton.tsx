import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface LiveProjectButtonProps {
  url?: string;
  onClick?: () => void;
  className?: string;
}

export const LiveProjectButton: React.FC<LiveProjectButtonProps> = ({
  url,
  onClick,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.03, 
        borderColor: "#FFFFFF",
        boxShadow: "0 0 15px rgba(215, 226, 234, 0.25)"
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] hover:text-white font-medium uppercase tracking-widest
        h-12 sm:h-14 px-6 sm:px-8 text-xs sm:text-sm flex items-center justify-center gap-1.5
        cursor-pointer overflow-hidden relative select-none ${className}`}
    >
      <span className="relative z-10">Live Project</span>
      <motion.div
        animate={{ 
          x: isHovered ? 0 : -8, 
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 0.7 : 1
        }}
        transition={{ type: "spring", stiffness: 350, damping: 18 }}
        className="relative z-10 shrink-0"
      >
        <ArrowUpRight size={16} />
      </motion.div>
    </motion.button>
  );
};

export default LiveProjectButton;
