import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LiveProjectButton } from './LiveProjectButton';
import { FadeIn } from './FadeIn';

interface Project {
  id: string;
  name: string;
  category: string;
  liveUrl: string;
  imgCol1Top: string;
  imgCol1Bottom: string;
  imgCol2: string;
}

export const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects`)
      .then(res => res.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          const formatted = data.map(item => ({
            id: item.projectId,
            name: item.name,
            category: item.category,
            liveUrl: item.liveUrl,
            imgCol1Top: item.imgCol1Top,
            imgCol1Bottom: item.imgCol1Bottom,
            imgCol2: item.imgCol2
          }));
          setProjects(formatted);
        }
      })
      .catch(err => console.error('Failed to fetch projects:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="projects"
      className="bg-[#0C0C0C] text-[#D7E2EA] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 pt-24 pb-32 px-5 sm:px-8 md:px-10 relative z-10 select-none overflow-visible"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Section Heading */}
        <FadeIn delay={0} y={40} duration={0.8}>
          <h2
            className="hero-heading font-black uppercase text-center mb-16 sm:mb-20 md:mb-24"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Project
          </h2>
        </FadeIn>

        {/* Sticky Stacking Cards Container */}
        <div className="w-full flex flex-col items-center gap-12 sm:gap-16">
          {loading ? (
            // Loading skeleton
            [1, 2].map(i => (
              <div key={i} className="w-full border-2 border-[#D7E2EA]/10 rounded-[40px] p-6 md:p-8 animate-pulse">
                <div className="h-8 bg-white/5 rounded-xl w-1/3 mb-6" />
                <div className="grid grid-cols-10 gap-4" style={{ height: 'clamp(320px, 42vw, 500px)' }}>
                  <div className="col-span-4 flex flex-col gap-4">
                    <div className="flex-1 bg-white/5 rounded-[24px]" />
                    <div className="flex-1 bg-white/5 rounded-[24px]" />
                  </div>
                  <div className="col-span-6 bg-white/5 rounded-[24px]" />
                </div>
              </div>
            ))
          ) : projects.length === 0 ? (
            <p className="text-[#D7E2EA]/40 text-sm uppercase tracking-widest font-light py-16">
              No projects yet — add them via the Admin panel.
            </p>
          ) : (
            projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                totalCards={projects.length}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

interface ProjectCardProps {
  project: Project;
  index: number;
  totalCards: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, totalCards }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of this card's container relative to viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Scale down card as we scroll past it: targetScale = 1 - (total - 1 - idx) * 0.03
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  
  // Card top offset: index * 28px
  const stickyTopOffset = index * 28;

  return (
    <div
      ref={containerRef}
      className="h-[85vh] w-full sticky top-24 md:top-32 flex justify-center items-start overflow-visible"
      style={{ top: `calc(${stickyTopOffset}px + 6rem)` }}
    >
      <motion.div
        style={{ scale }}
        className="w-full bg-[#0C0C0C] border-2 border-[#D7E2EA] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] p-4 sm:p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-hidden h-fit max-h-[80vh]"
      >
        {/* Top Row: Meta & CTA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Huge Number */}
            <span
              className="font-black text-[#D7E2EA] select-none leading-none"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 100px)' }}
            >
              {project.id}
            </span>
            {/* Category + Title */}
            <div className="flex flex-col text-left">
              <span className="text-xs uppercase tracking-widest text-[#D7E2EA]/60 font-light mb-1">
                {project.category}
              </span>
              <h3
                className="font-medium uppercase leading-tight text-[#D7E2EA] tracking-wide"
                style={{ fontSize: 'clamp(1.1rem, 2.5vw, 2.1rem)' }}
              >
                {project.name}
              </h3>
            </div>
          </div>
          {/* Action Link */}
          <LiveProjectButton url={project.liveUrl} />
        </div>

        {/* Bottom Row: Two-Column Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-4 sm:gap-6 items-stretch flex-1 overflow-hidden">
          {/* Left Stack (40% width) */}
          <div className="md:col-span-4 flex flex-col gap-4 sm:gap-6">

            {/* Top thumbnail */}
            <div className="overflow-hidden rounded-[24px] sm:rounded-[32px] md:rounded-[40px] bg-[#1a1a1a] relative group">
              <img
                src={project.imgCol1Top}
                alt={`${project.name} screenshot 1`}
                className="w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.06]"
                style={{ height: 'clamp(140px, 17vw, 240px)', display: 'block' }}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>

            {/* Bottom thumbnail */}
            <div className="overflow-hidden rounded-[24px] sm:rounded-[32px] md:rounded-[40px] bg-[#1a1a1a] relative group">
              <img
                src={project.imgCol1Bottom}
                alt={`${project.name} screenshot 2`}
                className="w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.06]"
                style={{ height: 'clamp(170px, 24vw, 360px)', display: 'block' }}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Tall Hero Image (60% width) */}
          <div className="md:col-span-6 overflow-hidden rounded-[24px] sm:rounded-[32px] md:rounded-[40px] bg-[#1a1a1a] relative group">
            <img
              src={project.imgCol2}
              alt={`${project.name} hero`}
              className="w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
              style={{ height: 'clamp(320px, 42vw, 620px)', display: 'block' }}
              loading="lazy"
              decoding="async"
            />
            {/* depth gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/25 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectsSection;
