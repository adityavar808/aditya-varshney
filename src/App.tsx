import { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import MarqueeSection from './components/MarqueeSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ProjectsSection from './components/ProjectsSection';
import FloatingContactButton from './components/FloatingContactButton';
import ContactSection from './components/ContactSection';
import AdminPanel from './components/AdminPanel';
import Adibot from './components/Adibot';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash || window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.hash || window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const normalizedPath = currentPath.replace(/\/$/, '');
  if (normalizedPath === '#/admin' || normalizedPath === '/admin') {
    return <AdminPanel />;
  }

  return (
    <div className="w-full min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-sans selection:bg-[#B600A8]/20 selection:text-white relative">
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
      <ContactSection />


      {/* Global Floating Action Button */}
      <FloatingContactButton />

      {/* RAG Portfolio Chatbot */}
      <Adibot />
    </div>
  );
}

export default App;
