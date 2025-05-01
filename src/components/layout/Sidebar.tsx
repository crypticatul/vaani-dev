
import { Home, MessageCircle, History, Settings, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
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

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
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
  
  return (
    <SidebarComponent>
      <SidebarHeader className="py-4">
        <div className="px-4">
          <h3 className="text-lg font-bold neon-text">Vaani.dev</h3>
        </div>
        <div className="px-2 pt-4">
          <Button 
            onClick={() => navigate('/agents/create')}
            className="w-full flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Agent</span>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    isActive={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon size={20} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="py-4 px-4">
        <div className="text-xs text-muted-foreground">
          Vaani.dev © {new Date().getFullYear()}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Powered by cutting-edge AI from Cognitiev.com. A brand of Kritrima AI Technologies Private Limited.
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
