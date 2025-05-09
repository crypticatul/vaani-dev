
import { memo } from 'react';
import { ChevronDown, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface DemoSectionProps {
  scrollToSection: (sectionId: string) => void;
  isVisible: boolean;
}

const DemoSection = ({ scrollToSection, isVisible }: DemoSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-b from-card/80 to-black">
      <div className="container mx-auto px-4">
        <div 
          className={`text-center transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
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
  );
};

export default memo(DemoSection);
