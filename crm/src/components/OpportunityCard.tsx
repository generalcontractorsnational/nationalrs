import { DollarSign, Calendar, BarChart3 } from 'lucide-react';
import { Opportunity } from '@/store/crm';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onClick?: () => void;
}

const stageColors: Record<string, { bg: string; text: string }> = {
  prospecting: { bg: 'bg-gray-100', text: 'text-gray-700' },
  qualified: { bg: 'bg-blue-100', text: 'text-blue-700' },
  proposal: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  negotiation: { bg: 'bg-orange-100', text: 'text-orange-700' },
  closed_won: { bg: 'bg-green-100', text: 'text-green-700' },
  closed_lost: { bg: 'bg-red-100', text: 'text-red-700' },
};

export function OpportunityCard({ opportunity, onClick }: OpportunityCardProps) {
  const colors = stageColors[opportunity.stage] || stageColors.prospecting;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{opportunity.title}</h3>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
          {opportunity.stage.replace('_', ' ')}
        </div>
      </div>

      {opportunity.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{opportunity.description}</p>
      )}

      <div className="space-y-2 text-sm">
        {opportunity.amount && (
          <div className="flex items-center gap-2 text-gray-700">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="font-medium">${opportunity.amount.toLocaleString()}</span>
          </div>
        )}
        {opportunity.close_date && (
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>{new Date(opportunity.close_date).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-600">Probability</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
                style={{ width: `${opportunity.probability}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-700">{opportunity.probability}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
