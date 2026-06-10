import React from 'react';
import Card, { CardContent } from './Card';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function RecommendationCard({ title, recommendations }) {
  return (
    <Card className="border-indigo-100 bg-gradient-to-b from-indigo-50/50 to-white">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-indigo-900">{title}</h3>
        </div>
        
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex gap-3 p-3 rounded-xl bg-white border border-indigo-50/50 shadow-sm">
              <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                rec.type === 'warning' ? 'bg-amber-400' :
                rec.type === 'critical' ? 'bg-red-400' : 'bg-indigo-400'
              }`} />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-0.5">{rec.message}</p>
                {rec.action && (
                  <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mt-1 group">
                    {rec.action}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
