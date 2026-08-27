// ═══════════════════════════════════════════════════════════════════════════════
// SULTAN AI OS — Core Engine — Chat completion, routing, tool execution
// ═══════════════════════════════════════════════════════════════════════════════

import type { AIModel, AIProvider, ToolCall, ModelRoutingRule, Task, AgentDefinition } from './types';
import { DEFAULT_MODELS, DEFAULT_PROVIDERS } from '../providers/provider-registry';
import { AGENT_DEFINITIONS, getAgentForTask } from './agent-registry';

// ─── Model Router ────────────────────────────────────────────────────────────

const ROUTING_RULES: ModelRoutingRule[] = [
  {
    id: 'rule-reasoning', name: 'Reasoning Tasks', description: 'Use reasoning models for complex logic',
    conditions: { taskTypes: ['reasoning', 'math', 'logic_puzzle'], requiresReasoning: true },
    primaryModelId: 'model-o3-mini', fallbackModelIds: ['model-deepseek-r1', 'model-gpt-4o'],
    isActive: true, priority: 1,
  },
  {
    id: 'rule-coding', name: 'Coding Tasks', description: 'Use coding-optimized models',
    conditions: { taskTypes: ['code_generation', 'code_analysis', 'bug_fixing', 'code_review'], requiresCoding: true },
    primaryModelId: 'model-claude-sonnet-4', fallbackModelIds: ['model-gpt-4o', 'model-gemini-2-5-pro'],
    isActive: true, priority: 2,
  },
  {
    id: 'rule-fast', name: 'Fast Tasks', description: 'Use fast models for simple tasks',
    conditions: { taskTypes: ['classification', 'summarization', 'translation', 'simple_qa'], maxCostUsd: 0.001 },
    primaryModelId: 'model-gpt-4o-mini', fallbackModelIds: ['model-llama-4-scout', 'model-deepseek-v3'],
    isActive: true, priority: 10,
  },
  {
    id: 'rule-vision', name: 'Vision Tasks', description: 'Use vision-capable models',
    conditions: { requiresVision: true },
    primaryModelId: 'model-gpt-4o', fallbackModelIds: ['model-claude-sonnet-4', 'model-gemini-2-5-pro'],
    isActive: true, priority: 3,
  },
  {
    id: 'rule-general', name: 'General Tasks', description: 'Default for general purpose',
    conditions: {},
    primaryModelId: 'model-gpt-4o', fallbackModelIds: ['model-claude-sonnet-4', 'model-gemini-2-5-pro'],
    emergencyModelId: 'model-deepseek-v3',
    isActive: true, priority: 100,
  },
];

export function routeModel(taskType: string, options?: { requiresVision?: boolean; requiresCoding?: boolean; requiresReasoning?: boolean; maxCostUsd?: number }): {
  model: AIModel;
  provider: AIProvider;
  rule: ModelRoutingRule;
} {
  const sortedRules = [...ROUTING_RULES].filter(r => r.isActive).sort((a, b) => a.priority - b.priority);

  for (const rule of sortedRules) {
    const c = rule.conditions;
    if (c.requiresReasoning && !options?.requiresReasoning && taskType !== 'reasoning') continue;
    if (c.requiresCoding && !options?.requiresCoding && taskType !== 'code_generation' && taskType !== 'code_analysis') continue;
    if (c.requiresVision && !options?.requiresVision) continue;
    if (c.maxCostUsd && options?.maxCostUsd && options.maxCostUsd > c.maxCostUsd) continue;
    if (c.taskTypes && c.taskTypes.length > 0 && !c.taskTypes.includes(taskType)) continue;

    const model = DEFAULT_MODELS.find(m => m.id === rule.primaryModelId);
    if (model) {
      const provider = DEFAULT_PROVIDERS.find(p => p.id === model.providerId);
      if (provider && provider.isActive && model.isActive) {
        return { model, provider, rule };
      }
    }
  }

  // Fallback: find any active model
  const fallback = DEFAULT_MODELS.find(m => m.isActive);
  const fallbackProvider = fallback ? DEFAULT_PROVIDERS.find(p => p.id === fallback.providerId) : DEFAULT_PROVIDERS[0];
  return { model: fallback!, provider: fallbackProvider!, rule: sortedRules[sortedRules.length - 1] };
}

// ─── Chat Completion (Server-side) ──────────────────────────────────────────

interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_call_id?: string;
  tool_calls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>;
}

interface ChatCompletionOptions {
  modelId?: string;
  providerId?: string;
  messages: ChatMessage[];
  tools?: Array<{ type: 'function'; function: { name: string; description: string; parameters: Record<string, unknown> } }>;
  temperature?: number;
  maxTokens?: number;
  taskType?: string;
  agentId?: string;
}

