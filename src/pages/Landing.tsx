
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Sparkles, Shield, Zap, Mic, Bot, Copy, Globe } from 'lucide-react';
import Logo from '@/components/common/Logo';

const Landing = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('hero');
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({
    hero: null,
    features: null,
    getStarted: null,
    demo: null,
    cta: null,
  });

  // Smooth scrolling effect
  const scrollToSection = (sectionId: string) => {
    const section = sectionsRef.current[sectionId];
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Track which section is currently in view
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      Object.keys(sectionsRef.current).forEach((sectionId) => {
        const section = sectionsRef.current[sectionId];
        if (!section) return;
        
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Conversations",
      description: "Create intelligent voice agents that understand and respond naturally"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and data protection for your peace of mind"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Real-time responses with minimal latency for smooth interactions"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Navigation Indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4 px-6 bg-black/50 backdrop-blur-sm">
        <div className="flex gap-4 md:gap-6">
          {Object.keys(sectionsRef.current).map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className={`relative px-3 py-1 text-sm transition-all duration-300 ${
                activeSection === section 
                  ? 'text-primary' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
              {activeSection === section && (
                <motion.div 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                  layoutId="activeSection"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-grid-pattern"></div>
        <div className="absolute inset-0 bg-noise-pattern mix-blend-soft-light"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial-top opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-radial-bottom opacity-20"></div>
      </div>

      {/* Hero Section */}
      <section 
        ref={el => sectionsRef.current.hero = el} 
        className="min-h-screen flex items-center justify-center hero-gradient-bg overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="sound-wave-bg absolute inset-0 pointer-events-none"></div>
        <div className="wave-pattern absolute inset-0 pointer-events-none"></div>
        
        {/* Animated Purple Blobs */}
        <motion.div 
          className="purple-blob absolute w-96 h-96 top-20 left-20 opacity-30 z-0"
          initial={{ scale: 0.8, opacity: 0.2 }}
          animate={{ 
            scale: [0.8, 1.2, 0.8],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="purple-blob absolute w-96 h-96 bottom-20 right-20 opacity-30 z-0"
          initial={{ scale: 1, opacity: 0.3 }}
          animate={{ 
            scale: [1, 0.7, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
        />
        
        {/* Animated Sound Wave Visual */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 opacity-10">
          <motion.div 
            className="sound-wave flex items-center justify-center gap-1"
            initial="hidden"
            animate="visible"
          >
            {[...Array(12)].map((_, i) => (
              <motion.span
                key={i}
                className={`w-1 rounded-full ${i % 2 === 0 ? 'bg-primary' : 'bg-[#BD00FF]'}`}
                initial={{ height: 5 }}
                animate={{ 
                  height: [5, 30, 5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </div>

        <motion.div
          className="container mx-auto px-4 text-center z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Centered Logo */}
          <motion.div variants={itemVariants} className="flex justify-center w-full">
            <Logo className="mx-auto" size="hero" />
          </motion.div>
          
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 text-gradient"
            variants={itemVariants}
          >
            Vaani.dev
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
           Create sophisticated AI voice agents that understand, learn, and engage naturally with your users.
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <Button
              onClick={() => navigate('/dashboard')}
              className="gradient-btn text-white px-8 py-6 text-lg rounded-full hover:scale-105 transform transition-all duration-300"
            >
              Get Started
            </Button>
          </motion.div>
          
          {/* Centered Chevron Down */}
          <div className="w-full flex justify-center">
            <motion.button 
              className="scroll-down-btn mt-20"
              onClick={() => scrollToSection('features')}
              variants={itemVariants}
              whileHover={{ y: 5 }}
            >
              <ChevronDown className="w-8 h-8 text-primary animate-bounce" />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section 
        ref={el => sectionsRef.current.features = el}
        className="py-20 bg-black"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              Powerful Features
            </h2>
            <div className="section-divider mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="feature-card p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <feature.icon className="w-12 h-12 text-primary mb-4 neo-glow" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-16">
            <motion.button 
              className="scroll-down-btn"
              onClick={() => scrollToSection('getStarted')}
              whileHover={{ y: 5 }}
            >
              <ChevronDown className="w-8 h-8 text-primary animate-bounce" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* How To Get Started Section */}
      <section
        ref={el => sectionsRef.current.getStarted = el}
        className="py-20 bg-gradient-to-b from-black to-card/80"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              How To Get Started?
            </h2>
            <div className="section-divider mx-auto" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-card/50 via-card/40 to-card/30 backdrop-blur-md border border-primary/20 p-6 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="feature-card p-6 rounded-xl">
                  <Bot className="w-12 h-12 text-primary mb-4 neo-glow" />
                  <h3 className="text-xl font-semibold mb-2">Create Agent</h3>
                  <p className="text-gray-400">Easily configure your AI voice agent with a few clicks.</p>
                </div>
                <div className="feature-card p-6 rounded-xl">
                  <Copy className="w-12 h-12 text-primary mb-4 neo-glow" />
                  <h3 className="text-xl font-semibold mb-2">Copy Embed Code</h3>
                  <p className="text-gray-400">Grab the provided snippet to seamlessly integrate.</p>
                </div>
                <div className="feature-card p-6 rounded-xl">
                  <Globe className="w-12 h-12 text-primary mb-4 neo-glow" />
                  <h3 className="text-xl font-semibold mb-2">Paste to Your Website</h3>
                  <p className="text-gray-400">Paste the embed code into your site and go live.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center mt-16">
            <motion.button 
              className="scroll-down-btn"
              onClick={() => scrollToSection('demo')}
              whileHover={{ y: 5 }}
            >
              <ChevronDown className="w-8 h-8 text-primary animate-bounce" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Demo View Section */}
      <section
        ref={el => sectionsRef.current.demo = el}
        className="py-20 bg-gradient-to-b from-card/80 to-black"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-10 text-glow">See It In Action</h2>
            <div className="bg-gradient-to-br from-card/50 via-card/40 to-card/30 backdrop-blur-md border border-primary/20 p-6 rounded-xl overflow-hidden relative">
              <div className="aspect-w-16 aspect-h-9 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <Bot className="w-16 h-16 text-primary mb-4 neo-glow" />
                  <p className="text-lg text-gray-300">Interactive Demo</p>
                  <Button 
                    onClick={() => navigate('/agents/preview/demo')} 
                    className="mt-4 gradient-btn"
                  >
                    Try Demo Agent
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center mt-16">
            <motion.button 
              className="scroll-down-btn"
              onClick={() => scrollToSection('cta')}
              whileHover={{ y: 5 }}
            >
              <ChevronDown className="w-8 h-8 text-primary animate-bounce" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section 
        ref={el => sectionsRef.current.cta = el}
        className="py-20 bg-gradient-to-br from-black to-card"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="mb-8 inline-flex"
            initial={{ y: 0 }}
            animate={{ y: [-10, 10, -10] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-secondary to-purple-500 flex items-center justify-center neo-glow">
              <Mic className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-glow">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Start creating your own AI voice agents in minutes. No coding required.
            </p>
            <Button
              onClick={() => navigate('/dashboard')}
              className="gradient-btn text-white px-8 py-6 text-lg rounded-full hover:scale-105 transform transition-all duration-300"
            >
              Create Your First Agent
            </Button>

            <div className="flex justify-center mt-16">
              <motion.button 
                className="scroll-down-btn"
                onClick={() => scrollToSection('hero')}
                whileHover={{ y: -5 }}
              >
                <ChevronUp className="w-8 h-8 text-primary animate-bounce" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
