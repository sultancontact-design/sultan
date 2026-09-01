import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = {};
    if (status !== 'all') where.status = status;

    const [auctions, total] = await Promise.all([
      db.auction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.auction.count({ where }),
    ]);

    return NextResponse.json({ auctions, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Auctions API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
