import type { ButtonHTMLAttributes, ComponentType, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ComponentType<{ className?: string }>;
}

export default function Button({
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon: Icon,
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus:ring-blue-600",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500",
    outline: "border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 focus:ring-slate-500",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-500",
    danger: "bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-red-600",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-10 px-4 text-sm gap-2",
    lg: "h-12 px-6 text-base gap-2",
    icon: "h-10 w-10 p-2 justify-center",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      {children}
    </button>
  );
}
