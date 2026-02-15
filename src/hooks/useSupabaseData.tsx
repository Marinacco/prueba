import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Generic fetch helpers
const fetchTable = async (table: string) => {
  const { data, error } = await (supabase as any).from(table).select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

// Lawyers
export function useLawyers() {
  return useQuery({ queryKey: ['lawyers'], queryFn: () => fetchTable('lawyers') });
}

export function useCreateLawyer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lawyer: { name: string; email?: string; phone?: string; specialties?: string[]; hire_date?: string }) => {
      const { data, error } = await (supabase as any).from('lawyers').insert(lawyer).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['lawyers'] }); toast.success('Abogado registrado'); },
    onError: (e: any) => toast.error('Error', { description: e.message }),
  });
}

export function useUpdateLawyer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await (supabase as any).from('lawyers').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['lawyers'] }); toast.success('Abogado actualizado'); },
    onError: (e: any) => toast.error('Error', { description: e.message }),
  });
}

export function useDeleteLawyer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from('lawyers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['lawyers'] }); toast.success('Abogado eliminado'); },
    onError: (e: any) => toast.error('Error', { description: e.message }),
  });
}

// Legal Services
export function useServices() {
  return useQuery({ queryKey: ['legal_services'], queryFn: () => fetchTable('legal_services') });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (service: { name: string; description?: string; category: string; base_price: number; commission_type?: string; commission_percentage?: number }) => {
      const { data, error } = await (supabase as any).from('legal_services').insert(service).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['legal_services'] }); toast.success('Servicio creado'); },
    onError: (e: any) => toast.error('Error', { description: e.message }),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await (supabase as any).from('legal_services').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['legal_services'] }); toast.success('Servicio actualizado'); },
    onError: (e: any) => toast.error('Error', { description: e.message }),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from('legal_services').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['legal_services'] }); toast.success('Servicio eliminado'); },
    onError: (e: any) => toast.error('Error', { description: e.message }),
  });
}

// Clients
export function useClients() {
  return useQuery({ queryKey: ['clients'], queryFn: () => fetchTable('clients') });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (client: { name: string; email?: string; phone?: string; company?: string; address?: string }) => {
      const { data, error } = await (supabase as any).from('clients').insert(client).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['clients'] }); },
    onError: (e: any) => toast.error('Error', { description: e.message }),
  });
}

// Cases with joins
export function useCases() {
  return useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('cases')
        .select('*, client:clients(*), service:legal_services(*), lawyer:lawyers(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateCase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (caseData: {
      case_number: string;
      client_id: string;
      service_id: string;
      lawyer_id: string;
      total_amount: number;
      commission_amount: number;
      notes?: string;
    }) => {
      const { data, error } = await (supabase as any).from('cases').insert(caseData).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cases'] }); toast.success('Caso creado'); },
    onError: (e: any) => toast.error('Error', { description: e.message }),
  });
}

export function useUpdateCase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await (supabase as any).from('cases').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cases'] }); toast.success('Caso actualizado'); },
    onError: (e: any) => toast.error('Error', { description: e.message }),
  });
}

export function useDeleteCase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from('cases').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cases'] }); toast.success('Caso eliminado'); },
    onError: (e: any) => toast.error('Error', { description: e.message }),
  });
}

// Dashboard stats (computed from cases)
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [casesRes, lawyersRes, clientsRes] = await Promise.all([
        (supabase as any).from('cases').select('*, lawyer:lawyers(name)'),
        (supabase as any).from('lawyers').select('*'),
        (supabase as any).from('clients').select('id'),
      ]);

      const cases = casesRes.data || [];
      const lawyers = lawyersRes.data || [];
      const clients = clientsRes.data || [];

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const monthlyCases = cases.filter((c: any) => {
        const d = new Date(c.start_date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

      return {
        totalRevenue: cases.reduce((s: number, c: any) => s + Number(c.total_amount || 0), 0),
        monthlyRevenue: monthlyCases.reduce((s: number, c: any) => s + Number(c.total_amount || 0), 0),
        totalCommissions: cases.filter((c: any) => c.commission_paid).reduce((s: number, c: any) => s + Number(c.commission_amount || 0), 0),
        pendingCommissions: cases.filter((c: any) => !c.commission_paid).reduce((s: number, c: any) => s + Number(c.commission_amount || 0), 0),
        activeCases: cases.filter((c: any) => c.status === 'active' || c.status === 'in_progress').length,
        completedCases: cases.filter((c: any) => c.status === 'completed').length,
        totalLawyers: lawyers.length,
        totalClients: clients.length,
      };
    },
  });
}
