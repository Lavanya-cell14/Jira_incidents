import React from 'react';

export default function Badge({ 
  children, 
  variant = 'default', 
  className = '',
  ...props 
}) {
  const variants = {
    default: "bg-blue-50 text-blue-700 border-blue-200",
    primary: "bg-[#0071C1] text-white border-[#0071C1]",
    secondary: "bg-gray-100 text-gray-700 border-gray-200",
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-[#FFD815] text-white border-[#FFD815]",
    error: "bg-red-50 text-red-700 border-red-200",
    outline: "bg-transparent text-gray-700 border-gray-300",
  };

  return (
    <div 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
