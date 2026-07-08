import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = "", style }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  
  // Track scroll position relative to the paragraph element
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  // Split text into characters
  const characters = text.split('');
  const totalChars = characters.length;

  return (
    <p ref={containerRef} style={style} className={`${className} inline relative`}>
      {characters.map((char, index) => {
        // Calculate scroll progress start/end bounds for each character
        // Spreading characters evenly across 0 to 1 with overlap for smoothness
        const step = 1 / totalChars;
        const start = index * step;
        const end = Math.min(1, start + (step * 5)); // Overlap characters to create a fading gradient trail

        return (
          <Character
            key={index}
            char={char}
            progress={scrollYProgress}
            range={[start, end]}
          />
        );
      })}
    </p>
  );
};

interface CharacterProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const Character: React.FC<CharacterProps> = ({ char, progress, range }) => {
  // Transform scroll progress mapping for opacity
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className="relative inline-block whitespace-pre">
      {/* Invisible placeholder for spacing */}
      <span className="opacity-0">{char === ' ' ? '\u00A0' : char}</span>
      {/* Animated absolute character */}
      <motion.span
        style={{ opacity }}
        className="absolute left-0 top-0 select-none pointer-events-none"
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  );
};

export default AnimatedText;
