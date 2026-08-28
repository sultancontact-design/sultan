'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEconomyStore } from '@/lib/economy';
import { useSultanStore } from '@/lib/store';
import type { CampaignType, AudienceSegment, CampaignStatus } from '@/lib/economy/types';
import {
  Search,
  Shield,
  ShieldCheck,
  ShieldX,
  Award,
  Badge as BadgeIcon,
  Crown,
  Star,
  Zap,
  Heart,
  Coins,
  Gift,
  TrendingUp,
  Users,
  Eye,
  MousePointerClick,
  UserPlus,
  Target,
  Rocket,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Megaphone,
  UserCheck,
  UserX,
  Snowflake,
  Flame,
  ArrowUpRight,
  Download,
  Ban,
  ClipboardCheck,
  Sparkles,
  CircleDot,
  LayoutGrid,
  List,
  type LucideIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ─── Animation ──────────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.05 } },
};

// ─── Colors ──────────────────────────────────────────────────────────────────

const GOLD = '#D4AF37';
const GOLD_LIGHT = '#F0D060';

// ─── Demo Users ──────────────────────────────────────────────────────────────

interface DemoUser {
  id: string;
  displayName: string;
  username: string;
  avatar: string;
  status: 'active' | 'suspended' | 'restricted' | 'pending';
  trustScore: number;
  reputationScore: number;
  level: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  verifications: string[];
  followers: number;
  following: number;
  supportGiven: number;
  supportReceived: number;
  coins: number;
  rewards: number;
  pending: number;
  power: number;
  reach: number;
  engagement: number;
  transactions: number;
}

const DEMO_USERS: DemoUser[] = [
  {
    id: 'u-001', displayName: 'يوسف بنعلي', username: 'youssef_sultan', avatar: '',
    status: 'active', trustScore: 85, reputationScore: 72, level: 12,
    riskLevel: 'low', verifications: ['identity_verified'],
    followers: 2450, following: 185, supportGiven: 3200, supportReceived: 8400,
    coins: 2500, rewards: 750, pending: 200, power: 1200, reach: 45000, engagement: 8.5, transactions: 156,
  },
  {
    id: 'u-002', displayName: 'فاطمة الزهراء', username: 'fatima_art', avatar: '',
    status: 'active', trustScore: 92, reputationScore: 88, level: 18,
    riskLevel: 'low', verifications: ['identity_verified', 'business_verified'],
    followers: 12400, following: 320, supportGiven: 15000, supportReceived: 32000,
    coins: 8500, rewards: 4200, pending: 600, power: 5400, reach: 280000, engagement: 12.3, transactions: 482,
  },
  {
    id: 'u-003', displayName: 'أحمد المنصوري', username: 'ahmed_mansouri', avatar: '',
    status: 'active', trustScore: 68, reputationScore: 55, level: 7,
    riskLevel: 'medium', verifications: [],
    followers: 890, following: 420, supportGiven: 800, supportReceived: 2100,
    coins: 600, rewards: 180, pending: 50, power: 320, reach: 12000, engagement: 4.2, transactions: 67,
  },
  {
    id: 'u-004', displayName: 'نورة بنحدو', username: 'noura_design', avatar: '',
    status: 'active', trustScore: 95, reputationScore: 91, level: 22,
    riskLevel: 'low', verifications: ['identity_verified', 'business_verified', 'sultan_supported', 'featured'],
    followers: 34500, following: 180, supportGiven: 25000, supportReceived: 78000,
    coins: 15000, rewards: 8900, pending: 1200, power: 12000, reach: 890000, engagement: 15.7, transactions: 892,
  },
  {
    id: 'u-005', displayName: 'كريم العلوي', username: 'karim_alawi', avatar: '',
    status: 'restricted', trustScore: 42, reputationScore: 30, level: 4,
    riskLevel: 'high', verifications: [],
    followers: 120, following: 890, supportGiven: 50, supportReceived: 150,
    coins: 80, rewards: 0, pending: 0, power: 15, reach: 2000, engagement: 1.8, transactions: 12,
  },
  {
    id: 'u-006', displayName: 'سلمى بنعمر', username: 'salma_benomar', avatar: '',
    status: 'active', trustScore: 78, reputationScore: 65, level: 10,
    riskLevel: 'low', verifications: ['identity_verified'],
    followers: 1800, following: 250, supportGiven: 2000, supportReceived: 5600,
    coins: 1800, rewards: 520, pending: 100, power: 800, reach: 32000, engagement: 7.1, transactions: 134,
  },
  {
    id: 'u-007', displayName: 'محمد الفاسي', username: 'mohammed_fassi', avatar: '',
    status: 'suspended', trustScore: 15, reputationScore: 10, level: 2,
    riskLevel: 'critical', verifications: [],
    followers: 45, following: 1200, supportGiven: 0, supportReceived: 0,
    coins: 0, rewards: 0, pending: 0, power: 0, reach: 500, engagement: 0.3, transactions: 3,
  },
  {
    id: 'u-008', displayName: 'ليلى الحسني', username: 'layla_hassni', avatar: '',
    status: 'pending', trustScore: 50, reputationScore: 40, level: 3,
    riskLevel: 'medium', verifications: [],
    followers: 320, following: 150, supportGiven: 200, supportReceived: 500,
    coins: 350, rewards: 80, pending: 0, power: 120, reach: 5000, engagement: 3.5, transactions: 28,
  },
];

// ─── Campaign Type Labels ──────────────────────────────────────────────────

