
import { Home, MessageCircle, History, Settings, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Logo from "@/components/common/Logo";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  const mainNavItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/",
    },
    {
      title: "My Agents",
      icon: MessageCircle,
      path: "/agents",
    },
    {
      title: "History",
      icon: History,
      path: "/history",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  
  return (
    <SidebarComponent className={`transition-all duration-300 ${collapsed ? 'w-20' : ''}`}>
      <SidebarHeader className={`py-4 flex flex-col ${collapsed ? 'items-center' : ''}`}>
        <div className={`px-4 flex ${collapsed ? 'justify-center' : 'items-center'}`}>
          <Logo size={collapsed ? "small" : "medium"} />
        </div>
        <div className={`${collapsed ? 'px-2' : 'px-2'} pt-4`}>
          {collapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={() => navigate('/agents/create')}
                    className="w-12 h-12 rounded-full flex items-center justify-center neo-glow"
                    size="icon"
                  >
                    <Plus size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">New Agent</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button 
              onClick={() => navigate('/agents/create')}
              className="w-full flex items-center gap-2 neo-glow"
            >
              <Plus size={16} />
              <span>New Agent</span>
            </Button>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleCollapse} 
          className="absolute -right-3 top-10 h-6 w-6 rounded-full border border-primary/20 bg-card shadow-md z-20"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  {collapsed ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            className={`sidebar-icon ${location.pathname === item.path ? 'active' : ''}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(item.path)}
                          >
                            <item.icon size={24} className="neo-glow-icon" /> {/* Increased icon size */}
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent side="right">{item.title}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <SidebarMenuButton 
                      isActive={location.pathname === item.path}
                      onClick={() => navigate(item.path)}
                      className="group transition-all duration-300 hover:neo-glow"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-3" // Increased gap for more spacing
                      >
                        <item.icon 
                          size={22} 
                          className={`${location.pathname === item.path ? 'text-white neo-glow-icon' : 'text-primary'} group-hover:text-white transition-colors duration-300`} 
                        />
                        <span className="text-base">{item.title}</span> {/* Slightly increased text size */}
                      </motion.div>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className={`py-4 ${collapsed ? 'px-2 text-center' : 'px-4'}`}>
        {!collapsed && (
          <>
            <div className="text-xs text-muted-foreground">
              Vaani.dev © {new Date().getFullYear()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Powered by cutting-edge AI from Cognitiev.com
            </div>
          </>
        )}
        {collapsed && (
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}
          </div>
        )}
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
