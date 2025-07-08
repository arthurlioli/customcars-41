import { ReactNode } from "react";
import DesktopSidebar from "./DesktopSidebar";
import BottomNavigation from "./BottomNavigation";

interface ResponsiveLayoutProps {
  children: ReactNode;
}

const ResponsiveLayout = ({ children }: ResponsiveLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      
      <div className="lg:pl-64">
        <div className="pb-20 lg:pb-0">
          {children}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default ResponsiveLayout;