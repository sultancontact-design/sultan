import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const search = searchParams.get('search');
    const condition = searchParams.get('condition');
    const sortBy = searchParams.get('sort') || 'newest';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = { status: 'active' };

    if (category && category !== 'all') {
      where.categoryId = category;
    }
    if (city && city !== 'all') {
      where.city = city;
    }
    if (condition && condition !== 'all') {
      where.condition = condition;
    }
    if (minPrice || maxPrice) {
      const priceFilter: Record<string, number> = {};
      if (minPrice) priceFilter.gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.lte = parseFloat(maxPrice);
      where.price = priceFilter;
    }

    const orderBy: Record<string, string> = {};
    switch (sortBy) {
      case 'price_asc': orderBy.price = 'asc'; break;
      case 'price_desc': orderBy.price = 'desc'; break;
      case 'popular': orderBy.viewsCount = 'desc'; break;
      default: orderBy.createdAt = 'desc';
    }

    const [listings, total] = await Promise.all([
      db.listing.findMany({
        where,
        include: {
          profile: { select: { id: true, displayName: true, avatar: true, city: true, isVerified: true, trustScore: true } },
          category: { select: { id: true, nameAr: true, slug: true, icon: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.listing.count({ where }),
    ]);

    return NextResponse.json({
      listings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Listings API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
