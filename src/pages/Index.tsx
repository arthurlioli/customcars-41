import { ShoppingCart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import TicketSelector from "@/components/TicketSelector";
import SocialLinks from "@/components/SocialLinks";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import ImageCarousel from "@/components/ImageCarousel";
import audiImage1 from "/lovable-uploads/776f6bdf-1e99-40c0-b11e-a8572a38c7fc.png";
import audiImage2 from "/lovable-uploads/2b050f1e-bcd6-4104-ac01-055eed20d6c9.png";
import audiImage3 from "/lovable-uploads/0ea4bf69-ac2e-40da-bf6d-9f780d26dac1.png";

const Index = () => {
  const carouselImages = [
    { src: audiImage1, alt: "Audi RS3 Cinza" },
    { src: audiImage2, alt: "Audi RS3 Estacionado" },
    { src: audiImage3, alt: "Audi RS3 Esportivo" },
  ];

  return (
    <ResponsiveLayout>
      <div className="lg:hidden">
        <Header />
      </div>
      
      <main className="px-4 lg:px-8 pb-8">
        {/* Hero Section with Motorcycle Carousel */}
        <ImageCarousel images={carouselImages} />

        {/* Raffle Info */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Audi A3 com body kit da rs3 + de 350cv</h1>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Sorteio: Loteria Federal</span>
            <span className="text-lg font-bold text-foreground">R$4,99</span>
          </div>
        </div>

        {/* Promotions Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Promoções</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-lg p-3">
              <span className="text-primary font-bold text-lg">5</span>
              <span className="text-muted-foreground text-sm ml-1">bilhetes por</span>
              <div className="text-foreground font-bold">R$ 20,00</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <span className="text-primary font-bold text-lg">15</span>
              <span className="text-muted-foreground text-sm ml-1">bilhetes por</span>
              <div className="text-foreground font-bold">R$ 60,00</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <span className="text-primary font-bold text-lg">20</span>
              <span className="text-muted-foreground text-sm ml-1">bilhetes por</span>
              <div className="text-foreground font-bold">R$ 80,00</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <span className="text-primary font-bold text-lg">30</span>
              <span className="text-muted-foreground text-sm ml-1">bilhetes por</span>
              <div className="text-foreground font-bold">R$ 120,00</div>
            </div>
          </div>
        </div>

        {/* Ticket Selector */}
        <div className="mb-8">
          <TicketSelector />
        </div>

        {/* My Tickets Button */}
        <div className="mb-8">
          <Link to="/meus-bilhetes">
            <Button 
              variant="ghost" 
              className="w-full h-12 bg-card border border-border text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Ver meus bilhetes
            </Button>
          </Link>
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
              className="flex items-center gap-2 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
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
    </ResponsiveLayout>
  );
};

export default Index;
