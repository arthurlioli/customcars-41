import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ActionData) => void;
  initialData?: ActionData;
  mode: "create" | "edit" | "view";
}

export interface ActionData {
  id?: string;
  name: string;
  description: string;
  ticket_price: number;
  total_tickets: number;
  draw_date: string;
  regulations: string;
  photos: string[];
  status?: string;
}

const AdminActionModal = ({ isOpen, onClose, onSave, initialData, mode }: AdminActionModalProps) => {
  const [formData, setFormData] = useState<ActionData>(
    initialData || {
      name: "",
      description: "",
      ticket_price: 4.99,
      total_tickets: 1000,
      draw_date: "",
      regulations: "",
      photos: [],
    }
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === "create") {
        const { error } = await supabase
          .from("campaigns")
          .insert({
            name: formData.name,
            description: formData.description,
            ticket_price: formData.ticket_price,
            total_tickets: formData.total_tickets,
            draw_date: formData.draw_date,
            regulations: formData.regulations,
            photos: formData.photos,
          });
        
        if (error) throw error;
        
        toast({
          title: "Campanha criada!",
          description: "A campanha foi criada com sucesso.",
        });
      } else if (mode === "edit" && formData.id) {
        const { error } = await supabase
          .from("campaigns")
          .update({
            name: formData.name,
            description: formData.description,
            ticket_price: formData.ticket_price,
            total_tickets: formData.total_tickets,
            draw_date: formData.draw_date,
            regulations: formData.regulations,
            photos: formData.photos,
          })
          .eq("id", formData.id);
        
        if (error) throw error;
        
        toast({
          title: "Campanha atualizada!",
          description: "As alterações foram salvas com sucesso.",
        });
      }
      
      onSave(formData);
      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar campanha:', error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar a campanha",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Simulação de upload - aqui você implementaria o upload real para storage
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const isViewMode = mode === "view";
  const title = mode === "create" ? "Nova Ação" : mode === "edit" ? "Editar Ação" : "Visualizar Ação";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Campanha</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Kawasaki Ninja"
                disabled={isViewMode}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ticket_price">Valor do Bilhete (R$)</Label>
              <Input
                id="ticket_price"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.ticket_price}
                onChange={(e) => setFormData(prev => ({ ...prev, ticket_price: Number(e.target.value) }))}
                disabled={isViewMode}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total_tickets">Total de Bilhetes</Label>
              <Input
                id="total_tickets"
                type="number"
                min="1"
                value={formData.total_tickets}
                onChange={(e) => setFormData(prev => ({ ...prev, total_tickets: Number(e.target.value) }))}
                disabled={isViewMode}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="draw_date">Data do Sorteio</Label>
              <Input
                id="draw_date"
                type="date"
                value={formData.draw_date}
                onChange={(e) => setFormData(prev => ({ ...prev, draw_date: e.target.value }))}
                disabled={isViewMode}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição detalhada da campanha..."
              disabled={isViewMode}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="regulations">Regulamento</Label>
            <Textarea
              id="regulations"
              value={formData.regulations}
              onChange={(e) => setFormData(prev => ({ ...prev, regulations: e.target.value }))}
              placeholder="Regulamento da campanha..."
              disabled={isViewMode}
              rows={4}
            />
          </div>

          {!isViewMode && (
            <div className="space-y-2">
              <Label>Fotos para o Carrossel</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Clique para adicionar fotos ou arraste e solte
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                  >
                    Selecionar Fotos
                  </Button>
                </div>
              </div>
            </div>
          )}

          {formData.photos.length > 0 && (
            <div className="space-y-2">
              <Label>Fotos Adicionadas</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {!isViewMode && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {isViewMode ? "Fechar" : "Cancelar"}
            </Button>
            {!isViewMode && (
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : mode === "create" ? "Criar Campanha" : "Salvar Alterações"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminActionModal;