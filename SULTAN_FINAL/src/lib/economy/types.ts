// ═══════════════════════════════════════════════════════════════════════════════
// SULTAN ECONOMY — Type System
// Currency: SC (Sultan Coins), SR (Sultan Rewards), SP (Sultan Power)
// ═══════════════════════════════════════════════════════════════════════════════

export type CurrencyCode = 'SC' | 'SR' | 'SP' | 'MAD';

export type TransactionType =
  | 'coin_purchase'
  | 'support_sent'
  | 'support_received'
  | 'reward_earned'
  | 'reward_pending'
  | 'reward_available'
  | 'cashout_requested'
  | 'cashout_approved'
  | 'cashout_rejected'
  | 'cashout_paid'
  | 'grant_received'
  | 'grant_adjustment'
  | 'boost_purchase'
  | 'featured_purchase'
  | 'promotion_purchase'
  | 'challenge_reward'
  | 'bounty_reward'
  | 'task_payment'
  | 'commission_deducted'
  | 'refund_issued'
  | 'admin_grant'
  | 'admin_adjustment'
  | 'power_earned'
  | 'power_spent'
  | 'challenge_entry_fee'
  | 'bounty_submission'
  | 'ad_payment';

export type TransactionStatus =
  | 'completed'
  | 'pending'
  | 'frozen'
  | 'failed'
  | 'cancelled'
  | 'reversed';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type CashoutStatus =
  | 'requested'
  | 'pending'
  | 'risk_review'
  | 'kyc_review'
  | 'approved'
  | 'processing'
  | 'paid'
  | 'rejected'
  | 'cancelled'
  | 'frozen';

export type KYCStatus =
  | 'not_required'
  | 'required'
  | 'pending'
  | 'verified'
  | 'rejected'
  | 'expired'
  | 'review';

export type VerificationType =
  | 'identity_verified'
  | 'business_verified'
  | 'official_account'
  | 'trusted_contributor'
  | 'sultan_supported'
  | 'featured'
  | 'sponsored';

export type ChallengeStatus =
  | 'draft'
  | 'published'
  | 'active'
  | 'closed'
  | 'judging'
  | 'winner_selected'
  | 'rewarded'
  | 'cancelled';

export type BountyStatus =
  | 'draft'
  | 'published'
  | 'active'
  | 'closed'
  | 'judging'
  | 'rewarded'
  | 'disputed'
  | 'cancelled';

export type TaskStatus =
  | 'draft'
  | 'published'
  | 'in_progress'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'paid'
  | 'rejected'
  | 'cancelled';

export type GrantStatus =
  | 'draft'
  | 'accepting_applications'
  | 'review'
  | 'approved'
  | 'payout'
  | 'completed'
  | 'cancelled';

export type CampaignType =
  | 'follower_growth'
  | 'engagement'
  | 'reach'
  | 'profile_visit'
  | 'content_discovery'
  | 'local_boost'
  | 'city_boost'
  | 'regional_boost'
  | 'national_boost'
  | 'diaspora_boost';

export type CampaignStatus =
  | 'draft'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';

export type AudienceSegment =
  | 'morocco'
  | 'moroccan_diaspora'
  | 'france'
  | 'spain'
  | 'belgium'
  | 'netherlands'
  | 'canada'
  | 'other';

// ─── Wallet ──────────────────────────────────────────────────────────────────

export interface WalletBalance {
  currency: CurrencyCode;
  balance: number;
  available: number;
  pending: number;
  frozen: number;
  lifetimeReceived: number;
  lifetimeGiven: number;
  lifetimeWithdrawn: number;
}

export interface UserWallet {
  userId: string;
  coins: WalletBalance;
  rewards: WalletBalance;
  power: WalletBalance;
  pendingRewards: WalletBalance;
  updatedAt: string;
}

// ─── Ledger Transaction ─────────────────────────────────────────────────────

export interface LedgerTransaction {
  id: string;
  userId: string;
  source: string;
  destination: string;
  currency: CurrencyCode;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  referenceId: string;
  campaignId: string | null;
  createdAt: string;
  completedAt: string | null;
  createdBy: string | null;
  riskStatus: RiskLevel;
  metadata: Record<string, any>;
  auditId: string | null;
  ruleVersion: number;
}

