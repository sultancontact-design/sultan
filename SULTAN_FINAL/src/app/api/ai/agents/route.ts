export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';
import { AGENT_DEFINITIONS, getAgentDefinition, getAgentsByCategory } from '@/lib/ai/core/agent-registry';

const agentInstances = new Map<string, unknown>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const agentId = searchParams.get('agentId');

    if (agentId) {
      const agent = getAgentDefinition(agentId);
      if (!agent) {
        return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: agent });
    }

    if (category) {
      const agents = getAgentsByCategory(category);
      return NextResponse.json({ success: true, data: agents });
    }

    return NextResponse.json({ success: true, data: AGENT_DEFINITIONS });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, config, name } = body;

    if (!agentId) {
      return NextResponse.json({ error: 'agentId is required' }, { status: 400 });
    }

    const definition = getAgentDefinition(agentId);
    if (!definition) {
      return NextResponse.json({ error: 'Agent definition not found' }, { status: 404 });
    }

    const instanceId = `inst_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const instance = {
      id: instanceId,
      agentId,
      name: name || definition.name,
      config: config || {},
      definition,
      createdAt: new Date().toISOString(),
    };

    agentInstances.set(instanceId, instance);

    return NextResponse.json({ success: true, data: instance }, { status: 201 });
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}