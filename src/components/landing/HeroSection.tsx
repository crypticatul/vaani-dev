
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import Logo from '@/components/common/Logo';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void;
  isVisible?: boolean;
}

const HeroSection = ({ scrollToSection, isVisible = true }: HeroSectionProps) => {
  const navigate = useNavigate();
  
  return (
    <section className="min-h-screen flex items-center justify-center hero-gradient-bg overflow-hidden">
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
  );
};

export default HeroSection;
