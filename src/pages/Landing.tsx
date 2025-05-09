
import { useEffect, useRef, useState } from 'react';

// Import individual sections
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import GetStartedSection from '@/components/landing/GetStartedSection';
import DemoSection from '@/components/landing/DemoSection';
import CtaSection from '@/components/landing/CtaSection';
import LandingNavbar from '@/components/landing/LandingNavbar';

const Landing = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState({
    features: false,
    getStarted: false,
    demo: false,
    cta: false
  });
  
  const sectionsRef = useRef<{
    [key: string]: HTMLElement | null;
  }>({
    hero: null,
    features: null,
    getStarted: null,
    demo: null,
    cta: null
  });

  // Optimized intersection observer for better performance
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const options = {
      rootMargin: '-100px 0px',
      threshold: 0.1
    };
    
    // Create observer for each section
    Object.keys(sectionsRef.current).forEach(section => {
      const element = sectionsRef.current[section];
      if (!element) return;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(section);
            setIsVisible(prev => ({ ...prev, [section]: true }));
          }
        });
      }, options);
      
      observer.observe(element);
      observers.push(observer);
    });
    
    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  // Simplified scroll function
  const scrollToSection = (sectionId: string) => {
    const section = sectionsRef.current[sectionId];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const sectionNames = Object.keys(sectionsRef.current);
  
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Navigation Bar */}
      <LandingNavbar 
        activeSection={activeSection} 
        scrollToSection={scrollToSection} 
        sections={sectionNames}
      />

      {/* Simplified Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-noise-pattern mix-blend-soft-light"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial-top opacity-30"></div>
      </div>

      {/* Hero Section */}
      <div ref={el => sectionsRef.current.hero = el}>
        <HeroSection scrollToSection={scrollToSection} />
      </div>

      {/* Features Section */}
      <div ref={el => sectionsRef.current.features = el}>
        <FeaturesSection 
          scrollToSection={scrollToSection} 
          isVisible={isVisible.features} 
        />
      </div>

      {/* How To Get Started Section */}
      <div ref={el => sectionsRef.current.getStarted = el}>
        <GetStartedSection 
          scrollToSection={scrollToSection} 
          isVisible={isVisible.getStarted} 
        />
      </div>

      {/* Demo Section */}
      <div ref={el => sectionsRef.current.demo = el}>
        <DemoSection 
          scrollToSection={scrollToSection} 
          isVisible={isVisible.demo} 
        />
      </div>

      {/* CTA Section */}
      <div ref={el => sectionsRef.current.cta = el}>
        <CtaSection 
          scrollToSection={scrollToSection} 
          isVisible={isVisible.cta} 
        />
      </div>
    </div>
  );
};

export default Landing;
