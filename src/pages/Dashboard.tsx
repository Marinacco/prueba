import { DollarSign, Briefcase, Users, TrendingUp } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { useDashboardStats, useCases, useLawyers } from '@/hooks/useSupabaseData';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { data: stats } = useDashboardStats();
  const { data: cases } = useCases();
  const { data: lawyers } = useLawyers();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

  const s = stats || { totalRevenue: 0, monthlyRevenue: 0, pendingCommissions: 0, activeCases: 0, completedCases: 0, totalLawyers: 0, totalClients: 0, totalCommissions: 0 };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Resumen general del rendimiento de la firma</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard title="Ingresos del Mes" value={formatCurrency(s.monthlyRevenue)} subtitle="vs mes anterior" icon={<DollarSign className="h-6 w-6" />} variant="accent" />
        <StatCard title="Casos Activos" value={s.activeCases.toString()} subtitle={`${s.completedCases} completados`} icon={<Briefcase className="h-6 w-6" />} />
        <StatCard title="Comisiones Pendientes" value={formatCurrency(s.pendingCommissions)} subtitle="Por liquidar" icon={<TrendingUp className="h-6 w-6" />} />
        <StatCard title="Abogados Activos" value={s.totalLawyers.toString()} subtitle={`${s.totalClients} clientes`} icon={<Users className="h-6 w-6" />} />
      </div>

      {/* Recent Cases */}
      {cases && cases.length > 0 && (
        <div className="stat-card mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Casos Recientes</h3>
          {/* Mobile cards */}
          <div className="block lg:hidden space-y-3">
            {cases.slice(0, 5).map((c: any) => (
              <div key={c.id} className="p-3 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-medium text-foreground">{c.case_number}</span>
                  <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                    c.status === 'completed' ? 'bg-primary/10 text-primary border border-primary/20' :
                    c.status === 'active' ? 'badge-active' : 'badge-pending'
                  )}>
                    {c.status === 'active' ? 'Activo' : c.status === 'in_progress' ? 'En Proceso' : c.status === 'completed' ? 'Finalizado' : 'Cancelado'}
                  </span>
                </div>
                <p className="text-sm text-foreground">{c.client?.name || '—'}</p>
                <p className="text-sm font-semibold text-foreground tabular-nums mt-1">{formatCurrency(Number(c.total_amount))}</p>
              </div>
            ))}
          </div>
          {/* Desktop table */}
          <div className="hidden lg:block overflow-hidden rounded-lg border border-border">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-4 py-3 text-left">Caso</th>
                  <th className="px-4 py-3 text-left">Cliente</th>
                  <th className="px-4 py-3 text-left">Abogado</th>
                  <th className="px-4 py-3 text-center">Estado</th>
                  <th className="px-4 py-3 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cases.slice(0, 5).map((c: any) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3"><span className="font-mono text-sm font-medium text-foreground">{c.case_number}</span></td>
                    <td className="px-4 py-3"><span className="text-sm text-foreground">{c.client?.name || '—'}</span></td>
                    <td className="px-4 py-3"><span className="text-sm text-foreground">{c.lawyer?.name || '—'}</span></td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        c.status === 'completed' ? 'bg-primary/10 text-primary border border-primary/20' :
                        c.status === 'active' ? 'badge-active' : 'badge-pending'
                      )}>
                        {c.status === 'active' ? 'Activo' : c.status === 'in_progress' ? 'En Proceso' : c.status === 'completed' ? 'Finalizado' : 'Cancelado'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right"><span className="font-semibold text-foreground tabular-nums">{formatCurrency(Number(c.total_amount))}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!cases?.length && !lawyers?.length && (
        <div className="stat-card text-center py-12">
          <p className="text-muted-foreground text-lg">No hay datos todavía. Comienza agregando abogados, servicios y casos.</p>
        </div>
      )}
    </MainLayout>
  );
}
