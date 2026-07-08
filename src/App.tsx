import HeroSection from './components/HeroSection';
import MarqueeSection from './components/MarqueeSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ProjectsSection from './components/ProjectsSection';
import { FadeIn } from './components/FadeIn';
import FloatingContactButton from './components/FloatingContactButton';

function App() {
  return (
    <div className="w-full min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-sans selection:bg-[#B600A8]/20 selection:text-white overflow-x-clip relative">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Marquee Section */}
      <MarqueeSection />

      {/* 3. About Section */}
      <AboutSection />

      {/* 4. Services Section */}
      <ServicesSection />

      {/* 5. Projects Section */}
      <ProjectsSection />

      {/* 6. Contact / Footer Section */}
      <footer
        id="contact"
        className="w-full bg-[#0C0C0C] text-[#D7E2EA] py-16 sm:py-24 px-6 md:px-10 border-t border-[#D7E2EA]/10 flex flex-col items-center justify-center text-center relative overflow-hidden select-none"
      >
        <div className="max-w-6xl mx-auto flex flex-col items-center w-full">
          <FadeIn delay={0} y={30} duration={0.8}>
            <h2
              className="hero-heading font-black uppercase mb-4 tracking-tight leading-none"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 90px)' }}
            >
              Let&apos;s talk
            </h2>
          </FadeIn>
          
          <FadeIn delay={0.1} y={20} duration={0.8}>
            <p className="text-xs sm:text-sm md:text-base text-[#D7E2EA]/60 max-w-md mb-8 font-light uppercase tracking-widest leading-relaxed">
              Have a project in mind or want to explore AI/ML and fullstack collaboration? Reach out below.
            </p>
          </FadeIn>

          <FadeIn delay={0.2} y={20} duration={0.8}>
            <a
              href="mailto:aditya@example.com"
              className="text-lg sm:text-2xl md:text-3xl font-medium text-[#D7E2EA] hover:opacity-75 transition-opacity duration-200 uppercase tracking-widest block mb-16"
            >
              aditya@example.com
            </a>
          </FadeIn>

          {/* Social Links & Copyright */}
          <FadeIn delay={0.3} y={20} duration={0.8} className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center w-full border-t border-[#D7E2EA]/10 pt-8 gap-4 text-[10px] sm:text-xs font-light uppercase tracking-widest opacity-60">
              <span>&copy; {new Date().getFullYear()} Aditya Varshney. All Rights Reserved.</span>
              <div className="flex gap-6">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:opacity-100 transition-colors"
                >
                  Github
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:opacity-100 transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:opacity-100 transition-colors"
                >
                  Twitter
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </footer>

      {/* Global Floating Action Button */}
      <FloatingContactButton />
    </div>
  );
}

export default App;
