import { Mail, Phone, Building, TrendingUp } from 'lucide-react';
import { Lead } from '@/store/crm';

interface LeadCardProps {
  lead: Lead;
  onClick?: () => void;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  new: { bg: 'bg-blue-100', text: 'text-blue-700' },
  contacted: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  qualified: { bg: 'bg-green-100', text: 'text-green-700' },
  unqualified: { bg: 'bg-red-100', text: 'text-red-700' },
};

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const colors = statusColors[lead.status] || statusColors.new;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">
            {lead.first_name} {lead.last_name}
          </h3>
          {lead.title && <p className="text-sm text-gray-600">{lead.title}</p>}
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
          {lead.status}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        {lead.company && (
          <div className="flex items-center gap-2 text-gray-700">
            <Building className="w-4 h-4 text-gray-400" />
            <span>{lead.company}</span>
          </div>
        )}
        {lead.email && (
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="truncate">{lead.email}</span>
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center gap-2 text-gray-700">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{lead.phone}</span>
          </div>
        )}
      </div>

      {lead.lead_score > 0 && (
        <div className="mt-3 flex items-center gap-2 pt-3 border-t border-gray-100">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">Score: {lead.lead_score}</span>
        </div>
      )}
    </div>
  );
}
