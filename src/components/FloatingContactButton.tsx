import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail } from 'lucide-react';

export const FloatingContactButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleScroll = () => {
      const isPastThreshold = window.scrollY > 150;

      const staticButtons = document.querySelectorAll('.static-contact-btn');
      let anyStaticInView = false;
      
      staticButtons.forEach((btn) => {
        const rect = btn.getBoundingClientRect();
        const isInViewport = (
          rect.top < window.innerHeight &&
          rect.bottom > 0 &&
          rect.left < window.innerWidth &&
          rect.right > 0
        );
        if (isInViewport) {
          anyStaticInView = true;
        }
      });

      setIsVisible(isPastThreshold && !anyStaticInView);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = 'mailto:adityavarshney808@gmail.com';
    }
  };

  const unfoldedWidth = isMobile ? 140 : 170;
  const unfoldedHeight = isMobile ? 48 : 56;
  const unfoldedRadius = isMobile ? "24px" : "28px";

  const buttonStyle: React.CSSProperties = {
    background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
    boxShadow: isHovered 
      ? '0 8px 32px rgba(181, 1, 167, 0.55), inset 0 2px 4px rgba(255,255,255,0.4)'
      : '0 8px 24px rgba(181, 1, 167, 0.35), inset 0 2px 4px rgba(255,255,255,0.2)',
    outline: '1px solid rgba(255, 255, 255, 0.4)',
    outlineOffset: '-2px',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            width: unfoldedWidth,
            height: unfoldedHeight,
            borderRadius: unfoldedRadius,
          }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 240,
            damping: 24
          }}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={buttonStyle}
          className={`fixed bottom-6 right-6 z-50 flex items-center justify-center font-heading text-white font-medium cursor-pointer overflow-hidden select-none gap-2 px-4 sm:px-6 ${isHovered ? 'animate-shimmer' : ''}`}
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
      )}
    </AnimatePresence>
  );
};

export default FloatingContactButton;
