import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QrCode, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PixCheckoutProps {
  quantity: number;
  onClose: () => void;
}

const PixCheckout = ({ quantity, onClose }: PixCheckoutProps) => {
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: ""
  });
  const [pixData, setPixData] = useState<{
    qr_code?: string;
    qr_code_base64?: string;
    payment_id?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-pix-payment', {
        body: { 
          quantity,
          customer: {
            name: customerData.name,
            email: customerData.email,
            identification: {
              type: "CPF",
              number: customerData.cpf.replace(/\D/g, "")
            }
          }
        }
      });

      if (error) throw error;

      if (data?.qr_code) {
        setPixData(data);
      } else {
        throw new Error('Dados do PIX não recebidos');
      }
    } catch (error: any) {
      console.error('Erro no pagamento:', error);
      toast({
        title: "Erro no pagamento",
        description: error.message || "Ocorreu um erro ao processar o pagamento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = () => {
    if (pixData?.qr_code) {
      navigator.clipboard.writeText(pixData.qr_code);
      toast({
        title: "Código copiado!",
        description: "Cole no seu app do banco para pagar",
      });
    }
  };

  const total = quantity * 4.99;

  if (pixData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <QrCode className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-xl font-bold">Pagamento PIX</CardTitle>
            <p className="text-muted-foreground">
              Use o QR Code ou código para pagar
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {pixData.qr_code_base64 && (
              <div className="flex justify-center">
                <img 
                  src={`data:image/png;base64,${pixData.qr_code_base64}`}
                  alt="QR Code PIX"
                  className="w-48 h-48"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Código PIX Copia e Cola</Label>
              <div className="flex gap-2">
                <Input
                  value={pixData.qr_code || ""}
                  readOnly
                  className="text-xs"
                />
                <Button
                  onClick={copyPixCode}
                  variant="outline"
                  size="icon"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            <div className="text-sm text-muted-foreground text-center">
              <p>Valor: R$ {total.toFixed(2).replace('.', ',')}</p>
              <p>Quantidade: {quantity} rifas</p>
              <p className="mt-2 text-xs">
                Após o pagamento, seus números serão gerados automaticamente
              </p>
            </div>

            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Fechar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Finalizar Compra</CardTitle>
          <p className="text-muted-foreground">
            Preencha seus dados para gerar o PIX
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={customerData.name}
                onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={customerData.email}
                onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={customerData.cpf}
                onChange={(e) => setCustomerData(prev => ({ 
                  ...prev, 
                  cpf: formatCPF(e.target.value) 
                }))}
                placeholder="000.000.000-00"
                maxLength={14}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Celular</Label>
              <Input
                id="phone"
                value={customerData.phone}
                onChange={(e) => setCustomerData(prev => ({ 
                  ...prev, 
                  phone: formatPhone(e.target.value) 
                }))}
                placeholder="(11) 99999-9999"
                maxLength={15}
                required
              />
            </div>

            <Separator />

            <div className="text-center">
              <p className="text-lg font-semibold">
                Total: R$ {total.toFixed(2).replace('.', ',')}
              </p>
              <p className="text-sm text-muted-foreground">
                {quantity} rifas × R$ 4,99
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Gerando PIX..." : "Gerar PIX"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PixCheckout;