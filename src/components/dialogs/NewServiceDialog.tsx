import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateService } from '@/hooks/useSupabaseData';
import { toast } from 'sonner';

interface NewServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewServiceDialog({ open, onOpenChange }: NewServiceDialogProps) {
  const [form, setForm] = useState({ name: '', description: '', category: '', basePrice: '', commissionType: 'fixed' as string, commissionPercentage: '' });
  const createService = useCreateService();

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.basePrice) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }
    await createService.mutateAsync({
      name: form.name,
      description: form.description || undefined,
      category: form.category,
      base_price: Number(form.basePrice),
      commission_type: form.commissionType,
      commission_percentage: Number(form.commissionPercentage) || 0,
    });
    setForm({ name: '', description: '', category: '', basePrice: '', commissionType: 'fixed', commissionPercentage: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader><DialogTitle className="font-display text-xl">Nuevo Servicio</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nombre del Servicio *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Constitución de Empresa" />
          </div>
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción del servicio..." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Categoría *</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Corporativo">Corporativo</SelectItem>
                  <SelectItem value="Familiar">Familiar</SelectItem>
                  <SelectItem value="Penal">Penal</SelectItem>
                  <SelectItem value="Laboral">Laboral</SelectItem>
                  <SelectItem value="Civil">Civil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Precio Base (MXN) *</Label>
              <Input type="number" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} placeholder="0" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tipo de Comisión</Label>
              <Select value={form.commissionType} onValueChange={(v) => setForm({ ...form, commissionType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fija</SelectItem>
                  <SelectItem value="variable">Variable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Comisión (%)</Label>
              <Input type="number" value={form.commissionPercentage} onChange={(e) => setForm({ ...form, commissionPercentage: e.target.value })} placeholder="15" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button className="btn-gold" onClick={handleSubmit} disabled={createService.isPending}>
            {createService.isPending ? 'Creando...' : 'Crear Servicio'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
