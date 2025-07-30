import { MessageCircle, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const SocialLinks = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Redes sociais</h3>
      <div className="flex gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-green-500 hover:bg-primary text-white"
          onClick={() => window.open(`https://wa.me/5519974193116`, '_blank')}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:opacity-90 text-white"
          onClick={() => window.open('https://www.instagram.com/customclub_cars/', '_blank')}
        >
          <Instagram className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default SocialLinks;