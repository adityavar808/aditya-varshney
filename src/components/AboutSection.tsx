import React from 'react';
import { FadeIn } from './FadeIn';
import { AnimatedText } from './AnimatedText';
import { ContactButton } from './ContactButton';

export const AboutSection: React.FC = () => {
  // Personal bio for Aditya Varshney
  const aboutText = "I'm Aditya Varshney, a Computer Science Engineering student passionate about Full Stack Development and AI/ML. I enjoy building intelligent, user-friendly applications using modern web technologies and machine learning. I'm continuously learning, creating real-world projects, and striving to become an AI Engineer who develops impactful solutions.";


  return (
    <section
      id="about"
      className="min-h-screen w-full bg-[#0C0C0C] relative flex flex-col justify-center items-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden select-none"
    >
      {/* Decorative 3D Images - Corners */}
      
      {/* Top Left: Moon Icon */}
      <div className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-20">
        <FadeIn delay={0.1} x={-80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
            alt="3D Moon Icon"
            className="w-[120px] sm:w-[160px] md:w-[210px] h-auto select-none transition-all duration-500 ease-out hover:scale-110 hover:-translate-y-3 hover:rotate-6 filter hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer"
            loading="lazy"
          />
        </FadeIn>
      </div>

      {/* Bottom Left: 3D Object */}
      <div className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] z-20">
        <FadeIn delay={0.25} x={-80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
            alt="3D Object"
            className="w-[100px] sm:w-[140px] md:w-[180px] h-auto select-none transition-all duration-500 ease-out hover:scale-115 hover:translate-y-2 hover:-rotate-12 filter hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] cursor-pointer"
            loading="lazy"
          />
        </FadeIn>
      </div>

      {/* Top Right: Lego Icon */}
      <div className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] z-20">
        <FadeIn delay={0.15} x={80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
            alt="3D Lego Icon"
            className="w-[120px] sm:w-[160px] md:w-[210px] h-auto select-none transition-all duration-500 ease-out hover:scale-110 hover:-translate-y-4 hover:rotate-12 filter hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer"
            loading="lazy"
          />
        </FadeIn>
      </div>

      {/* Bottom Right: 3D Group */}
      <div className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] z-20">
        <FadeIn delay={0.3} x={80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
            alt="3D Group Object"
            className="w-[130px] sm:w-[170px] md:w-[220px] h-auto select-none transition-all duration-500 ease-out hover:scale-112 hover:translate-x-2 hover:-translate-y-2 hover:rotate-6 filter hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] cursor-pointer"
            loading="lazy"
          />
        </FadeIn>
      </div>

      {/* Central Content */}
      <div className="flex flex-col items-center text-center max-w-4xl z-10">
        {/* About Heading */}
        <FadeIn delay={0} y={40} duration={0.8}>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight mb-10 sm:mb-14 md:mb-16 select-none"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            About me
          </h2>
        </FadeIn>

        {/* Character-by-character animated paragraph */}
        <div className="max-w-[560px] mb-16 sm:mb-20 md:mb-24 px-4">
          <AnimatedText
            text={aboutText}
            className="text-[#D7E2EA] font-medium leading-relaxed text-center"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
        </div>

        {/* Contact CTA */}
        <FadeIn delay={0.2} y={20} duration={0.8}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
};

export default AboutSection;
