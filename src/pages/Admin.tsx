import { Plus, Edit, Eye, BarChart3, Users, Trophy, Settings, Trash2 } from "lucide-react";
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
  const [campaigns, setCampaigns] = useState<ActionData[]>([]);
  const [loading, setLoading] = useState(true);
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
        return;
      }
      
      // Carregar campanhas
      await loadCampaigns();
    };
    
    checkAuth();
  }, [navigate]);

  const loadCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setCampaigns(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar campanhas:', error);
      toast({
        title: "Erro ao carregar campanhas",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock data para estatísticas - pode ser substituído por dados reais do Supabase
  const stats = {
    totalVendas: 1950.00,
    bilhetesVendidos: 1250,
    acoesAtivas: campaigns.filter(c => c.status === 'active').length,
    participantes: 89
  };

  const handleCreateAction = () => {
    setModalMode("create");
    setSelectedAction(undefined);
    setModalOpen(true);
  };

  const handleViewAction = (action: ActionData) => {
    setModalMode("view");
    setSelectedAction(action);
    setModalOpen(true);
  };

  const handleEditAction = (action: ActionData) => {
    setModalMode("edit");
    setSelectedAction(action);
    setModalOpen(true);
  };

  const handleDeleteAction = async (action: ActionData) => {
    if (!action.id) return;
    
    if (confirm(`Tem certeza que deseja deletar a campanha "${action.name}"?`)) {
      try {
        const { error } = await supabase
          .from('campaigns')
          .delete()
          .eq('id', action.id);
        
        if (error) throw error;
        
        toast({
          title: "Campanha deletada!",
          description: "A campanha foi removida com sucesso.",
        });
        
        await loadCampaigns();
      } catch (error: any) {
        console.error('Erro ao deletar campanha:', error);
        toast({
          title: "Erro ao deletar",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const handleSaveAction = async (data: ActionData) => {
    // Recarregar campanhas após salvar
    await loadCampaigns();
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

            {/* Lista de campanhas */}
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Carregando campanhas...</p>
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma campanha criada ainda.</p>
                </div>
              ) : (
                campaigns.map((campaign) => (
                  <div key={campaign.id} className="bg-card border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Sorteio: {new Date(campaign.draw_date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          campaign.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {campaign.status === "active" ? "Ativa" : "Finalizada"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">Valor do bilhete:</span>
                        <div className="font-medium">R$ {campaign.ticket_price.toFixed(2).replace('.', ',')}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total de bilhetes:</span>
                        <div className="font-medium">{campaign.total_tickets}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewAction(campaign)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditAction(campaign)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteAction(campaign)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Deletar
                      </Button>
                    </div>
                  </div>
                ))
              )}
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