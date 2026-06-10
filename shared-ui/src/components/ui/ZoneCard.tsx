import Card, { CardContent } from './Card';
import CapacityProgress from './CapacityProgress';
import StatusBadge from './StatusBadge';
import { Thermometer, Package } from 'lucide-react';

export interface ZoneCardProps {
  name: string;
  capacityPercent: number;
  availableSlots: number | string;
  productCount: number | string;
  temperature?: string;
  status: string;
}

export default function ZoneCard({
  name,
  capacityPercent,
  availableSlots,
  productCount,
  temperature,
  status,
}: ZoneCardProps) {
  return (
    <Card className="hover:border-blue-200 transition-colors duration-200 h-full flex flex-col">
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">{name}</h4>
            <StatusBadge status={status} />
          </div>
          {temperature && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
              <Thermometer className="w-3.5 h-3.5 text-gray-400" />
              {temperature}
            </div>
          )}
        </div>
        
        <div className="mt-auto">
          <CapacityProgress value={capacityPercent} className="mb-4" />
          
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-50">
            <div>
              <p className="text-xs text-gray-500 mb-1">Available Slots</p>
              <p className="font-semibold text-gray-900">{availableSlots}</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-xs text-gray-500 mb-1">Products</p>
              <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                <Package className="w-3.5 h-3.5 text-gray-400" />
                {productCount}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
