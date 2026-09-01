import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const city = searchParams.get('city');
    const role = searchParams.get('role');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { displayName: { contains: search } },
        { username: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (city) where.city = city;
    if (role) where.role = role;

    const [profiles, total] = await Promise.all([
      db.profile.findMany({
        where,
        select: {
          id: true, userId: true, username: true, displayName: true, email: true,
          phone: true, avatar: true, bio: true, city: true, region: true,
          role: true, isVerified: true, isBusiness: true, trustScore: true,
          reputationScore: true, sultanPower: true, coinsBalance: true,
          isRising: true, isFeatured: true, listingCount: true, saleCount: true,
          followerCount: true, followingCount: true, createdAt: true,
          _count: { select: { listings: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.profile.count({ where }),
    ]);

    return NextResponse.json({ profiles, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Profiles API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
