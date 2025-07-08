import { Home, ShoppingCart, User, Award, FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const DesktopSidebar = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Início", path: "/" },
    { icon: ShoppingCart, label: "Meus Bilhetes", path: "/meus-bilhetes" },
    { icon: Award, label: "Ganhadores", path: "/ganhadores" },
    { icon: FileText, label: "Regulamento", path: "/regulamento" },
    { icon: User, label: "Perfil", path: "/perfil" },
  ];

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-card lg:border-r lg:border-border">
      <div className="h-16 border-b border-border">
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm font-medium",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-primary hover:text-primary-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default DesktopSidebar;