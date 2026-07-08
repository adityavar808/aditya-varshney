import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from './FadeIn';
import { Magnet } from './Magnet';
import { ContactButton } from './ContactButton';
import developerAvatar from '../assets/developer_avatar.png';

export const HeroSection: React.FC = () => {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="h-screen w-full flex flex-col justify-between overflow-x-clip relative select-none bg-[#0C0C0C]">
      {/* 1. Navbar (Floating Pill Redesign - Fixed Visibility Bug) */}
      <motion.nav
        initial={{ opacity: 0, y: -20, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        transition={{ delay: 0.1, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-6 left-1/2 z-50 w-[92%] max-w-3xl bg-[#0C0C0C]/65 backdrop-blur-xl border border-white/10 rounded-full py-2.5 px-4 sm:px-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-between"
      >
        {/* Left: Branding */}
        <div className="flex items-center gap-1.5 cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="font-black text-white tracking-widest text-[11px] sm:text-xs uppercase">
            Aditya
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#B600A8] shadow-[0_0_8px_#B600A8]" />
        </div>

        {/* Center: Nav links */}
        <ul className="flex items-center gap-2 sm:gap-6">
          {[
            { id: 'about', label: 'About' },
            { id: 'services', label: 'Services' },
            { id: 'projects', label: 'Projects' }
          ].map((link) => (
            <li key={link.id}>
              <button
                onClick={() => handleScrollTo(link.id)}
                className="relative text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#D7E2EA]/60 hover:text-white transition-all duration-300 py-1.5 px-3 rounded-full hover:bg-white/5 cursor-pointer"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Right: CTA Mini Button */}
        <div>
          <button
            onClick={() => handleScrollTo('contact')}
            className="cursor-pointer text-[9px] sm:text-[11px] font-semibold uppercase tracking-widest text-white px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 12px rgba(181, 1, 167, 0.25)',
              outline: '1px solid rgba(255,255,255,0.4)',
              outlineOffset: '-2px'
            }}
          >
            Contact
          </button>
        </div>
      </motion.nav>

      {/* 2. Hero Heading (Background Layer relative to Portrait) */}
      <div className="flex-1 flex items-center justify-center relative w-full overflow-visible">
        {/* Massive H1 Heading */}
        <div className="w-full overflow-hidden text-center z-0 relative px-4">
          <FadeIn delay={0.15} y={40} duration={0.8}>
            <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[11vw] sm:text-[11.5vw] md:text-[12vw] lg:text-[13vw] mt-6 sm:mt-4 md:-mt-5 select-none">
              hi, i&apos;m aditya
            </h1>
          </FadeIn>
        </div>

        {/* 3. Hero Portrait (Absolute Overlapping Layer) */}
        <div className="absolute left-1/2 -translate-x-1/2 z-10 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0">
          <FadeIn delay={0.6} y={30} duration={0.9} className="w-full h-full flex justify-center items-end">
            <Magnet
              padding={150}
              strength={3}
              activeTransition="transform 0.3s ease-out"
              inactiveTransition="transform 0.6s ease-in-out"
              className="w-full h-full flex justify-center items-end"
            >
              <img
                src={developerAvatar}
                alt="Aditya Varshney Portrait"
                className="w-full h-auto object-contain select-none pointer-events-none rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
                style={{ filter: 'drop-shadow(0px 20px 40px rgba(0,0,0,0.8))' }}
              />
            </Magnet>
          </FadeIn>
        </div>
      </div>

      {/* 4. Bottom Bar */}
      <div className="w-full z-20 px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 flex justify-between items-end">
        {/* Left: Bio Info Redesign - Premium Interactive Glassmorphic Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="bg-white/[0.02] backdrop-blur-lg border border-white/10 hover:border-[#B600A8]/30 rounded-2xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_40px_rgba(181,1,167,0.12)] transition-all duration-300 max-w-[240px] sm:max-w-[320px] md:max-w-[390px] text-left select-none group"
        >
          {/* Pulsing Core Focus Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B600A8] animate-pulse shadow-[0_0_8px_#B600A8]" />
            <span className="text-[10px] tracking-widest text-[#BBCCD7] uppercase font-semibold font-heading">
              Core Focus
            </span>
          </div>
          {/* Main Typography Paragraph */}
          <p
            className="text-[#D7E2EA]/85 font-heading font-light tracking-wide leading-relaxed"
            style={{ fontSize: 'clamp(0.8rem, 1.15vw, 1.15rem)' }}
          >
            Turning complex ideas into <span className="text-white font-medium">elegant</span>, <span className="text-white font-medium">scalable</span> applications through <span className="text-[#BBCCD7] font-semibold">full stack development</span> and <span className="text-[#BBCCD7] font-semibold">artificial intelligence innovation</span>.
          </p>
        </motion.div>

        {/* Right: Contact CTA */}
        <FadeIn delay={0.5} y={20} duration={0.8}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
};

export default HeroSection;
