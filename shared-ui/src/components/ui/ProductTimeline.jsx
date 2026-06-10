import React from 'react';
import Card, { CardContent, CardHeader, CardTitle } from './Card';
import { CheckCircle2, Circle } from 'lucide-react';

export default function ProductTimeline({ events }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Movement History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-3">
          {/* Vertical line connecting timeline items */}
          <div className="absolute left-[17px] top-2 bottom-2 w-px bg-gray-200" />
          
          <div className="space-y-6 relative">
            {events.map((event, index) => {
              const isLast = index === events.length - 1;
              const isCompleted = event.status === 'completed';
              
              return (
                <div key={index} className="flex gap-4">
                  <div className="relative z-10 bg-white pt-1">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 fill-white" />
                    )}
                  </div>
                  <div className="flex-1 pb-1">
                    <p className={`text-sm font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                      {event.stage}
                    </p>
                    {event.date && (
                      <p className="text-xs text-gray-500 mt-0.5">{event.date}</p>
                    )}
                    {event.location && (
                      <p className="text-xs text-gray-600 mt-1.5 bg-gray-50 inline-block px-2 py-1 rounded">
                        {event.location}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
