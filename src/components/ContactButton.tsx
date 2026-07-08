import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

interface ContactButtonProps {
  onClick?: () => void;
  className?: string;
}

export const ContactButton: React.FC<ContactButtonProps> = ({ onClick, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = 'mailto:aditya@example.com';
      }
    }
  };

  const buttonStyle: React.CSSProperties = {
    background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
    boxShadow: isHovered 
      ? '0px 8px 25px rgba(181, 1, 167, 0.55), inset 0 2px 4px rgba(255,255,255,0.4)'
      : '0px 4px 15px rgba(181, 1, 167, 0.35), inset 0 2px 4px rgba(255,255,255,0.2)',
    outline: '1px solid rgba(255, 255, 255, 0.4)',
    outlineOffset: '-2px',
  };

  return (
    <motion.button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 350, damping: 18 }}
      style={buttonStyle}
      className={`static-contact-btn rounded-full flex items-center justify-center font-heading text-white font-medium cursor-pointer overflow-hidden select-none 
        w-[140px] sm:w-[170px] h-12 sm:h-14 px-4 sm:px-6 gap-2 ${isHovered ? 'animate-shimmer' : ''} ${className}`}
    >
      <motion.div 
        animate={{ rotate: isHovered ? [0, -15, 15, 0] : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="shrink-0"
      >
        <Mail size={16} />
      </motion.div>
      <span className="uppercase tracking-widest text-[10px] sm:text-xs font-semibold whitespace-nowrap">
        Contact Me
      </span>
    </motion.button>
  );
};

export default ContactButton;
