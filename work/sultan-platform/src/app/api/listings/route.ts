import { NextResponse } from 'next/server';
import { listings, categories, cities } from '@/lib/seed-data';

export async function GET(request: Request) {
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

  let filtered = [...listings];

  if (category && category !== 'all') {
    filtered = filtered.filter(l => l.categoryId === category);
  }
  if (city) {
    filtered = filtered.filter(l => l.city === city);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(l =>
      l.title.includes(search) || l.description.includes(search)
    );
  }
  if (condition && condition !== 'all') {
    filtered = filtered.filter(l => l.condition === condition);
  }
  if (minPrice) {
    filtered = filtered.filter(l => l.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter(l => l.price <= parseFloat(maxPrice));
  }

  switch (sortBy) {
    case 'price_asc': filtered.sort((a, b) => a.price - b.price); break;
    case 'price_desc': filtered.sort((a, b) => b.price - a.price); break;
    case 'popular': filtered.sort((a, b) => b.viewsCount - a.viewsCount); break;
    default:
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return NextResponse.json({
    listings: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    categories,
    cities,
  });
}
