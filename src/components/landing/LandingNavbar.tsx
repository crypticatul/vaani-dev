
import { memo } from 'react';

interface LandingNavbarProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
  sections: string[];
}

const LandingNavbar = ({ activeSection, scrollToSection, sections }: LandingNavbarProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4 px-6 bg-black/50 backdrop-blur-sm">
      <div className="flex gap-4 md:gap-6">
        {sections.map((section) => (
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
  );
};

export default memo(LandingNavbar);
