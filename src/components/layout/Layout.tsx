
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Animation variants for page content
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        when: "beforeChildren",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-grid-pattern"></div>
        <div className="absolute inset-0 bg-noise-pattern mix-blend-soft-light"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial-top opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-radial-bottom opacity-20"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-secondary/5 filter blur-3xl"></div>
      </div>
      
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Navbar />
            <motion.main 
              className="flex-1 overflow-auto p-4 md:p-6"
              initial="initial"
              animate="enter"
              exit="exit"
              variants={pageVariants}
            >
              {children}
              {/* Overlay gradient effect at the bottom */}
              <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
            </motion.main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Layout;
