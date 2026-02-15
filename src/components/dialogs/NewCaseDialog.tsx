import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLawyers, useServices, useCreateClient, useCreateCase } from '@/hooks/useSupabaseData';
import { toast } from 'sonner';

interface NewCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewCaseDialog({ open, onOpenChange }: NewCaseDialogProps) {
  const [form, setForm] = useState({ clientName: '', clientEmail: '', clientPhone: '', serviceId: '', lawyerId: '', totalAmount: '', notes: '' });
  const { data: lawyers = [] } = useLawyers();
  const { data: services = [] } = useServices();
  const createClient = useCreateClient();
  const createCase = useCreateCase();

  const handleSubmit = async () => {
    if (!form.clientName || !form.serviceId || !form.lawyerId) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    try {
      // Create client first
      const client = await createClient.mutateAsync({ name: form.clientName, email: form.clientEmail || undefined, phone: form.clientPhone || undefined });

      // Find service for commission calc
      const service = services.find((s: any) => s.id === form.serviceId);
      const totalAmount = Number(form.totalAmount) || Number(service?.base_price) || 0;
      const commissionAmount = totalAmount * (Number(service?.commission_percentage) || 0) / 100;

      // Generate case number
      const caseNumber = `CASO-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

      await createCase.mutateAsync({
        case_number: caseNumber,
        client_id: client.id,
        service_id: form.serviceId,
        lawyer_id: form.lawyerId,
        total_amount: totalAmount,
        commission_amount: commissionAmount,
        notes: form.notes || undefined,
      });

      setForm({ clientName: '', clientEmail: '', clientPhone: '', serviceId: '', lawyerId: '', totalAmount: '', notes: '' });
      onOpenChange(false);
    } catch (e) {
      // errors handled in mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader><DialogTitle className="font-display text-xl">Nuevo Caso</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nombre del Cliente *</Label>
              <Input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="Nombre completo" />
            </div>
            <div className="space-y-2">
              <Label>Correo Electrónico</Label>
              <Input type="email" value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })} placeholder="correo@email.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Teléfono</Label>
            <Input value={form.clientPhone} onChange={(e) => setForm({ ...form, clientPhone: e.target.value })} placeholder="+52 55 1234 5678" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Servicio *</Label>
              <Select value={form.serviceId} onValueChange={(v) => {
                const svc = services.find((s: any) => s.id === v);
                setForm({ ...form, serviceId: v, totalAmount: svc ? String(svc.base_price) : '' });
              }}>
                <SelectTrigger><SelectValue placeholder="Seleccionar servicio" /></SelectTrigger>
                <SelectContent>
                  {services.filter((s: any) => s.is_active).map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Abogado Asignado *</Label>
              <Select value={form.lawyerId} onValueChange={(v) => setForm({ ...form, lawyerId: v })}>
                <SelectTrigger><SelectValue placeholder="Seleccionar abogado" /></SelectTrigger>
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
            <Input type="number" value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: e.target.value })} placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label>Notas</Label>
            <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Observaciones del caso..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button className="btn-gold" onClick={handleSubmit} disabled={createCase.isPending}>
            {createCase.isPending ? 'Creando...' : 'Crear Caso'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
