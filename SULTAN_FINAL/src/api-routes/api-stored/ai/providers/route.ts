import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_PROVIDERS, getProvider, getActiveProviders } from '@/lib/ai/providers/provider-registry';

const customProviders: Array<{
  id: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  createdAt: string;
}> = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');
    const activeOnly = searchParams.get('active') === 'true';

    if (providerId) {
      const provider = getProvider(providerId);
      if (!provider) {
        const custom = customProviders.find((p) => p.id === providerId);
        if (!custom) {
          return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: custom });
      }
      return NextResponse.json({ success: true, data: provider });
    }

    if (activeOnly) {
      return NextResponse.json({ success: true, data: getActiveProviders() });
    }

    return NextResponse.json({
      success: true,
      data: {
        default: DEFAULT_PROVIDERS,
        custom: customProviders,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, type, config } = body;

    if (!id || !name || !type) {
      return NextResponse.json(
        { error: 'id, name, and type are required' },
        { status: 400 }
      );
    }

    const existing = customProviders.find((p) => p.id === id);
    if (existing) {
      return NextResponse.json(
        { error: 'Provider with this id already exists' },
        { status: 409 }
      );
    }

    const provider = {
      id,
      name,
      type,
      config: config || {},
      createdAt: new Date().toISOString(),
    };

    customProviders.push(provider);

    return NextResponse.json({ success: true, data: provider }, { status: 201 });
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