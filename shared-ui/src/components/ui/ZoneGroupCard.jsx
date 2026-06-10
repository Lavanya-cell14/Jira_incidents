import React from 'react';
import Card, { CardContent } from './Card';
import CapacityProgress from './CapacityProgress';
import StatusBadge from './StatusBadge';
import { Box } from 'lucide-react';

export default function ZoneGroupCard({ name, totalZones, occupiedPercent, availableCapacity, status, onClick }) {
  return (
    <Card 
      className="hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500 h-full flex flex-col"
      onClick={onClick}
    >
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50/50 rounded-lg">
              <Box className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{name}</h4>
              <p className="text-xs text-gray-500 mt-1">{totalZones} Zones Total</p>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>
        
        <div className="mt-auto">
          <CapacityProgress value={occupiedPercent} className="mb-4" />
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Available</span>
            <span className="font-medium text-gray-900">{availableCapacity} Units</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
