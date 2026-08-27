// ═══════════════════════════════════════════════════════════════════════════════
// SULTAN AI OS — Core Type System
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Agent Types ─────────────────────────────────────────────────────────────

export type AgentStatus = 'idle' | 'running' | 'paused' | 'error' | 'waiting_approval' | 'completed'
export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'waiting_approval' | 'paused'
export type WorkflowStatus = 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled'
export type PermissionAction = 'read' | 'write' | 'execute' | 'deploy' | 'delete' | 'database' | 'github' | 'cloudflare' | 'social' | 'finance' | 'user_data' | 'secrets'
export type PermissionLevel = 'allowed' | 'denied' | 'approval_required'
export type SecretScope = 'ai_provider' | 'github' | 'supabase' | 'cloudflare' | 'social' | 'payment' | 'custom'

export interface AgentDefinition {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  icon: string
  category: 'core' | 'engineering' | 'quality' | 'security' | 'devops' | 'research' | 'data' | 'product' | 'growth' | 'social' | 'content' | 'business' | 'knowledge'
  capabilities: string[]
  defaultModel?: string
  permissions: Record<PermissionAction, PermissionLevel>
  maxConcurrentTasks: number
  timeoutMs: number
  isAlwaysOn: boolean
  tools: string[]
  createdAt: string
  updatedAt: string
}

export interface AgentInstance {
  id: string
  agentDefId: string
  status: AgentStatus
  currentTaskId?: string
  completedTasks: number
  failedTasks: number
  totalTokensUsed: number
  lastActiveAt: string
  createdAt: string
}

// ─── Task Types ──────────────────────────────────────────────────────────────