const CAMPAIGN_TYPE_LABELS: Record<CampaignType, string> = {
  follower_growth: 'نمو المتابعين',
  engagement: 'التفاعل',
  reach: 'الوصول',
  profile_visit: 'زيارة الملف',
  content_discovery: 'اكتشاف المحتوى',
  local_boost: 'تعزيز محلي',
  city_boost: 'تعزيز المدينة',
  regional_boost: 'تعزيز جهوي',
  national_boost: 'تعزيز وطني',
  diaspora_boost: 'تعزيز الجالية',
};

const AUDIENCE_LABELS: Record<AudienceSegment, string> = {
  morocco: 'المغرب',
  moroccan_diaspora: 'الجالية المغربية',
  france: 'فرنسا',
  spain: 'إسبانيا',
  belgium: 'بلجيكا',
  netherlands: 'هولندا',
  canada: 'كندا',
  other: 'أخرى',
};

const STATUS_LABELS: Record<CampaignStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'مسودة', color: 'text-gray-400', bg: 'bg-gray-400/10' },
  active: { label: 'نشط', color: 'text-green-400', bg: 'bg-green-400/10' },
  paused: { label: 'متوقف', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  completed: { label: 'مكتمل', color: 'text-sultan', bg: 'bg-sultan/10' },
  cancelled: { label: 'ملغى', color: 'text-red-400', bg: 'bg-red-400/10' },
};

