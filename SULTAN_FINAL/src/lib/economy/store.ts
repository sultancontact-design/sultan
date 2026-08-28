// ═══════════════════════════════════════════════════════════════════
// SULTAN ECONOMY — Zustand Store
// Central state management for the entire economy system
// ═══════════════════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import type {
  LedgerTransaction, EconomyRule, FeatureFlag, SupportEvent,
  CashoutRequest, Challenge, Bounty, SultanTask, GrantCampaign,
  GrantApplication, GrowthCampaign, AuditLogEntry, AdminOverride,
  RiskAssessment, CommissionRule, EconomyNotification, CoinPackage,
  IntegrationStatus, UserWallet, CashoutEligibility,
} from './types';
import { DEFAULT_ECONOMY_RULES, DEFAULT_FEATURE_FLAGS, COIN_PACKAGES, INTEGRATION_PROVIDERS } from './constants';

// ─── Economy State Interface ─────────────────────────────────────────────────

export interface EconomyState {
  // ─── Wallet ────────────────────────────────────────────────────────────────
  wallet: UserWallet | null;
  initWallet: (userId: string) => void;
  getWalletBalance: (currency: 'SC' | 'SR' | 'SP') => number;
  getAvailableBalance: (currency: 'SC' | 'SR' | 'SP') => number;
  getPendingBalance: (currency: 'SR') => number;

  // ─── Ledger ────────────────────────────────────────────────────────────────
  ledger: LedgerTransaction[];
  addLedgerEntry: (entry: Omit<LedgerTransaction, 'id' | 'createdAt' | 'ruleVersion'>) => string;
  getTransactionHistory: (userId: string, filters?: { type?: string; currency?: string; limit?: number }) => LedgerTransaction[];

  // ─── Support ───────────────────────────────────────────────────────────────
  supportEvents: SupportEvent[];
  executeSupport: (params: { supporterId: string; recipientId: string; amount: number; message: string; targetType: string; targetId: string }) => { success: boolean; transactionId: string; error?: string };
  getSupporterStats: (userId: string) => { totalGiven: number; peopleSupported: number };
  getRecipientStats: (userId: string) => { totalReceived: number; supporters: number };

  // ─── Rewards ───────────────────────────────────────────────────────────────
  addReward: (userId: string; amount: number; source: string; referenceId: string) => string;
  movePendingToAvailable: (transactionId: string) => void;

  // ─── Cashout ───────────────────────────────────────────────────────────────
  cashoutRequests: CashoutRequest[];
  getCashoutEligibility: (userId: string) => CashoutEligibility;
  requestCashout: (userId: string; amount: number) => { success: boolean; cashoutId: string; error?: string };
  updateCashoutStatus: (cashoutId: string; status: string; reason?: string) => void;

  // ─── Rules Engine ──────────────────────────────────────────────────────────
  economyRules: EconomyRule[];
  getRule: (key: string) => EconomyRule | undefined;
  updateRule: (key: string, newValue: any, adminId: string, reason: string) => void;

  // ─── Feature Flags ─────────────────────────────────────────────────────────
  featureFlags: FeatureFlag[];
  isFeatureEnabled: (key: string) => boolean;
  toggleFeature: (key: string, adminId: string) => void;

