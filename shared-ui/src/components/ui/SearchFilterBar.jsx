import React from 'react';
import { Search, Filter } from 'lucide-react';
import Input from './Input';

export default function SearchFilterBar({ 
  searchPlaceholder = "Search...", 
  searchValue, 
  onSearchChange,
  filters,
  activeFilter,
  onFilterChange 
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <div className="relative w-full sm:max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          className="pl-10 bg-gray-50/50 border-gray-200"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        />
      </div>
      
      {filters && filters.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 hide-scrollbar">
          <Filter className="w-4 h-4 text-gray-400 shrink-0 mr-1" />
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange && onFilterChange(filter.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter.id 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
