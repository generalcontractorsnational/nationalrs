import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  loading: true,

  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    if (data.user) {
      set({ user: { id: data.user.id, email: data.user.email || '' } });
    }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.user) {
      set({ user: { id: data.user.id, email: data.user.email || '' } });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },

  checkAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        set({
          user: { id: session.user.id, email: session.user.email || '' },
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({ loading: false });
    }
  },
}));
