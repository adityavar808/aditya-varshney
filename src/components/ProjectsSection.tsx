import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { LiveProjectButton } from './LiveProjectButton';
import { FadeIn } from './FadeIn';

interface Project {
  id: string;
  name: string;
  category: string;
  liveUrl: string;
  images?: string[];
  imgCol1Top?: string;
  imgCol1Bottom?: string;
  imgCol2?: string;
}

// Helper to build array for smooth looping marquee
function buildMarqueeArray(imageUrls: string[], minItems: number = 6): string[] {
  const valid = imageUrls.filter(Boolean);
  if (valid.length === 0) return [];
  const factor = Math.max(1, Math.ceil(minItems / valid.length));
  const base = Array(factor).fill(valid).flat();
  return [...base, ...base]; // doubled for seamless -50% translate
}

// ─── Single Card Marquee Item ────────────────────────────────────────────────
const MarqueeImageCard: React.FC<{
  url: string;
  altText: string;
  cardWidth: string;
  cardHeight: string;
  indexTag: string;
  onOpenLightbox: (url: string) => void;
}> = ({ url, altText, cardWidth, cardHeight, indexTag, onOpenLightbox }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => !imgError && url && onOpenLightbox(url)}
      className="relative shrink-0 rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#161619] border border-white/10 hover:border-[#00FF00]/40 group select-none cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,0,0.12)]"
      style={{ width: cardWidth, height: cardHeight }}
    >
      {!imgError && url ? (
        <img
          src={url}
          alt={altText}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.08]"
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-[#1e1e24] to-[#0d0d10]">
          <span className="text-[9px] text-[#00FF00] font-mono uppercase tracking-widest">
            {altText}
          </span>
          <span className="text-[7px] text-gray-500 font-mono uppercase tracking-wider mt-1">
            [No Image Preview]
          </span>
        </div>
      )}

      {/* Index Badge */}
      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-mono text-gray-300 font-medium opacity-80 group-hover:opacity-100 group-hover:border-[#00FF00]/40 group-hover:text-[#00FF00] transition-all">
        {indexTag}
      </div>

      {/* Interactive Expand Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 border border-[#00FF00]/50 text-[#00FF00] text-[9px] font-mono uppercase tracking-wider shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <Maximize2 className="w-3 h-3" />
          <span>Expand</span>
        </div>
      </div>
    </div>
  );
};

// ─── Single Row in Card Carousel ─────────────────────────────────────────────
interface CardMarqueeRowProps {
  imageUrls: string[];
  altText: string;
  direction: 'left' | 'right';
  cardHeight: string;
  cardWidth: string;
  speed?: number;
  onOpenLightbox: (url: string) => void;
}

const CardMarqueeRow: React.FC<CardMarqueeRowProps> = ({
  imageUrls,
  altText,
  direction,
  cardHeight,
  cardWidth,
  speed = 30,
  onOpenLightbox,
}) => {
  const items = buildMarqueeArray(imageUrls, 6);
  const animName = direction === 'left' ? 'marquee-to-left' : 'marquee-to-right';

  if (items.length === 0) return null;

  return (
    <div className="overflow-hidden w-full py-1">
      <div
        className="marquee-track flex gap-4"
        style={{
          width: 'max-content',
          animation: `${animName} ${speed}s linear infinite`,
        }}
      >
        {items.map((url, idx) => (
          <MarqueeImageCard
            key={idx}
            url={url}
            altText={altText}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            indexTag={`#${String((idx % imageUrls.length) + 1).padStart(2, '0')}`}
            onOpenLightbox={onOpenLightbox}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Lightbox Modal Component ────────────────────────────────────────────────
interface LightboxProps {
  activeUrl: string | null;
  allImages: string[];
  projectName: string;
  projectCategory: string;
  liveUrl: string;
  onClose: () => void;
}

const LightboxModal: React.FC<LightboxProps> = ({
  activeUrl,
  allImages,
  projectName,
  projectCategory,
  liveUrl,
  onClose,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  useEffect(() => {
    if (activeUrl) {
      const idx = allImages.indexOf(activeUrl);
      setCurrentIdx(idx !== -1 ? idx : 0);
    }
  }, [activeUrl, allImages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && allImages.length > 0) {
        setCurrentIdx(prev => (prev + 1) % allImages.length);
      }
      if (e.key === 'ArrowLeft' && allImages.length > 0) {
        setCurrentIdx(prev => (prev - 1 + allImages.length) % allImages.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allImages, onClose]);

  if (!activeUrl) return null;

  const currentImg = allImages[currentIdx] || activeUrl;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8"
      >
        {/* Top Header Bar */}
        <div
          onClick={e => e.stopPropagation()}
          className="flex justify-between items-center w-full max-w-6xl mx-auto"
        >
          <div className="flex flex-col">
            <span className="text-[10px] text-[#00FF00] uppercase tracking-widest font-mono">
              {projectCategory}
            </span>
            <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
              {projectName}
            </h4>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-gray-400">
              {currentIdx + 1} / {allImages.length || 1}
            </span>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Image View */}
        <div
          onClick={e => e.stopPropagation()}
          className="relative flex-1 flex items-center justify-center my-4 max-w-6xl mx-auto w-full group"
        >
          {allImages.length > 1 && (
            <button
              onClick={() => setCurrentIdx(prev => (prev - 1 + allImages.length) % allImages.length)}
              className="absolute left-2 z-10 p-3 rounded-full bg-black/60 border border-white/10 hover:border-[#00FF00] text-white hover:text-[#00FF00] transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <motion.img
            key={currentImg}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
            src={currentImg}
            alt={projectName}
            className="max-h-[75vh] max-w-full object-contain rounded-2xl border border-white/10 shadow-2xl"
          />

          {allImages.length > 1 && (
            <button
              onClick={() => setCurrentIdx(prev => (prev + 1) % allImages.length)}
              className="absolute right-2 z-10 p-3 rounded-full bg-black/60 border border-white/10 hover:border-[#00FF00] text-white hover:text-[#00FF00] transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Bottom Bar */}
        <div
          onClick={e => e.stopPropagation()}
          className="flex justify-between items-center w-full max-w-6xl mx-auto pt-2 border-t border-white/10"
        >
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
            Use ← → keys or click arrows to navigate
          </span>

          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#00FF00]/10 border border-[#00FF00]/40 text-[#00FF00] text-xs font-bold uppercase tracking-wider hover:bg-[#00FF00]/20 transition-all"
            >
              <span>Visit Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Main Projects Section ───────────────────────────────────────────────────
export const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects`)
      .then(res => res.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          setProjects(
            data.map(item => ({
              id:            item.projectId,
              name:          item.name,
              category:      item.category,
              liveUrl:       item.liveUrl,
              images:        Array.isArray(item.images) && item.images.length > 0
                ? item.images
                : [item.imgCol1Top, item.imgCol2, item.imgCol1Bottom].filter(Boolean),
              imgCol1Top:    item.imgCol1Top,
              imgCol1Bottom: item.imgCol1Bottom,
              imgCol2:       item.imgCol2,
            }))
          );
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
      {/* Keyframe Marquee Animations & Hover-Pause Logic */}
      <style>{`
        @keyframes marquee-to-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-to-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-container:hover .marquee-track {
          animation-play-state: paused !important;
        }
      `}</style>

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
            [1, 2].map(i => (
              <div
                key={i}
                className="w-full bg-[#0C0C0C] border-2 border-[#D7E2EA]/20 rounded-[40px] p-6 md:p-8 animate-pulse"
              >
                <div className="h-10 bg-white/5 rounded-xl w-1/3 mb-6" />
                <div className="space-y-3">
                  <div className="h-28 bg-white/5 rounded-2xl" />
                  <div className="h-36 bg-white/5 rounded-2xl" />
                  <div className="h-28 bg-white/5 rounded-2xl" />
                </div>
              </div>
            ))
          ) : projects.length === 0 ? (
            <p className="text-[#D7E2EA]/40 text-sm uppercase tracking-widest font-light py-16 text-center">
              No projects registered yet — add them via the Admin panel.
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

// ─── Individual Project Card Component ───────────────────────────────────────
interface ProjectCardProps {
  project: Project;
  index: number;
  totalCards: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  totalCards,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLightboxUrl, setActiveLightboxUrl] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const stickyTopOffset = index * 28;

  // Project-specific images array
  const pImages = (project.images && project.images.length > 0)
    ? project.images.filter(Boolean)
    : ([project.imgCol1Top, project.imgCol2, project.imgCol1Bottom].filter(Boolean) as string[]);

  // Distribute project's images across the 3 carousel rows
  let row1Images = pImages.filter((_, i) => i % 3 === 0);
  let row2Images = pImages.filter((_, i) => i % 3 === 1);
  let row3Images = pImages.filter((_, i) => i % 3 === 2);

  if (row1Images.length === 0) row1Images = pImages;
  if (row2Images.length === 0) row2Images = pImages;
  if (row3Images.length === 0) row3Images = pImages;

  return (
    <>
      <div
        ref={containerRef}
        className="h-[88vh] w-full sticky top-24 md:top-32 flex justify-center items-start overflow-visible"
        style={{ top: `calc(${stickyTopOffset}px + 6rem)` }}
      >
        <motion.div
          style={{ scale }}
          className="w-full bg-[#0C0C0C] border-2 border-[#D7E2EA] hover:border-[#00FF00]/40 transition-colors duration-500 rounded-[36px] sm:rounded-[48px] md:rounded-[56px] p-4 sm:p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-hidden max-h-[82vh]"
        >
          {/* Top Row: Meta & CTA */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6 shrink-0">
            <div className="flex items-center gap-4 sm:gap-6">
              <span
                className="font-black text-[#D7E2EA] select-none leading-none"
                style={{ fontSize: 'clamp(2.2rem, 6vw, 84px)' }}
              >
                {project.id}
              </span>
              <div className="flex flex-col text-left">
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#D7E2EA]/60 font-light mb-0.5">
                  {project.category}
                </span>
                <h3
                  className="font-medium uppercase leading-tight text-[#D7E2EA] tracking-wide"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 1.9rem)' }}
                >
                  {project.name}
                </h3>
              </div>
            </div>
            <LiveProjectButton url={project.liveUrl} />
          </div>

          {/* Bottom Row: 3-Row Image Marquee Carousel with Edge Gradient Fade & Hover Controls */}
          <div className="relative w-full overflow-hidden flex flex-col gap-3 rounded-[24px] sm:rounded-[32px] bg-[#121215] p-3 sm:p-4 border border-white/5 marquee-container">
            {/* Hover Micro-Badge Indicator */}
            <div className="absolute top-2 right-4 z-20 pointer-events-none opacity-0 group-hover/marquee:opacity-100 transition-opacity duration-300 flex items-center gap-2 px-3 py-1 rounded-full bg-black/75 border border-[#00FF00]/30 text-[#00FF00] text-[8px] font-mono uppercase tracking-wider backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF00] animate-pulse" />
              <span>PAUSED • CLICK IMAGE TO EXPAND</span>
            </div>

            {/* Edge Alpha Gradient Fade Mask */}
            <div
              className="w-full flex flex-col gap-2.5"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
              }}
            >
              {/* Row 1 -> Right */}
              <CardMarqueeRow
                imageUrls={row1Images}
                altText={project.name}
                direction="right"
                cardHeight="clamp(100px, 12vw, 150px)"
                cardWidth="clamp(180px, 22vw, 290px)"
                speed={35}
                onOpenLightbox={url => setActiveLightboxUrl(url)}
              />

              {/* Row 2 <- Left (Taller) */}
              <CardMarqueeRow
                imageUrls={row2Images}
                altText={project.name}
                direction="left"
                cardHeight="clamp(120px, 15vw, 190px)"
                cardWidth="clamp(220px, 26vw, 340px)"
                speed={25}
                onOpenLightbox={url => setActiveLightboxUrl(url)}
              />

              {/* Row 3 -> Right */}
              <CardMarqueeRow
                imageUrls={row3Images}
                altText={project.name}
                direction="right"
                cardHeight="clamp(100px, 12vw, 150px)"
                cardWidth="clamp(180px, 22vw, 290px)"
                speed={40}
                onOpenLightbox={url => setActiveLightboxUrl(url)}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        activeUrl={activeLightboxUrl}
        allImages={pImages}
        projectName={project.name}
        projectCategory={project.category}
        liveUrl={project.liveUrl}
        onClose={() => setActiveLightboxUrl(null)}
      />
    </>
  );
};

export default ProjectsSection;
