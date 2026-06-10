import React from 'react';

export default function StatusBadge({ status, type }) {
  // Mapping of common status/types to color variants
  const variants = {
    // Inventory/Stock
    'In Stock': 'bg-emerald-100/50 text-emerald-700 border-emerald-200',
    'Low Stock': 'bg-amber-100/50 text-amber-700 border-amber-200',
    'Out of Stock': 'bg-red-100/50 text-red-700 border-red-200',
    // Movement
    'In Transit': 'bg-blue-100/50 text-blue-700 border-blue-200',
    'Received': 'bg-indigo-100/50 text-indigo-700 border-indigo-200',
    'Shipped': 'bg-purple-100/50 text-purple-700 border-purple-200',
    // Zone capacity
    'Available': 'bg-emerald-100/50 text-emerald-700 border-emerald-200',
    'Full': 'bg-red-100/50 text-red-700 border-red-200',
    'Warning': 'bg-amber-100/50 text-amber-700 border-amber-200',
    // Generic fallback
    default: 'bg-gray-100/50 text-gray-700 border-gray-200'
  };

  const currentVariant = variants[status] || variants[type] || variants.default;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentVariant}`}>
      {status}
    </span>
  );
}
