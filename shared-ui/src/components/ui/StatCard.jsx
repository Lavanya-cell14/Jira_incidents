import React from 'react';
import Card, { CardContent } from './Card';

export default function StatCard({ title, value, icon: Icon, trend, trendValue, subtitle }) {
  const isPositiveTrend = trend === 'up';
  const isNegativeTrend = trend === 'down';
  const isNeutralTrend = trend === 'neutral';

  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          </div>
          {Icon && (
            <div className="p-3 bg-blue-50/50 rounded-xl">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
          )}
        </div>
        
        {(trendValue || subtitle) && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            {trendValue && (
              <span className={`font-medium ${
                isPositiveTrend ? 'text-emerald-600' : 
                isNegativeTrend ? 'text-red-600' : 'text-gray-600'
              }`}>
                {trendValue}
              </span>
            )}
            {subtitle && <span className="text-gray-500">{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
