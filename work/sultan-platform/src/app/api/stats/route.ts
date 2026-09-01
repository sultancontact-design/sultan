import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const [
      totalUsers,
      totalListings,
      activeListings,
      totalAuctions,
      activeAuctions,
      totalCharity,
      recentUsers,
      revenueData,
    ] = await Promise.all([
      db.profile.count(),
      db.listing.count(),
      db.listing.count({ where: { status: 'active' } }),
      db.auction.count(),
      db.auction.count({ where: { status: 'active' } }),
      db.charityCase.count(),
      db.profile.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      db.listing.aggregate({
        _sum: { price: true },
        _count: true,
      }),
    ]);

    const listingsByCategory = await db.category.findMany({
      where: { isActive: true },
      select: {
        nameAr: true,
        _count: { select: { listings: { where: { status: 'active' } } } },
      },
      orderBy: { order: 'asc' },
    });

    // User growth over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userGrowth = await db.profile.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _count: { id: true },
    });

    return NextResponse.json({
      totalUsers,
      totalListings,
      activeListings,
      totalAuctions,
      activeAuctions,
      totalCharity,
      recentUsers,
      totalRevenue: revenueData._sum.price || 0,
      listingsByCategory: listingsByCategory.map(c => ({
        name: c.nameAr,
        count: c._count.listings,
      })),
      userGrowth: userGrowth.map(u => ({
        date: u.createdAt.toISOString().split('T')[0],
        count: u._count.id,
      })),
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