  // ─── Challenges ────────────────────────────────────────────────────────────
  challenges: Challenge[];
  addChallenge: (challenge: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateChallengeStatus: (id: string, status: string) => void;

  // ─── Bounties ──────────────────────────────────────────────────────────────
  bounties: Bounty[];
  addBounty: (bounty: Omit<Bounty, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateBountyStatus: (id: string, status: string) => void;

  // ─── Tasks ─────────────────────────────────────────────────────────────────
  tasks: SultanTask[];
  addTask: (task: Omit<SultanTask, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateTaskStatus: (id: string, status: string) => void;

  // ─── Grants ────────────────────────────────────────────────────────────────
  grantCampaigns: GrantCampaign[];
  grantApplications: GrantApplication[];
  addGrantCampaign: (campaign: Omit<GrantCampaign, 'id' | 'createdAt' | 'updatedAt'>) => string;
  applyForGrant: (campaignId: string; userId: string; reason: string) => string;
  reviewGrantApplication: (applicationId: string, status: 'approved' | 'rejected', adminId: string, notes: string) => void;

  // ─── Growth Campaigns ─────────────────────────────────────────────────────
  campaigns: GrowthCampaign[];
  addCampaign: (campaign: Omit<GrowthCampaign, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateCampaignStatus: (id: string, status: string) => void;

  // ─── Risk ──────────────────────────────────────────────────────────────────
  riskAssessments: Record<string, RiskAssessment>;
  getRiskScore: (userId: string) => RiskAssessment;
  assessRisk: (userId: string) => RiskAssessment;

  // ─── Commission ────────────────────────────────────────────────────────────
  commissionRules: CommissionRule[];
  calculateCommission: (module: string, amount: number, category?: string) => number;
  addCommissionRule: (rule: Omit<CommissionRule, 'id' | 'createdAt' | 'version'>) => void;

  // ─── Admin / Audit ─────────────────────────────────────────────────────────
  auditLog: AuditLogEntry[];
  adminOverrides: AdminOverride[];
  addAuditEntry: (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'auditId'>) => string;
  addAdminOverride: (override: Omit<AdminOverride, 'id' | 'timestamp' | 'auditId'>) => string;

  // ─── Notifications ─────────────────────────────────────────────────────────
  economyNotifications: EconomyNotification[];
  addEconomyNotification: (notification: Omit<EconomyNotification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  getUnreadCount: (userId: string) => number;

  // ─── Coin Packages ─────────────────────────────────────────────────────────
  coinPackages: CoinPackage[];

  // ─── Integration Status ────────────────────────────────────────────────────
  integrationStatus: Record<string, IntegrationStatus>;

  // ─── Emergency Controls ────────────────────────────────────────────────────
  emergencyPauses: Record<string, boolean>;
  pauseFeature: (feature: string) => void;
  unpauseFeature: (feature: string) => void;
  isFeaturePaused: (feature: string) => boolean;

  // ─── Admin Economy Actions ─────────────────────────────────────────────────
  adminGrantCoins: (adminId: string, userId: string, amount: number, reason: string) => string;
  adminGrantReward: (adminId: string, userId: string, amount: number, reason: string) => string;
  adminGrantPower: (adminId: string, userId: string, amount: number, reason: string) => string;
  adminEnableCashout: (adminId: string, userId: string, reason: string) => void;
  adminDisableCashout: (adminId: string, userId: string, reason: string) => void;
  adminFreezeCashout: (adminId: string, userId: string, reason: string) => void;
  adminSultanSupported: (adminId: string, userId: string, data: { duration: string; surfaces: string[]; budget: number; reason: string }) => void;
  adminAddBadge: (adminId: string, userId: string, badge: string, reason: string) => void;
  adminLaunchBoost: (adminId: string, params: Omit<GrowthCampaign, 'id' | 'createdAt' | 'updatedAt' | 'results'>) => string;

  // ─── Stats ─────────────────────────────────────────────────────────────────
  getEconomyStats: () => {
    totalCoinSales: number; coinsCirculating: number; coinsSpent: number;
    coinsTransferred: number; rewardsGenerated: number; rewardsPending: number;
    rewardsPaid: number; cashoutVolume: number; platformRevenue: number;
    fees: number; refunds: number; chargebacks: number; fraudPrevented: number;
    activeSupporters: number; supportedUsers: number;
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateId(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

function createEmptyWallet(userId: string): UserWallet {
  const emptyBalance = (currency: any) => ({
    currency, balance: 0, available: 0, pending: 0, frozen: 0,
    lifetimeReceived: 0, lifetimeGiven: 0, lifetimeWithdrawn: 0,
  });
  return {
    userId,
    coins: emptyBalance('SC' as any),
    rewards: emptyBalance('SR' as any),
    power: emptyBalance('SP' as any),
    pendingRewards: emptyBalance('SR' as any),
    updatedAt: now(),
  };
}

// ─── Store Implementation ────────────────────────────────────────────────────

export const useEconomyStore = create<EconomyState>()((set, get) => ({
  // ─── Wallet ────────────────────────────────────────────────────────────────
  wallet: null,

  initWallet: (userId: string) => {
    const existing = get().wallet;
    if (existing && existing.userId === userId) return;
    const wallet = createEmptyWallet(userId);
    // Give demo user some coins
    if (userId === 'demo-001') {
      wallet.coins = { ...wallet.coins, balance: 2500, available: 2500, lifetimeReceived: 5000, lifetimeGiven: 2500 };
      wallet.rewards = { ...wallet.rewards, balance: 750, available: 750, lifetimeReceived: 1200 };
      wallet.pendingRewards = { ...wallet.pendingRewards, pending: 200 };
      wallet.power = { ...wallet.power, balance: 1200, available: 1200, lifetimeReceived: 2000 };
    } else if (userId === 'admin-001') {
      wallet.coins = { ...wallet.coins, balance: 99999, available: 99999 };
      wallet.power = { ...wallet.power, balance: 9999, available: 9999 };
    }
    set({ wallet });
  },

  getWalletBalance: (currency) => {
    const w = get().wallet;
    if (!w) return 0;
    switch (currency) {
      case 'SC': return w.coins.balance;
      case 'SR': return w.rewards.balance;
      case 'SP': return w.power.balance;
      default: return 0;
    }
  },

  getAvailableBalance: (currency) => {
    const w = get().wallet;
    if (!w) return 0;
    switch (currency) {
      case 'SC': return w.coins.available;
      case 'SR': return w.rewards.available;
      case 'SP': return w.power.available;
      default: return 0;
    }
  },

  getPendingBalance: (currency) => {
    const w = get().wallet;
    if (!w) return 0;
    return w.pendingRewards.pending;
  },

  // ─── Ledger ────────────────────────────────────────────────────────────────
  ledger: [],

  addLedgerEntry: (entry) => {
    const id = generateId();
    const rule = get().getRule('platform_fee_percent');
    const tx: LedgerTransaction = {
      ...entry,
      id,
      createdAt: now(),
      ruleVersion: rule?.version ?? 1,
    };
    set((s) => ({ ledger: [tx, ...s.ledger] }));
    return id;
  },

  getTransactionHistory: (userId, filters) => {
    let txs = get().ledger.filter((t) => t.userId === userId);
    if (filters?.type) txs = txs.filter((t) => t.type === filters.type);
    if (filters?.currency) txs = txs.filter((t) => t.currency === filters.currency);
    if (filters?.limit) txs = txs.slice(0, filters.limit);
    return txs;
  },

  // ─── Support ───────────────────────────────────────────────────────────────
  supportEvents: [],

  executeSupport: (params) => {
    const { supporterId, recipientId, amount, message, targetType, targetId } = params;
    const state = get();

    // Validation: cannot support self
    if (supporterId === recipientId) {
      return { success: false, transactionId: '', error: 'لا يمكنك دعم نفسك' };
    }

    // Check feature enabled
    if (!state.isFeatureEnabled('support_enabled')) {
      return { success: false, transactionId: '', error: 'الدعم معطل حالياً' };
    }

    // Check emergency pause
    if (state.isFeaturePaused('support')) {
      return { success: false, transactionId: '', error: 'الدعم متوقف مؤقتاً' };
    }

    // Check balance
    const feeRate = state.getRule('platform_fee_percent')?.value ?? 5;
    const fee = Math.round((amount * feeRate) / 100);
    const total = amount + fee;
    const available = state.getAvailableBalance('SC');

    if (available < total) {
      return { success: false, transactionId: '', error: 'رصيدك غير كافٍ' };
    }

    // Execute
    const txId = generateId();
    const event: SupportEvent = {
      id: generateId(), supporterId, recipientId, amount, fee,
      recipientReceives: amount,
      currency: 'SC', message, targetType: targetType as any, targetId,
      transactionId: txId, createdAt: now(),
    };

    // Deduct from supporter
    state.addLedgerEntry({
      userId: supporterId, source: 'wallet', destination: `user:${recipientId}`,
      currency: 'SC', amount: -total, type: 'support_sent', status: 'completed',
      referenceId: targetId, campaignId: null, completedAt: now(),
      createdBy: supporterId, riskStatus: 'low', metadata: { message, targetType, targetId }, auditId: null,
    });

    // Add to recipient
    state.addLedgerEntry({
      userId: recipientId, source: `user:${supporterId}`, destination: 'wallet',
      currency: 'SC', amount, type: 'support_received', status: 'completed',
      referenceId: targetId, campaignId: null, completedAt: now(),
      createdBy: supporterId, riskStatus: 'low', metadata: { message, targetType, targetId }, auditId: null,
    });

    // Update wallet balances
    set((s) => {
      if (!s.wallet || s.wallet.userId !== supporterId) return s;
      return {
        wallet: {
          ...s.wallet,
          coins: { ...s.wallet.coins, balance: s.wallet.coins.balance - total, available: s.wallet.coins.available - total, lifetimeGiven: s.wallet.coins.lifetimeGiven + total },
        },
      };
    });

    // Add support event
    set((s) => ({ supportEvents: [...s.supportEvents, event] }));

    // Add notification for recipient
    state.addEconomyNotification({
      userId: recipientId, type: 'support_received',
      title: 'دعم جديد',
      body: `تم دعمك بـ ${amount.toLocaleString()} SC`,
      metadata: { supporterId, amount, message, txId },
    });

    return { success: true, transactionId: txId };
  },

  getSupporterStats: (userId) => {
    const events = get().supportEvents.filter((e) => e.supporterId === userId);
    return {
      totalGiven: events.reduce((sum, e) => sum + e.amount + e.fee, 0),
      peopleSupported: new Set(events.map((e) => e.recipientId)).size,
    };
  },

  getRecipientStats: (userId) => {
    const events = get().supportEvents.filter((e) => e.recipientId === userId);
    return {
      totalReceived: events.reduce((sum, e) => sum + e.recipientReceives, 0),
      supporters: new Set(events.map((e) => e.supporterId)).size,
    };
  },

  // ─── Rewards ───────────────────────────────────────────────────────────────
  addReward: (userId, amount, source, referenceId) => {
    // Add as pending first
    const txId = get().addLedgerEntry({
      userId, source, destination: 'wallet', currency: 'SR', amount,
      type: 'reward_pending', status: 'pending', referenceId,
      campaignId: null, completedAt: null, createdBy: null,
      riskStatus: 'low', metadata: { source }, auditId: null,
    });
    return txId;
  },

  movePendingToAvailable: (transactionId) => {
    set((s) => ({
      ledger: s.ledger.map((t) =>
        t.id === transactionId
          ? { ...t, type: 'reward_available' as any, status: 'completed' as any, completedAt: now() }
          : t
      ),
    }));
  },

  // ─── Cashout ───────────────────────────────────────────────────────────────
  cashoutRequests: [],

  getCashoutEligibility: (userId) => {
    const state = get();
    if (!state.isFeatureEnabled('cashout_enabled')) {
      return { eligible: false, reason: 'السحب غير مفعّل حالياً', reviewStatus: 'none' as any, riskStatus: 'low' as any, kycStatus: 'not_required' as any, approvedBy: null, approvedAt: null, expiresAt: null };
    }
    if (state.isFeaturePaused('cashouts')) {
      return { eligible: false, reason: 'السحب متوقف مؤقتاً من قبل الإدارة', reviewStatus: 'none' as any, riskStatus: 'low' as any, kycStatus: 'not_required' as any, approvedBy: null, approvedAt: null, expiresAt: null };
    }
    const risk = state.getRiskScore(userId);
    if (risk.level === 'high' || risk.level === 'critical') {
      return { eligible: false, reason: 'حسابك يحتاج مراجعة أمنية', reviewStatus: 'pending' as any, riskStatus: risk.level, kycStatus: 'not_required' as any, approvedBy: null, approvedAt: null, expiresAt: null };
    }
    return { eligible: true, reason: 'مؤهل', reviewStatus: 'approved' as any, riskStatus: 'low' as any, kycStatus: 'not_required' as any, approvedBy: null, approvedAt: null, expiresAt: null };
  },

  requestCashout: (userId, amount) => {
    const state = get();
    const eligibility = state.getCashoutEligibility(userId);
    if (!eligibility.eligible) {
      return { success: false, cashoutId: '', error: eligibility.reason };
    }
    const minCashout = (state.getRule('min_cashout_sr')?.value ?? 500) as number;
    if (amount < minCashout) {
      return { success: false, cashoutId: '', error: `الحد الأدنى للسحب ${minCashout.toLocaleString()} SR` };
    }
    const available = state.getAvailableBalance('SR');
    if (available < amount) {
      return { success: false, cashoutId: '', error: 'رصيدك المتاح غير كافٍ' };
    }

    const id = generateId();
    const cashout: CashoutRequest = {
      id, userId, amount, currency: 'SR', status: 'requested',
      method: 'bank_transfer', methodDetails: {}, eligibility,
      requestedAt: now(), processedAt: null, completedAt: null,
      rejectionReason: null, transactionId: null, auditId: null,
    };
    set((s) => ({
      cashoutRequests: [...s.cashoutRequests, cashout],
      wallet: s.wallet && s.wallet.userId === userId ? {
        ...s.wallet,
        rewards: { ...s.wallet.rewards, available: s.wallet.rewards.available - amount, pending: s.wallet.rewards.pending + amount },
      } : s.wallet,
    }));
    return { success: true, cashoutId: id };
  },

  updateCashoutStatus: (cashoutId, status, reason) => {
    set((s) => ({
      cashoutRequests: s.cashoutRequests.map((c) =>
        c.id === cashoutId
          ? { ...c, status: status as any, processedAt: now(), rejectionReason: reason ?? c.rejectionReason }
          : c
      ),
    }));
  },

  // ─── Rules Engine ──────────────────────────────────────────────────────────
  economyRules: [...DEFAULT_ECONOMY_RULES],

  getRule: (key) => get().economyRules.find((r) => r.key === key),

  updateRule: (key, newValue, adminId, reason) => {
    set((s) => ({
      economyRules: s.economyRules.map((r) => {
        if (r.key !== key) return r;
        const updated: EconomyRule = {
          ...r, value: newValue, previousValue: r.value,
          version: r.version + 1, updatedBy: adminId, updatedAt: now(), changeReason: reason,
        };
        return updated;
      }),
    }));
    get().addAuditEntry({
      adminId, action: 'update_economy_rule', targetUser: null, targetTransaction: null,
      oldValue: { key, value: get().economyRules.find((r) => r.key === key)?.previousValue },
      newValue: { key, value: newValue }, reason, category: 'economy',
    });
  },

  // ─── Feature Flags ─────────────────────────────────────────────────────────
  featureFlags: [...DEFAULT_FEATURE_FLAGS],

  isFeatureEnabled: (key) => {
    const flag = get().featureFlags.find((f) => f.key === key);
    if (!flag) return false;
    if (!flag.enabled) return false;
    return !get().isFeaturePaused(key);
  },

  toggleFeature: (key, adminId) => {
    set((s) => ({
      featureFlags: s.featureFlags.map((f) =>
        f.key === key ? { ...f, enabled: !f.enabled } : f
      ),
    }));
    get().addAuditEntry({
      adminId, action: 'toggle_feature_flag', targetUser: null, targetTransaction: null,
      oldValue: { key, enabled: get().featureFlags.find((f) => f.key === key)?.enabled },
      newValue: { key, enabled: !get().featureFlags.find((f) => f.key === key)?.enabled },
      reason: 'تغيير ميزة', category: 'system',
    });
  },

  // ─── Challenges ────────────────────────────────────────────────────────────
  challenges: [],
  addChallenge: (c) => {
    const id = generateId();
    set((s) => ({ challenges: [...s.challenges, { ...c, id, createdAt: now(), updatedAt: now() }] }));
    return id;
  },
  updateChallengeStatus: (id, status) => {
    set((s) => ({
      challenges: s.challenges.map((c) => c.id === id ? { ...c, status: status as any, updatedAt: now() } : c),
    }));
  },

  // ─── Bounties ──────────────────────────────────────────────────────────────
  bounties: [],
  addBounty: (b) => {
    const id = generateId();
    set((s) => ({ bounties: [...s.bounties, { ...b, id, createdAt: now(), updatedAt: now() }] }));
    return id;
  },
  updateBountyStatus: (id, status) => {
    set((s) => ({
      bounties: s.bounties.map((b) => b.id === id ? { ...b, status: status as any, updatedAt: now() } : b),
    }));
  },

  // ─── Tasks ─────────────────────────────────────────────────────────────────
  tasks: [],
  addTask: (t) => {
    const id = generateId();
    set((s) => ({ tasks: [...s.tasks, { ...t, id, createdAt: now(), updatedAt: now() }] }));
    return id;
  },
  updateTaskStatus: (id, status) => {
    set((s) => ({
      tasks: s.tasks.map((t) => t.id === id ? { ...t, status: status as any, updatedAt: now() } : t),
    }));
  },

  // ─── Grants ────────────────────────────────────────────────────────────────
  grantCampaigns: [],
  grantApplications: [],
  addGrantCampaign: (c) => {
    const id = generateId();
    set((s) => ({ grantCampaigns: [...s.grantCampaigns, { ...c, id, createdAt: now(), updatedAt: now() }] }));
    return id;
  },
  applyForGrant: (campaignId, userId, reason) => {
    const id = generateId();
    set((s) => ({
      grantApplications: [...s.grantApplications, {
        id, campaignId, userId, status: 'pending', amount: 0, reason,
        reviewNotes: null, reviewedBy: null, reviewedAt: null, createdAt: now(),
      }],
    }));
    return id;
  },
  reviewGrantApplication: (applicationId, status, adminId, notes) => {
    set((s) => ({
      grantApplications: s.grantApplications.map((a) =>
        a.id === applicationId
          ? { ...a, status: status as any, reviewedBy: adminId, reviewedAt: now(), reviewNotes: notes }
          : a
      ),
    }));
    get().addAuditEntry({
      adminId, action: 'review_grant_application', targetUser: null, targetTransaction: null,
      oldValue: { applicationId, status: 'pending' },
      newValue: { applicationId, status }, reason: notes, category: 'grant',
    });
  },

  // ─── Growth Campaigns ─────────────────────────────────────────────────────
  campaigns: [],
  addCampaign: (c) => {
    const id = generateId();
    set((s) => ({ campaigns: [...s.campaigns, { ...c, id, createdAt: now(), updatedAt: now(), results: c.results ?? { impressions: 0, clicks: 0, follows: 0, engagement: 0, reach: 0 } }] }));
    return id;
  },
  updateCampaignStatus: (id, status) => {
    set((s) => ({
      campaigns: s.campaigns.map((c) => c.id === id ? { ...c, status: status as any, updatedAt: now() } : c),
    }));
  },

  // ─── Risk ──────────────────────────────────────────────────────────────────
  riskAssessments: {},
  getRiskScore: (userId) => {
    const existing = get().riskAssessments[userId];
    if (existing) return existing;
    return { score: 0, level: 'low' as any, factors: [], lastAssessed: now() };
  },
  assessRisk: (userId) => {
    // Simplified risk assessment based on activity patterns
    const state = get();
    const userTxs = state.ledger.filter((t) => t.userId === userId);
    const recentTxs = userTxs.filter((t) => {
      const txDate = new Date(t.createdAt).getTime();
      const now_ = Date.now();
      return (now_ - txDate) < 24 * 60 * 60 * 1000; // last 24h
    });

    let score = 0;
    const factors: { type: string; description: string; weight: number }[] = [];

    // Rapid transactions factor
    if (recentTxs.length > 20) {
      score += 30;
      factors.push({ type: 'rapid_activity', description: 'نشاط سريع جداً', weight: 30 });
    } else if (recentTxs.length > 10) {
      score += 15;
      factors.push({ type: 'moderate_rapid', description: 'نشاط سريع', weight: 15 });
    }

    // Self-support check (would need more data in production)
    const supportEvents = state.supportEvents.filter((e) => e.supporterId === userId);
    const circular = supportEvents.filter((e) => {
      return state.supportEvents.some((r) => r.supporterId === e.recipientId && r.recipientId === userId);
    });
    if (circular.length > 0) {
      score += 40;
      factors.push({ type: 'circular_support', description: 'دعم متبادل مشبوه', weight: 40 });
    }

    // Determine level
    const rLow = (state.getRule('risk_threshold_low')?.value ?? 30) as number;
    const rMed = (state.getRule('risk_threshold_medium')?.value ?? 60) as number;
    const rHigh = (state.getRule('risk_threshold_high')?.value ?? 80) as number;

    let level: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (score >= rHigh) level = 'critical';
    else if (score >= rMed) level = 'high';
    else if (score >= rLow) level = 'medium';

    const assessment: RiskAssessment = { score, level, factors, lastAssessed: now() };
    set((s) => ({ riskAssessments: { ...s.riskAssessments, [userId]: assessment } }));
    return assessment;
  },

  // ─── Commission ────────────────────────────────────────────────────────────
  commissionRules: [
    { id: 'cr-1', module: 'marketplace', category: null, sellerType: null, userTier: null, rate: 3, minFee: 0, maxFee: 500, currency: 'SC', version: 1, active: true, createdAt: now() },
    { id: 'cr-2', module: 'services', category: null, sellerType: null, userTier: null, rate: 5, minFee: 0, maxFee: 1000, currency: 'SC', version: 1, active: true, createdAt: now() },
    { id: 'cr-3', module: 'support', category: null, sellerType: null, userTier: null, rate: 5, minFee: 0, maxFee: 0, currency: 'SC', version: 1, active: true, createdAt: now() },
  { id: 'cr-4', module: 'jobs', category: null, sellerType: null, userTier: null, rate: 2, minFee: 0, maxFee: 200, currency: 'SC', version: 1, active: true, createdAt: now() },
  { id: 'cr-5', module: 'auctions', category: null, sellerType: null, userTier: null, rate: 4, minFee: 0, maxFee: 2000, currency: 'SC', version: 1, active: true, createdAt: now() },
  ],

  calculateCommission: (module, amount, category) => {
    const rules = get().commissionRules;
    const rule = rules.find((r) => r.module === module && r.active && (!category || r.category === category));
    if (!rule) return 0;
    const fee = Math.round((amount * rule.rate) / 100);
    return Math.max(rule.minFee, Math.min(fee, rule.maxFee || fee));
  },

  addCommissionRule: (rule) => {
    set((s) => ({ commissionRules: [...s.commissionRules, { ...rule, id: generateId(), createdAt: now(), version: 1 }] }));
  },

  // ─── Admin / Audit ─────────────────────────────────────────────────────────
  auditLog: [],
  adminOverrides: [],

  addAuditEntry: (entry) => {
    const id = generateId();
    const auditEntry: AuditLogEntry = { ...entry, id, timestamp: now(), auditId: id };
    set((s) => ({ auditLog: [...s.auditLog, auditEntry] }));
    return id;
  },

  addAdminOverride: (override) => {
    const id = generateId();
    const entry: AdminOverride = { ...override, id, timestamp: now(), auditId: id };
    set((s) => ({ adminOverrides: [...s.adminOverrides, entry] }));
    get().addAuditEntry({
      adminId: override.adminId, action: override.action, targetUser: override.targetUserId,
      targetTransaction: null, oldValue: override.beforeState, newValue: override.afterState,
      reason: override.reason, category: 'economy',
    });
    return id;
  },

  // ─── Notifications ─────────────────────────────────────────────────────────
  economyNotifications: [],
  addEconomyNotification: (n) => {
    set((s) => ({ economyNotifications: [{ ...n, id: generateId(), createdAt: now(), read: false }, ...s.economyNotifications] }));
  },
  markNotificationRead: (id) => {
    set((s) => ({
      economyNotifications: s.economyNotifications.map((n) => n.id === id ? { ...n, read: true } : n),
    }));
  },
  getUnreadCount: (userId) => get().economyNotifications.filter((n) => n.userId === userId && !n.read).length,

  // ─── Coin Packages ─────────────────────────────────────────────────────────
  coinPackages: COIN_PACKAGES,

  // ─── Integration Status ────────────────────────────────────────────────────
  integrationStatus: {
    payment: INTEGRATION_PROVIDERS.payment,
    cashout: INTEGRATION_PROVIDERS.cashout,
    kyc: INTEGRATION_PROVIDERS.kyc,
  },

  // ─── Emergency Controls ────────────────────────────────────────────────────
  emergencyPauses: {},
  pauseFeature: (feature) => set((s) => ({ emergencyPauses: { ...s.emergencyPauses, [feature]: true } })),
  unpauseFeature: (feature) => set((s) => ({ emergencyPauses: { ...s.emergencyPauses, [feature]: false } })),
  isFeaturePaused: (feature) => get().emergencyPauses[feature] === true,

  // ─── Admin Economy Actions ─────────────────────────────────────────────────
  adminGrantCoins: (adminId, userId, amount, reason) => {
    const txId = get().addLedgerEntry({
      userId, source: 'admin_grant', destination: 'wallet', currency: 'SC', amount,
      type: 'admin_grant', status: 'completed', referenceId: '', campaignId: null,
      completedAt: now(), createdBy: adminId, riskStatus: 'low', metadata: { reason }, auditId: null,
    });
    get().addAdminOverride({ adminId, targetUserId: userId, action: 'grant_coins',
      beforeState: {}, afterState: { amount }, reason, auditId: '' });
    return txId;
  },

  adminGrantReward: (adminId, userId, amount, reason) => {
    const txId = get().addLedgerEntry({
      userId, source: 'admin_grant', destination: 'wallet', currency: 'SR', amount,
      type: 'admin_grant', status: 'completed', referenceId: '', campaignId: null,
      completedAt: now(), createdBy: adminId, riskStatus: 'low', metadata: { reason }, auditId: null,
    });
    get().addAdminOverride({ adminId, targetUserId: userId, action: 'grant_reward',
      beforeState: {}, afterState: { amount }, reason, auditId: '' });
    return txId;
  },

  adminGrantPower: (adminId, userId, amount, reason) => {
    const txId = get().addLedgerEntry({
      userId, source: 'admin_grant', destination: 'wallet', currency: 'SP', amount,
      type: 'admin_grant', status: 'completed', referenceId: '', campaignId: null,
      completedAt: now(), createdBy: adminId, riskStatus: 'low', metadata: { reason }, auditId: null,
    });
    get().addAdminOverride({ adminId, targetUserId: userId, action: 'grant_power',
      beforeState: {}, afterState: { amount }, reason, auditId: '' });
    return txId;
  },

  adminEnableCashout: (adminId, userId, reason) => {
    get().addAdminOverride({ adminId, targetUserId: userId, action: 'enable_cashout',
      beforeState: { cashoutEnabled: false }, afterState: { cashoutEnabled: true }, reason, auditId: '' });
  },

  adminDisableCashout: (adminId, userId, reason) => {
    get().addAdminOverride({ adminId, targetUserId: userId, action: 'disable_cashout',
      beforeState: { cashoutEnabled: true }, afterState: { cashoutEnabled: false }, reason, auditId: '' });
  },

  adminFreezeCashout: (adminId, userId, reason) => {
    get().addAdminOverride({ adminId, targetUserId: userId, action: 'freeze_cashout',
      beforeState: { frozen: false }, afterState: { frozen: true }, reason, auditId: '' });
  },

  adminSultanSupported: (adminId, userId, data) => {
    get().addAdminOverride({ adminId, targetUserId: userId, action: 'sultan_supported',
      beforeState: {}, afterState: data, reason: data.reason, auditId: '' });
    get().addEconomyNotification({
      userId, type: 'support_received',
      title: 'دعم سلطان', body: 'حسابك يحظى بدعم ترويجي من سلطان',
      metadata: { adminId, ...data },
    });
  },

  adminAddBadge: (adminId, userId, badge, reason) => {
    get().addAdminOverride({ adminId, targetUserId: userId, action: 'add_badge',
      beforeState: {}, afterState: { badge }, reason, auditId: '' });
  },

  adminLaunchBoost: (adminId, params) => {
    const id = get().addCampaign({ ...params, creatorId: adminId, budgetSpent: 0, isSponsored: true });
    get().addAuditEntry({
      adminId, action: 'launch_boost', targetUser: params.targetId, targetTransaction: null,
      oldValue: {}, newValue: params, reason: 'إطلاق حملة تعزيز', category: 'campaign',
    });
    return id;
  },

  // ─── Stats ─────────────────────────────────────────────────────────────────
  getEconomyStats: () => {
    const state = get();
    const ledger = state.ledger;
    const supportEvents = state.supportEvents;

    const coinPurchases = ledger.filter((t) => t.type === 'coin_purchase');
    const supports = ledger.filter((t) => t.type === 'support_sent');
    const rewards = ledger.filter((t) => t.type.startsWith('reward'));
    const cashouts = state.cashoutRequests;
    const fees = ledger.filter((t) => t.type === 'commission_deducted');

    return {
      totalCoinSales: coinPurchases.reduce((s, t) => s + t.amount, 0),
      coinsCirculating: ledger.filter((t) => t.currency === 'SC' && t.status === 'completed').reduce((s, t) => s + Math.abs(t.amount), 0) / 2,
      coinsSpent: supports.reduce((s, t) => s + Math.abs(t.amount), 0),
      coinsTransferred: supportEvents.reduce((s, e) => s + e.amount, 0),
      rewardsGenerated: rewards.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0),
      rewardsPending: rewards.filter((t) => t.status === 'pending').reduce((s, t) => s + t.amount, 0),
      rewardsPaid: cashouts.filter((c) => c.status === 'paid').reduce((s, c) => s + c.amount, 0),
      cashoutVolume: cashouts.reduce((s, c) => s + c.amount, 0),
      platformRevenue: fees.reduce((s, t) => s + Math.abs(t.amount), 0),
      fees: supportEvents.reduce((s, e) => s + e.fee, 0),
      refunds: ledger.filter((t) => t.type === 'refund_issued').reduce((s, t) => s + Math.abs(t.amount), 0),
      chargebacks: 0,
      fraudPrevented: 0,
      activeSupporters: new Set(supportEvents.map((e) => e.supporterId)).size,
      supportedUsers: new Set(supportEvents.map((e) => e.recipientId)).size,
    };
  },
}));
