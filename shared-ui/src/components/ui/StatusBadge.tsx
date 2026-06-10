export interface StatusBadgeProps {
  status: string;
  type?: string;
}

export default function StatusBadge({ status, type }: StatusBadgeProps) {
  const variants: Record<string, string> = {
    Open: 'bg-amber-50 text-amber-700 border-amber-200',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
    'Waiting for support': 'bg-blue-50 text-blue-700 border-blue-200',
    'Waiting for Support': 'bg-blue-50 text-blue-700 border-blue-200',
    Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Closed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Full: 'bg-red-50 text-red-700 border-red-200',
    'Warning': 'bg-amber-100/50 text-amber-700 border-amber-200',
    default: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const currentVariant = variants[status] || variants[type] || variants.default;

  return (
    <span className={`inline-flex min-w-[72px] items-center justify-center rounded-md border px-2.5 py-1 text-xs font-semibold ${currentVariant}`}>
      {status}
    </span>
  );
}
