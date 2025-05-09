
import { memo } from 'react';
import { ChevronDown, Bot, Copy, Globe } from 'lucide-react';

interface GetStartedSectionProps {
  scrollToSection: (sectionId: string) => void;
  isVisible: boolean;
}

const GetStartedSection = ({ scrollToSection, isVisible }: GetStartedSectionProps) => {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-card/80">
      <div className="container mx-auto px-4">
        <div 
          className={`text-center mb-16 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
            How To Get Started?
          </h2>
          <div className="section-divider mx-auto" />
        </div>
        <div 
          className={`bg-gradient-to-br from-card/50 via-card/40 to-card/30 backdrop-blur-sm border border-primary/20 p-6 rounded-xl transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
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
  );
};

export default memo(GetStartedSection);
