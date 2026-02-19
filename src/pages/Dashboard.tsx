import { DollarSign, Briefcase, TrendingUp, Trophy } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { useDashboardStats, useCases } from '@/hooks/useSupabaseData';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { data: stats } = useDashboardStats();
  const { data: cases } = useCases();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

  const s = stats || { totalContracted: 0, montoPagado: 0, pendingCommissions: 0, activeCases: 0, completedCases: 0, totalLawyers: 0, totalClients: 0, totalCommissionsPaid: 0, caseLawyers: [] };

  // Lawyer ranking
  const lawyerMap = new Map<string, { name: string; contracted: number; commissions: number; commissionsPaid: number; cases: number }>();
  if (cases) {
    for (const c of cases as any[]) {
      const cls = c.case_lawyers || [];
      for (const cl of cls) {
        const lid = cl.lawyer_id;
        const lname = cl.lawyer?.name || '—';
        const prev = lawyerMap.get(lid) || { name: lname, contracted: 0, commissions: 0, commissionsPaid: 0, cases: 0 };
        prev.contracted += Number(c.total_amount || 0);
        prev.commissions += Number(cl.commission_amount || 0);
        if (cl.commission_paid) prev.commissionsPaid += Number(cl.commission_amount || 0);
        prev.cases += 1;
        lawyerMap.set(lid, prev);
      }
    }
  }
  const lawyerRanking = Array.from(lawyerMap.values()).sort((a, b) => b.contracted - a.contracted);

  return (
    <MainLayout>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Resumen general del rendimiento de la firma</p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 mb-4 sm:mb-6">
        <StatCard title="Monto Contratado" value={formatCurrency(s.totalContracted)} subtitle={`${s.activeCases} activos`} icon={<DollarSign className="h-6 w-6" />} variant="accent" />
        <StatCard title="Monto Pagado" value={formatCurrency(s.montoPagado)} subtitle="Contratado − Comisiones" icon={<TrendingUp className="h-6 w-6" />} />
        <StatCard title="Com. Pagadas" value={formatCurrency(s.totalCommissionsPaid)} subtitle="Liquidadas" icon={<Trophy className="h-6 w-6" />} />
        <StatCard title="Com. Pendientes" value={formatCurrency(s.pendingCommissions)} subtitle="Por liquidar" icon={<Briefcase className="h-6 w-6" />} />
      </div>

      {/* Lawyer Ranking */}
      {lawyerRanking.length > 0 && (
        <div className="stat-card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">Ranking de Profesionales</h3>
          </div>
          {/* Mobile cards */}
          <div className="block lg:hidden space-y-3">
            {lawyerRanking.map((l, i) => (
              <div key={i} className="p-3 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={cn('flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                      i === 0 ? 'bg-accent/20 text-accent' : i === 1 ? 'bg-muted text-foreground' : 'bg-muted text-muted-foreground'
                    )}>#{i + 1}</span>
                    <span className="font-medium text-foreground text-sm">{l.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{l.cases} casos</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted-foreground">Contratado:</span> <span className="tabular-nums font-semibold">{formatCurrency(l.contracted)}</span></div>
                  <div><span className="text-muted-foreground">Comisiones:</span> <span className="tabular-nums font-semibold text-accent">{formatCurrency(l.commissions)}</span></div>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop table */}
          <div className="hidden lg:block overflow-hidden rounded-lg border border-border">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-4 py-3 text-left w-12">#</th>
                  <th className="px-4 py-3 text-left">Profesional</th>
                  <th className="px-4 py-3 text-center">Casos</th>
                  <th className="px-4 py-3 text-right">Monto Contratado</th>
                  <th className="px-4 py-3 text-right">Comisiones Generadas</th>
                  <th className="px-4 py-3 text-right">Comisiones Pagadas</th>
                  <th className="px-4 py-3 text-right">Cobrado Neto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lawyerRanking.map((l, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className={cn('flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                        i === 0 ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'
                      )}>#{i + 1}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{l.name}</td>
                    <td className="px-4 py-3 text-center tabular-nums">{l.cases}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatCurrency(l.contracted)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-accent">{formatCurrency(l.commissions)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-success">{formatCurrency(l.commissionsPaid)}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatCurrency(l.contracted - l.commissions)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Cases */}
      {cases && (cases as any[]).length > 0 && (
        <div className="stat-card mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Casos Recientes</h3>
          <div className="block lg:hidden space-y-3">
            {(cases as any[]).slice(0, 5).map((c: any) => (
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
                <p className="text-sm text-muted-foreground">{(c.case_lawyers || []).map((cl: any) => cl.lawyer?.name).filter(Boolean).join(', ') || '—'}</p>

                <p className="text-sm font-semibold text-foreground tabular-nums mt-1">{formatCurrency(Number(c.total_amount))}</p>
              </div>
            ))}
          </div>
          <div className="hidden lg:block overflow-hidden rounded-lg border border-border">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-4 py-3 text-left">Caso</th>
                  <th className="px-4 py-3 text-left">Cliente</th>
                  <th className="px-4 py-3 text-left">Profesionales</th>
                  <th className="px-4 py-3 text-center">Estado</th>
                  <th className="px-4 py-3 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(cases as any[]).slice(0, 5).map((c: any) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3"><span className="font-mono text-sm font-medium text-foreground">{c.case_number}</span></td>
                    <td className="px-4 py-3"><span className="text-sm text-foreground">{c.client?.name || '—'}</span></td>
                    <td className="px-4 py-3"><span className="text-sm text-foreground">{(c.case_lawyers || []).map((cl: any) => cl.lawyer?.name).filter(Boolean).join(', ') || '—'}</span></td>

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

      {!cases?.length && (
        <div className="stat-card text-center py-12">
          <p className="text-muted-foreground text-lg">No hay datos todavía. Comienza agregando abogados, servicios y casos.</p>
        </div>
      )}
    </MainLayout>
  );
}
