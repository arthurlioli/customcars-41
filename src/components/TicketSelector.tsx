import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PixCheckout from "./PixCheckout";
import { useToast } from "@/hooks/use-toast";

interface TicketOption {
  quantity: number;
  popular?: boolean;
}

const ticketOptions: TicketOption[] = [
  { quantity: 1 },
  { quantity: 15 },
  { quantity: 30, popular: true },
  { quantity: 100 },
  { quantity: 500 },
  { quantity: 1000 },
];

const TicketSelector = () => {
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(30);
  const [customQuantity, setCustomQuantity] = useState(30);
  const [showCheckout, setShowCheckout] = useState(false);
  const { toast } = useToast();

  const handlePayment = () => {
    setShowCheckout(true);
  };

  const currentQuantity = selectedQuantity || customQuantity;
  
  // Sistema de descontos progressivos
  const getTicketPrice = (quantity: number) => {
    if (quantity >= 100) return 3.99;
    if (quantity >= 40) return 4.29;
    if (quantity >= 10) return 4.49;
    return 4.99;
  };
  
  const ticketPrice = getTicketPrice(currentQuantity);
  const totalPrice = (currentQuantity * ticketPrice).toFixed(2).replace('.', ',');

  return (
    <div className="space-y-6">
      {/* Ticket Options Grid */}
      <div className="grid grid-cols-3 gap-3">
        {ticketOptions.map((option) => (
          <Button
            key={option.quantity}
            variant="ghost"
            onClick={() => {
              setSelectedQuantity(option.quantity);
              setCustomQuantity(option.quantity);
            }}
            className={cn(
              "relative h-16 flex flex-col items-center justify-center border border-border bg-card text-card-foreground hover:bg-primary/20 hover:border-primary transition-colors",
              selectedQuantity === option.quantity && "border-primary bg-primary/10",
              option.popular && "border-primary"
            )}
          >
            {option.popular && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                MAIS POPULAR
              </div>
            )}
            <span className="text-xs text-muted-foreground">SELECIONAR</span>
            <span className="text-lg font-bold">+{option.quantity}</span>
          </Button>
        ))}
      </div>

      {/* Custom Quantity Selector */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const newQuantity = Math.max(1, customQuantity - 1);
            setCustomQuantity(newQuantity);
            setSelectedQuantity(null);
          }}
          className="w-12 h-12 bg-card border border-border hover:bg-primary/20 hover:border-primary transition-colors"
        >
          -
        </Button>
        <div className="flex-1 text-center">
          <span className="text-2xl font-bold">+{customQuantity}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const newQuantity = customQuantity + 1;
            setCustomQuantity(newQuantity);
            setSelectedQuantity(null);
          }}
          className="w-12 h-12 bg-card border border-border hover:bg-primary/20 hover:border-primary transition-colors"
        >
          +
        </Button>
      </div>

      {/* Price Display */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Quantidade:</span>
          <span className="font-semibold">{currentQuantity} bilhetes</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Preço unitário:</span>
          <span className="font-semibold">R$ {ticketPrice.toFixed(2).replace('.', ',')}</span>
        </div>
        {currentQuantity >= 10 && (
          <div className="text-green-600 text-sm font-medium">
            {currentQuantity >= 100 ? '🎉 Desconto máximo aplicado!' : 
             currentQuantity >= 40 ? '🎉 Desconto especial aplicado!' : 
             '🎉 Desconto aplicado!'}
          </div>
        )}
        <div className="border-t border-border pt-2">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total:</span>
            <span className="text-primary">R$ {totalPrice}</span>
          </div>
        </div>
      </div>

      {/* Participate Button */}
      <Button 
        onClick={handlePayment}
        className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-lg"
      >
        Participar Agora
      </Button>

      {/* PIX Checkout Modal */}
      {showCheckout && (
        <PixCheckout
          quantity={currentQuantity}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
};

export default TicketSelector;