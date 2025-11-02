import { useEffect, useState } from 'react';
import { useCRM } from '@/store/crm';
import { LeadCard } from './LeadCard';
import { OpportunityCard } from './OpportunityCard';
import { Plus, Users, Target, TrendingUp, DollarSign } from 'lucide-react';
import { CreateLeadModal } from './CreateLeadModal';
import { CreateOpportunityModal } from './CreateOpportunityModal';

export function Dashboard() {
  const { leads, opportunities, fetchLeads, fetchOpportunities, loading } = useCRM();
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showOppModal, setShowOppModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'leads' | 'opportunities'>('leads');

  useEffect(() => {
    fetchLeads();
    fetchOpportunities();
  }, []);

  const stats = {
    totalLeads: leads.length,
    qualifiedLeads: leads.filter((l) => l.status === 'qualified').length,
    totalOpportunities: opportunities.length,
    totalValue: opportunities.reduce((sum, o) => sum + (o.amount || 0), 0),
    activeDeals: opportunities.filter((o) => !o.stage.includes('closed')).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your leads and opportunities</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowLeadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Lead
            </button>
            <button
              onClick={() => setShowOppModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Opportunity
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Leads"
            value={stats.totalLeads}
            color="blue"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Qualified Leads"
            value={stats.qualifiedLeads}
            color="green"
          />
          <StatCard
            icon={<Target className="w-6 h-6" />}
            label="Active Deals"
            value={stats.activeDeals}
            color="purple"
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            label="Pipeline Value"
            value={`$${stats.totalValue.toLocaleString()}`}
            color="green"
          />
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8">
              <button
                onClick={() => setActiveTab('leads')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'leads'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Leads ({leads.length})
              </button>
              <button
                onClick={() => setActiveTab('opportunities')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'opportunities'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Opportunities ({opportunities.length})
              </button>
            </nav>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'leads' ? (
              leads.length > 0 ? (
                leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
              ) : (
                <EmptyState type="leads" onCreate={() => setShowLeadModal(true)} />
              )
            ) : opportunities.length > 0 ? (
              opportunities.map((opp) => <OpportunityCard key={opp.id} opportunity={opp} />)
            ) : (
              <EmptyState type="opportunities" onCreate={() => setShowOppModal(true)} />
            )}
          </div>
        )}
      </div>

      {showLeadModal && <CreateLeadModal onClose={() => setShowLeadModal(false)} />}
      {showOppModal && <CreateOpportunityModal onClose={() => setShowOppModal(false)} />}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

function EmptyState({ type, onCreate }: { type: string; onCreate: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
      <p className="text-gray-500 mb-4">No {type} yet</p>
      <button
        onClick={onCreate}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Create {type === 'leads' ? 'Lead' : 'Opportunity'}
      </button>
    </div>
  );
}
