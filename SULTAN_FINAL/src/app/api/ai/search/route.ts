import { NextRequest, NextResponse } from 'next/server';
import { processCommand, routeModel } from '@/lib/ai/core/engine';
import { getActiveProviders, getActiveModels } from '@/lib/ai/providers/provider-registry';
import { getAgentsByCategory } from '@/lib/ai/core/agent-registry';

interface SearchResult {
  type: string;
  source: string;
  title: string;
  description: string;
  relevance: number;
  metadata?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, type } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'query is required' },
        { status: 400 }
      );
    }

    const results: SearchResult[] = [];

    // Search across available providers
    const providers = getActiveProviders();
    for (const provider of providers) {
      results.push({
        type: 'provider',
        source: 'providers',
        title: provider.name,
        description: `${provider.type} provider — ${provider.id}`,
        relevance: provider.name.toLowerCase().includes(query.toLowerCase()) ? 1 : 0.3,
        metadata: { providerId: provider.id },
      });
    }

    // Search across available models
    const models = getActiveModels();
    for (const model of models) {
      const matches =
        model.name?.toLowerCase().includes(query.toLowerCase()) ||
        model.id?.toLowerCase().includes(query.toLowerCase());
      results.push({
        type: 'model',
        source: 'models',
        title: model.name || model.id,
        description: `Model — provider: ${model.providerId || 'unknown'}`,
        relevance: matches ? 1 : 0.2,
        metadata: { modelId: model.id, providerId: model.providerId },
      });
    }

    // Search across agents
    const searchAgents = getAgentsByCategory('all');
    for (const agent of searchAgents) {
      const matches =
        agent.name?.toLowerCase().includes(query.toLowerCase()) ||
        agent.description?.toLowerCase().includes(query.toLowerCase());
      results.push({
        type: 'agent',
        source: 'agents',
        title: agent.name,
        description: agent.description || `Agent — ${agent.id}`,
        relevance: matches ? 1 : 0.2,
        metadata: { agentId: agent.id, category: agent.category },
      });
    }

    // If type is specified, filter results
    const filtered = type
      ? results.filter((r) => r.type === type)
      : results;

    // Sort by relevance descending
    filtered.sort((a, b) => b.relevance - a.relevance);

    return NextResponse.json({
      success: true,
      data: {
        query,
        type: type || 'all',
        results: filtered,
        total: filtered.length,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}