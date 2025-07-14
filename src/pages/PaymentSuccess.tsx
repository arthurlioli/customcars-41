import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Check, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState<any>(null);
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  const fetchOrderData = async () => {
    try {
      // Como ainda não temos as tabelas criadas no banco, vamos simular os dados
      const data = {
        id: orderId,
        quantity: 30,
        amount: 149.70,
        status: 'paid'
      };
      
      setOrderData(data);
    } catch (error) {
      console.error("Erro ao buscar dados do pedido:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-foreground">Pagamento Aprovado!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Seu pagamento foi processado com sucesso!
          </p>
          
          {orderData && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>Quantidade:</strong> {orderData.quantity} bilhetes
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Valor:</strong> R$ {orderData.amount?.toFixed(2).replace('.', ',')}
              </p>
            </div>
          )}

          <div className="space-y-2 pt-4">
            <Link to="/meus-bilhetes">
              <Button className="w-full" variant="default">
                <Ticket className="w-4 h-4 mr-2" />
                Ver Meus Bilhetes
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full">
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;