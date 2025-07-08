import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";

interface AdminActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ActionData) => void;
  initialData?: ActionData;
  mode: "create" | "edit" | "view";
}

export interface ActionData {
  id?: number;
  nome: string;
  descricao: string;
  valorBilhete: number;
  totalBilhetes: number;
  dataSorteio: string;
  regulamento: string;
  fotos: string[];
}

const AdminActionModal = ({ isOpen, onClose, onSave, initialData, mode }: AdminActionModalProps) => {
  const [formData, setFormData] = useState<ActionData>(
    initialData || {
      nome: "",
      descricao: "",
      valorBilhete: 1.0,
      totalBilhetes: 1000,
      dataSorteio: "",
      regulamento: "",
      fotos: [],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Simulação de upload - aqui você implementaria o upload real
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        fotos: [...prev.fotos, ...newPhotos]
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index)
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
              <Label htmlFor="nome">Nome da Ação</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Kawasaki Ninja"
                disabled={isViewMode}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valorBilhete">Valor do Bilhete (R$)</Label>
              <Input
                id="valorBilhete"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.valorBilhete}
                onChange={(e) => setFormData(prev => ({ ...prev, valorBilhete: Number(e.target.value) }))}
                disabled={isViewMode}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalBilhetes">Total de Bilhetes</Label>
              <Input
                id="totalBilhetes"
                type="number"
                min="1"
                value={formData.totalBilhetes}
                onChange={(e) => setFormData(prev => ({ ...prev, totalBilhetes: Number(e.target.value) }))}
                disabled={isViewMode}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataSorteio">Data do Sorteio</Label>
              <Input
                id="dataSorteio"
                type="date"
                value={formData.dataSorteio}
                onChange={(e) => setFormData(prev => ({ ...prev, dataSorteio: e.target.value }))}
                disabled={isViewMode}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descrição detalhada da ação..."
              disabled={isViewMode}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="regulamento">Regulamento</Label>
            <Textarea
              id="regulamento"
              value={formData.regulamento}
              onChange={(e) => setFormData(prev => ({ ...prev, regulamento: e.target.value }))}
              placeholder="Regulamento da ação..."
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

          {formData.fotos.length > 0 && (
            <div className="space-y-2">
              <Label>Fotos Adicionadas</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.fotos.map((photo, index) => (
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
              <Button type="submit">
                {mode === "create" ? "Criar Ação" : "Salvar Alterações"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminActionModal;