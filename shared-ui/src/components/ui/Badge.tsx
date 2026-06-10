import type { HTMLAttributes } from 'react';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

export default function Badge({
  children, 
  variant = 'default', 
  className = '',
  ...props 
}: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: "bg-blue-50 text-blue-700 border-blue-200",
    primary: "bg-blue-600 text-white border-blue-600",
    secondary: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    error: "bg-red-50 text-red-700 border-red-200",
    outline: "bg-white text-slate-700 border-slate-300",
  };

  return (
    <div 
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
