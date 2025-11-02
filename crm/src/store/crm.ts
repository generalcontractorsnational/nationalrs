import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  source?: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified';
  lead_score: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Opportunity {
  id: string;
  lead_id?: string;
  title: string;
  description?: string;
  amount?: number;
  probability: number;
  stage: 'prospecting' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  close_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  lead_id?: string;
  opportunity_id?: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'task';
  subject: string;
  description?: string;
  activity_date: string;
  completed: boolean;
  created_at: string;
}

interface CRMStore {
  leads: Lead[];
  opportunities: Opportunity[];
  activities: Activity[];
  loading: boolean;
  fetchLeads: () => Promise<void>;
  fetchOpportunities: () => Promise<void>;
  fetchActivities: () => Promise<void>;
  createLead: (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => Promise<Lead>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  createOpportunity: (opp: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>) => Promise<Opportunity>;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => Promise<void>;
  createActivity: (activity: Omit<Activity, 'id' | 'created_at'>) => Promise<Activity>;
}

export const useCRM = create<CRMStore>((set) => ({
  leads: [],
  opportunities: [],
  activities: [],
  loading: false,

  fetchLeads: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('archived', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      set({ leads: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching leads:', error);
      set({ loading: false });
    }
  },

  fetchOpportunities: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('archived', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      set({ opportunities: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      set({ loading: false });
    }
  },

  fetchActivities: async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('activity_date', { ascending: false })
        .limit(50);
      if (error) throw error;
      set({ activities: data || [] });
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  },

  createLead: async (lead) => {
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select()
      .single();
    if (error) throw error;
    set((state) => ({ leads: [data, ...state.leads] }));
    return data;
  },

  updateLead: async (id, updates) => {
    const { error } = await supabase
      .from('leads')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));
  },

  createOpportunity: async (opp) => {
    const { data, error } = await supabase
      .from('opportunities')
      .insert([opp])
      .select()
      .single();
    if (error) throw error;
    set((state) => ({ opportunities: [data, ...state.opportunities] }));
    return data;
  },

  updateOpportunity: async (id, updates) => {
    const { error } = await supabase
      .from('opportunities')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    set((state) => ({
      opportunities: state.opportunities.map((o) =>
        o.id === id ? { ...o, ...updates } : o
      ),
    }));
  },

  createActivity: async (activity) => {
    const { data, error } = await supabase
      .from('activities')
      .insert([activity])
      .select()
      .single();
    if (error) throw error;
    set((state) => ({ activities: [data, ...state.activities] }));
    return data;
  },
}));
