import { ArrowLeft, Shield, FileText, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ResponsiveLayout from "@/components/ResponsiveLayout";

const Regulamento = () => {
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
          <h1 className="text-xl font-bold text-foreground">Regulamento</h1>
        </header>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-8 space-y-6 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center">
          <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Regulamento Oficial
          </h2>
          <p className="text-muted-foreground">
            Leia atentamente todas as regras e condições
          </p>
        </div>

        {/* Alert */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-primary mb-1">Importante</h3>
            <p className="text-sm text-foreground">
              Este regulamento está em conformidade com a legislação brasileira 
              e é baseado nos resultados oficiais da Loteria Federal.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          <section className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              1. Das Condições Gerais
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• A rifa é organizada pela Custom Club Cars, CNPJ: XX.XXX.XXX/XXXX-XX</p>
              <p>• O sorteio será realizado com base na Loteria Federal</p>
              <p>• Podem participar pessoas maiores de 18 anos</p>
              <p>• A compra do bilhete implica na aceitação deste regulamento</p>
            </div>
          </section>

          <section className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-3">
              2. Da Participação
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Cada bilhete custa R$ 1,00 (um real)</p>
              <p>• Não há limite mínimo ou máximo de bilhetes por pessoa</p>
              <p>• Os bilhetes são numerados sequencialmente</p>
              <p>• O pagamento deve ser efetuado no ato da compra</p>
            </div>
          </section>

          <section className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-3">
              3. Do Sorteio
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• O sorteio será realizado na data especificada</p>
              <p>• Utilizaremos o resultado da Loteria Federal</p>
              <p>• O número ganhador será o último número do 1º prêmio</p>
              <p>• O sorteio será transmitido ao vivo nas redes sociais</p>
            </div>
          </section>

          <section className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-3">
              4. Do Prêmio
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• O prêmio será entregue conforme especificado na ação</p>
              <p>• Todos os documentos e taxas estão inclusos</p>
              <p>• O ganhador será contatado em até 24 horas</p>
              <p>• A entrega será coordenada com o ganhador</p>
            </div>
          </section>

          <section className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-3">
              5. Disposições Finais
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Este regulamento pode ser alterado a qualquer momento</p>
              <p>• Casos omissos serão resolvidos pela organização</p>
              <p>• Foro competente: São Paulo/SP</p>
              <p>• Dúvidas: contato@customclubcars.com.br</p>
            </div>
          </section>
        </div>

        {/* Contact Info */}
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <h3 className="font-semibold text-foreground mb-2">
            Dúvidas ou Reclamações?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Entre em contato conosco através dos canais oficiais
          </p>
          <div className="space-y-2 text-sm">
            <p className="text-foreground">📧 contato@customclubcars.com.br</p>
            <p className="text-foreground">📱 WhatsApp: (11) 99999-9999</p>
            <p className="text-foreground">📍 São Paulo - SP</p>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Regulamento;