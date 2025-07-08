import { Receipt, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import ResponsiveLayout from "@/components/ResponsiveLayout";

const MeusRecibos = () => {
  // Mock data - será substituído por dados reais
  const recibos = [
    {
      id: "001",
      rifa: "Kawasaki Ninja",
      quantidade: 5,
      valor: 4.00,
      data: "2024-01-15",
      status: "Pago"
    },
    {
      id: "002",
      rifa: "Honda CB600F",
      quantidade: 10,
      valor: 8.00,
      data: "2024-01-10",
      status: "Pago"
    },
    {
      id: "003",
      rifa: "Yamaha MT-03",
      quantidade: 1,
      valor: 1.00,
      data: "2024-01-08",
      status: "Pago"
    },
  ];

  return (
    <ResponsiveLayout>
      <div className="lg:hidden">
        <Header />
      </div>
      
      <main className="px-4 lg:px-8 pb-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Meus Recibos</h1>
          <p className="text-muted-foreground">Histórico de compras e recibos</p>
        </div>

        <div className="space-y-4">
          {recibos.map((recibo) => (
            <Card key={recibo.id} className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Receipt className="h-5 w-5 text-primary" />
                    <span className="text-foreground">Recibo #{recibo.id}</span>
                  </div>
                  <span className="text-sm px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                    {recibo.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-muted-foreground text-sm">Rifa:</span>
                    <div className="font-medium">{recibo.rifa}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Quantidade:</span>
                    <div className="font-medium">{recibo.quantidade} bilhetes</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Valor Total:</span>
                    <div className="font-medium text-primary">
                      R$ {recibo.valor.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-muted-foreground text-sm">Data da Compra:</span>
                  <div className="font-medium">{recibo.data}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {recibos.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum recibo encontrado
            </h3>
            <p className="text-muted-foreground">
              Você ainda não possui recibos de compras
            </p>
          </div>
        )}
      </main>
    </ResponsiveLayout>
  );
};

export default MeusRecibos;