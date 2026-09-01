import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const categories = await db.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        _count: { select: { listings: { where: { status: 'active' } } } },
        children: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          include: {
            _count: { select: { listings: { where: { status: 'active' } } } },
          },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
