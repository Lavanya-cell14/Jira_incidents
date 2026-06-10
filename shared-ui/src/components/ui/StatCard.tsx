import Card, { CardContent } from './Card';
import type { ComponentType, ReactNode } from 'react';

export type StatCardTrend = 'up' | 'down' | 'neutral';

export interface StatCardProps {
  title: string;
  value: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  trend?: StatCardTrend;
  trendValue?: string;
  subtitle?: string;
}

export default function StatCard({ title, value, icon: Icon, trend, trendValue, subtitle }: StatCardProps) {
  const isPositiveTrend = trend === 'up';
  const isNegativeTrend = trend === 'down';

  return (
    <Card className="transition-shadow duration-200 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-slate-500">{title}</p>
            <h3 className="text-3xl font-bold tracking-tight text-slate-950">{value}</h3>
          </div>
          {Icon && (
            <div className="rounded-lg bg-blue-50 p-3">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
          )}
        </div>
        
        {(trendValue || subtitle) && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            {trendValue && (
              <span className={`font-semibold ${
                isPositiveTrend ? 'text-emerald-600' : 
                isNegativeTrend ? 'text-red-600' : 'text-slate-700'
              }`}>
                {trendValue}
              </span>
            )}
            {subtitle && <span className="text-slate-500">{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
