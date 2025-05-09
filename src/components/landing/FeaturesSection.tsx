
import { memo } from 'react';
import { ChevronDown, Sparkles, Shield, Zap } from 'lucide-react';

interface FeaturesSectionProps {
  scrollToSection: (sectionId: string) => void;
  isVisible: boolean;
}

const FeaturesSection = ({ scrollToSection, isVisible }: FeaturesSectionProps) => {
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
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div 
          className={`text-center mb-16 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
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
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
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
  );
};

export default memo(FeaturesSection);
