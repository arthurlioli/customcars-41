import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-background">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">C</span>
        </div>
        <div className="text-foreground">
          <div className="text-sm font-bold leading-none">CUSTOM</div>
          <div className="text-xs text-primary leading-none">CLUB CARS</div>
        </div>
      </div>
      
      <Button variant="ghost" size="icon" className="hover:bg-primary/20 hover:text-primary transition-colors">
        <Menu className="h-6 w-6" />
      </Button>
    </header>
  );
};

export default Header;