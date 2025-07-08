import { ShoppingCart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import TicketSelector from "@/components/TicketSelector";
import SocialLinks from "@/components/SocialLinks";
import BottomNavigation from "@/components/BottomNavigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="px-4 pb-8">
        {/* Hero Section with Motorcycle */}
        <div className="relative mb-8">
          <img 
            src="/lovable-uploads/312253d0-5fa3-4bc9-8baf-a90534188bd1.png" 
            alt="Moto Yamaha MT-03" 
            className="w-full h-64 object-contain"
          />
          
          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-8 h-1 bg-foreground rounded-full"></div>
            <div className="w-2 h-1 bg-muted rounded-full"></div>
            <div className="w-2 h-1 bg-muted rounded-full"></div>
          </div>
        </div>

        {/* Raffle Info */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Ação X</h1>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Sorteio: Loteria Federal</span>
            <span className="text-lg font-bold text-foreground">R$1,00</span>
          </div>
        </div>

        {/* Promotions Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Promoções</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-lg p-3">
              <span className="text-primary font-bold text-lg">5</span>
              <span className="text-muted-foreground text-sm ml-1">bilhetes por</span>
              <div className="text-foreground font-bold">R$ 4,00</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <span className="text-primary font-bold text-lg">15</span>
              <span className="text-muted-foreground text-sm ml-1">bilhetes por</span>
              <div className="text-foreground font-bold">R$ 12,00</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <span className="text-primary font-bold text-lg">20</span>
              <span className="text-muted-foreground text-sm ml-1">bilhetes por</span>
              <div className="text-foreground font-bold">R$ 16,00</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <span className="text-primary font-bold text-lg">30</span>
              <span className="text-muted-foreground text-sm ml-1">bilhetes por</span>
              <div className="text-foreground font-bold">R$ 22,00</div>
            </div>
          </div>
        </div>

        {/* Ticket Selector */}
        <div className="mb-8">
          <TicketSelector />
        </div>

        {/* My Tickets Button */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="w-full h-12 bg-card border border-border text-primary hover:bg-primary/20 hover:border-primary transition-colors"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Ver meus bilhetes
          </Button>
        </div>

        {/* Social Links */}
        <div className="mb-8">
          <SocialLinks />
        </div>

        {/* Description/Regulations */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Descrição/Regulamento</h3>
          <p className="text-muted-foreground text-sm mb-4">Descrição completa...</p>
          <Link to="/regulamento">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-primary hover:bg-red-500 hover:text-white transition-colors"
            >
              <Shield className="h-4 w-4" />
              Ver nosso regulamento →
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <footer className="text-xs text-muted-foreground text-center space-y-2 pt-8 border-t border-border">
          <p>Sorteio realizado por Custom Club Cars, Inscrito sob CNPJ:</p>
          <p>XXXXXXXXXXXXXXX, Endereço em: Rua</p>
          <p>XXXXXXXXXXXXXXX, N°XXX, XXXXXX, Brasil.</p>
          <p className="pt-4">Todos os direitos reservados © 2025 -</p>
        </footer>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
