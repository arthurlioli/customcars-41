import { Plus, Edit, Eye, BarChart3, Users, Trophy, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminActionModal, { ActionData } from "@/components/AdminActionModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [selectedAction, setSelectedAction] = useState<ActionData | undefined>();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/admin/login");
        return;
      }
      
      const { data: isAdmin } = await supabase.rpc('is_admin', { user_id: user.id });
      if (!isAdmin) {
        navigate("/admin/login");
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Mock data - será substituído por dados reais do Supabase
  const acoes = [
    {
      id: 1,
      nome: "Ação X - Yamaha MT-03",
      valorBilhete: 1.00,
      totalBilhetes: 1000,
      bilhetesVendidos: 750,
      dataSorteio: "2024-12-25",
      status: "Ativa"
    },
    {
      id: 2,
      nome: "Ação Y - Honda CB600F",
      valorBilhete: 2.00,
      totalBilhetes: 500,
      bilhetesVendidos: 500,
      dataSorteio: "2024-12-07",
      status: "Finalizada"
    }
  ];

  const stats = {
    totalVendas: 1950.00,
    bilhetesVendidos: 1250,
    acoesAtivas: 1,
    participantes: 89
  };

  const handleCreateAction = () => {
    setModalMode("create");
    setSelectedAction(undefined);
    setModalOpen(true);
  };

  const handleViewAction = (action: any) => {
    setModalMode("view");
    setSelectedAction(action);
    setModalOpen(true);
  };

  const handleEditAction = (action: any) => {
    setModalMode("edit");
    setSelectedAction(action);
    setModalOpen(true);
  };

  const handleSaveAction = (data: ActionData) => {
    // Aqui você implementaria a lógica de salvar no banco de dados
    toast({
      title: modalMode === "create" ? "Ação criada!" : "Ação atualizada!",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <h1 className="text-xl font-bold text-foreground">Painel Administrativo</h1>
        <p className="text-sm text-muted-foreground">Gerencie suas rifas e ações</p>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-card border-b border-border">
        <div className="flex overflow-x-auto">
          {[
            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
            { id: "acoes", label: "Ações", icon: Trophy },
            { id: "participantes", label: "Participantes", icon: Users },
            { id: "configuracoes", label: "Config", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeSection === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Content */}
      <div className="p-4">
        {activeSection === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">
                  R$ {stats.totalVendas.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-sm text-muted-foreground">Total de Vendas</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">{stats.bilhetesVendidos}</div>
                <div className="text-sm text-muted-foreground">Bilhetes Vendidos</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">{stats.acoesAtivas}</div>
                <div className="text-sm text-muted-foreground">Ações Ativas</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">{stats.participantes}</div>
                <div className="text-sm text-muted-foreground">Participantes</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-4">Atividade Recente</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Nova compra - 5 bilhetes</span>
                  <span className="text-sm text-muted-foreground">há 2 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Nova compra - 1 bilhete</span>
                  <span className="text-sm text-muted-foreground">há 5 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Nova compra - 30 bilhetes</span>
                  <span className="text-sm text-muted-foreground">há 10 min</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "acoes" && (
          <div className="space-y-4">
            {/* Header com botão de criar */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-foreground">Gerenciar Ações</h2>
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={handleCreateAction}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Ação
              </Button>
            </div>

            {/* Lista de ações */}
            <div className="space-y-3">
              {acoes.map((acao) => (
                <div key={acao.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{acao.nome}</h3>
                      <p className="text-sm text-muted-foreground">
                        Sorteio: {acao.dataSorteio}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        acao.status === "Ativa"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {acao.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-muted-foreground">Valor do bilhete:</span>
                      <div className="font-medium">R$ {acao.valorBilhete.toFixed(2).replace('.', ',')}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Progresso:</span>
                      <div className="font-medium">
                        {acao.bilhetesVendidos}/{acao.totalBilhetes} vendidos
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-muted rounded-full h-2 mb-4">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${(acao.bilhetesVendidos / acao.totalBilhetes) * 100}%`,
                      }}
                    ></div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewAction(acao)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditAction(acao)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "participantes" && (
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Lista de Participantes
            </h3>
            <p className="text-muted-foreground">
              Aqui você poderá ver todos os participantes das suas rifas
            </p>
          </div>
        )}

        {activeSection === "configuracoes" && (
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Configurações
            </h3>
            <p className="text-muted-foreground">
              Configure as opções gerais do sistema
            </p>
          </div>
        )}
      </div>

      <AdminActionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveAction}
        initialData={selectedAction}
        mode={modalMode}
      />
    </div>
  );
};

export default Admin;