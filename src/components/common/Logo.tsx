
import { useState, useEffect } from 'react';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'hero';
  animated?: boolean;
}

const Logo = ({ className = '', size = 'medium', animated = true }: LogoProps) => {
  const [isLoaded, setIsLoaded] = useState(!animated);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    }
  }, [animated]);

  // Determine size class
  const sizeClass = {
    'small': 'h-8',
    'medium': 'h-10',
    'large': 'h-20',
    'xlarge': 'h-32',
    'hero': 'h-40'  // Reduced hero size
  }[size];

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <img 
        src="/logo.svg" 
        alt="वाani.dev Logo" 
        className={`${sizeClass} ${animated ? 'transition-all duration-500' : ''}`}
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(-10px)'
        }}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default Logo;
