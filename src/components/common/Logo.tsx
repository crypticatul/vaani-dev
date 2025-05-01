
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

const Logo = ({ className = '', size = 'medium', animated = true }: LogoProps) => {
  // Determine size class
  const sizeClass = {
    'small': 'h-8',
    'medium': 'h-10',
    'large': 'h-20'
  }[size];

  return (
    <div className={`inline-flex items-center ${className}`}>
      {animated ? (
        <motion.img 
          src="/logo.svg" 
          alt="वाani.dev Logo" 
          className={sizeClass}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.7,
            ease: "easeInOut"
          }}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.3 }
          }}
        />
      ) : (
        <img 
          src="/logo.svg" 
          alt="वाani.dev Logo" 
          className={sizeClass}
        />
      )}
    </div>
  );
};

export default Logo;
