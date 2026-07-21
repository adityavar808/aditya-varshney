import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
}> = ({ url, altText, cardWidth, cardHeight }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="relative shrink-0 rounded-[18px] sm:rounded-[22px] overflow-hidden bg-[#161618] border border-white/10 group select-none"
      style={{ width: cardWidth, height: cardHeight }}
    >
      {!imgError && url ? (
        <img
          src={url}
          alt={altText}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.06]"
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
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
}

const CardMarqueeRow: React.FC<CardMarqueeRowProps> = ({
  imageUrls,
  altText,
  direction,
  cardHeight,
  cardWidth,
  speed = 30,
}) => {
  const items = buildMarqueeArray(imageUrls, 6);
  const animName = direction === 'left' ? 'marquee-to-left' : 'marquee-to-right';

  if (items.length === 0) return null;

  return (
    <div className="overflow-hidden w-full py-1">
      <div
        className="flex gap-3.5"
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
          />
        ))}
      </div>
    </div>
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
      {/* CSS Keyframe animations for Marquee */}
      <style>{`
        @keyframes marquee-to-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-to-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        [data-[#0C0C0C]]:hover [data-card-marquee] {
          animation-play-state: paused;
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
    : [project.imgCol1Top, project.imgCol2, project.imgCol1Bottom].filter(Boolean) as string[];

  // Distribute project's images across the 3 carousel rows
  let row1Images = pImages.filter((_, i) => i % 3 === 0);
  let row2Images = pImages.filter((_, i) => i % 3 === 1);
  let row3Images = pImages.filter((_, i) => i % 3 === 2);

  if (row1Images.length === 0) row1Images = pImages;
  if (row2Images.length === 0) row2Images = pImages;
  if (row3Images.length === 0) row3Images = pImages;

  return (
    <div
      ref={containerRef}
      className="h-[88vh] w-full sticky top-24 md:top-32 flex justify-center items-start overflow-visible"
      style={{ top: `calc(${stickyTopOffset}px + 6rem)` }}
    >
      <motion.div
        style={{ scale }}
        className="w-full bg-[#0C0C0C] border-2 border-[#D7E2EA] rounded-[36px] sm:rounded-[48px] md:rounded-[56px] p-4 sm:p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-hidden max-h-[82vh]"
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

        {/* Bottom Row: 3-Row Image Marquee Carousel (Inside Card) */}
        <div className="w-full overflow-hidden flex flex-col gap-2.5 rounded-[24px] sm:rounded-[32px] bg-[#111113] p-2.5 sm:p-3.5 border border-white/5 group/marquee">
          {/* Row 1 -> Right */}
          <CardMarqueeRow
            imageUrls={row1Images}
            altText={project.name}
            direction="right"
            cardHeight="clamp(100px, 12vw, 150px)"
            cardWidth="clamp(180px, 22vw, 290px)"
            speed={35}
          />

          {/* Row 2 <- Left (Taller) */}
          <CardMarqueeRow
            imageUrls={row2Images}
            altText={project.name}
            direction="left"
            cardHeight="clamp(120px, 15vw, 190px)"
            cardWidth="clamp(220px, 26vw, 340px)"
            speed={25}
          />

          {/* Row 3 -> Right */}
          <CardMarqueeRow
            imageUrls={row3Images}
            altText={project.name}
            direction="right"
            cardHeight="clamp(100px, 12vw, 150px)"
            cardWidth="clamp(180px, 22vw, 290px)"
            speed={40}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectsSection;
