
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const Logo = ({ className = '', size = 'medium' }: LogoProps) => {
  // Determine size class
  const sizeClass = {
    'small': 'h-8',
    'medium': 'h-10',
    'large': 'h-14'
  }[size];

  return (
    <div className={`inline-flex items-center ${className}`}>
      <motion.img 
        src="/logo.svg" 
        alt="वाani.dev Logo" 
        className={sizeClass}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

export default Logo;
