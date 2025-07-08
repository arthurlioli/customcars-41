import { useState } from "react";
import { ArrowLeft, User, Mail, Phone, MapPin, Edit, LogOut, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ResponsiveLayout from "@/components/ResponsiveLayout";
const Perfil = () => {
  // Mock data - será substituído por dados reais do Supabase Auth
  const usuario = {
    nome: "João Silva",
    email: "joao.silva@email.com",
    telefone: "(11) 99999-9999",
    cidade: "São Paulo, SP",
    totalGasto: 45.00,
    bilhetesComprados: 25,
    rifasParticipadas: 3
  };

  // Estados para os campos editáveis
  const [editData, setEditData] = useState({
    nome: usuario.nome,
    email: usuario.email,
    telefone: usuario.telefone,
    cidade: usuario.cidade
  });
  const handleSave = () => {
    // Aqui implementar a lógica de salvar no Supabase
    console.log("Salvando dados:", editData);
  };
  return <ResponsiveLayout>
      {/* Header - só no mobile */}
      <div className="lg:hidden">
        <header className="flex items-center gap-4 p-4 border-b border-border">
          <Link to="/">
            <Button variant="ghost" size="icon" className="hover:bg-primary hover:text-primary-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Meu Perfil</h1>
        </header>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-8 space-y-6">
        {/* Title para desktop */}
        <div className="hidden lg:block">
          <h1 className="text-3xl font-bold text-foreground mb-2">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
        </div>
        {/* Avatar e Nome */}
        <div className="text-center">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-12 w-12 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{usuario.nome}</h2>
          <p className="text-muted-foreground">{usuario.email}</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{usuario.rifasParticipadas}</div>
            <div className="text-xs text-muted-foreground">Rifas</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{usuario.bilhetesComprados}</div>
            <div className="text-xs text-muted-foreground">Bilhetes</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              R$ {usuario.totalGasto.toFixed(2).replace('.', ',')}
            </div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>

        {/* Informações Pessoais */}
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Informações Pessoais</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-primary">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Editar Informações Pessoais</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nome" className="text-right">
                      Nome
                    </Label>
                    <Input id="nome" value={editData.nome} onChange={e => setEditData({
                    ...editData,
                    nome: e.target.value
                  })} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input id="email" type="email" value={editData.email} onChange={e => setEditData({
                    ...editData,
                    email: e.target.value
                  })} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="telefone" className="text-right">
                      Telefone
                    </Label>
                    <Input id="telefone" value={editData.telefone} onChange={e => setEditData({
                    ...editData,
                    telefone: e.target.value
                  })} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cidade" className="text-right">
                      Cidade
                    </Label>
                    <Input id="cidade" value={editData.cidade} onChange={e => setEditData({
                    ...editData,
                    cidade: e.target.value
                  })} className="col-span-3" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <DialogTrigger asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogTrigger>
                  <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Salvar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{usuario.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Telefone</div>
                <div className="font-medium">{usuario.telefone}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Localização</div>
                <div className="font-medium">{usuario.cidade}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="space-y-3">
          <Link to="/meus-recibos">
            <Button variant="ghost" className="w-full h-12 bg-card border border-border justify-start text-foreground hover:bg-primary hover:text-primary-foreground py-0 my-[15px]">
              <Receipt className="h-4 w-4 mr-3" />
              Meus Recibos
            </Button>
          </Link>

          <Link to="/meus-bilhetes">
            <Button variant="ghost" className="w-full h-12 bg-card border border-border justify-start text-foreground hover:bg-primary hover:text-primary-foreground">
              <User className="h-4 w-4 mr-3" />
              Meus Bilhetes
            </Button>
          </Link>

          <Button variant="ghost" className="w-full h-12 bg-card border border-border justify-start text-destructive hover:bg-destructive/20">
            <LogOut className="h-4 w-4 mr-3" />
            Sair da Conta
          </Button>
        </div>
      </div>
    </ResponsiveLayout>;
};
export default Perfil;