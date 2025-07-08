import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-background">
      <div className="flex items-center gap-2">
        <img
          src="/lovable-uploads/3426429b-2dfc-4a2d-9484-3932c3efec09.png"
          alt="Club Cars Logo"
          className="h-10 w-auto"
        />
      </div>
      
      <Button variant="ghost" size="icon" className="hover:bg-primary/20 hover:text-primary transition-colors">
        <Menu className="h-6 w-6" />
      </Button>
    </header>
  );
};

export default Header;