// ─── Support ────────────────────────────────────────────────────────────────

export interface SupportOption {
  amount: number;
  isCustom?: boolean;
}

export interface SupportMessage {
  id: string;
  textAr: string;
}

export interface SupportEvent {
  id: string;
  supporterId: string;
  recipientId: string;
  amount: number;
  fee: number;
  recipientReceives: number;
  currency: CurrencyCode;
  message: string;
  targetType: 'profile' | 'post' | 'service' | 'business' | 'project' | 'challenge' | 'bounty' | 'community';
  targetId: string;
  transactionId: string;
  createdAt: string;
}

// ─── Cashout ────────────────────────────────────────────────────────────────

export interface CashoutEligibility {
  eligible: boolean;
  reason: string;
  reviewStatus: 'none' | 'pending' | 'approved' | 'rejected';
  riskStatus: RiskLevel;
  kycStatus: KYCStatus;
  approvedBy: string | null;
  approvedAt: string | null;
  expiresAt: string | null;
}

export interface CashoutRequest {
  id: string;
  userId: string;
  amount: number;
  currency: CurrencyCode;
  status: CashoutStatus;
  method: string;
  methodDetails: Record<string, any>;
  eligibility: CashoutEligibility;
  requestedAt: string;
  processedAt: string | null;
  completedAt: string | null;
  rejectionReason: string | null;
  transactionId: string | null;
  auditId: string | null;
}

// ─── Economy Rules ──────────────────────────────────────────────────────────

export interface EconomyRule {
  id: string;
  key: string;
  value: number | string | boolean;
  label: string;
  labelAr: string;
  description: string;
  category: 'coins' | 'rewards' | 'cashout' | 'risk' | 'commission' | 'campaign' | 'support' | 'grant' | 'general';
  version: number;
  updatedBy: string | null;
  updatedAt: string;
  previousValue: any;
  changeReason: string | null;
}

// ─── Reputation ─────────────────────────────────────────────────────────────

export interface ReputationSignal {
  type: string;
  weight: number;
  value: number;
}

export interface ReputationScore {
  score: number;
  level: number;
  signals: ReputationSignal[];
  lastUpdated: string;
}

// ─── Supporter ──────────────────────────────────────────────────────────────

export type SupporterRank = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface SupporterProfile {
  userId: string;
  level: SupporterRank;
  score: number;
  contributionScore: number;
  peopleSupported: number;
  totalSupportGiven: number;
  communityImpact: number;
  rank: number;
}

// ─── Challenge ──────────────────────────────────────────────────────────────

