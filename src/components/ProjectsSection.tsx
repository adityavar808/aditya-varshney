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

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "01",
    name: "Nextlevel Studio",
    category: "Client / AI Product Design",
    liveUrl: "https://motionsites.ai",
    imgCol1Top: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
    imgCol1Bottom: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
    imgCol2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85"
  },
  {
    id: "02",
    name: "Aura Brand Identity",
    category: "Personal / Agent Intelligence",
    liveUrl: "https://motionsites.ai",
    imgCol1Top: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
    imgCol1Bottom: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
    imgCol2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85"
  },
  {
    id: "03",
    name: "Solaris Digital",
    category: "Client / Fullstack Web Platform",
    liveUrl: "https://motionsites.ai",
    imgCol1Top: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
    imgCol1Bottom: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
    imgCol2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85"
  }
];

export const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects`)
      .then(res => res.json())
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
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
      .catch(err => console.log('Projects API fallback:', err));
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
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              totalCards={projects.length}
            />
          ))}
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
