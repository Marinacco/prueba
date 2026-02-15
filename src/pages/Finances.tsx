import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { cn } from '@/lib/utils';
import { DollarSign, TrendingUp, Download, FileSpreadsheet, FileText, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { useCases, useUpdateCase, useDashboardStats } from '@/hooks/useSupabaseData';
import { toast } from 'sonner';

export default function Finances() {
  const [liquidateAllOpen, setLiquidateAllOpen] = useState(false);
  const [liquidateId, setLiquidateId] = useState<string | null>(null);

  const { data: cases = [] } = useCases();
  const { data: stats } = useDashboardStats();
  const updateCase = useUpdateCase();

  const s = stats || { totalRevenue: 0, monthlyRevenue: 0, pendingCommissions: 0, totalCommissions: 0 };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

  const pendingCommissions = cases.filter((c: any) => !c.commission_paid && Number(c.commission_amount) > 0);
  const paidCommissions = cases.filter((c: any) => c.commission_paid);

  const handleExport = (type: string) => {
    toast.success(`Exportando ${type}...`, { description: 'El archivo se descargará en breve' });
  };

  const liquidateCase = cases.find((c: any) => c.id === liquidateId);

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Control Financiero</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gestión de ingresos y comisiones</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => handleExport('Excel')}><FileSpreadsheet className="h-4 w-4" />Excel</Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => handleExport('PDF')}><FileText className="h-4 w-4" />PDF</Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="stat-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 mb-3"><DollarSign className="h-5 w-5 text-success" /></div>
          <p className="text-xs sm:text-sm text-muted-foreground">Ingresos Totales</p>
          <p className="text-lg sm:text-2xl font-bold text-foreground tabular-nums">{formatCurrency(s.totalRevenue)}</p>
        </div>
        <div className="stat-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 mb-3"><TrendingUp className="h-5 w-5 text-accent" /></div>
          <p className="text-xs sm:text-sm text-muted-foreground">Ingresos del Mes</p>
          <p className="text-lg sm:text-2xl font-bold text-foreground tabular-nums">{formatCurrency(s.monthlyRevenue)}</p>
        </div>
        <div className="stat-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-3"><CheckCircle className="h-5 w-5 text-primary" /></div>
          <p className="text-xs sm:text-sm text-muted-foreground">Comisiones Pagadas</p>
          <p className="text-lg sm:text-2xl font-bold text-foreground tabular-nums">{formatCurrency(s.totalCommissions)}</p>
        </div>
        <div className="stat-card bg-warning/5 border-warning/20">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 mb-3"><Clock className="h-5 w-5 text-warning" /></div>
          <p className="text-xs sm:text-sm text-muted-foreground">Comisiones Pendientes</p>
          <p className="text-lg sm:text-2xl font-bold text-warning tabular-nums">{formatCurrency(s.pendingCommissions)}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        <div className="stat-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Comisiones Pendientes</h3>
              <p className="text-xs text-muted-foreground">Pagos por realizar</p>
            </div>
            {pendingCommissions.length > 0 && (
              <Button size="sm" className="btn-gold text-xs" onClick={() => setLiquidateAllOpen(true)}>Liquidar Todas</Button>
            )}
          </div>
          {pendingCommissions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No hay comisiones pendientes</p>
          ) : (
            <div className="space-y-3">
              {pendingCommissions.map((c: any) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{c.lawyer?.name || '—'}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.case_number} - {c.service?.name || ''}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-semibold text-accent tabular-nums">{formatCurrency(Number(c.commission_amount))}</p>
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setLiquidateId(c.id)}>Liquidar</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="stat-card">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Comisiones Pagadas</h3>
          {paidCommissions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No hay comisiones pagadas</p>
          ) : (
            <div className="space-y-3">
              {paidCommissions.map((c: any) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{c.lawyer?.name || '—'}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.case_number}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-semibold text-success tabular-nums">{formatCurrency(Number(c.commission_amount))}</p>
                    <span className="badge-active inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium">
                      <CheckCircle className="h-3 w-3" />Pagada
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={liquidateAllOpen}
        onOpenChange={setLiquidateAllOpen}
        title="Liquidar Todas las Comisiones"
        description={`¿Confirmas la liquidación de ${pendingCommissions.length} comisiones pendientes por un total de ${formatCurrency(pendingCommissions.reduce((sum: number, c: any) => sum + Number(c.commission_amount), 0))}?`}
        confirmLabel="Liquidar Todas"
        onConfirm={async () => {
          for (const c of pendingCommissions) {
            await updateCase.mutateAsync({ id: c.id, commission_paid: true });
          }
          setLiquidateAllOpen(false);
        }}
      />
      <ConfirmDialog
        open={!!liquidateId}
        onOpenChange={(o) => !o && setLiquidateId(null)}
        title="Liquidar Comisión"
        description={`¿Confirmas la liquidación de ${formatCurrency(Number(liquidateCase?.commission_amount ?? 0))} para ${liquidateCase?.lawyer?.name}?`}
        confirmLabel="Liquidar"
        onConfirm={() => { updateCase.mutate({ id: liquidateId!, commission_paid: true }); setLiquidateId(null); }}
      />
    </MainLayout>
  );
}
