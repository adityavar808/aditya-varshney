import React, { useState, useEffect } from 'react';
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

interface ImageItem {
  url: string;
  project: Project;
}

// Repeat the array until we have enough items, then double for seamless loop
function buildMarqueeRow(images: ImageItem[]): ImageItem[] {
  if (images.length === 0) return [];
  const factor = Math.max(1, Math.ceil(6 / images.length));
  const base = Array(factor).fill(images).flat() as ImageItem[];
  return [...base, ...base]; // doubled → seamless -50% translate trick
}

// ─── Single Marquee Row ──────────────────────────────────────────────────────
interface MarqueeRowProps {
  images: ImageItem[];
  direction: 'left' | 'right';
  cardHeight: string;
  cardWidth?: string;
  speed?: number;
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({
  images,
  direction,
  cardHeight,
  cardWidth = '300px',
  speed = 35,
}) => {
  const filled = buildMarqueeRow(images);
  const animName = direction === 'left' ? 'marquee-to-left' : 'marquee-to-right';

  return (
    <div className="overflow-hidden w-full py-2">
      <div
        className="flex gap-4 group/row"
        style={{
          width: 'max-content',
          animation: `${animName} ${speed}s linear infinite`,
        }}
      >
        {filled.map((item, i) => (
          <a
            key={i}
            href={item.project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative shrink-0 rounded-[20px] overflow-hidden bg-[#111] block group"
            style={{ width: cardWidth, height: cardHeight }}
          >
            {/* Image */}
            <img
              src={item.url}
              alt={item.project.name}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.07]"
              loading="lazy"
              decoding="async"
            />

            {/* Hover info overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-4 pointer-events-none">
              <span className="text-[#D7E2EA]/50 text-[9px] uppercase tracking-[0.2em] font-light mb-0.5">
                {item.project.category}
              </span>
              <span className="text-white text-sm font-bold uppercase tracking-wide leading-tight">
                {item.project.name}
              </span>
              <span className="mt-2 text-[9px] text-[#D7E2EA]/40 uppercase tracking-widest font-light flex items-center gap-1">
                Live ↗
              </span>
            </div>

            {/* Subtle border */}
            <div className="absolute inset-0 rounded-[20px] border border-white/[0.06] pointer-events-none" />
          </a>
        ))}
      </div>
    </div>
  );
};

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
const SkeletonRow: React.FC<{ height: string }> = ({ height }) => (
  <div className="overflow-hidden w-full py-2">
    <div className="flex gap-4">
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className="shrink-0 rounded-[20px] bg-white/[0.04] animate-pulse"
          style={{ width: '300px', height }}
        />
      ))}
    </div>
  </div>
);

// ─── Main Section ─────────────────────────────────────────────────────────────
export const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects`)
      .then(res => res.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          setProjects(data.map(item => ({
            id:           item.projectId,
            name:         item.name,
            category:     item.category,
            liveUrl:      item.liveUrl,
            imgCol1Top:   item.imgCol1Top,
            imgCol1Bottom: item.imgCol1Bottom,
            imgCol2:      item.imgCol2,
          })));
        }
      })
      .catch(err => console.error('Failed to fetch projects:', err))
      .finally(() => setLoading(false));
  }, []);

  // Distribute images across 3 rows
  const row1: ImageItem[] = projects.map(p => ({ url: p.imgCol1Top,    project: p }));
  const row2: ImageItem[] = projects.map(p => ({ url: p.imgCol2,       project: p }));
  const row3: ImageItem[] = projects.map(p => ({ url: p.imgCol1Bottom, project: p }));

  return (
    <section
      id="projects"
      className="bg-[#0C0C0C] text-[#D7E2EA] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 pt-24 pb-32 relative z-10 select-none overflow-hidden"
    >
      {/* ── Marquee keyframe animations ── */}
      <style>{`
        @keyframes marquee-to-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-to-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        /* Pause all rows on hover */
        [data-marquee]:hover > div {
          animation-play-state: paused;
        }
      `}</style>

      {/* Heading */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-10 mb-14">
        <FadeIn delay={0} y={40} duration={0.8}>
          <h2
            className="hero-heading font-black uppercase text-center"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Project
          </h2>
        </FadeIn>
      </div>

      {/* ── Carousel Rows ── */}
      {loading ? (
        <div className="flex flex-col gap-4 px-5">
          <SkeletonRow height="170px" />
          <SkeletonRow height="230px" />
          <SkeletonRow height="170px" />
        </div>
      ) : projects.length === 0 ? (
        <p className="text-[#D7E2EA]/30 text-sm uppercase tracking-widest font-light py-20 text-center">
          No projects yet — add them via the Admin panel.
        </p>
      ) : (
        <div className="flex flex-col gap-4" data-marquee>
          {/* Row 1 — scrolls LEFT → */}
          <MarqueeRow
            images={row1}
            direction="left"
            cardHeight="170px"
            cardWidth="290px"
            speed={38}
          />

          {/* Row 2 — scrolls RIGHT ← (taller, slightly faster for rhythm) */}
          <MarqueeRow
            images={row2}
            direction="right"
            cardHeight="240px"
            cardWidth="340px"
            speed={28}
          />

          {/* Row 3 — scrolls LEFT → */}
          <MarqueeRow
            images={row3}
            direction="left"
            cardHeight="170px"
            cardWidth="290px"
            speed={42}
          />
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;
