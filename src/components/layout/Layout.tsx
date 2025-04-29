
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Navbar />
            <motion.main 
              className="flex-1 overflow-auto p-4 md:p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Layout;
