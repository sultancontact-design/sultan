import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_MODELS, getModel, getModelsByProvider, getActiveModels } from '@/lib/ai/providers/provider-registry';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');
    const modelId = searchParams.get('modelId');
    const activeOnly = searchParams.get('active') === 'true';

    if (modelId) {
      const model = getModel(modelId);
      if (!model) {
        return NextResponse.json({ error: 'Model not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: model });
    }

    if (providerId) {
      const models = getModelsByProvider(providerId);
      return NextResponse.json({ success: true, data: models });
    }

    if (activeOnly) {
      return NextResponse.json({ success: true, data: getActiveModels() });
    }

    return NextResponse.json({ success: true, data: DEFAULT_MODELS });
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}