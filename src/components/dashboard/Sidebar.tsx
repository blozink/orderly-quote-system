
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ClipboardList, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
}

const NavItem = ({ to, icon: Icon, label, collapsed }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink to={to} className="block">
            <Button 
              variant="ghost" 
              className={`w-full justify-start mb-1 ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'} transition-all duration-200`}
            >
              <Icon className={`h-5 w-5 ${collapsed ? "" : "mr-2"}`} />
              {!collapsed && <span>{label}</span>}
            </Button>
          </NavLink>
        </TooltipTrigger>
        {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  
  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/orders", icon: ShoppingBag, label: "Completed Orders" },
    { to: "/drafts", icon: ClipboardList, label: "Preliminary Orders" },
    { to: "/settings", icon: Settings, label: "Settings" },
    { to: "/help", icon: HelpCircle, label: "Help & Support" },
  ];
  
  const sidebarWidth = collapsed ? "w-[70px]" : "w-[250px]";
  
  return (
    <div className={`${sidebarWidth} h-screen bg-card border-r border-border/60 transition-all duration-300 ease-out relative`}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute -right-3 top-12 h-6 w-6 rounded-full border border-border/60 bg-background shadow-sm hover:bg-secondary" 
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>
      
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={`p-4 flex items-center ${collapsed ? "justify-center" : "justify-between"} border-b border-border/60`}>
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-md">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            {!collapsed && (
              <div className="ml-2 font-semibold text-lg tracking-tight">
                OrderFlow
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                collapsed={collapsed}
              />
            ))}
          </nav>
        </ScrollArea>
        
        {/* User */}
        <div className="p-4 border-t border-border/60">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={user?.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.name?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="ml-2 flex-1 truncate">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            )}
          </div>
          
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start mt-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={logout}
                >
                  <LogOut className={`h-5 w-5 ${collapsed ? "" : "mr-2"}`} />
                  {!collapsed && <span>Sign out</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">Sign out</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
