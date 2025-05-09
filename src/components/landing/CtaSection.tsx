
import { memo } from 'react';
import { ChevronUp, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface CtaSectionProps {
  scrollToSection: (sectionId: string) => void;
  isVisible: boolean;
}

const CtaSection = ({ scrollToSection, isVisible }: CtaSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-black to-card">
      <div className="container mx-auto px-4 text-center">
        <div 
          className={`mb-8 inline-flex transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-secondary to-purple-500 flex items-center justify-center">
            <Mic className="w-12 h-12 text-white" />
          </div>
        </div>
        <div 
          className={`transition-all duration-500 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
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
  );
};

export default memo(CtaSection);