export interface Challenge {
  id: string;
  title: string;
  description: string;
  rules: string;
  deadline: string;
  reward: { amount: number; currency: CurrencyCode; type: 'coins' | 'rewards' | 'power' | 'mixed' };
  category: string;
  location: string | null;
  attachments: string[];
  submissionType: 'text' | 'image' | 'video' | 'link' | 'file';
  winnerCount: number;
  jury: string[];
  status: ChallengeStatus;
  creatorId: string;
  participantCount: number;
  submissionCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Bounty ─────────────────────────────────────────────────────────────────

export interface Bounty {
  id: string;
  title: string;
  problem: string;
  budget: number;
  currency: CurrencyCode;
  deadline: string;
  requirements: string[];
  location: string | null;
  category: string;
  submissionCount: number;
  winnerId: string | null;
  status: BountyStatus;
  paymentStatus: 'none' | 'escrowed' | 'released' | 'disputed';
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Task ───────────────────────────────────────────────────────────────────

export interface SultanTask {
  id: string;
  title: string;
  description: string;
  budget: number;
  reward: number;
  currency: CurrencyCode;
  estimatedTime: string;
  skills: string[];
  location: string | null;
  deadline: string;
  verificationMethod: string;
  completionProof: string;
  reviewStatus: string;
  payoutStatus: 'none' | 'pending' | 'approved' | 'paid' | 'rejected';
  status: TaskStatus;
  assigneeId: string | null;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Grant ──────────────────────────────────────────────────────────────────

export interface GrantCampaign {
  id: string;
  title: string;
  description: string;
  recipientCount: number;
  grantAmount: number;
  grantCurrency: CurrencyCode;
  grantType: 'coins' | 'rewards' | 'power' | 'mixed';
  categories: string[];
  cities: string[];
  duration: { start: string; end: string };
  eligibility: string;
  applicationProcess: 'open' | 'invite_only' | 'nomination';
  selectionMethod: 'auto' | 'manual' | 'jury';
  budget: number;
  budgetUsed: number;
  visibility: 'public' | 'featured' | 'hidden';
  status: GrantStatus;
  applicantCount: number;
  approvedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GrantApplication {
  id: string;
  campaignId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  amount: number;
  reason: string;
  reviewNotes: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

// ─── Campaign (Growth/Boost) ────────────────────────────────────────────────

export interface GrowthCampaign {
  id: string;
  type: CampaignType;
  title: string;
  targetId: string;
  targetType: 'profile' | 'post' | 'service' | 'business' | 'news' | 'marketplace';
  budget: number;
  budgetSpent: number;
  startAt: string;
  endAt: string;
  audience: AudienceSegment[];
  surfaces: string[];
  priority: 'low' | 'normal' | 'high';
  status: CampaignStatus;
  results: {
    impressions: number;
    clicks: number;
    follows: number;
    engagement: number;
    reach: number;
  };
  isSponsored: boolean;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Admin Override / Audit ─────────────────────────────────────────────────

export interface AdminOverride {
  id: string;
  adminId: string;
  targetUserId: string;
  action: string;
  beforeState: Record<string, any>;
  afterState: Record<string, any>;
  reason: string;
  timestamp: string;
  auditId: string;
}

export interface AuditLogEntry {
  id: string;
  adminId: string;
  action: string;
  targetUser: string | null;
  targetTransaction: string | null;
  oldValue: any;
  newValue: any;
  reason: string;
  timestamp: string;
  auditId: string;
  category: 'economy' | 'user' | 'campaign' | 'cashout' | 'grant' | 'risk' | 'system';
}

// ─── Feature Flags ──────────────────────────────────────────────────────────

export interface FeatureFlag {
  key: string;
  label: string;
  labelAr: string;
  description: string;
  enabled: boolean;
  category: 'economy' | 'support' | 'rewards' | 'cashout' | 'grants' | 'tasks' | 'bounties' | 'challenges' | 'growth' | 'news' | 'business' | 'diaspora';
}

// ─── Risk ───────────────────────────────────────────────────────────────────

export interface RiskAssessment {
  score: number;
  level: RiskLevel;
  factors: { type: string; description: string; weight: number }[];
  lastAssessed: string;
}

// ─── Commission ─────────────────────────────────────────────────────────────

export interface CommissionRule {
  id: string;
  module: string;
  category: string | null;
  sellerType: string | null;
  userTier: string | null;
  rate: number;
  minFee: number;
  maxFee: number;
  currency: CurrencyCode;
  version: number;
  active: boolean;
  createdAt: string;
}

// ─── Notification ───────────────────────────────────────────────────────────

export interface EconomyNotification {
  id: string;
  userId: string;
  type: TransactionType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  metadata: Record<string, any>;
}

// ─── Opportunity ────────────────────────────────────────────────────────────

export type OpportunityType = 'job' | 'task' | 'bounty' | 'challenge' | 'grant' | 'service' | 'business' | 'promotion';

export interface OpportunityFilter {
  skills: string[];
  city: string | null;
  availableTime: string | null;
  languages: string[];
  domains: string[];
  audienceSegment: AudienceSegment | null;
}

// ─── Coin Packages ──────────────────────────────────────────────────────────

export interface CoinPackage {
  id: string;
  coins: number;
  priceMAD: number;
  bonus: number;
  popular: boolean;
  label: string;
}

// ─── Integration Status ─────────────────────────────────────────────────────

export interface IntegrationStatus {
  provider: string;
  type: 'payment' | 'cashout' | 'kyc' | 'other';
  configured: boolean;
  mode: 'production' | 'development' | 'mock';
  lastChecked: string;
}
