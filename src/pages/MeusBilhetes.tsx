import { ArrowLeft, Calendar, Trophy, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";

const MeusBilhetes = () => {
  // Mock data - será substituído por dados reais do Supabase
  const bilhetes = [
    {
      id: 1,
      acao: "Ação X - Yamaha MT-03",
      numerosBilhetes: ["00123", "00124", "00125"],
      valor: 3.00,
      dataCompra: "2024-12-08",
      status: "Ativo",
      dataSorteio: "2024-12-25"
    },
    {
      id: 2,
      acao: "Ação Y - Honda CB600F",
      numerosBilhetes: ["00456", "00457"],
      valor: 2.00,
      dataCompra: "2024-12-07",
      status: "Finalizado",
      dataSorteio: "2024-12-07",
      resultado: "Não contemplado"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b border-border">
        <Link to="/">
          <Button variant="ghost" size="icon" className="hover:bg-primary/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground">Meus Bilhetes</h1>
      </header>

      {/* Content */}
      <div className="p-4 space-y-4">
        {bilhetes.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Nenhum bilhete encontrado
            </h2>
            <p className="text-muted-foreground mb-6">
              Você ainda não possui bilhetes de rifas
            </p>
            <Link to="/">
              <Button className="bg-primary hover:bg-primary/90">
                Comprar Bilhetes
              </Button>
            </Link>
          </div>
        ) : (
          bilhetes.map((bilhete) => (
            <div
              key={bilhete.id}
              className="bg-card border border-border rounded-lg p-4 space-y-3"
            >
              {/* Header do bilhete */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{bilhete.acao}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    bilhete.status === "Ativo"
                      ? "bg-green-500/20 text-green-400"
                      : bilhete.resultado === "Não contemplado"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {bilhete.status}
                </span>
              </div>

              {/* Números dos bilhetes */}
              <div>
                <span className="text-sm text-muted-foreground">Números:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {bilhete.numerosBilhetes.map((numero) => (
                    <span
                      key={numero}
                      className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono"
                    >
                      {numero}
                    </span>
                  ))}
                </div>
              </div>

              {/* Informações adicionais */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-muted-foreground">Compra</div>
                    <div className="font-medium">{bilhete.dataCompra}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-muted-foreground">Sorteio</div>
                    <div className="font-medium">{bilhete.dataSorteio}</div>
                  </div>
                </div>
              </div>

              {/* Valor pago */}
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-muted-foreground">Valor pago:</span>
                <span className="font-bold text-lg text-foreground">
                  R$ {bilhete.valor.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {/* Resultado (se houver) */}
              {bilhete.resultado && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">Resultado:</div>
                  <div className="font-medium text-foreground">{bilhete.resultado}</div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MeusBilhetes;