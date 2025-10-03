import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './Card';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  iconColor: string;
  trend?: {
    value: number;
    label: string;
  };
  status?: 'normal' | 'warning' | 'critical';
}

export function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  iconColor,
  trend,
  status = 'normal'
}: MetricCardProps) {
  const statusEffects = {
    normal: 'border-white/10',
    warning: 'border-amber-400/50 shadow-amber-400/20',
    critical: 'border-red-400/50 shadow-red-400/20 animate-pulse'
  };

  const statusGlow = {
    normal: '',
    warning: 'shadow-lg shadow-amber-500/20',
    critical: 'shadow-lg shadow-red-500/30'
  };

  return (
    <Card className={`${statusEffects[status]} ${statusGlow[status]} card-hover metric-glow relative overflow-hidden group`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardContent className="py-4 sm:py-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-purple-200 mb-2 tracking-wide uppercase truncate">{title}</p>
            <div className="flex items-baseline gap-1 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-2xl sm:text-4xl font-bold text-white animate-data-flow">
                {typeof value === 'number' ? value.toFixed(1) : value}
              </span>
              {unit && (
                <span className="text-lg sm:text-xl font-semibold text-purple-300">{unit}</span>
              )}
            </div>
            {trend && (
              <div className="flex items-center gap-2">
                <span className={`text-xs sm:text-sm font-bold px-2 py-1 rounded-full transition-all duration-300 ${trend.value >= 0 ? 'text-emerald-300 bg-emerald-500/20 border border-emerald-500/30' : 'text-red-300 bg-red-500/20 border border-red-500/30'}`}>
                  {trend.value >= 0 ? '↗' : '↘'} {Math.abs(trend.value).toFixed(1)}%
                </span>
                <span className="text-xs text-purple-300 hidden sm:inline">{trend.label}</span>
              </div>
            )}
          </div>
          <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${iconColor} shadow-lg relative animate-energy-pulse`}>
            <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white relative z-10" />
            <div className="absolute inset-0 bg-white/20 rounded-xl sm:rounded-2xl blur-sm" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
