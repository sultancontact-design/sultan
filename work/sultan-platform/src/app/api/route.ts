import { NextResponse } from "next/server";
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [userCount, listingCount, categoryCount] = await Promise.all([
      db.profile.count(),
      db.listing.count(),
      db.category.count(),
    ]);

    return NextResponse.json({
      name: 'سلطان | SULTAN',
      version: '2.0.0',
      status: 'operational',
      database: 'connected',
      stats: { users: userCount, listings: listingCount, categories: categoryCount },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ name: 'سلطان | SULTAN', status: 'error', database: 'disconnected' }, { status: 503 });
  }
}
