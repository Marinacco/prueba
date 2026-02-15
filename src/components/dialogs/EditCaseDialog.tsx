import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateCase, useLawyers, useServices } from '@/hooks/useSupabaseData';
import { toast } from 'sonner';

interface EditCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseItem: any;
}

export function EditCaseDialog({ open, onOpenChange, caseItem }: EditCaseDialogProps) {
  const [form, setForm] = useState({ status: '', lawyerId: '', totalAmount: '', notes: '' });
  const updateCase = useUpdateCase();
  const { data: lawyers = [] } = useLawyers();
  const { data: services = [] } = useServices();

  useEffect(() => {
    if (caseItem) {
      setForm({
        status: caseItem.status || 'active',
        lawyerId: caseItem.lawyer_id || '',
        totalAmount: String(caseItem.total_amount || ''),
        notes: caseItem.notes || '',
      });
    }
  }, [caseItem]);

  const handleSubmit = async () => {
    const service = services.find((s: any) => s.id === caseItem?.service_id);
    const totalAmount = Number(form.totalAmount) || 0;
    const commissionAmount = totalAmount * (Number(service?.commission_percentage) || 0) / 100;

    await updateCase.mutateAsync({
      id: caseItem.id,
      status: form.status,
      lawyer_id: form.lawyerId || null,
      total_amount: totalAmount,
      commission_amount: commissionAmount,
      notes: form.notes || null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader><DialogTitle className="text-xl font-semibold">Editar Caso {caseItem?.case_number}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="in_progress">En Proceso</SelectItem>
                  <SelectItem value="completed">Finalizado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Abogado Asignado</Label>
              <Select value={form.lawyerId} onValueChange={(v) => setForm({ ...form, lawyerId: v })}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {lawyers.filter((l: any) => l.status === 'active').map((l: any) => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Monto Total (MXN)</Label>
            <Input type="number" value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Notas</Label>
            <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button className="btn-gold" onClick={handleSubmit} disabled={updateCase.isPending}>
            {updateCase.isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
