import React from 'react';

export default function CapacityProgress({ value, max = 100, className = '', showLabel = true }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  let colorClass = 'bg-emerald-500';
  if (percentage >= 90) colorClass = 'bg-red-500';
  else if (percentage >= 75) colorClass = 'bg-amber-500';

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs mb-1.5 font-medium">
          <span className="text-gray-600">Capacity</span>
          <span className="text-gray-900">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ease-out rounded-full ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
