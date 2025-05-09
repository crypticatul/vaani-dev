
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Simpler Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-noise-pattern mix-blend-soft-light"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial-top opacity-30"></div>
      </div>
      
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Navbar />
            <main 
              className="flex-1 overflow-auto p-4 md:p-6"
              style={{
                opacity: 1,
                transform: 'none',
                transition: 'opacity 0.4s ease, transform 0.4s ease'
              }}
            >
              {children}
              {/* Overlay gradient effect at the bottom */}
              <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Layout;