export interface ChatCompletionResult {
  content: string;
  model: string;
  provider: string;
  tokensInput: number;
  tokensOutput: number;
  totalTokens: number;
  costUsd: number;
  latencyMs: number;
  toolCalls?: ToolCall[];
  finishReason: string;
}

export async function completeChat(options: ChatCompletionOptions): Promise<ChatCompletionResult> {
  const startTime = Date.now();
  let model: AIModel;
  let provider: AIProvider;

  if (options.modelId) {
    model = DEFAULT_MODELS.find(m => m.id === options.modelId) || DEFAULT_MODELS[0];
    provider = DEFAULT_PROVIDERS.find(p => p.id === (options.providerId || model.providerId)) || DEFAULT_PROVIDERS[0];
  } else {
    const routed = routeModel(options.taskType || 'general');
    model = routed.model;
    provider = routed.provider;
  }

  const secretKey = process.env[`SULTAN_SECRET_${provider.id.toUpperCase().replace(/-/g, '_')}`];
  if (!secretKey) {
    return {
      content: `[Sultan AI OS] No API key configured for ${provider.name}. Please add your ${provider.name} API key in Admin → AI OS → API Keys.`,
      model: model.modelId, provider: provider.name,
      tokensInput: 0, tokensOutput: 0, totalTokens: 0, costUsd: 0,
      latencyMs: Date.now() - startTime, finishReason: 'error',
    };
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${secretKey}`,
    };

    let body: Record<string, unknown>;
    if (provider.type === 'anthropic') {
      body = {
        model: model.modelId,
        max_tokens: options.maxTokens || model.capabilities.maxOutputTokens,
        system: options.messages.find(m => m.role === 'system')?.content || '',
        messages: options.messages.filter(m => m.role !== 'system'),
      };
      if (options.tools) {
        (body as Record<string, unknown>).tools = options.tools.map(t => ({
          name: t.function.name,
          description: t.function.description,
          input_schema: t.function.parameters,
        }));
      }
    } else {
      body = {
        model: model.modelId,
        messages: options.messages,
        max_tokens: options.maxTokens || model.capabilities.maxOutputTokens,
        temperature: options.temperature ?? 0.7,
      };
      if (options.tools) body.tools = options.tools;
    }

    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST', headers, body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        content: `[Sultan AI OS] Error from ${provider.name}: ${response.status} ${errorText.slice(0, 200)}`,
        model: model.modelId, provider: provider.name,
        tokensInput: 0, tokensOutput: 0, totalTokens: 0, costUsd: 0,
        latencyMs: Date.now() - startTime, finishReason: 'error',
      };
    }

    const data = await response.json();
    const choice = provider.type === 'anthropic' ? data.content?.[0] : data.choices?.[0];
    const content = provider.type === 'anthropic' ? (choice?.text || '') : (choice?.message?.content || '');
    const usage = data.usage || {};
    const inputTokens = usage.input_tokens || usage.prompt_tokens || 0;
    const outputTokens = usage.output_tokens || usage.completion_tokens || 0;
    const totalTokens = inputTokens + outputTokens;
    const costUsd = (inputTokens / 1000) * model.pricing.inputPer1kTokens + (outputTokens / 1000) * model.pricing.outputPer1kTokens;

    const toolCalls: ToolCall[] = [];
    if (provider.type === 'anthropic') {
      if (data.content) {
        for (const block of data.content) {
          if (block.type === 'tool_use') {
            toolCalls.push({
              id: block.id, toolName: block.name,
              input: typeof block.input === 'string' ? JSON.parse(block.input) : (block.input || {}),
              durationMs: 0, status: 'success',
            });
          }
        }
      }
    } else if (choice?.message?.tool_calls) {
      for (const tc of choice.message.tool_calls) {
        toolCalls.push({
          id: tc.id, toolName: tc.function.name,
          input: JSON.parse(tc.function.arguments),
          durationMs: 0, status: 'success',
        });
      }
    }

    return {
      content, model: model.modelId, provider: provider.name,
      tokensInput: inputTokens, tokensOutput: outputTokens, totalTokens,
      costUsd, latencyMs: Date.now() - startTime,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      finishReason: provider.type === 'anthropic' ? (data.stop_reason || 'stop') : (choice?.finish_reason || 'stop'),
    };
  } catch (error) {
    return {
      content: `[Sultan AI OS] Failed to connect to ${provider.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      model: model.modelId, provider: provider.name,
      tokensInput: 0, tokensOutput: 0, totalTokens: 0, costUsd: 0,
      latencyMs: Date.now() - startTime, finishReason: 'error',
    };
  }
}

// ─── Master Agent Command Processing ─────────────────────────────────────────

