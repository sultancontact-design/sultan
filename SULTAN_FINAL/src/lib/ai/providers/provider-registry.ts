// ═══════════════════════════════════════════════════════════════════════════════
// SULTAN AI OS — Provider Registry
// ═══════════════════════════════════════════════════════════════════════════════

import type { AIProvider, AIModel } from '../core/types';

export const DEFAULT_PROVIDERS: AIProvider[] = [
  {
    id: 'provider-openai',
    name: 'OpenAI',
    type: 'openai_compatible',
    baseUrl: 'https://api.openai.com/v1',
    isActive: true,
    priority: 1,
    isDefault: true,
    supportedFeatures: { chat: true, vision: true, coding: true, reasoning: true, functionCalling: true, streaming: true, jsonMode: true },
    rateLimitRpm: 500,
    rateLimitTpm: 200000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'provider-anthropic',
    name: 'Anthropic',
    type: 'anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    isActive: true,
    priority: 2,
    isDefault: false,
    supportedFeatures: { chat: true, vision: true, coding: true, reasoning: true, functionCalling: true, streaming: true, jsonMode: false },
    rateLimitRpm: 400,
    rateLimitTpm: 150000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'provider-google',
    name: 'Google AI',
    type: 'openai_compatible',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    isActive: true,
    priority: 3,
    isDefault: false,
    supportedFeatures: { chat: true, vision: true, coding: true, reasoning: true, functionCalling: true, streaming: true, jsonMode: true },
    rateLimitRpm: 300,
    rateLimitTpm: 250000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'provider-xai',
    name: 'xAI (Grok)',
    type: 'openai_compatible',
    baseUrl: 'https://api.x.ai/v1',
    isActive: true,
    priority: 4,
    isDefault: false,
    supportedFeatures: { chat: true, vision: true, coding: true, reasoning: true, functionCalling: true, streaming: true, jsonMode: true },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'provider-deepseek',
    name: 'DeepSeek',
    type: 'openai_compatible',
    baseUrl: 'https://api.deepseek.com/v1',
    isActive: true,
    priority: 5,
    isDefault: false,
    supportedFeatures: { chat: true, vision: false, coding: true, reasoning: true, functionCalling: true, streaming: true, jsonMode: true },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'provider-mistral',
    name: 'Mistral AI',
    type: 'openai_compatible',
    baseUrl: 'https://api.mistral.ai/v1',
    isActive: true,
    priority: 6,
    isDefault: false,
    supportedFeatures: { chat: true, vision: true, coding: true, reasoning: true, functionCalling: true, streaming: true, jsonMode: true },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'provider-groq',
    name: 'Groq',
    type: 'openai_compatible',
    baseUrl: 'https://api.groq.com/openai/v1',
    isActive: true,
    priority: 7,
    isDefault: false,
    supportedFeatures: { chat: true, vision: false, coding: false, reasoning: false, functionCalling: true, streaming: true, jsonMode: true },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'provider-openrouter',
    name: 'OpenRouter',
    type: 'openai_compatible',
    baseUrl: 'https://openrouter.ai/api/v1',
    isActive: true,
    priority: 8,
    isDefault: false,
    supportedFeatures: { chat: true, vision: true, coding: true, reasoning: true, functionCalling: true, streaming: true, jsonMode: true },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'provider-cerebras',
    name: 'Cerebras',
    type: 'openai_compatible',
    baseUrl: 'https://api.cerebras.ai/v1',
    isActive: true,
    priority: 9,
    isDefault: false,
    supportedFeatures: { chat: true, vision: false, coding: false, reasoning: false, functionCalling: true, streaming: true, jsonMode: true },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_MODELS: AIModel[] = [
  // ── OpenAI ──
  {
    id: 'model-gpt-4o',
    providerId: 'provider-openai', providerName: 'OpenAI',
    modelId: 'gpt-4o', displayName: 'GPT-4o',
    description: 'Most capable OpenAI model with vision and function calling',
    capabilities: { maxContextTokens: 128000, maxOutputTokens: 16384, supportsVision: true, supportsCoding: true, supportsReasoning: true, supportsFunctionCalling: true, supportsStreaming: true, supportsJsonMode: true },
    pricing: { inputPer1kTokens: 0.0025, outputPer1kTokens: 0.01 },
    isActive: true, isDefaultForCategory: 'general',
    healthStatus: 'unknown', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'model-gpt-4o-mini',
    providerId: 'provider-openai', providerName: 'OpenAI',
    modelId: 'gpt-4o-mini', displayName: 'GPT-4o Mini',
    description: 'Fast and cost-efficient for simpler tasks',
    capabilities: { maxContextTokens: 128000, maxOutputTokens: 16384, supportsVision: true, supportsCoding: false, supportsReasoning: false, supportsFunctionCalling: true, supportsStreaming: true, supportsJsonMode: true },
    pricing: { inputPer1kTokens: 0.00015, outputPer1kTokens: 0.0006 },
    isActive: true, isDefaultForCategory: 'fast',
    healthStatus: 'unknown', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'model-o3-mini',
    providerId: 'provider-openai', providerName: 'OpenAI',
    modelId: 'o3-mini', displayName: 'o3-mini',
    description: 'Reasoning model for complex logic and math',
    capabilities: { maxContextTokens: 200000, maxOutputTokens: 100000, supportsVision: false, supportsCoding: true, supportsReasoning: true, supportsFunctionCalling: true, supportsStreaming: true, supportsJsonMode: true },
    pricing: { inputPer1kTokens: 0.0011, outputPer1kTokens: 0.0044 },
    isActive: true, isDefaultForCategory: 'reasoning',
    healthStatus: 'unknown', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  // ── Anthropic ──
  {
    id: 'model-claude-sonnet-4',
    providerId: 'provider-anthropic', providerName: 'Anthropic',
    modelId: 'claude-sonnet-4-20250514', displayName: 'Claude Sonnet 4',
    description: 'Excellent for coding, analysis, and long context tasks',
    capabilities: { maxContextTokens: 200000, maxOutputTokens: 64000, supportsVision: true, supportsCoding: true, supportsReasoning: true, supportsFunctionCalling: true, supportsStreaming: true, supportsJsonMode: false },
    pricing: { inputPer1kTokens: 0.003, outputPer1kTokens: 0.015 },
    isActive: true, isDefaultForCategory: 'coding',
    healthStatus: 'unknown', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'model-claude-haiku-3-5',
    providerId: 'provider-anthropic', providerName: 'Anthropic',
    modelId: 'claude-3-5-haiku-20241022', displayName: 'Claude 3.5 Haiku',
    description: 'Fast and efficient for routine tasks',
    capabilities: { maxContextTokens: 200000, maxOutputTokens: 8192, supportsVision: true, supportsCoding: false, supportsReasoning: false, supportsFunctionCalling: true, supportsStreaming: true, supportsJsonMode: false },
    pricing: { inputPer1kTokens: 0.0008, outputPer1kTokens: 0.004 },
    isActive: true,
    healthStatus: 'unknown', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  // ── Google ──
  {
    id: 'model-gemini-2-5-pro',
    providerId: 'provider-google', providerName: 'Google AI',
    modelId: 'gemini-2.5-pro-preview-06-05', displayName: 'Gemini 2.5 Pro',
    description: 'Google flagship model with long context and thinking',
    capabilities: { maxContextTokens: 1000000, maxOutputTokens: 65536, supportsVision: true, supportsCoding: true, supportsReasoning: true, supportsFunctionCalling: true, supportsStreaming: true, supportsJsonMode: true },
    pricing: { inputPer1kTokens: 0.00125, outputPer1kTokens: 0.01 },
    isActive: true,
    healthStatus: 'unknown', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'model-gemini-2-5-flash',
    providerId: 'provider-google', providerName: 'Google AI',
    modelId: 'gemini-2.5-flash-preview-05-20', displayName: 'Gemini 2.5 Flash',
    description: 'Fast and capable model from Google',
    capabilities: { maxContextTokens: 1000000, maxOutputTokens: 65536, supportsVision: true, supportsCoding: true, supportsReasoning: true, supportsFunctionCalling: true, supportsStreaming: true, supportsJsonMode: true },
    pricing: { inputPer1kTokens: 0.00015, outputPer1kTokens: 0.0006 },
    isActive: true,
    healthStatus: 'unknown', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  // ── xAI ──
  {
    id: 'model-grok-3',
    providerId: 'provider-xai', providerName: 'xAI',
    modelId: 'grok-3', displayName: 'Grok 3',
    description: 'xAI flagship model with reasoning capabilities',
    capabilities: { maxContextTokens: 131072, maxOutputTokens: 32768, supportsVision: true, supportsCoding: true, supportsReasoning: true, supportsFunctionCalling: true, supportsStreaming: true, supportsJsonMode: true },
    pricing: { inputPer1kTokens: 0.003, outputPer1kTokens: 0.015 },
    isActive: true,
    healthStatus: 'unknown', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  // ── DeepSeek ──
  {
    id: 'model-deepseek-r1',
    providerId: 'provider-deepseek', providerName: 'DeepSeek',
    modelId: 'deepseek-reasoner', displayName: 'DeepSeek R1',
    description: 'DeepSeek reasoning model',
    capabilities: { maxContextTokens: 65536, maxOutputTokens: 8192, supportsVision: false, supportsCoding: true, supportsReasoning: true, supportsFunctionCalling: true, supportsStreaming: true, supportsJsonMode: true },
    pricing: { inputPer1kTokens: 0.00055, outputPer1kTokens: 0.00219 },
    isActive: true,
    healthStatus: 'unknown', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'model-deepseek-v3',
    providerId: 'provider-deepseek', providerName: 'DeepSeek',
    modelId: 'deepseek-chat', displayName: 'DeepSeek V3',
    description: 'DeepSeek general purpose chat model',
    capabilities: { maxContextTokens: 65536, maxOutputTokens: 8192, supportsVision: false, supportsCoding: true, supportsReasoning: false, supportsFunctionCalling: true, supportsStreaming: true, supportsJsonMode: true },
    pricing: { inputPer1kTokens: 0.00014, outputPer1kTokens: 0.00028 },
    isActive: true,
    healthStatus: 'unknown', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  // ── Mistral ──
  {
    id: 'model-mistral-large',
    providerId: 'provider-mistral', providerName: 'Mistral AI',
    modelId: 'mistral-large-latest', displayName: 'Mistral Large',
    description: 'Mistral flagship model for complex tasks',
    capabilities: { maxContextTokens: 128000, maxOutputTokens: 128000, supportsVision: true, supportsCoding: true, supportsReasoning: true, supportsFunctionCalling: true, supportsStreaming: true, supportsJsonMode: true },
    pricing: { inputPer1kTokens: 0.002, outputPer1kTokens: 0.006 },
    isActive: true,
    healthStatus: 'unknown', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  // ── Groq (for speed) ──
  {
    id: 'model-llama-4-scout',
    providerId: 'provider-groq', providerName: 'Groq',
    modelId: 'llama-4-scout-17b-16e-instruct', displayName: 'Llama 4 Scout (Groq)',
    description: 'Ultra-fast inference via Groq hardware',
    capabilities: { maxContextTokens: 131072, maxOutputTokens: 8192, supportsVision: true, supportsCoding: false, supportsReasoning: false, supportsFunctionCalling: true, supportsStreaming: true, supportsJsonMode: true },
    pricing: { inputPer1kTokens: 0.00005, outputPer1kTokens: 0.00008 },
    isActive: true, isDefaultForCategory: 'ultra_fast',
    healthStatus: 'unknown', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

export function getProvider(providerId: string): AIProvider | undefined {
  return DEFAULT_PROVIDERS.find(p => p.id === providerId);
}

export function getModel(modelId: string): AIModel | undefined {
  return DEFAULT_MODELS.find(m => m.id === modelId);
}

export function getModelsByProvider(providerId: string): AIModel[] {
  return DEFAULT_MODELS.filter(m => m.providerId === providerId);
}

export function getActiveProviders(): AIProvider[] {
  return DEFAULT_PROVIDERS.filter(p => p.isActive);
}

export function getActiveModels(): AIModel[] {
  return DEFAULT_MODELS.filter(m => m.isActive);
}
