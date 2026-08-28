export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';
import { listSecrets, storeSecret, deleteSecret } from '@/lib/ai/core/engine';

export async function GET() {
  try {
    const secrets = await listSecrets();
    return NextResponse.json({ success: true, data: secrets });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, value, scope, providerId } = body;

    if (!name || !value) {
      return NextResponse.json(
        { error: 'name and value are required' },
        { status: 400 }
      );
    }

    const secret = await storeSecret({
      name,
      value,
      scope: scope || 'global',
      providerId: providerId || undefined,
    });

    return NextResponse.json({ success: true, data: secret }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      );
    }

    await deleteSecret(id);

    return NextResponse.json({ success: true, message: 'Secret deleted' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('not found') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}