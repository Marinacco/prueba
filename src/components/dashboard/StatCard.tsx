import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'accent';
}

export function StatCard({ title, value, subtitle, icon, trend, variant = 'default' }: StatCardProps) {
  return (
    <div
      className={cn(
        'stat-card relative overflow-hidden',
        variant === 'accent' && 'bg-primary text-primary-foreground'
      )}
    >
      <div
        className={cn(
          'absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10',
          variant === 'accent' ? 'bg-white' : 'bg-accent'
        )}
      />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              variant === 'accent' ? 'bg-white/20' : 'bg-accent/10'
            )}
          >
            <div className={cn(variant === 'accent' ? 'text-white' : 'text-accent')}>
              {icon}
            </div>
          </div>
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                trend.isPositive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
              )}
            >
              {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {trend.value}%
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className={cn('text-sm font-medium', variant === 'accent' ? 'text-white/70' : 'text-muted-foreground')}>
            {title}
          </p>
          <p className="mt-1 text-2xl sm:text-3xl font-bold tabular-nums">{value}</p>
          {subtitle && (
            <p className={cn('mt-1 text-sm', variant === 'accent' ? 'text-white/60' : 'text-muted-foreground')}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
