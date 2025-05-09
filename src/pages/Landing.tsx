
import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Sparkles, Shield, Zap, Mic, Bot, Copy, Globe } from 'lucide-react';
import Logo from '@/components/common/Logo';

// Simple loading component to use with lazy loading
const LoadingFallback = () => <div className="flex items-center justify-center h-40">
  <div className="animate-pulse w-8 h-8 rounded-full bg-primary/50"></div>
</div>;

const Landing = () => {
  const navigate = useNavigate();
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
  
  const features = [{
    icon: Sparkles,
    title: "AI-Powered Conversations",
    description: "Create intelligent voice agents that understand and respond naturally"
  }, {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption and data protection for your peace of mind"
  }, {
    icon: Zap,
    title: "Lightning Fast",
    description: "Real-time responses with minimal latency for smooth interactions"
  }];
  
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Lighter Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4 px-6 bg-black/50 backdrop-blur-sm">
        <div className="flex gap-4 md:gap-6">
          {Object.keys(sectionsRef.current).map(section => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className={`relative px-3 py-1 text-sm transition-all duration-300 ${
                activeSection === section ? 'text-primary' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
              {activeSection === section && (
                <div 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" 
                  style={{ 
                    transform: 'scaleX(1)',
                    transition: 'transform 0.3s ease'
                  }} 
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Simplified Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-noise-pattern mix-blend-soft-light"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial-top opacity-30"></div>
      </div>

      {/* Hero Section - Simplified */}
      <section ref={el => sectionsRef.current.hero = el} className="min-h-screen flex items-center justify-center hero-gradient-bg overflow-hidden">
        <div className="container mx-auto px-4 text-center z-10" style={{opacity: 1, transform: 'none'}}>
          {/* Logo */}
          <div className="flex justify-center w-full">
            <Logo className="mx-auto" size="large" animated={false} />
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
           Create sophisticated AI voice agents that understand, learn, and engage naturally with your users.
          </p>
          
          <div>
            <Button onClick={() => navigate('/dashboard')} className="gradient-btn text-white px-8 py-6 text-lg rounded-full hover:scale-105 transform transition-all duration-300">
              Get Started
            </Button>
          </div>
          
          {/* Chevron Down */}
          <div className="w-full flex justify-center">
            <button className="scroll-down-btn mt-20" onClick={() => scrollToSection('features')}>
              <ChevronDown className="w-8 h-8 text-primary animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section - Optimized */}
      <section ref={el => sectionsRef.current.features = el} className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div 
            className={`text-center mb-16 transition-opacity duration-700 ${isVisible.features ? 'opacity-100' : 'opacity-0'}`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              Powerful Features
            </h2>
            <div className="section-divider mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`feature-card p-6 rounded-xl transition-all duration-500 delay-${index * 100} ${
                  isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-16">
            <button className="scroll-down-btn" onClick={() => scrollToSection('getStarted')}>
              <ChevronDown className="w-8 h-8 text-primary animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* How To Get Started Section - Optimized */}
      <section ref={el => sectionsRef.current.getStarted = el} className="py-20 bg-gradient-to-b from-black to-card/80">
        <div className="container mx-auto px-4">
          <div 
            className={`text-center mb-16 transition-opacity duration-700 ${isVisible.getStarted ? 'opacity-100' : 'opacity-0'}`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              How To Get Started?
            </h2>
            <div className="section-divider mx-auto" />
          </div>
          <div 
            className={`bg-gradient-to-br from-card/50 via-card/40 to-card/30 backdrop-blur-sm border border-primary/20 p-6 rounded-xl transition-all duration-500 ${
              isVisible.getStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="feature-card p-6 rounded-xl">
                <Bot className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Create Agent</h3>
                <p className="text-gray-400">Easily configure your AI voice agent with a few clicks.</p>
              </div>
              <div className="feature-card p-6 rounded-xl">
                <Copy className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Copy Embed Code</h3>
                <p className="text-gray-400">Grab the provided snippet to seamlessly integrate.</p>
              </div>
              <div className="feature-card p-6 rounded-xl">
                <Globe className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Paste to Your Website</h3>
                <p className="text-gray-400">Paste the embed code into your site and go live.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-16">
            <button className="scroll-down-btn" onClick={() => scrollToSection('demo')}>
              <ChevronDown className="w-8 h-8 text-primary animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* Demo View Section - Optimized */}
      <section ref={el => sectionsRef.current.demo = el} className="py-20 bg-gradient-to-b from-card/80 to-black">
        <div className="container mx-auto px-4">
          <div 
            className={`text-center transition-all duration-500 ${
              isVisible.demo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h2 className="text-4xl font-bold mb-10 text-glow">See It In Action</h2>
            <div className="bg-gradient-to-br from-card/50 via-card/40 to-card/30 backdrop-blur-sm border border-primary/20 p-6 rounded-xl overflow-hidden relative">
              <div className="aspect-w-16 aspect-h-9 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <Bot className="w-16 h-16 text-primary mb-4" />
                  <p className="text-lg text-gray-300">Interactive Demo</p>
                  <Button onClick={() => navigate('/agents/preview/demo')} className="mt-4 gradient-btn">
                    Try Demo Agent
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-16">
            <button className="scroll-down-btn" onClick={() => scrollToSection('cta')}>
              <ChevronDown className="w-8 h-8 text-primary animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action - Optimized */}
      <section ref={el => sectionsRef.current.cta = el} className="py-20 bg-gradient-to-br from-black to-card">
        <div className="container mx-auto px-4 text-center">
          <div 
            className={`mb-8 inline-flex transition-all duration-700 ${
              isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-secondary to-purple-500 flex items-center justify-center">
              <Mic className="w-12 h-12 text-white" />
            </div>
          </div>
          <div 
            className={`transition-all duration-500 delay-300 ${
              isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h2 className="text-4xl font-bold mb-6 text-glow">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Start creating your own AI voice agents in minutes. No coding required.
            </p>
            <Button onClick={() => navigate('/dashboard')} className="gradient-btn text-white px-8 py-6 text-lg rounded-full hover:scale-105 transform transition-all duration-300">
              Create Your First Agent
            </Button>

            <div className="flex justify-center mt-16">
              <button className="scroll-down-btn" onClick={() => scrollToSection('hero')}>
                <ChevronUp className="w-8 h-8 text-primary animate-bounce" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
