// ═══════════════════════════════════════════════════════════════════════════════
// SULTAN — Supabase Client Configuration
// ═══════════════════════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Server-side client with service role (for admin operations)
export function createServiceClient() {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

// Database type helper
export type Tables = {
  Profile: any;
  Category: any;
  Listing: any;
  ListingSave: any;
  Message: any;
  WalletTransaction: any;
  SupportEvent: any;
  Auction: any;
  CharityCase: any;
  FeatureFlag: any;
  AuditLog: any;
  AiProvider: any;
  AiModel: any;
  ModelRoutingRule: any;
  StoredSecret: any;
  AgentInstance: any;
  AiTask: any;
  Workflow: any;
  ObservabilityEvent: any;
  ModelUsageMetric: any;
  MemoryEntry: any;
  KnowledgeEntry: any;
  PermissionPolicy: any;
  ScheduledTask: any;
  SocialAccount: any;
  SocialPost: any;
  MarriageProfile: any;
  Wallet: any;
  Transaction: any;
  TrustScoreRecord: any;
  TrendItem: any;
  BusinessProfile: any;
  CommandCenterSession: any;
};
