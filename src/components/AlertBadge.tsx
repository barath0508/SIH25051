import { AlertCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import type { Alert } from '../types';

interface AlertBadgeProps {
  alert: Alert;
  onClick?: () => void;
}

export function AlertBadge({ alert, onClick }: AlertBadgeProps) {
  const typeConfig = {
    critical: {
      icon: XCircle,
      bg: 'bg-red-500/20',
      border: 'border-red-400/50',
      text: 'text-red-200',
      iconColor: 'text-red-400',
      glow: 'shadow-red-500/30'
    },
    fault: {
      icon: AlertCircle,
      bg: 'bg-orange-500/20',
      border: 'border-orange-400/50',
      text: 'text-orange-200',
      iconColor: 'text-orange-400',
      glow: 'shadow-orange-500/30'
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-amber-500/20',
      border: 'border-amber-400/50',
      text: 'text-amber-200',
      iconColor: 'text-amber-400',
      glow: 'shadow-amber-500/30'
    },
    info: {
      icon: Info,
      bg: 'bg-blue-500/20',
      border: 'border-blue-400/50',
      text: 'text-blue-200',
      iconColor: 'text-blue-400',
      glow: 'shadow-blue-500/30'
    }
  };

  const config = typeConfig[alert.type];
  const Icon = config.icon;

  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-4 p-4 rounded-xl border ${config.bg} ${config.border} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${config.glow} ${onClick ? 'cursor-pointer' : ''} backdrop-blur-sm`}
    >
      <div className={`p-2 rounded-lg bg-gradient-to-br ${config.bg} border ${config.border}`}>
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h4 className={`font-bold ${config.text} text-lg`}>{alert.title}</h4>
          <span className={`text-xs px-3 py-1 rounded-full ${config.bg} ${config.text} border ${config.border} font-semibold uppercase tracking-wide`}>
            {alert.category}
          </span>
        </div>
        <p className={`text-sm ${config.text} opacity-90 leading-relaxed`}>{alert.description}</p>
        <p className="text-xs text-purple-300 mt-3 font-medium">
          {new Date(alert.createdAt).toLocaleString()}
        </p>
      </div>
      {alert.status === 'active' && (
        <div className="flex-shrink-0 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-3 h-3 bg-red-400 rounded-full animate-pulse" />
          <span className="text-xs text-red-300 font-bold uppercase tracking-wide">Active</span>
        </div>
      )}
    </div>
  );
}
