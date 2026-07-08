import React, { useRef, useState } from 'react';
import { Brain } from 'lucide-react';

// Tech cards with brand-specific styling and descriptions
const TECH_CARDS = [
  { 
    name: 'PyTorch', 
    tagline: 'Deep Learning & Neural Networks', 
    glow: 'rgba(238, 76, 44, 0.25)', 
    border: 'border-[#EE4C2C]/30',
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 animate-pytorch-breath" fill="#EE4C2C">
        <path d="M12.005.04l-7.03 7.03a9.832 9.832 0 0 0 0 13.975 9.833 9.833 0 0 0 13.976 0c3.97-3.887 3.972-10.171.084-13.976l-1.738 1.737c2.895 2.895 2.895 7.608 0 10.503-2.894 2.894-7.608 2.894-10.503 0C3.9 16.414 3.9 11.7 6.794 8.806l4.632-4.631.58-.663z"/>
      </svg>
    )
  },
  { 
    name: 'React', 
    tagline: 'Component-Driven Frontend Architectures', 
    glow: 'rgba(0, 216, 255, 0.25)', 
    border: 'border-[#00D8FF]/30',
    icon: (
      <svg viewBox="-10.5 -9.45 21 18.9" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 animate-react-spin">
        <circle cx="0" cy="0" r="2" fill="#00D8FF"/>
        <g stroke="#00D8FF" strokeWidth="1" fill="none">
          <ellipse rx="10" ry="4.5"/>
          <ellipse rx="10" ry="4.5" transform="rotate(60)"/>
          <ellipse rx="10" ry="4.5" transform="rotate(120)"/>
        </g>
      </svg>
    )
  },
  { 
    name: 'Python', 
    tagline: 'Backend Systems & Scientific Computing', 
    glow: 'rgba(55, 118, 171, 0.25)', 
    border: 'border-[#3776AB]/30',
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 animate-python-float" fill="#3776AB">
        <path d="M14.31.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.83l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.23l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05L0 11.97l.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.24l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05 1.07.13zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09-.33.22zM21.1 6.11l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01.21.03zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08-.33.23z"/>
      </svg>
    )
  },
  { 
    name: 'TensorFlow', 
    tagline: 'Scalable ML Models & Production Pipelines', 
    glow: 'rgba(255, 111, 0, 0.25)', 
    border: 'border-[#FF6F00]/30',
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 animate-tf-wobble" fill="#FF6F00">
        <path d="M19.6 12l.1 4.7-3.1-1.8v6.7L12.5 24V0l10.2 5.9v5.3l-6.1-3.6v2.7zM1.3 5.9L11.5 0v24l-4.1-2.4v-14l-6.1 3.6z"/>
      </svg>
    )
  },
  { 
    name: 'LLMs', 
    tagline: 'Generative AI & Prompt Engineering API', 
    glow: 'rgba(182, 0, 168, 0.25)', 
    border: 'border-[#B600A8]/30',
    icon: (
      <Brain className="w-6 h-6 text-[#B600A8] animate-brain-pulse" />
    )
  },
  { 
    name: 'FastAPI', 
    tagline: 'Asynchronous High-Performance API Systems', 
    glow: 'rgba(5, 150, 105, 0.25)', 
    border: 'border-[#059669]/30',
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 animate-fastapi-pulse">
        <circle cx="12" cy="12" r="10" fill="#009485"/>
        <path d="M13 6l-6 7h5v5l6-7h-5z" fill="white"/>
      </svg>
    )
  }
];

// Tech cards are duplicated in the render method for a seamless marquee loop

// Individual 3D Tilting Card Component
const TiltCard: React.FC<{ item: typeof TECH_CARDS[0] }> = ({ item }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate relative cursor coordinates on card (from center)
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Calculate rotation angles (max 15 degrees)
    const rX = -(mouseY / (height / 2)) * 14;
    const rY = (mouseX / (width / 2)) * 14;

    setRotate({ x: rX, y: rY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`flex-shrink-0 w-[240px] sm:w-[280px] h-[160px] sm:h-[180px] rounded-2xl border bg-[#0C0C0C]/40 backdrop-blur-xl p-5 flex flex-col justify-between text-left select-none relative transition-all duration-300 ${item.border}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.04 : 1})`,
        boxShadow: isHovered 
          ? `0 12px 36px rgba(0,0,0,0.6), 0 0 25px ${item.glow}` 
          : '0 8px 24px rgba(0, 0, 0, 0.4)',
        willChange: 'transform'
      }}
    >
      {/* Top row: Icon & Name */}
      <div className="flex items-center justify-between">
        <span className="text-xl sm:text-2xl flex items-center justify-center">{item.icon}</span>
        <span className="text-xs tracking-widest text-white/30 uppercase font-semibold font-heading">
          Stack Node
        </span>
      </div>

      {/* Title & Tagline */}
      <div className="mt-4">
        <h4 className="text-lg sm:text-xl font-bold font-heading text-white mb-1.5">
          {item.name}
        </h4>
        <p className="text-[10px] sm:text-xs text-[#D7E2EA]/60 font-light leading-relaxed font-sans">
          {item.tagline}
        </p>
      </div>

      {/* Accent Corner Line */}
      {isHovered && (
        <span 
          className="absolute bottom-3 right-3 w-3 h-3 border-r-2 border-b-2 rounded-br"
          style={{ borderColor: item.glow.replace('0.25', '0.6') }}
        />
      )}
    </div>
  );
};

export const MarqueeSection: React.FC = () => {
  return (
    <section className="bg-[#0C0C0C] w-full py-16 overflow-hidden flex flex-col justify-center items-center relative border-b border-white/5 font-heading select-none">
      
      {/* Header Info */}
      <div className="text-center z-10 pointer-events-none mb-10 px-4">
        <h3 className="text-xs uppercase tracking-widest text-[#D7E2EA]/40 font-semibold mb-1">
          Core Technical Capabilities
        </h3>
        <p className="text-xs sm:text-sm text-[#D7E2EA]/50 font-light max-w-md leading-relaxed font-sans">
          Hover over nodes to explore tech details and experience tactile 3D card tilt physics.
        </p>
      </div>

      {/* Infinite Horizontal Marquee Container */}
      <div className="w-full flex overflow-x-hidden relative py-4 z-0 group">
        {/* Left Fading Edge Mask */}
        <div className="absolute top-0 left-0 h-full w-[8%] md:w-[15%] bg-gradient-to-r from-[#0C0C0C] to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling Cards Row 1 */}
        <div className="flex gap-6 pr-6 animate-marquee shrink-0 group-hover:[animation-play-state:paused]">
          {TECH_CARDS.map((item, index) => (
            <TiltCard key={`${item.name}-1-${index}`} item={item} />
          ))}
        </div>

        {/* Scrolling Cards Row 2 */}
        <div className="flex gap-6 pr-6 animate-marquee shrink-0 group-hover:[animation-play-state:paused]" aria-hidden="true">
          {TECH_CARDS.map((item, index) => (
            <TiltCard key={`${item.name}-2-${index}`} item={item} />
          ))}
        </div>

        {/* Right Fading Edge Mask */}
        <div className="absolute top-0 right-0 h-full w-[8%] md:w-[15%] bg-gradient-to-l from-[#0C0C0C] to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
};


export default MarqueeSection;
