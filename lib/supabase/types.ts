/**
 * lib/supabase/types.ts
 * Database type definitions. Replace with generated types from:
 *   npx supabase gen types typescript --project-id <your-project-id> > lib/supabase/types.ts
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id:         string;
          email:      string;
          full_name:  string | null;
          role:       'admin' | 'operator' | 'analyst' | 'client' | 'viewer';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      incidents: {
        Row: {
          id:          string;
          title:       string;
          description: string;
          severity:    'critical' | 'high' | 'medium' | 'low';
          status:      'active' | 'investigating' | 'contained' | 'resolved';
          location:    string;
          industry:    string;
          assigned_to: string | null;
          created_by:  string;
          created_at:  string;
          updated_at:  string;
        };
        Insert: Omit<Database['public']['Tables']['incidents']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['incidents']['Insert']>;
      };
      clients: {
        Row: {
          id:           string;
          name:         string;
          industry:     string;
          risk_score:   number;
          status:       'active' | 'pending' | 'review' | 'inactive';
          contact_name: string | null;
          email:        string | null;
          phone:        string | null;
          created_at:   string;
          updated_at:   string;
        };
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['clients']['Insert']>;
      };
      reports: {
        Row: {
          id:            string;
          title:         string;
          type:          string;
          status:        'draft' | 'review' | 'approved' | 'delivered';
          content:       string | null;
          client_id:     string | null;
          created_by:    string;
          created_at:    string;
          updated_at:    string;
        };
        Insert: Omit<Database['public']['Tables']['reports']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['reports']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