export async function processCommand(command: string, context?: Record<string, unknown>): Promise<{
  response: string;
  agentUsed: string;
  tasksCreated: string[];
  toolsUsed: string[];
}> {
  const systemPrompt = `أنت Master Agent في Sultan AI OS — المنصة الرقمية المغربية المتكاملة.

اسمك سلطان وأنت المسؤول الرئيسي عن فهم أوامر المسؤول وتنسيق تنفيذها.

المنصة تتضمن: السوق، الخدمات، الوظائف، العقارات، الطعام، المزادات، التضامن، الأخبار، الزواج، المحفظة، والأعمال.

لديك وكلاء متخصصون يمكنك تفويض المهام إليهم:
${AGENT_DEFINITIONS.map(a => `- ${a.nameAr} (${a.name}): ${a.descriptionAr}`).join('\n')}

عند استلام أمر:
1. فهم القصد الحقيقي
2. تحديد الوكلاء المناسبين
3. تقسيم المهمة إلى خطوات
4. تنفيذ أو تفويض كل خطوة
5. تجميع النتائج

أجب بالعربية دائماً. كن دقيقاً ومفيداً.`;

  const result = await completeChat({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: command },
    ],
    taskType: 'general',
    agentId: 'agent-master',
  });

  return {
    response: result.content,
    agentUsed: 'agent-master',
    tasksCreated: [],
    toolsUsed: result.toolCalls?.map(tc => tc.toolName) || [],
  };
}

// ─── Observability Store (in-memory for now, DB in production) ────────────────

import type { ObservabilityEvent, ModelUsageMetric } from './types';

const eventsStore: ObservabilityEvent[] = [];
const metricsStore: ModelUsageMetric[] = [];
const MAX_EVENTS = 10000;
const MAX_METRICS = 5000;

export function addEvent(event: Omit<ObservabilityEvent, 'id' | 'timestamp'>): ObservabilityEvent {
  const e: ObservabilityEvent = { ...event, id: crypto.randomUUID(), timestamp: new Date().toISOString() };
  eventsStore.unshift(e);
  if (eventsStore.length > MAX_EVENTS) eventsStore.pop();
  return e;
}

export function getEvents(filter?: { type?: string; agentId?: string; level?: string; limit?: number }): ObservabilityEvent[] {
  let result = [...eventsStore];
  if (filter?.type) result = result.filter(e => e.type === filter.type);
  if (filter?.agentId) result = result.filter(e => e.agentId === filter.agentId);
  if (filter?.level) result = result.filter(e => e.level === filter.level);
  return result.slice(0, filter?.limit || 100);
}

export function addMetric(metric: Omit<ModelUsageMetric, 'timestamp'>): ModelUsageMetric {
  const m: ModelUsageMetric = { ...metric, timestamp: new Date().toISOString() };
  metricsStore.unshift(m);
  if (metricsStore.length > MAX_METRICS) metricsStore.pop();
  return m;
}

export function getMetrics(limit?: number): ModelUsageMetric[] {
  return metricsStore.slice(0, limit || 100);
}

// ─── Secrets Management (Server-side only) ───────────────────────────────────

const secretsMap = new Map<string, { encryptedValue: string; name: string; providerId?: string; scope: string; keyPreview: string; isActive: boolean; lastUsedAt?: string; createdAt: string; updatedAt: string }>();

// Simple encryption/decryption for secrets (use proper KMS in production)
function simpleEncrypt(text: string): string {
  return Buffer.from(text).toString('base64');
}
function simpleDecrypt(encoded: string): string {
  return Buffer.from(encoded, 'base64').toString('utf-8');
}

export function storeSecret(name: string, value: string, scope: string, providerId?: string): { id: string; keyPreview: string } {
  const id = crypto.randomUUID();
  const preview = value.slice(0, 6) + '...' + value.slice(-4);
  secretsMap.set(id, {
    encryptedValue: simpleEncrypt(value),
    name, providerId, scope, keyPreview: preview, isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  });
  return { id, keyPreview: preview };
}

export function getSecretValue(id: string): string | null {
  const secret = secretsMap.get(id);
  if (!secret || !secret.isActive) return null;
  secret.lastUsedAt = new Date().toISOString();
  return simpleDecrypt(secret.encryptedValue);
}

export function listSecrets(): Array<{ id: string; name: string; providerId?: string; scope: string; keyPreview: string; isActive: boolean; lastUsedAt?: string }> {
  return Array.from(secretsMap.entries()).map(([id, s]) => ({
    id, name: s.name, providerId: s.providerId, scope: s.scope,
    keyPreview: s.keyPreview, isActive: s.isActive, lastUsedAt: s.lastUsedAt,
  }));
}

export function deleteSecret(id: string): boolean {
  return secretsMap.delete(id);
}

export function toggleSecret(id: string, isActive: boolean): boolean {
  const secret = secretsMap.get(id);
  if (!secret) return false;
  secret.isActive = isActive;
  secret.updatedAt = new Date().toISOString();
  return true;
}
