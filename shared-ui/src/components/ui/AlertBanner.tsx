import { AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';
import type { ComponentType } from 'react';

export type AlertBannerType = 'warning' | 'critical' | 'info' | 'success';

export interface AlertBannerProps {
  type?: AlertBannerType;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

interface AlertBannerConfig {
  bg: string;
  border: string;
  icon: ComponentType<{ className?: string }>;
  iconColor: string;
  textColor: string;
  btnClass: string;
}

export default function AlertBanner({ type = 'warning', message, actionText, onAction }: AlertBannerProps) {
  const configs: Record<AlertBannerType, AlertBannerConfig> = {
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      textColor: 'text-amber-800',
      btnClass: 'bg-amber-100 hover:bg-amber-200 text-amber-900'
    },
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: XCircle,
      iconColor: 'text-red-500',
      textColor: 'text-red-800',
      btnClass: 'bg-red-100 hover:bg-red-200 text-red-900'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: Info,
      iconColor: 'text-blue-500',
      textColor: 'text-blue-800',
      btnClass: 'bg-blue-100 hover:bg-blue-200 text-blue-900'
    },
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      icon: CheckCircle2,
      iconColor: 'text-emerald-500',
      textColor: 'text-emerald-800',
      btnClass: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={`w-full rounded-xl border p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between ${config.bg} ${config.border}`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 shrink-0 ${config.iconColor}`} />
        <p className={`text-sm font-medium ${config.textColor}`}>{message}</p>
      </div>
      {actionText && onAction && (
        <button 
          onClick={onAction}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shrink-0 ${config.btnClass}`}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
