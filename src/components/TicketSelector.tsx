import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [selectedQuantity, setSelectedQuantity] = useState(30);
  const [customQuantity, setCustomQuantity] = useState(1);

  return (
    <div className="space-y-6">
      {/* Ticket Options Grid */}
      <div className="grid grid-cols-3 gap-3">
        {ticketOptions.map((option) => (
          <Button
            key={option.quantity}
            variant="ghost"
            onClick={() => setSelectedQuantity(option.quantity)}
            className={cn(
              "relative h-16 flex flex-col items-center justify-center border border-border bg-card text-card-foreground hover:bg-muted",
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
          onClick={() => setCustomQuantity(Math.max(1, customQuantity - 1))}
          className="w-12 h-12 bg-card border border-border"
        >
          -
        </Button>
        <div className="flex-1 text-center">
          <span className="text-2xl font-bold">+{customQuantity}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCustomQuantity(customQuantity + 1)}
          className="w-12 h-12 bg-card border border-border"
        >
          +
        </Button>
      </div>

      {/* Participate Button */}
      <Button 
        className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-lg"
      >
        Participar (R${(selectedQuantity || customQuantity).toFixed(2).replace('.', ',')})
      </Button>
    </div>
  );
};

export default TicketSelector;