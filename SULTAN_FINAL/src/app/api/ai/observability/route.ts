import { NextRequest, NextResponse } from 'next/server';
import { getEvents, getMetrics, addEvent, addMetric } from '@/lib/ai/core/engine';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = searchParams.get('limit')
      ? parseInt(searchParams.get('limit')!, 10)
      : 100;

    if (type === 'events') {
      const events = await getEvents({ limit });
      return NextResponse.json({ success: true, data: events });
    }

    if (type === 'metrics') {
      const metrics = await getMetrics({ limit });
      return NextResponse.json({ success: true, data: metrics });
    }

    const [events, metrics] = await Promise.all([
      getEvents({ limit }),
      getMetrics({ limit }),
    ]);

    return NextResponse.json({
      success: true,
      data: { events, metrics },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...payload } = body;

    if (type === 'event') {
      const { name, data, source } = payload;
      if (!name) {
        return NextResponse.json(
          { error: 'name is required for events' },
          { status: 400 }
        );
      }
      const event = await addEvent({ name, data, source });
      return NextResponse.json({ success: true, data: event }, { status: 201 });
    }

    if (type === 'metric') {
      const { name, value, unit, tags } = payload;
      if (!name || value === undefined) {
        return NextResponse.json(
          { error: 'name and value are required for metrics' },
          { status: 400 }
        );
      }
      const metric = await addMetric({ name, value, unit, tags });
      return NextResponse.json({ success: true, data: metric }, { status: 201 });
    }

    return NextResponse.json(
      { error: 'type must be "event" or "metric"' },
      { status: 400 }
    );
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