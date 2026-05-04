import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Competitor = {
  id: string;
  user_id: string;
  name: string;
  website: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  status: 'active' | 'paused';
  created_at: string;
  updated_at: string;
};

export type CompetitorData = {
  id: string;
  competitor_id: string;
  user_id: string;
  data_type: 'price' | 'product' | 'content' | 'site_update';
  title: string;
  description: string;
  value: string;
  change_detected: boolean;
  collected_at: string;
};

export type ReportContent = {
  executive_summary: string;
  categories: {
    prices: CategorySection;
    products: CategorySection;
    marketing: CategorySection;
    site_updates: CategorySection;
  };
  insights: string[];
  opportunities: string[];
  threats: string[];
  recommendations: string[];
};

export type CategorySection = {
  summary: string;
  items: { what: string; impact: string; why: string }[];
};

export type Report = {
  id: string;
  user_id: string;
  title: string;
  content: ReportContent;
  created_at: string;
};
