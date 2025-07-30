import { ArrowLeft, Trophy, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ResponsiveLayout from "@/components/ResponsiveLayout";

const Ganhadores = () => {
  // Dados reais serão carregados do banco de dados
  const ganhadores: any[] = [];

  return (
    <ResponsiveLayout>
      {/* Header - só no mobile */}
      <div className="lg:hidden">
        <header className="flex items-center gap-4 p-4 border-b border-border">
          <Link to="/">
            <Button variant="ghost" size="icon" className="hover:bg-primary hover:text-primary-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Ganhadores</h1>
        </header>
      </div>

      {/* Hero Section */}
      <div className="text-center p-6 lg:p-8 bg-gradient-to-b from-primary/10 to-transparent">
        <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Nossos Ganhadores
        </h2>
        <p className="text-muted-foreground">
          Confira quem já foi contemplado em nossas rifas
        </p>
      </div>

      {/* Winners List */}
      <div className="p-4 lg:p-8 space-y-4 max-w-4xl mx-auto">
        {ganhadores.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Nenhum ganhador ainda
            </h2>
            <p className="text-muted-foreground mb-6">
              Em breve teremos nossos primeiros ganhadores!
            </p>
            <Link to="/">
              <Button className="bg-primary hover:bg-primary/90">
                Participar Agora
              </Button>
            </Link>
          </div>
        ) : (
          ganhadores.map((ganhador, index) => (
          <div
            key={ganhador.id}
            className="bg-card border border-border rounded-lg p-4 relative overflow-hidden"
          >
            {/* Winner Badge for recent winner */}
            {index === 0 && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                MAIS RECENTE
              </div>
            )}

            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-lg">
                  {ganhador.nome.charAt(0)}
                </span>
              </div>

              {/* Winner Info */}
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="font-bold text-foreground text-lg">{ganhador.nome}</h3>
                  <p className="text-primary font-semibold">{ganhador.premio}</p>
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Trophy className="h-4 w-4" />
                    <span>Bilhete nº {ganhador.numeroBilhete} - {ganhador.acao}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{ganhador.dataGanho}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{ganhador.cidade}</span>
                  </div>
                </div>

                {/* Congratulations badge */}
                <div className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                  🎉 Parabéns!
                </div>
              </div>
            </div>
          </div>
          ))
        )}

        {ganhadores.length > 0 && (
          <>
        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 text-center mt-8">
          <Trophy className="h-12 w-12 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-bold text-foreground mb-2">
            Seja o Próximo Ganhador!
          </h3>
          <p className="text-muted-foreground mb-4">
            Participe das nossas rifas e concorra a prêmios incríveis
          </p>
          <Link to="/">
            <Button className="bg-primary hover:bg-primary/90">
              Ver Rifas Ativas
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{ganhadores.length}</div>
            <div className="text-xs text-muted-foreground">Ganhadores</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">R$ 0</div>
            <div className="text-xs text-muted-foreground">Em Prêmios</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">100%</div>
            <div className="text-xs text-muted-foreground">Pagos</div>
          </div>
        </div>
        </>
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default Ganhadores;