import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight, ExternalLink, Box, Sparkles, MoveRight } from 'lucide-react';
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
  return [...base, ...base];
}

// ─── 3D Image Card with Mouse Parallax & Tilt ───────────────────────────────
const ThreeDImageCard: React.FC<{
  url: string;
  altText: string;
  cardWidth: string;
  cardHeight: string;
  indexTag: string;
  tiltAngle: number;
  onOpenLightbox: (url: string) => void;
}> = ({ url, altText, cardWidth, cardHeight, indexTag, tiltAngle, onOpenLightbox }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      onClick={() => !imgError && url && onOpenLightbox(url)}
      whileHover={{ scale: 1.08, zIndex: 30, rotateY: 0, translateZ: 30 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative shrink-0 rounded-[22px] overflow-hidden bg-[#141417] border border-white/10 hover:border-[#00FF00]/50 group select-none cursor-pointer shadow-xl"
      style={{
        width: cardWidth,
        height: cardHeight,
        transform: `perspective(1000px) rotateY(${tiltAngle}deg) rotateX(4deg)`,
        transformStyle: 'preserve-3d',
      }}
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
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-[#1c1c24] to-[#0c0c0e]">
          <span className="text-[9px] text-[#00FF00] font-mono uppercase tracking-widest">
            {altText}
          </span>
          <span className="text-[7px] text-gray-500 font-mono uppercase tracking-wider mt-1">
            [No Preview]
          </span>
        </div>
      )}

      {/* 3D Glass Badge */}
      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[8px] font-mono text-gray-300 font-medium group-hover:border-[#00FF00]/50 group-hover:text-[#00FF00] transition-all">
        {indexTag}
      </div>

      {/* Interactive Expand Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center pointer-events-none">
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/90 border border-[#00FF00]/60 text-[#00FF00] text-[9px] font-mono uppercase tracking-wider shadow-[0_0_15px_rgba(0,255,0,0.3)] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <Maximize2 className="w-3.5 h-3.5" />
          <span>View 3D High-Res</span>
        </div>
      </div>
    </motion.div>
  );
};

// ─── 3D Marquee Row ──────────────────────────────────────────────────────────
interface ThreeDMarqueeRowProps {
  imageUrls: string[];
  altText: string;
  direction: 'left' | 'right';
  cardHeight: string;
  cardWidth: string;
  speed?: number;
  tiltAngle: number;
  onOpenLightbox: (url: string) => void;
}

const ThreeDMarqueeRow: React.FC<ThreeDMarqueeRowProps> = ({
  imageUrls,
  altText,
  direction,
  cardHeight,
  cardWidth,
  speed = 30,
  tiltAngle,
  onOpenLightbox,
}) => {
  const items = buildMarqueeArray(imageUrls, 6);
  const animName = direction === 'left' ? 'marquee-to-left' : 'marquee-to-right';

  if (items.length === 0) return null;

  return (
    <div className="overflow-hidden w-full py-2" style={{ perspective: '1200px' }}>
      <div
        className="marquee-track flex gap-4"
        style={{
          width: 'max-content',
          animation: `${animName} ${speed}s linear infinite`,
          transformStyle: 'preserve-3d',
        }}
      >
        {items.map((url, idx) => (
          <ThreeDImageCard
            key={idx}
            url={url}
            altText={altText}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            indexTag={`3D #${String((idx % imageUrls.length) + 1).padStart(2, '0')}`}
            tiltAngle={tiltAngle}
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
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8"
      >
        {/* Top Header Bar */}
        <div
          onClick={e => e.stopPropagation()}
          className="flex justify-between items-center w-full max-w-6xl mx-auto"
        >
          <div className="flex flex-col">
            <span className="text-[10px] text-[#00FF00] uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Box className="w-3 h-3" /> {projectCategory}
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

        {/* Center 3D Interactive Viewer */}
        <div
          onClick={e => e.stopPropagation()}
          className="relative flex-1 flex items-center justify-center my-4 max-w-6xl mx-auto w-full group"
        >
          {allImages.length > 1 && (
            <button
              onClick={() => setCurrentIdx(prev => (prev - 1 + allImages.length) % allImages.length)}
              className="absolute left-2 z-10 p-3 rounded-full bg-black/70 border border-white/10 hover:border-[#00FF00] text-white hover:text-[#00FF00] transition-all shadow-xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <motion.img
            key={currentImg}
            initial={{ scale: 0.9, rotateX: 10, opacity: 0 }}
            animate={{ scale: 1, rotateX: 0, opacity: 1 }}
            exit={{ scale: 0.9, rotateX: -10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            src={currentImg}
            alt={projectName}
            className="max-h-[75vh] max-w-full object-contain rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,255,0,0.15)]"
          />

          {allImages.length > 1 && (
            <button
              onClick={() => setCurrentIdx(prev => (prev + 1) % allImages.length)}
              className="absolute right-2 z-10 p-3 rounded-full bg-black/70 border border-white/10 hover:border-[#00FF00] text-white hover:text-[#00FF00] transition-all shadow-xl"
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
            Use ← → arrow keys to switch images • Esc to exit
          </span>

          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#00FF00]/10 border border-[#00FF00]/40 text-[#00FF00] text-xs font-bold uppercase tracking-wider hover:bg-[#00FF00]/20 transition-all shadow-[0_0_15px_rgba(0,255,0,0.2)]"
            >
              <span>Launch Live Project</span>
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
      style={{ perspective: '1500px' }}
    >
      {/* CSS Keyframes for 3D Marquee tracks */}
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
        {/* 3D Section Heading */}
        <FadeIn delay={0} y={40} duration={0.8}>
          <div className="flex flex-col items-center mb-16 sm:mb-20 md:mb-24">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#00FF00] mb-2 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> 3D Interactive Showcase
            </span>
            <h2
              className="hero-heading font-black uppercase text-center"
              style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
            >
              Project
            </h2>
          </div>
        </FadeIn>

        {/* 3D Sticky Stacking Cards Container */}
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
            <p className="text-[#D7E2EA]/40 text-sm uppercase tracking-widest font-light py-16 text-center font-mono">
              No projects registered yet — add them via the Admin panel.
            </p>
          ) : (
            projects.map((project, index) => (
              <Interactive3DProjectCard
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

// ─── Interactive 3D Project Card with Mouse Tilt Physics ────────────────────
interface ProjectCardProps {
  project: Project;
  index: number;
  totalCards: number;
}

const Interactive3DProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  totalCards,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeLightboxUrl, setActiveLightboxUrl] = useState<string | null>(null);

  // 3D Motion values for interactive tilt physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

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
        className="h-[90vh] w-full sticky top-24 md:top-32 flex justify-center items-start overflow-visible"
        style={{ top: `calc(${stickyTopOffset}px + 6rem)`, perspective: '1200px' }}
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            scale,
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="w-full bg-[#0C0C0E]/90 backdrop-blur-2xl border-2 border-[#D7E2EA] hover:border-[#00FF00]/60 transition-colors duration-500 rounded-[36px] sm:rounded-[48px] md:rounded-[56px] p-4 sm:p-6 md:p-8 flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_80px_rgba(0,255,0,0.18)] max-h-[84vh] relative group/card"
        >
          {/* 3D Holographic Ambient Light Glow */}
          <div className="absolute inset-0 rounded-[36px] sm:rounded-[48px] md:rounded-[56px] bg-gradient-to-tr from-[#00FF00]/5 via-transparent to-[#B600A8]/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Top Row: Meta & CTA */}
          <div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6 shrink-0 relative z-10"
            style={{ transform: 'translateZ(30px)' }}
          >
            <div className="flex items-center gap-4 sm:gap-6">
              {/* 3D Number */}
              <span
                className="font-black text-[#D7E2EA] select-none leading-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                style={{ fontSize: 'clamp(2.2rem, 6vw, 84px)' }}
              >
                {project.id}
              </span>
              <div className="flex flex-col text-left">
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#00FF00] font-mono font-bold mb-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF00] animate-ping" />
                  {project.category}
                </span>
                <h3
                  className="font-medium uppercase leading-tight text-white tracking-wide drop-shadow-md"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 1.9rem)' }}
                >
                  {project.name}
                </h3>
              </div>
            </div>
            <LiveProjectButton url={project.liveUrl} />
          </div>

          {/* Bottom Row: 3D Multi-Row Image Stage */}
          <div
            className="relative w-full overflow-hidden flex flex-col gap-3 rounded-[26px] sm:rounded-[34px] bg-[#111114]/90 p-3 sm:p-4 border border-white/10 marquee-container shadow-inner"
            style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}
          >
            {/* 3D Interactive Badge */}
            <div className="absolute top-2.5 right-4 z-20 pointer-events-none opacity-80 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-[#00FF00]/40 text-[#00FF00] text-[8px] font-mono uppercase tracking-wider backdrop-blur-md shadow-lg">
              <MoveRight className="w-3 h-3 animate-pulse" />
              <span>HOVER TO PAUSE • CLICK FOR 3D LIGHTBOX</span>
            </div>

            {/* Edge Gradient Mask */}
            <div
              className="w-full flex flex-col gap-3"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Row 1 -> Right with 3D Tilt Angle +8deg */}
              <ThreeDMarqueeRow
                imageUrls={row1Images}
                altText={project.name}
                direction="right"
                cardHeight="clamp(100px, 12vw, 150px)"
                cardWidth="clamp(180px, 22vw, 290px)"
                speed={34}
                tiltAngle={7}
                onOpenLightbox={url => setActiveLightboxUrl(url)}
              />

              {/* Row 2 <- Left with 3D Tilt Angle -8deg (Taller) */}
              <ThreeDMarqueeRow
                imageUrls={row2Images}
                altText={project.name}
                direction="left"
                cardHeight="clamp(125px, 15vw, 195px)"
                cardWidth="clamp(220px, 26vw, 340px)"
                speed={24}
                tiltAngle={-7}
                onOpenLightbox={url => setActiveLightboxUrl(url)}
              />

              {/* Row 3 -> Right with 3D Tilt Angle +8deg */}
              <ThreeDMarqueeRow
                imageUrls={row3Images}
                altText={project.name}
                direction="right"
                cardHeight="clamp(100px, 12vw, 150px)"
                cardWidth="clamp(180px, 22vw, 290px)"
                speed={38}
                tiltAngle={7}
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