export interface Task {
  id: string
  parentId?: string
  workflowId?: string
  agentId: string
  agentName: string
  title: string
  description: string
  status: TaskStatus
  priority: 'low' | 'medium' | 'high' | 'critical'
 input: Record<string, unknown>
  output?: Record<string, unknown>
  error?: string
  progress: number // 0-100
  model: string
  provider: string
  tokensUsed: number
  tokensInput: number
  tokensOutput: number
  latencyMs: number
  costUsd: number
  toolsUsed: ToolCall[]
 subTaskIds: string[]
  approvalRequired: boolean
  approvalStatus?: 'pending' | 'approved' | 'rejected'
  approvedBy?: string
  startedAt?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ToolCall {
  id: string
  toolName: string
  input: Record<string, unknown>
  output?: unknown
  error?: string
  durationMs: number
  status: 'success' | 'error'
}

// ─── AI Provider & Model Types ───────────────────────────────────────────────

export interface AIProvider {
  id: string
  name: string
  type: 'openai_compatible' | 'anthropic' | 'google' | 'custom'
  baseUrl: string
  isActive: boolean
  priority: number
  isDefault: boolean
  supportedFeatures: {
    chat: boolean
    vision: boolean
    coding: boolean
    reasoning: boolean
    functionCalling: boolean
    streaming: boolean
    jsonMode: boolean
  }
  rateLimitRpm?: number
  rateLimitTpm?: number
  createdAt: string
  updatedAt: string
}

export interface AIModel {
  id: string
  providerId: string
  providerName: string
  modelId: string
  displayName: string
  description: string
  capabilities: {
    maxContextTokens: number
    maxOutputTokens: number
    supportsVision: boolean
    supportsCoding: boolean
    supportsReasoning: boolean
    supportsFunctionCalling: boolean
    supportsStreaming: boolean
    supportsJsonMode: boolean
  }
  pricing: {
    inputPer1kTokens: number
    outputPer1kTokens: number
  }
  isActive: boolean
  isDefaultForCategory?: string
  healthStatus: 'healthy' | 'degraded' | 'down' | 'unknown'
  avgLatencyMs?: number
  totalCalls24h?: number
  errorRate24h?: number
  createdAt: string
  updatedAt: string
}

export interface ModelRoutingRule {
  id: string
  name: string
  description: string
  conditions: {
    taskTypes?: string[]
    minQuality?: number
    maxCostUsd?: number
    requiresVision?: boolean
    requiresCoding?: boolean
    requiresReasoning?: boolean
  }
  primaryModelId: string
  fallbackModelIds: string[]
  emergencyModelId?: string
  isActive: boolean
  priority: number
}

// ─── Secrets Management ──────────────────────────────────────────────────────

export interface StoredSecret {
  id: string
  name: string
  providerId?: string
  scope: SecretScope
  keyPreview: string // e.g. 'sk-...xxxx'
  encryptedValue: string
  isActive: boolean
  lastUsedAt?: string
  lastRotatedAt?: string
  permissionScope: string[]
  createdAt: string
  updatedAt: string
}

// ─── Memory & Knowledge ──────────────────────────────────────────────────────

export interface MemoryEntry {
  id: string
  agentId?: string
  sessionId?: string
  type: 'short_term' | 'session' | 'long_term' | 'organizational'
  category: string
  title: string
  content: string
  metadata: Record<string, unknown>
  embedding?: number[]
  importance: number // 0-1
  accessCount: number
  createdAt: string
  updatedAt: string
  expiresAt?: string
}

export interface KnowledgeEntry {
  id: string
  type: 'architecture_decision' | 'business_rule' | 'solution' | 'bug' | 'documentation' | 'product_knowledge' | 'agent_knowledge'
  title: string
  content: string
  source: string
  tags: string[]
  version: number
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

// ─── Workflow Types ──────────────────────────────────────────────────────────

export interface Workflow {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  status: WorkflowStatus
  definition: WorkflowStep[]
  currentStepIndex: number
  input: Record<string, unknown>
  output?: Record<string, unknown>
  error?: string
  taskIds: string[]
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface WorkflowStep {
  id: string
  name: string
  nameAr: string
  agentId: string
  agentName: string
  taskType: string
  input: Record<string, unknown>
  dependsOn: string[] // step IDs
  timeoutMs: number
  requiresApproval: boolean
  approvalStatus?: 'pending' | 'approved' | 'rejected'
  maxRetries: number
  retryCount: number
  status: TaskStatus
  taskId?: string
}

// ─── Observability Types ─────────────────────────────────────────────────────

export interface ObservabilityEvent {
  id: string
  timestamp: string
  type: 'agent_start' | 'agent_end' | 'tool_call' | 'model_call' | 'error' | 'approval_request' | 'approval_response' | 'workflow_step' | 'system'
  agentId?: string
  taskId?: string
  workflowId?: string
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal'
  message: string
  metadata: Record<string, unknown>
  durationMs?: number
  tokensUsed?: number
  costUsd?: number
}

export interface ModelUsageMetric {
  timestamp: string
  modelId: string
  providerId: string
  calls: number
  tokensInput: number
  tokensOutput: number
  totalTokens: number
  totalCostUsd: number
  avgLatencyMs: number
  errorCount: number
  successRate: number
}

// ─── Browser Types ───────────────────────────────────────────────────────────

export interface BrowserSession {
  id: string
  status: 'active' | 'closed' | 'error'
  url?: string
  title?: string
  screenshot?: string
  startedAt: string
  lastActivityAt: string
  taskId?: string
}

export interface BrowserAction {
  type: 'navigate' | 'click' | 'type' | 'scroll' | 'screenshot' | 'read' | 'wait' | 'upload' | 'download'
  selector?: string
  url?: string
  text?: string
  value?: string
}

// ─── Command Center Types ────────────────────────────────────────────────────

export interface CommandCenterMessage {
  id: string
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  timestamp: string
  agentId?: string
  agentName?: string
  toolCalls?: ToolCall[]
  model?: string
  tokensUsed?: number
  isStreaming?: boolean
}

export interface CommandCenterSession {
  id: string
  title: string
  messages: CommandCenterMessage[]
  status: 'active' | 'archived'
  createdAt: string
  updatedAt: string
}

// ─── Permission Firewall ─────────────────────────────────────────────────────

export interface PermissionPolicy {
  id: string
  agentId?: string
  agentRoleId?: string
  action: PermissionAction
  level: PermissionLevel
  conditions?: Record<string, unknown>
  description: string
  createdAt: string
}

// ─── Scheduled Task ──────────────────────────────────────────────────────────

export interface ScheduledTask {
  id: string
  name: string
  nameAr: string
  description: string
  cronExpression?: string
  intervalMs?: number
  agentId: string
  agentName: string
  taskType: string
  input: Record<string, unknown>
  isActive: boolean
  lastRunAt?: string
  nextRunAt?: string
  runCount: number
  failCount: number
  createdAt: string
  updatedAt: string
}

// ─── Social Manager ──────────────────────────────────────────────────────────

export interface SocialAccount {
  id: string
  platform: 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube'
  displayName: string
  username: string
  isConnected: boolean
  followersCount?: number
  isActive: boolean
  lastPostedAt?: string
  createdAt: string
}

export interface SocialPost {
  id: string
  accountId: string
  platform: string
  content: string
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  scheduledAt?: string
  publishedAt?: string
  engagement?: {
    likes: number
    comments: number
    shares: number
    views: number
  }
  agentId?: string
  createdAt: string
}

// ─── Marriage Profile ────────────────────────────────────────────────────────

export interface MarriageProfile {
  id: string
  profileId: string
  gender: 'male' | 'female'
  birthYear: number
  city: string
  region: string
  maritalStatus: 'never_married' | 'divorced' | 'widowed'
  about: string
  lookingFor: string
  education?: string
  profession?: string
  height?: number
  prayerFrequency: 'always' | 'mostly' | 'sometimes' | 'rarely'
  isVerified: boolean
  photos: string[]
 privacyLevel: 'public' | 'verified_only' | 'invite_only'
 isActive: boolean
  completedAt?: string
  createdAt: string
  updatedAt: string
}

// ─── Money / Wallet ──────────────────────────────────────────────────────────

export interface Wallet {
  id: string
  profileId: string
  balance: number
  currency: string
  isFrozen: boolean
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  walletId: string
  type: 'credit' | 'debit' | 'transfer' | 'payment' | 'refund' | 'reward'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  description: string
  referenceType?: string
  referenceId?: string
  metadata: Record<string, unknown>
  createdAt: string
}

// ─── Trust System ────────────────────────────────────────────────────────────

export interface TrustScore {
  profileId: string
  overallScore: number
  verificationScore: number
  reputationScore: number
  activityScore: number
  sellerScore: number
  providerScore: number
  fraudRisk: 'low' | 'medium' | 'high'
 lastCalculatedAt: string
}

// ─── Trends Engine ───────────────────────────────────────────────────────────

export interface TrendItem {
  id: string
  type: 'search' | 'category' | 'city' | 'product' | 'service'
  title: string
  titleAr: string
  score: number
  changePercent: number
  period: 'hourly' | 'daily' | 'weekly' | 'monthly'
  metadata: Record<string, unknown>
  createdAt: string
}

// ─── Business ────────────────────────────────────────────────────────────────

export interface BusinessProfile {
  id: string
  profileId: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  category: string
  city: string
  address?: string
  phone?: string
  website?: string
  logo?: string
  cover?: string
  isVerified: boolean
  rating: number
  reviewCount: number
  followerCount: number
  productCount: number
  serviceCount: number
  createdAt: string
  updatedAt: string
}
