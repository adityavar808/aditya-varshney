import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Cpu, Server, Layout, Cloud, Palette } from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  bg: string;
  borderColor: string;
  glowColor: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  dotBg: string;
}

interface ServiceCardProps {
  card: ServiceItem;
  index: number;
  scrollYProgress: any;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ card, index, scrollYProgress }) => {
  // Synchronized scrollytelling transition milestones:
  // Card 0: 0.10 -> 0.35 (Starts just as the Title morphs)
  // Card 1: 0.22 -> 0.47
  // Card 2: 0.34 -> 0.59
  // Card 3: 0.46 -> 0.71
  // Card 4: 0.58 -> 0.83
  // Runway completes at 1.00, providing a 17% settling buffer for the spring physics.
  const points = [0.00, 0.10, 0.35, 0.47, 0.59, 0.71, 0.83, 1.00];
  
  const slideStart = 0.10 + index * 0.12;
  const slideEnd = 0.35 + index * 0.12;

  // Responsive state for vertical offsets and height
  const [topOffset, setTopOffset] = useState(50);
  const [step, setStep] = useState(32);
  const [stackStep, setStackStep] = useState(-23);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setTopOffset(20);
        setStep(16);
        setStackStep(-12);
      } else if (w < 768) {
        setTopOffset(30);
        setStep(22);
        setStackStep(-18);
      } else {
        setTopOffset(50);
        setStep(32);
        setStackStep(-23);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Slide-in vertical translation (relative to the viewport)
  const yVal = useTransform(
    scrollYProgress,
    [0, slideStart, slideEnd, 1],
    ["100vh", "100vh", "0vh", "0vh"]
  );

  // Fade in during slide-in
  const slideOpacity = useTransform(
    scrollYProgress,
    [0, slideStart, slideStart + 0.04, 1],
    [0, 0, 1, 1]
  );

  // Stacking depth keyframes: scale and translation offset
  const scaleKeyframes: number[] = [];
  const offsetKeyframes: number[] = [];
  const fadeKeyframes: number[] = [];
  
  points.forEach((_, j) => {
    // Card is sliding in or resting at points[j] if j <= index + 2
    if (j <= index + 2) {
      scaleKeyframes.push(1);
      offsetKeyframes.push(0);
      fadeKeyframes.push(1);
    } else {
      const depth = j - (index + 2);
      scaleKeyframes.push(1 - depth * 0.035);
      offsetKeyframes.push(depth * stackStep); // Responsive stack folder-tab offset
      fadeKeyframes.push(1); // Maintain 1.0 opacity, do not dim
    }
  });

  const scale = useTransform(scrollYProgress, points, scaleKeyframes);
  const stackY = useTransform(scrollYProgress, points, offsetKeyframes);
  const stackOpacity = useTransform(scrollYProgress, points, fadeKeyframes);

  // Combine slide-in translation and stack offset safely
  const y = useTransform(
    [yVal, stackY] as any,
    (latest: any[]) => {
      const valY = latest[0];
      const valStack = (latest[1] as number) || 0;
      if (typeof valY === 'string' && valY.includes('vh')) {
        return `calc(${valY} + ${valStack}px)`;
      }
      const parsedY = typeof valY === 'number' ? valY : parseFloat(valY) || 0;
      return `${parsedY + valStack}px`;
    }
  );

  // Combine slide opacity and stacking fade
  const opacity = useTransform(
    [slideOpacity, stackOpacity],
    (latest: number[]) => latest[0] * latest[1]
  );

  const IconComponent = card.icon;

  return (
    <motion.div
      style={{
        y,
        scale,
        opacity,
        top: `calc(${topOffset}px + ${step * index}px)`,
        zIndex: index + 10,
        willChange: "transform, opacity",
        border: `1px solid ${card.borderColor}`,
        boxShadow: `0 20px 45px ${card.glowColor}, 0 4px 12px rgba(0,0,0,0.02)`,
      } as any}
      className="absolute left-0 right-0 mx-auto w-full h-[280px] sm:h-[330px] md:h-[370px] bg-white/85 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] md:rounded-[40px] overflow-hidden group"
    >
      {/* Background patterns and glowing bulbs */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-black/5 opacity-40" />
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full filter blur-[80px] opacity-15 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none" style={{ backgroundColor: card.borderColor }} />

      {/* Main content grid */}
      <div className="flex h-full relative z-10 w-full p-6 sm:p-10 md:p-12 text-left gap-6 sm:gap-8 items-stretch">
        
        {/* Left vertical color-themed anchor bar */}
        <div 
          className="w-[4px] rounded-full self-stretch shrink-0 opacity-70 group-hover:opacity-100 group-hover:scale-y-[1.02] transition-all duration-300 origin-center" 
          style={{ backgroundColor: card.borderColor }}
        />
        
        {/* Content detail container */}
        <div className="flex flex-col justify-center flex-grow pr-10 sm:pr-16 md:pr-24 relative">
          
          {/* Visible large number in background */}
          <div 
            style={{ color: card.borderColor }}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-[100px] sm:text-[180px] md:text-[240px] font-heading font-black opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 select-none pointer-events-none leading-none origin-center"
          >
            {card.id}
          </div>

          <div className="relative z-10 flex flex-col justify-center">
            {/* Themed Glassmorphic Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/45 backdrop-blur-md border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-[#0C0C0C] font-bold text-[11px] sm:text-xs mb-4 sm:mb-6 w-fit font-heading group-hover:border-black/[0.12] transition-colors duration-300">
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${card.dotBg}`} />
              <IconComponent className={`w-3.5 h-3.5 ${card.iconColor} group-hover:rotate-12 transition-transform duration-300`} />
              {card.name}
            </div>

            {/* Split Title */}
            <h3 className="text-xl sm:text-4xl md:text-5xl font-heading font-black text-[#0C0C0C] mb-2 sm:mb-4 tracking-tighter leading-[1.1] uppercase">
              {card.name.split(' ')[0]}. <br />
              <span className="text-black/25 group-hover:text-black/35 transition-colors duration-300">{card.subtitle}</span>
            </h3>

            {/* Description */}
            <p className="text-[#0C0C0C]/60 text-xs sm:text-sm md:text-base leading-relaxed font-normal max-w-lg">
              {card.description}
            </p>
          </div>

        </div>

      </div>
    </motion.div>
  );
};

export const ServicesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic layout offset configuration for responsive layout morphing
  const [offsets, setOffsets] = useState({ x: 0, y: 0, scale: 0.22 });

  useEffect(() => {
    const calculateOffsets = () => {
      if (!textRef.current || !containerRef.current) return;
      const width = window.innerWidth;
      
      const textW = textRef.current.offsetWidth;
      const textH = textRef.current.offsetHeight;
      
      const parentW = containerRef.current.offsetWidth;
      const parentH = containerRef.current.offsetHeight;
      
      // Target paddings inside the sticky container
      const paddingLeft = width >= 768 ? 48 : (width >= 640 ? 32 : 24);
      const paddingTop = width >= 768 ? 32 : (width >= 640 ? 28 : 24);
      
      const parentTopOffset = containerRef.current.offsetTop;

      // Centered layout coordinates math
      const targetX = paddingLeft - (parentW / 2) + (textW / 2);
      const targetY = (paddingTop - parentTopOffset) - (parentH - textH) / 2;
      
      const scaleFactor = width >= 768 ? 0.22 : (width >= 640 ? 0.28 : 0.36);

      setOffsets({ x: targetX, y: targetY, scale: scaleFactor });
    };

    // Calculate layout parameters a frame after mount to ensure offsetWidth is populated
    const timer = setTimeout(calculateOffsets, 50);
    
    window.addEventListener('resize', calculateOffsets);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateOffsets);
    };
  }, []);

  // Track progress of the entire scroll runway
  const { scrollYProgress: rawScrollProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Create a spring-damped version of scrollYProgress to make it smooth like water
  const scrollYProgress = useSpring(rawScrollProgress, {
    stiffness: 120,   // snappier stiffness for highly responsive tracking
    damping: 26,      // well-balanced damping to prevent excessive bouncing
    mass: 0.3,        // lower mass to let it react quickly
    restDelta: 0.001
  });

  // Morph the SERVICES title: remains centered 0% to 2%, morphs to corner 2% to 40%, locked 40% to 100%
  const titleX = useTransform(scrollYProgress, [0, 0.02, 0.40, 1], [0, 0, offsets.x, offsets.x]);
  const titleY = useTransform(scrollYProgress, [0, 0.02, 0.40, 1], [0, 0, offsets.y, offsets.y]);
  const titleScale = useTransform(scrollYProgress, [0, 0.02, 0.40, 1], [1, 1, offsets.scale, offsets.scale]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.02, 0.40, 1], [1.0, 1.0, 1.0, 1.0]);

  // Fade out bottom scroll indicator as scroll starts (completely gone by 0.08 progress)
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [0.3, 0]);

  const [services, setServices] = useState<ServiceItem[]>([
    {
      id: "01",
      name: "AI/ML Development",
      subtitle: "Intelligence.",
      description:
        "Building and deploying custom machine learning models, neural networks, and AI-driven solutions tailored to complex business needs, utilizing PyTorch, TensorFlow, and LLM APIs.",
      bg: "bg-[#F8F9FA]/98",
      borderColor: "rgba(238, 76, 44, 0.15)",
      glowColor: "rgba(238, 76, 44, 0.08)",
      icon: Cpu,
      iconColor: "text-[#EE4C2C]",
      dotBg: "bg-[#EE4C2C]"
    },
    {
      id: "02",
      name: "Fullstack Web Dev",
      subtitle: "Scalability.",
      description:
        "Developing robust, scalable web applications with polished responsive frontend interfaces and secure backend systems powered by React, Node.js, and modern databases.",
      bg: "bg-[#F8F9FA]/98",
      borderColor: "rgba(0, 216, 255, 0.15)",
      glowColor: "rgba(0, 216, 255, 0.08)",
      icon: Server,
      iconColor: "text-[#00D8FF]",
      dotBg: "bg-[#00D8FF]"
    },
    {
      id: "03",
      name: "UI/UX Design",
      subtitle: "Seamlessness.",
      description:
        "Designing modern, highly interactive, and user-centric interfaces with attention to layout, typography, and micro-interactions for seamless web applications.",
      bg: "bg-[#F8F9FA]/98",
      borderColor: "rgba(182, 0, 168, 0.15)",
      glowColor: "rgba(182, 0, 168, 0.08)",
      icon: Layout,
      iconColor: "text-[#B600A8]",
      dotBg: "bg-[#B600A8]"
    },
    {
      id: "04",
      name: "Cloud & DevOps",
      subtitle: "Automation.",
      description:
        "Deploying and managing scalable cloud architectures with automated CI/CD pipelines, containerization (Docker, Kubernetes), and optimized cloud services.",
      bg: "bg-[#F8F9FA]/98",
      borderColor: "rgba(255, 111, 0, 0.15)",
      glowColor: "rgba(255, 111, 0, 0.08)",
      icon: Cloud,
      iconColor: "text-[#FF6F00]",
      dotBg: "bg-[#FF6F00]"
    },
    {
      id: "05",
      name: "Creative Coding",
      subtitle: "Interaction.",
      description:
        "Integrating interactive 3D graphics, rich animations, and storytelling motion design using WebGL, Three.js, and Framer Motion into high-performance web products.",
      bg: "bg-[#F8F9FA]/98",
      borderColor: "rgba(5, 150, 105, 0.15)",
      glowColor: "rgba(5, 150, 105, 0.08)",
      icon: Palette,
      iconColor: "text-[#059669]",
      dotBg: "bg-[#059669]"
    }
  ]);

  useEffect(() => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      Cpu,
      Server,
      Layout,
      Cloud,
      Palette
    };

    const getGlowAndBorder = (iconName: string) => {
      if (iconName === 'Cpu') {
        return { border: "rgba(238, 76, 44, 0.15)", glow: "rgba(238, 76, 44, 0.08)" };
      }
      if (iconName === 'Server') {
        return { border: "rgba(0, 216, 255, 0.15)", glow: "rgba(0, 216, 255, 0.08)" };
      }
      if (iconName === 'Layout') {
        return { border: "rgba(182, 0, 168, 0.15)", glow: "rgba(182, 0, 168, 0.08)" };
      }
      if (iconName === 'Cloud') {
        return { border: "rgba(255, 111, 0, 0.15)", glow: "rgba(255, 111, 0, 0.08)" };
      }
      if (iconName === 'Palette') {
        return { border: "rgba(5, 150, 105, 0.15)", glow: "rgba(5, 150, 105, 0.08)" };
      }
      return { border: "rgba(182, 0, 168, 0.15)", glow: "rgba(182, 0, 168, 0.08)" };
    };

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/services`)
      .then(res => res.json())
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(item => {
            const colors = getGlowAndBorder(item.iconName);
            return {
              id: item.serviceId,
              name: item.name,
              subtitle: item.subtitle,
              description: item.description,
              bg: "bg-[#F8F9FA]/98",
              borderColor: colors.border,
              glowColor: colors.glow,
              icon: iconMap[item.iconName] || Cpu,
              iconColor: item.iconColor,
              dotBg: item.dotBg
            };
          });
          setServices(formatted);
        }
      })
      .catch(err => console.log('Services API fallback:', err));
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="bg-[#0C0C0C] relative z-20 overflow-visible"
      style={{ height: `${(services.length * 0.7 + 1.0) * 100}vh` }}
    >
      {/* Outer shadow wrapper that is sticky and overflow-visible */}
      <div
        style={{
          boxShadow: "30px 20px 70px -10px rgba(182, 0, 168, 0.45), 15px 10px 30px -5px rgba(139, 92, 246, 0.35)"
        }}
        className="sticky top-0 h-screen w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] overflow-visible"
      >
        {/* Sticky container pinned below floating navbar */}
        <div
          className="h-full w-full bg-[#F5F5F7] text-[#0C0C0C] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] overflow-hidden flex flex-col pt-16 sm:pt-24 md:pt-28 pb-8 px-4 sm:px-8 relative"
        >
          {/* Centered container that takes up 100% of remaining vertical space */}
          <div ref={containerRef} className="flex-grow w-full relative flex items-center justify-center overflow-visible mt-2 sm:mt-4">
            
            {/* Dynamic morphing SERVICES header block */}
            {/* z-index is set to constant 30 to always float above cards */}
            <motion.h2
              ref={textRef}
              style={{
                x: titleX,
                y: titleY,
                scale: titleScale,
                opacity: titleOpacity,
                zIndex: 30,
                transformOrigin: "left top",
                willChange: "transform, opacity",
              } as any}
              className="absolute font-heading font-black uppercase text-[#0C0C0C] tracking-tight leading-none text-6xl sm:text-8xl md:text-[130px] whitespace-nowrap select-none pointer-events-none"
            >
              Services
            </motion.h2>

            {/* Cards area - absolute stacked layout container centered in the middle of the screen */}
            <div className="w-full h-full relative overflow-visible flex items-center justify-center pointer-events-none">
              <div className="w-full max-w-[340px] sm:max-w-[550px] md:max-w-[700px] lg:max-w-4xl xl:max-w-5xl h-[380px] sm:h-[460px] md:h-[570px] relative pointer-events-auto">
                {services.map((service, index) => (
                  <ServiceCard
                    key={service.id}
                    card={service}
                    index={index}
                    scrollYProgress={scrollYProgress}
                  />
                ))}
              </div>
            </div>
            
          </div>

          {/* Bottom indicator block */}
          <div className="flex-shrink-0 pb-4 flex justify-center w-full">
            <motion.div
              style={{ opacity: indicatorOpacity }}
              className="flex flex-col items-center gap-2 select-none"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-[10px] font-heading font-semibold uppercase tracking-[0.2em] text-[#0C0C0C]">
                Scroll
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#0C0C0C]">
                <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
