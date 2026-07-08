import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ServiceItem {
  id: string;
  name: string;
  description: string;
}

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
  scrollYProgress: any;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, scrollYProgress }) => {
  // Stacking sequence thresholds (6 scroll segments for 5 cards)
  const points = [0, 0.15, 0.32, 0.49, 0.66, 0.83, 1.0];
  
  const slideStart = points[index];
  const slideEnd = points[index + 1];

  // Slide-in vertical translation (numeric in pixels) - unconditional hook call
  const yVal = useTransform(
    scrollYProgress,
    index === 0 ? [0, 1] : [0, slideStart, slideEnd, 1],
    index === 0 ? [0, 0] : [800, 800, 0, 0] // slides up from 800px below
  );

  // Scale and stacking offset keyframes
  const scaleKeyframes: number[] = [];
  const offsetKeyframes: number[] = [];
  
  points.forEach((_, j) => {
    if (j <= index) {
      scaleKeyframes.push(1);
      offsetKeyframes.push(0);
    } else {
      const depth = j - index;
      scaleKeyframes.push(1 - depth * 0.035);
      offsetKeyframes.push(depth * -16); // offset up slightly for stacked effect
    }
  });

  const scale = useTransform(scrollYProgress, points, scaleKeyframes);
  const stackY = useTransform(scrollYProgress, points, offsetKeyframes);
  
  // Combine slide-up and stack offset values
  const y = useTransform(
    [yVal, stackY], 
    (latest: any[]) => (latest[0] as number) + (latest[1] as number)
  );

  const cardColors = [
    'border-[#EE4C2C]/20 shadow-[0_15px_40px_rgba(238,76,44,0.04)]',
    'border-[#00D8FF]/20 shadow-[0_15px_40px_rgba(0,216,255,0.04)]',
    'border-[#3776AB]/20 shadow-[0_15px_40px_rgba(55,118,171,0.04)]',
    'border-[#FF6F00]/20 shadow-[0_15px_40px_rgba(255,111,0,0.04)]',
    'border-[#059669]/20 shadow-[0_15px_40px_rgba(5,150,105,0.04)]'
  ];

  return (
    <motion.div
      style={{ y, scale, zIndex: index } as any}
      className={`absolute w-full max-w-2xl bg-[#F8F9FA]/95 backdrop-blur-md border rounded-[24px] sm:rounded-[36px] p-6 sm:p-8 md:p-10 flex flex-col justify-between min-h-[220px] sm:min-h-[260px] md:min-h-[280px] ${cardColors[index % cardColors.length]}`}
    >
      {/* Top: Name & ID */}
      <div className="flex justify-between items-start gap-4 mb-4">
        <h3 className="font-heading font-black text-lg sm:text-2xl md:text-3xl text-[#0C0C0C] uppercase tracking-wide leading-tight">
          {service.name}
        </h3>
        <span className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-black/10 select-none leading-none">
          {service.id}
        </span>
      </div>

      {/* Bottom: Description */}
      <p className="font-sans font-light text-xs sm:text-sm md:text-base leading-relaxed text-[#0C0C0C]/75">
        {service.description}
      </p>
    </motion.div>
  );
};

export const ServicesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of the entire section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const services: ServiceItem[] = [
    {
      id: "01",
      name: "AI/ML Development",
      description: "Building and deploying custom machine learning models, neural networks, and AI-driven solutions tailored to complex business needs, utilizing PyTorch, TensorFlow, and LLM APIs."
    },
    {
      id: "02",
      name: "Fullstack Web Dev",
      description: "Developing robust, scalable web applications with polished responsive frontend interfaces and secure backend systems powered by React, Node.js, and modern databases."
    },
    {
      id: "03",
      name: "UI/UX Design",
      description: "Designing modern, highly interactive, and user-centric interfaces with attention to layout, typography, and micro-interactions for seamless web applications."
    },
    {
      id: "04",
      name: "Cloud & DevOps",
      description: "Deploying and managing scalable cloud architectures with automated CI/CD pipelines, containerization (Docker, Kubernetes), and optimized cloud services."
    },
    {
      id: "05",
      name: "Creative Coding",
      description: "Integrating interactive 3D graphics, rich animations, and storytelling motion design using WebGL, Three.js, and Framer Motion into high-performance web products."
    }
  ];

  return (
    <section
      ref={sectionRef}
      id="services"
      className="bg-white text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] relative z-20 h-[300vh]"
    >
      {/* Sticky Full-Screen Viewport Wrapper */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-start pt-24 sm:pt-28 pb-12 px-5 sm:px-8 md:px-10">
        
        {/* Fixed Title inside the Sticky Wrapper */}
        <div className="w-full max-w-4xl text-center border-b border-black/5 pb-4 sm:pb-6 mb-8 sm:mb-12">
          <h2
            className="font-black uppercase text-[#0C0C0C] tracking-tight leading-none"
            style={{ fontSize: 'clamp(2.2rem, 7vw, 85px)' }}
          >
            Services
          </h2>
        </div>

        {/* Absolute Centered Cards Stacking Area */}
        <div className="w-full max-w-2xl relative flex items-center justify-center flex-1 h-[50vh] sm:h-[55vh] min-h-[300px]">
          {services.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              index={index} 
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