const STATUS_LABELS_USER: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'نشط', color: 'text-green-400', bg: 'bg-green-400/10' },
  suspended: { label: 'موقوف', color: 'text-red-400', bg: 'bg-red-400/10' },
  restricted: { label: 'مقيّد', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  pending: { label: 'معلّق', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
};

const RISK_LABELS: Record<string, { label: string; color: string; bg: string; icon: LucideIcon }> = {
  low: { label: 'منخفض', color: 'text-green-400', bg: 'bg-green-400/10', icon: ShieldCheck },
  medium: { label: 'متوسط', color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Shield },
  high: { label: 'مرتفع', color: 'text-orange-400', bg: 'bg-orange-400/10', icon: AlertTriangle },
  critical: { label: 'حرج', color: 'text-red-400', bg: 'bg-red-400/10', icon: ShieldX },
};

const VERIFICATION_LABELS: Record<string, { label: string; icon: LucideIcon; color: string }> = {
  identity_verified: { label: 'متحقق الهوية', icon: UserCheck, color: 'text-blue-400' },
  business_verified: { label: 'حساب تجاري', icon: BadgeIcon, color: 'text-purple-400' },
  sultan_supported: { label: 'مدعوم سلطان', icon: Crown, color: 'text-sultan' },
  featured: { label: 'مميز', icon: Star, color: 'text-yellow-400' },
  official_account: { label: 'حساب رسمي', icon: ShieldCheck, color: 'text-cyan-400' },
  trusted_contributor: { label: 'مساهم موثوق', icon: Award, color: 'text-green-400' },
};

// ─── Quick Actions ──────────────────────────────────────────────────────────

interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  needsReason?: boolean;
  category: 'financial' | 'verification' | 'campaign' | 'moderation';
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'grant_support', label: 'منح دعم', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/20', needsReason: true, category: 'financial' },
  { id: 'grant_coins', label: 'منح عملات', icon: Coins, color: 'text-sultan', bg: 'bg-sultan/10', border: 'border-sultan/20', needsReason: true, category: 'financial' },
  { id: 'grant_reward', label: 'منح مكافأة', icon: Gift, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', needsReason: true, category: 'financial' },
  { id: 'enable_cashout', label: 'تفعيل السحب', icon: Unlock, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20', category: 'verification' },
  { id: 'freeze_cashout', label: 'تجميد السحب', icon: Lock, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', category: 'verification' },
  { id: 'verify_identity', label: 'التحقق من الهوية', icon: UserCheck, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', category: 'verification' },
  { id: 'verify_business', label: 'التحقق التجاري', icon: BadgeIcon, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', category: 'verification' },
  { id: 'sultan_supported', label: 'دعم سلطان', icon: Crown, color: 'text-sultan', bg: 'bg-sultan/10', border: 'border-sultan/20', category: 'campaign' },
  { id: 'featured', label: 'تثبيت مميز', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', category: 'campaign' },
  { id: 'boost_profile', label: 'تعزيز الملف', icon: Rocket, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', category: 'campaign' },
  { id: 'launch_growth', label: 'إطلاق حملة نمو', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', category: 'campaign' },
  { id: 'launch_engagement', label: 'إطلاق حملة تفاعل', icon: Zap, color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20', category: 'campaign' },
  { id: 'add_badge', label: 'إضافة شارة', icon: Award, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', category: 'verification' },
  { id: 'add_rising', label: 'إضافة لصاعدين', icon: Flame, color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20', category: 'campaign' },
  { id: 'grant', label: 'منحة', icon: Sparkles, color: 'text-sultan', bg: 'bg-sultan/10', border: 'border-sultan/20', needsReason: true, category: 'financial' },
  { id: 'restrict', label: 'تقييد', icon: Ban, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', category: 'moderation' },
  { id: 'freeze_account', label: 'تجميد الحساب', icon: Snowflake, color: 'text-blue-300', bg: 'bg-blue-300/10', border: 'border-blue-300/20', category: 'moderation' },
];

// ─── Bulk Actions ───────────────────────────────────────────────────────────

interface BulkAction {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  needsReason?: boolean;
}

const BULK_ACTIONS: BulkAction[] = [
  { id: 'bulk_campaign', label: 'إضافة لحملة', icon: Target, color: 'text-emerald-400' },
  { id: 'bulk_badge', label: 'منح شارة', icon: Award, color: 'text-amber-400' },
  { id: 'bulk_boost', label: 'إضافة تعزيز', icon: Rocket, color: 'text-orange-400' },
  { id: 'bulk_verify_biz', label: 'تحقق تجاري', icon: BadgeIcon, color: 'text-purple-400' },
  { id: 'bulk_export', label: 'تصدير', icon: Download, color: 'text-cyan-400' },
  { id: 'bulk_restrict', label: 'تقييد', icon: Ban, color: 'text-red-400', needsReason: true },
  { id: 'bulk_review', label: 'مراجعة', icon: ClipboardCheck, color: 'text-sultan' },
];

// ─── Demo Badges & Announcements ────────────────────────────────────────────

const DEMO_BADGES = [
  { id: 'b-1', name: 'مؤسس محتوى', icon: '🎬', description: 'أنشأ أكثر من 100 منشور أصلي', holders: 234, color: 'text-pink-400' },
  { id: 'b-2', name: 'داعم نشط', icon: '💎', description: 'دعم أكثر من 50 مستخدم', holders: 156, color: 'text-sultan' },
  { id: 'b-3', name: 'صاعد', icon: '🚀', description: 'نمو سريع في المتابعين', holders: 89, color: 'text-emerald-400' },
  { id: 'b-4', name: 'تاجر موثوق', icon: '🛡️', description: 'تقييم عالي في السوق', holders: 67, color: 'text-blue-400' },
  { id: 'b-5', name: 'فنان سلطان', icon: '🎨', description: 'محتوى إبداعي متميز', holders: 312, color: 'text-purple-400' },
];

const DEMO_ANNOUNCEMENTS = [
  { id: 'a-1', title: 'تحديث نظام المكافآت', body: 'تم رفع نسبة المكافآت بنسبة 15% لجميع المستخدمين النشطين', date: '2025-01-15', type: 'system' },
  { id: 'a-2', title: 'حملة دعم الفنانين', body: 'حملة ترويجية لدعم الفنانين المغاربة خلال الشهر الحالي', date: '2025-01-10', type: 'campaign' },
  { id: 'a-3', title: 'فتح باب التحقق التجاري', body: 'يمكن للتجار والمؤسسات التقدم للتحقق من حساباتهم التجارية', date: '2025-01-05', type: 'feature' },
];

// ═══════════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════════

export default function InfluenceCenter() {
  const addToast = useSultanStore((s) => s.addToast);
  const currentProfile = useSultanStore((s) => s.currentProfile);
  const campaigns = useEconomyStore((s) => s.campaigns);
  const addAuditEntry = useEconomyStore((s) => s.addAuditEntry);
  const addCampaign = useEconomyStore((s) => s.addCampaign);
  const adminGrantCoins = useEconomyStore((s) => s.adminGrantCoins);
  const adminGrantReward = useEconomyStore((s) => s.adminGrantReward);

  // ─── State ──────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<DemoUser | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(new Set());
  const [bulkReason, setBulkReason] = useState('');
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [pendingBulkAction, setPendingBulkAction] = useState<BulkAction | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [showReasonDialog, setShowReasonDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<QuickAction | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    campaigns: true,
    badges: true,
    bulk: false,
  });

  // ─── New Campaign Form ──────────────────────────────────────────────────
  const [newCampaign, setNewCampaign] = useState({
    type: 'follower_growth' as CampaignType,
    targetId: '',
    budget: '',
    duration: '7',
    audience: 'morocco' as AudienceSegment,
    priority: 'normal' as 'low' | 'normal' | 'high',
  });

  // ─── Filtered Users ────────────────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return DEMO_USERS;
    const q = searchQuery.toLowerCase();
    return DEMO_USERS.filter(
      (u) =>
        u.displayName.includes(q) ||
        u.username.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // ─── Active Campaigns ──────────────────────────────────────────────────
  const activeCampaigns = useMemo(() => {
    const storeActive = campaigns.filter((c) => c.status === 'active');
    if (storeActive.length > 0) return storeActive;
    // Demo campaigns if store is empty
    return [
      {
        id: 'demo-camp-1', type: 'follower_growth' as CampaignType, title: 'نمو فنانين الدار البيضاء',
        targetId: 'u-004', targetType: 'profile' as const, budget: 5000, budgetSpent: 3200,
        startAt: '2025-01-10T00:00:00Z', endAt: '2025-01-25T00:00:00Z',
        audience: ['morocco'] as AudienceSegment[], surfaces: ['feed', 'discover'],
        priority: 'high' as const, status: 'active' as CampaignStatus,
        results: { impressions: 125000, clicks: 8400, follows: 1200, engagement: 5600, reach: 89000 },
        isSponsored: true, creatorId: 'admin-001', createdAt: '2025-01-10T00:00:00Z', updatedAt: '2025-01-15T00:00:00Z',
      },
      {
        id: 'demo-camp-2', type: 'engagement' as CampaignType, title: 'تفاعل صاعدين الرباط',
        targetId: 'u-001', targetType: 'profile' as const, budget: 2000, budgetSpent: 1100,
        startAt: '2025-01-12T00:00:00Z', endAt: '2025-01-20T00:00:00Z',
        audience: ['morocco'] as AudienceSegment[], surfaces: ['feed', 'stories'],
        priority: 'normal' as const, status: 'active' as CampaignStatus,
        results: { impressions: 45000, clicks: 3200, follows: 380, engagement: 2100, reach: 32000 },
        isSponsored: true, creatorId: 'admin-001', createdAt: '2025-01-12T00:00:00Z', updatedAt: '2025-01-15T00:00:00Z',
      },
      {
        id: 'demo-camp-3', type: 'diaspora_boost' as CampaignType, title: 'تعزيز الجالية بفرنسا',
        targetId: 'u-002', targetType: 'profile' as const, budget: 8000, budgetSpent: 5600,
        startAt: '2025-01-08T00:00:00Z', endAt: '2025-02-08T00:00:00Z',
        audience: ['france'] as AudienceSegment[], surfaces: ['feed', 'discover', 'search'],
        priority: 'high' as const, status: 'active' as CampaignStatus,
        results: { impressions: 340000, clicks: 18000, follows: 2400, engagement: 12000, reach: 210000 },
        isSponsored: true, creatorId: 'admin-001', createdAt: '2025-01-08T00:00:00Z', updatedAt: '2025-01-15T00:00:00Z',
      },
    ];
  }, [campaigns]);

  // ─── Handlers ──────────────────────────────────────────────────────────
  const handleAction = (action: QuickAction) => {
    if (action.needsReason) {
      setPendingAction(action);
      setActionReason('');
      setShowReasonDialog(true);
      return;
    }
    executeAction(action, '');
  };

  const executeAction = (action: QuickAction, reason: string) => {
    if (!selectedUser) return;
    const adminId = currentProfile?.id ?? 'admin-001';

    addToast(`تم تنفيذ: ${action.label}`, 'success');
    addAuditEntry({
      adminId,
      action: action.id,
      targetUser: selectedUser.id,
      targetTransaction: null,
      oldValue: null,
      newValue: { reason },
      reason: reason || action.label,
      category: action.category === 'financial' ? 'economy' : action.category === 'campaign' ? 'campaign' : action.category === 'moderation' ? 'risk' : 'user',
    });

    // Execute actual store operations for financial actions
    if (action.id === 'grant_coins') {
      adminGrantCoins(adminId, selectedUser.id, 500, reason || 'منحة إدارية');
    } else if (action.id === 'grant_reward') {
      adminGrantReward(adminId, selectedUser.id, 200, reason || 'مكافأة إدارية');
    }
  };

  const handleBulkAction = (action: BulkAction) => {
    if (action.needsReason) {
      setPendingBulkAction(action);
      setBulkReason('');
      setShowBulkDialog(true);
      return;
    }
    executeBulkAction(action, '');
  };

  const executeBulkAction = (action: BulkAction, reason: string) => {
    const adminId = currentProfile?.id ?? 'admin-001';
    const userIds = Array.from(bulkSelected);

    userIds.forEach((uid) => {
      addAuditEntry({
        adminId,
        action: `bulk_${action.id}`,
        targetUser: uid,
        targetTransaction: null,
        oldValue: null,
        newValue: { bulkAction: action.id, reason },
        reason: reason || `إجراء جماعي: ${action.label} (${userIds.length} مستخدم)`,
        category: action.id === 'bulk_restrict' ? 'risk' : 'campaign',
      });
    });

    addToast(`تم تنفيذ ${action.label} لـ ${userIds.length} مستخدم`, 'success');
    setBulkSelected(new Set());
  };

  const toggleBulkSelect = (userId: string) => {
    setBulkSelected((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (bulkSelected.size === filteredUsers.length) {
      setBulkSelected(new Set());
    } else {
      setBulkSelected(new Set(filteredUsers.map((u) => u.id)));
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCreateCampaign = () => {
    const adminId = currentProfile?.id ?? 'admin-001';
    const targetId = newCampaign.targetId || selectedUser?.id || '';
    if (!targetId || !newCampaign.budget) {
      addToast('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }
    const durationDays = parseInt(newCampaign.duration) || 7;
    const endAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    addCampaign({
      type: newCampaign.type,
      title: CAMPAIGN_TYPE_LABELS[newCampaign.type],
      targetId,
      targetType: 'profile',
      budget: parseInt(newCampaign.budget),
      startAt: new Date().toISOString(),
      endAt,
      audience: [newCampaign.audience],
      surfaces: ['feed', 'discover'],
      priority: newCampaign.priority,
      status: 'active',
      isSponsored: true,
      creatorId: adminId,
    });

    addAuditEntry({
      adminId,
      action: 'create_campaign',
      targetUser: targetId,
      targetTransaction: null,
      oldValue: null,
      newValue: { type: newCampaign.type, budget: newCampaign.budget, audience: newCampaign.audience },
      reason: 'إنشاء حملة جديدة من مركز التأثير',
      category: 'campaign',
    });

    addToast('تم إنشاء الحملة بنجاح', 'success');
  };

  // ─── Metric Card Helper ────────────────────────────────────────────────
  const MetricCard = ({ icon: Icon, label, value, color, sub }: { icon: LucideIcon; label: string; value: string | number; color: string; sub?: string }) => (
    <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color}/10`}>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="space-y-6 p-4 md:p-6" dir="rtl">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <motion.div {...fadeUp} className="text-center">
        <h1 className="text-2xl font-bold md:text-3xl">
          <span className="text-gradient-sultan">مركز التأثير</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">إدارة النمو والتعزيز والظهور</p>
      </motion.div>

      {/* ─── Search ──────────────────────────────────────────────────────── */}
      <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ابحث عن مستخدم بالاسم أو اسم المستخدم..."
            className="border-sultan/20 bg-white/[0.03] pr-10 text-right placeholder:text-muted-foreground/60 focus-visible:ring-sultan/30"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearch(true);
            }}
            onFocus={() => setShowSearch(true)}
          />
          {showSearch && filteredUsers.length > 0 && (
            <div className="glass absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-sultan/10 scrollbar-thin">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setSelectedUser(user);
                    setShowSearch(false);
                    setSearchQuery(user.displayName);
                  }}
                  className={`flex w-full items-center gap-3 border-b border-white/5 px-4 py-3 text-right transition-colors last:border-0 ${selectedUser?.id === user.id ? 'bg-sultan/10' : 'hover:bg-white/5'}`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sultan/10">
                    <Users className="h-5 w-5 text-sultan" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{user.displayName}</p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${STATUS_LABELS_USER[user.status].color} ${STATUS_LABELS_USER[user.status].bg} border-0 text-[10px]`}>
                      {STATUS_LABELS_USER[user.status].label}
                    </Badge>
                    {(() => {
                      const rl = RISK_LABELS[user.riskLevel];
                      if (!rl) return null;
                      return <rl.icon className={`h-3.5 w-3.5 ${rl.color}`} />;
                    })()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* ─── User Command Center ─────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* User Header */}
            <Card className="border-sultan/10 bg-white/[0.02] p-4 md:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-sultan/30 bg-sultan/10">
                      <Users className="h-8 w-8 text-sultan" />
                    </div>
                    <div className="absolute -bottom-1 -left-1">
                      <div className={`h-4 w-4 rounded-full border-2 border-card ${selectedUser.status === 'active' ? 'bg-green-400' : selectedUser.status === 'suspended' ? 'bg-red-400' : 'bg-yellow-400'}`} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold text-foreground">{selectedUser.displayName}</h2>
                      <Badge className={`${STATUS_LABELS_USER[selectedUser.status].color} ${STATUS_LABELS_USER[selectedUser.status].bg} border-0 text-[10px]`}>
                        {STATUS_LABELS_USER[selectedUser.status].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge className="bg-sultan/10 text-sultan border-sultan/20 text-[10px]">
                        <ShieldCheck className="mr-1 h-3 w-3" />
                        ثقة: {selectedUser.trustScore}
                      </Badge>
                      <Badge className="bg-purple-400/10 text-purple-400 border-purple-400/20 text-[10px]">
                        <Star className="mr-1 h-3 w-3" />
                        سمعة: {selectedUser.reputationScore}
                      </Badge>
                      <Badge className="bg-blue-400/10 text-blue-400 border-blue-400/20 text-[10px]">
                        <Zap className="mr-1 h-3 w-3" />
                        مستوى {selectedUser.level}
                      </Badge>
                      {(() => {
                        const rl = RISK_LABELS[selectedUser.riskLevel];
                        if (!rl) return null;
                        return (
                          <Badge className={`${rl.color} ${rl.bg} border-0 text-[10px]`}>
                            <rl.icon className="mr-1 h-3 w-3" />
                            مخاطر: {rl.label}
                          </Badge>
                        );
                      })()}
                    </div>
                  </div>
                </div>
                {/* Verification Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {selectedUser.verifications.map((v) => {
                    const vInfo = VERIFICATION_LABELS[v];
                    if (!vInfo) return null;
                    return (
                      <Badge key={v} className={`${vInfo.color} ${vInfo.color}/10 border-0 gap-1 text-[10px]`}>
                        <vInfo.icon className="h-3 w-3" />
                        {vInfo.label}
                      </Badge>
                    );
                  })}
                  {selectedUser.verifications.length === 0 && (
                    <span className="text-xs text-muted-foreground">لا توجد شارات تحقق</span>
                  )}
                </div>
              </div>
            </Card>

            {/* Metrics Grid */}
            <motion.div
              variants={stagger}
              initial="initial"
              animate="animate"
              className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            >
              {[
                { icon: Users, label: 'متابعين', value: selectedUser.followers, color: 'text-blue-400' },
                { icon: UserPlus, label: 'يتابع', value: selectedUser.following, color: 'text-cyan-400' },
                { icon: Heart, label: 'دعم مُقدَّم', value: selectedUser.supportGiven, color: 'text-pink-400' },
                { icon: Gift, label: 'دعم مُستلَم', value: selectedUser.supportReceived, color: 'text-green-400' },
                { icon: Coins, label: 'عملات', value: selectedUser.coins, color: 'text-sultan' },
                { icon: Award, label: 'مكافآت', value: selectedUser.rewards, color: 'text-emerald-400' },
                { icon: Clock, label: 'معلّق', value: selectedUser.pending, color: 'text-yellow-400' },
                { icon: Zap, label: 'قوة سلطان', value: selectedUser.power, color: 'text-violet-400' },
                { icon: Eye, label: 'وصول', value: selectedUser.reach, color: 'text-sky-400' },
                { icon: MousePointerClick, label: 'تفاعل %', value: `${selectedUser.engagement}%`, color: 'text-orange-400' },
                { icon: CircleDot, label: 'معاملات', value: selectedUser.transactions, color: 'text-teal-400' },
                { icon: TrendingUp, label: 'مستوى', value: selectedUser.level, color: 'text-amber-400' },
              ].map((m) => (
                <motion.div key={m.label} variants={fadeUp}>
                  <MetricCard icon={m.icon} label={m.label} value={m.value} color={m.color} />
                </motion.div>
              ))}
            </motion.div>

            {/* Quick Actions */}
            <Card className="border-sultan/10 bg-white/[0.02] p-4 md:p-5">
              <div className="mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-sultan" />
                <h3 className="text-base font-bold text-foreground">إجراءات سريعة</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {QUICK_ACTIONS.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    className={`flex h-auto flex-col items-center gap-2 border ${action.border} ${action.bg} px-3 py-3 text-center transition-all hover:${action.bg} hover:scale-[1.02]`}
                    onClick={() => handleAction(action)}
                  >
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                    <span className="text-xs font-medium text-foreground">{action.label}</span>
                    {action.needsReason && (
                      <span className="text-[9px] text-muted-foreground">يتطلب سبب</span>
                    )}
                  </Button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Growth Campaigns ────────────────────────────────────────────── */}
      <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
        <Card className="border-sultan/10 bg-white/[0.02]">
          <button
            onClick={() => toggleSection('campaigns')}
            className="flex w-full items-center justify-between p-4 md:p-5"
          >
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-sultan" />
              <h3 className="text-base font-bold text-foreground">الحملات النشطة</h3>
              <Badge className="bg-sultan/10 text-sultan border-sultan/20 text-[10px]">
                {activeCampaigns.length}
              </Badge>
            </div>
            {expandedSections.campaigns ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.campaigns && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 px-4 pb-4 md:px-5 md:pb-5">
                  {activeCampaigns.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      لا توجد حملات نشطة حالياً
                    </div>
                  ) : (
                    <div className="max-h-96 space-y-3 overflow-y-auto scrollbar-thin">
                      {activeCampaigns.map((camp) => {
                        const pct = camp.budget > 0 ? Math.round((camp.budgetSpent / camp.budget) * 100) : 0;
                        const statusInfo = STATUS_LABELS[camp.status];
                        return (
                          <div
                            key={camp.id}
                            className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-sultan/20"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-sm font-semibold text-foreground">{camp.title}</h4>
                                  <Badge className={`${statusInfo.color} ${statusInfo.bg} border-0 text-[10px]`}>
                                    {statusInfo.label}
                                  </Badge>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Target className="h-3 w-3" />
                                    {CAMPAIGN_TYPE_LABELS[camp.type]}
                                  </span>
                                  <span>الهدف: {camp.targetId}</span>
                                  <span>الأولوية: {camp.priority === 'high' ? 'عالية' : camp.priority === 'low' ? 'منخفضة' : 'عادية'}</span>
                                </div>
                                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                  <span>من: {new Date(camp.startAt).toLocaleDateString('ar-MA')}</span>
                                  <span>إلى: {new Date(camp.endAt).toLocaleDateString('ar-MA')}</span>
                                </div>
                              </div>
                              <div className="text-left text-sm">
                                <span className={pct > 80 ? 'text-red-400' : pct > 50 ? 'text-yellow-400' : 'text-green-400'}>
                                  {pct}%
                                </span>
                              </div>
                            </div>
                            {/* Budget Bar */}
                            <div className="mt-3">
                              <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                                <span>الميزانية</span>
                                <span>{camp.budgetSpent.toLocaleString()} / {camp.budget.toLocaleString()} SC</span>
                              </div>
                              <Progress value={pct} className="h-1.5 bg-white/5" />
                            </div>
                            {/* Results */}
                            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                              <div className="rounded-lg bg-white/[0.03] p-2 text-center">
                                <Eye className="mx-auto mb-1 h-3.5 w-3.5 text-blue-400" />
                                <p className="text-xs font-semibold text-foreground">{(camp.results.impressions / 1000).toFixed(0)}K</p>
                                <p className="text-[10px] text-muted-foreground">انطباعات</p>
                              </div>
                              <div className="rounded-lg bg-white/[0.03] p-2 text-center">
                                <MousePointerClick className="mx-auto mb-1 h-3.5 w-3.5 text-cyan-400" />
                                <p className="text-xs font-semibold text-foreground">{camp.results.clicks.toLocaleString()}</p>
                                <p className="text-[10px] text-muted-foreground">نقرات</p>
                              </div>
                              <div className="rounded-lg bg-white/[0.03] p-2 text-center">
                                <UserPlus className="mx-auto mb-1 h-3.5 w-3.5 text-green-400" />
                                <p className="text-xs font-semibold text-foreground">{camp.results.follows.toLocaleString()}</p>
                                <p className="text-[10px] text-muted-foreground">متابعين</p>
                              </div>
                              <div className="rounded-lg bg-white/[0.03] p-2 text-center">
                                <Heart className="mx-auto mb-1 h-3.5 w-3.5 text-pink-400" />
                                <p className="text-xs font-semibold text-foreground">{camp.results.engagement.toLocaleString()}</p>
                                <p className="text-[10px] text-muted-foreground">تفاعل</p>
                              </div>
                              <div className="hidden rounded-lg bg-white/[0.03] p-2 text-center sm:block">
                                <TrendingUp className="mx-auto mb-1 h-3.5 w-3.5 text-sultan" />
                                <p className="text-xs font-semibold text-foreground">{(camp.results.reach / 1000).toFixed(0)}K</p>
                                <p className="text-[10px] text-muted-foreground">وصول</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <Separator className="my-4 bg-white/5" />

                  {/* Create Campaign Form */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Megaphone className="h-4 w-4 text-sultan" />
                      <h4 className="text-sm font-bold text-foreground">إنشاء حملة جديدة</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">نوع الحملة</Label>
                        <Select
                          value={newCampaign.type}
                          onValueChange={(v) => setNewCampaign((p) => ({ ...p, type: v as CampaignType }))}
                        >
                          <SelectTrigger className="border-sultan/20 bg-white/[0.03] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.entries(CAMPAIGN_TYPE_LABELS) as [CampaignType, string][]).map(([key, label]) => (
                              <SelectItem key={key} value={key} className="text-xs">
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">معرّف الهدف</Label>
                        <Input
                          placeholder="أدخل معرّف المستخدم"
                          className="border-sultan/20 bg-white/[0.03] text-xs"
                          value={newCampaign.targetId}
                          onChange={(e) => setNewCampaign((p) => ({ ...p, targetId: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">الميزانية (SC)</Label>
                        <Input
                          type="number"
                          placeholder="مثال: 5000"
                          className="border-sultan/20 bg-white/[0.03] text-xs"
                          value={newCampaign.budget}
                          onChange={(e) => setNewCampaign((p) => ({ ...p, budget: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">المدة (أيام)</Label>
                        <Select
                          value={newCampaign.duration}
                          onValueChange={(v) => setNewCampaign((p) => ({ ...p, duration: v }))}
                        >
                          <SelectTrigger className="border-sultan/20 bg-white/[0.03] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3" className="text-xs">3 أيام</SelectItem>
                            <SelectItem value="7" className="text-xs">7 أيام</SelectItem>
                            <SelectItem value="14" className="text-xs">14 يوم</SelectItem>
                            <SelectItem value="30" className="text-xs">30 يوم</SelectItem>
                            <SelectItem value="60" className="text-xs">60 يوم</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">الجمهور المستهدف</Label>
                        <Select
                          value={newCampaign.audience}
                          onValueChange={(v) => setNewCampaign((p) => ({ ...p, audience: v as AudienceSegment }))}
                        >
                          <SelectTrigger className="border-sultan/20 bg-white/[0.03] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.entries(AUDIENCE_LABELS) as [AudienceSegment, string][]).map(([key, label]) => (
                              <SelectItem key={key} value={key} className="text-xs">
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">الأولوية</Label>
                        <Select
                          value={newCampaign.priority}
                          onValueChange={(v) => setNewCampaign((p) => ({ ...p, priority: v as 'low' | 'normal' | 'high' }))}
                        >
                          <SelectTrigger className="border-sultan/20 bg-white/[0.03] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low" className="text-xs">منخفضة</SelectItem>
                            <SelectItem value="normal" className="text-xs">عادية</SelectItem>
                            <SelectItem value="high" className="text-xs">عالية</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      onClick={handleCreateCampaign}
                      className="mt-4 sultan-gradient border-0 text-sultan-foreground font-semibold text-sm hover:opacity-90"
                    >
                      <Rocket className="ml-2 h-4 w-4" />
                      إطلاق الحملة
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* ─── Badges & Announcements ──────────────────────────────────────── */}
      <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
        <Card className="border-sultan/10 bg-white/[0.02]">
          <button
            onClick={() => toggleSection('badges')}
            className="flex w-full items-center justify-between p-4 md:p-5"
          >
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-sultan" />
              <h3 className="text-base font-bold text-foreground">الشارات والإعلانات</h3>
            </div>
            {expandedSections.badges ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.badges && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 px-4 pb-4 md:px-5 md:pb-5">
                  {/* Badges */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                      <BadgeIcon className="h-4 w-4 text-sultan" />
                      الشارات المتاحة
                    </h4>
                    <div className="max-h-64 space-y-2 overflow-y-auto scrollbar-thin">
                      {DEMO_BADGES.map((badge) => (
                        <div
                          key={badge.id}
                          className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-colors hover:border-sultan/20"
                        >
                          <span className="text-2xl">{badge.icon}</span>
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-semibold ${badge.color}`}>{badge.name}</p>
                            <p className="text-xs text-muted-foreground">{badge.description}</p>
                          </div>
                          <Badge className="bg-sultan/10 text-sultan border-sultan/20 text-[10px]">
                            {badge.holders} حامل
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-white/5" />

                  {/* Announcements */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Megaphone className="h-4 w-4 text-sultan" />
                      الإعلانات الأخيرة
                    </h4>
                    <div className="max-h-64 space-y-2 overflow-y-auto scrollbar-thin">
                      {DEMO_ANNOUNCEMENTS.map((ann) => (
                        <div
                          key={ann.id}
                          className="rounded-xl border border-white/5 bg-white/[0.02] p-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                          <h5 className="text-sm font-semibold text-foreground">{ann.title}</h5>
                          <Badge className="bg-white/5 text-muted-foreground border-0 text-[10px]">
                            {ann.date}
                          </Badge>
                        </div>
                          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{ann.body}</p>
                          <Badge className="mt-2 bg-sultan/10 text-sultan border-sultan/20 text-[10px]">
                            {ann.type === 'system' ? 'نظام' : ann.type === 'campaign' ? 'حملة' : 'ميزة'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* ─── Bulk Actions ────────────────────────────────────────────────── */}
      <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
        <Card className="border-sultan/10 bg-white/[0.02]">
          <button
            onClick={() => toggleSection('bulk')}
            className="flex w-full items-center justify-between p-4 md:p-5"
          >
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-sultan" />
              <h3 className="text-base font-bold text-foreground">إجراءات جماعية</h3>
              {bulkSelected.size > 0 && (
                <Badge className="bg-sultan/10 text-sultan border-sultan/20 text-[10px]">
                  {bulkSelected.size} محدد
                </Badge>
              )}
            </div>
            {expandedSections.bulk ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.bulk && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 px-4 pb-4 md:px-5 md:pb-5">
                  {/* Bulk Actions Bar */}
                  <div className="flex flex-wrap gap-2">
                    {BULK_ACTIONS.map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        size="sm"
                        className={`border-white/10 bg-white/[0.03] text-xs ${action.color} hover:bg-white/[0.06] disabled:opacity-40`}
                        disabled={bulkSelected.size === 0}
                        onClick={() => handleBulkAction(action)}
                      >
                        <action.icon className="ml-1.5 h-3.5 w-3.5" />
                        {action.label}
                      </Button>
                    ))}
                  </div>

                  {/* User List with Checkboxes */}
                  <div className="rounded-xl border border-white/5">
                    {/* Select All Header */}
                    <div className="flex items-center gap-3 border-b border-white/5 px-4 py-2.5">
                      <Checkbox
                        checked={bulkSelected.size === filteredUsers.length && filteredUsers.length > 0}
                        onCheckedChange={toggleSelectAll}
                        className="border-sultan/30 data-[state=checked]:bg-sultan data-[state=checked]:border-sultan"
                      />
                      <span className="text-xs font-medium text-muted-foreground">
                        تحديد الكل ({filteredUsers.length})
                      </span>
                    </div>

                    {/* User Rows */}
                    <div className="max-h-80 overflow-y-auto scrollbar-thin">
                      {filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className={`flex items-center gap-3 border-b border-white/5 px-4 py-3 transition-colors last:border-0 ${bulkSelected.has(user.id) ? 'bg-sultan/5' : 'hover:bg-white/[0.02]'}`}
                        >
                          <Checkbox
                            checked={bulkSelected.has(user.id)}
                            onCheckedChange={() => toggleBulkSelect(user.id)}
                            className="border-sultan/30 data-[state=checked]:bg-sultan data-[state=checked]:border-sultan"
                          />
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sultan/10">
                            <Users className="h-4 w-4 text-sultan" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">{user.displayName}</p>
                            <p className="text-[11px] text-muted-foreground">@{user.username}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${RISK_LABELS[user.riskLevel].color} ${RISK_LABELS[user.riskLevel].bg} border-0 text-[9px]`}>
                              {RISK_LABELS[user.riskLevel].label}
                            </Badge>
                            <Badge className={`${STATUS_LABELS_USER[user.status].color} ${STATUS_LABELS_USER[user.status].bg} border-0 text-[9px]`}>
                              {STATUS_LABELS_USER[user.status].label}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* ─── Reason Dialog (Single Action) ──────────────────────────────── */}
      <Dialog open={showReasonDialog} onOpenChange={setShowReasonDialog}>
        <DialogContent className="border-sultan/20 bg-card max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {pendingAction && <span className="flex items-center gap-2"><pendingAction.icon className={`h-5 w-5 ${pendingAction.color}`} /> {pendingAction.label}</span>}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              يرجى إدخال سبب هذا الإجراء. سيتم تسجيله في سجل المراجعة.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="أدخل السبب..."
            className="min-h-[100px] border-sultan/20 bg-white/[0.03] text-sm"
            value={actionReason}
            onChange={(e) => setActionReason(e.target.value)}
          />
          <DialogFooter className="flex gap-2 sm:justify-start">
            <Button
              variant="outline"
              className="border-white/10 bg-white/[0.03] text-sm"
              onClick={() => setShowReasonDialog(false)}
            >
              إلغاء
            </Button>
            <Button
              className="sultan-gradient border-0 text-sultan-foreground text-sm"
              onClick={() => {
                if (pendingAction) {
                  executeAction(pendingAction, actionReason);
                  setShowReasonDialog(false);
                }
              }}
            >
              <CheckCircle2 className="ml-1.5 h-4 w-4" />
              تأكيد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Bulk Reason Dialog ─────────────────────────────────────────── */}
      <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <DialogContent className="border-sultan/20 bg-card max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {pendingBulkAction && <span className="flex items-center gap-2"><pendingBulkAction.icon className={`h-5 w-5 ${pendingBulkAction.color}`} /> {pendingBulkAction.label} — تأكيد</span>}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              سيتم تطبيق هذا الإجراء على <span className="font-bold text-sultan">{bulkSelected.size}</span> مستخدم. يرجى إدخال السبب.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="أدخل سبب الإجراء الجماعي..."
            className="min-h-[100px] border-sultan/20 bg-white/[0.03] text-sm"
            value={bulkReason}
            onChange={(e) => setBulkReason(e.target.value)}
          />
          <DialogFooter className="flex gap-2 sm:justify-start">
            <Button
              variant="outline"
              className="border-white/10 bg-white/[0.03] text-sm"
              onClick={() => setShowBulkDialog(false)}
            >
              إلغاء
            </Button>
            <Button
              className="sultan-gradient border-0 text-sultan-foreground text-sm"
              onClick={() => {
                if (pendingBulkAction) {
                  executeBulkAction(pendingBulkAction, bulkReason);
                  setShowBulkDialog(false);
                }
              }}
            >
              <CheckCircle2 className="ml-1.5 h-4 w-4" />
              تأكيد ({bulkSelected.size})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
