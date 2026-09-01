import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameAr" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "parentId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "username" TEXT NOT NULL UNIQUE,
    "displayName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "city" TEXT NOT NULL DEFAULT 'الدار البيضاء',
    "region" TEXT,
    "country" TEXT NOT NULL DEFAULT 'MA',
    "locale" TEXT NOT NULL DEFAULT 'ar',
    "role" TEXT NOT NULL DEFAULT 'user',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isBusiness" BOOLEAN NOT NULL DEFAULT false,
    "trustScore" INTEGER NOT NULL DEFAULT 0,
    "reputationScore" INTEGER NOT NULL DEFAULT 0,
    "sultanPower" INTEGER NOT NULL DEFAULT 0,
    "coinsBalance" INTEGER NOT NULL DEFAULT 0,
    "rewardsBalance" INTEGER NOT NULL DEFAULT 0,
    "pendingRewards" INTEGER NOT NULL DEFAULT 0,
    "followerCount" INTEGER NOT NULL DEFAULT 0,
    "followingCount" INTEGER NOT NULL DEFAULT 0,
    "supportGivenCount" INTEGER NOT NULL DEFAULT 0,
    "supportReceivedCount" INTEGER NOT NULL DEFAULT 0,
    "listingCount" INTEGER NOT NULL DEFAULT 0,
    "saleCount" INTEGER NOT NULL DEFAULT 0,
    "isSultanSupported" BOOLEAN NOT NULL DEFAULT false,
    "isRising" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MAD',
    "categoryId" TEXT NOT NULL,
    "condition" TEXT NOT NULL DEFAULT 'new',
    "city" TEXT NOT NULL DEFAULT 'الدار البيضاء',
    "region" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "images" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'active',
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPromoted" BOOLEAN NOT NULL DEFAULT false,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "negotiation" BOOLEAN NOT NULL DEFAULT true,
    "delivery" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profileId" TEXT NOT NULL,
    CONSTRAINT "Listing_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Listing_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "ListingSave" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ListingSave_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "WalletTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'SC',
    "status" TEXT NOT NULL DEFAULT 'completed',
    "source" TEXT,
    "destination" TEXT,
    "referenceId" TEXT,
    "metadata" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WalletTransaction_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "SupportEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supporterId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SupportEvent_supporterId_fkey" FOREIGN KEY ("supporterId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SupportEvent_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Auction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startPrice" DOUBLE PRECISION NOT NULL,
    "currentBid" DOUBLE PRECISION NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "images" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "CharityCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "goalAmount" DOUBLE PRECISION NOT NULL,
    "collectedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "urgency" TEXT NOT NULL DEFAULT 'medium',
    "images" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "FeatureFlag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL UNIQUE,
    "value" BOOLEAN NOT NULL DEFAULT false,
    "label" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "Listing_categoryId_idx" ON "Listing"("categoryId");
CREATE INDEX IF NOT EXISTS "Listing_profileId_idx" ON "Listing"("profileId");
CREATE INDEX IF NOT EXISTS "Listing_status_idx" ON "Listing"("status");
CREATE INDEX IF NOT EXISTS "Listing_city_idx" ON "Listing"("city");
CREATE INDEX IF NOT EXISTS "Profile_city_idx" ON "Profile"("city");
CREATE INDEX IF NOT EXISTS "Profile_role_idx" ON "Profile"("role");
`;

export async function POST() {
  try {
    // 1. Create tables
    console.log('Creating tables...');
    const statements = CREATE_TABLES_SQL.split(';').filter(s => s.trim());
    for (const sql of statements) {
      await db.$executeRawUnsafe(sql);
    }
    console.log('Tables created successfully');

    // 2. Check if data already exists
    const count = await db.profile.count();
    if (count > 0) {
      return NextResponse.json({ success: true, message: 'Database already set up', tables: 10, profiles: count });
    }

    // 3. Seed categories
    const { categories, listings } = await import('@/lib/seed-data');
    console.log('Seeding categories...');
    for (const cat of categories) {
      await db.category.upsert({
        where: { id: cat.id },
        update: { nameAr: cat.nameAr, nameFr: cat.nameFr, nameEn: cat.nameEn, icon: cat.icon, slug: cat.slug, order: cat.order },
        create: { id: cat.id, nameAr: cat.nameAr, nameFr: cat.nameFr, nameEn: cat.nameEn, icon: cat.icon, slug: cat.slug, order: cat.order },
      });
    }

    // 4. Seed profiles
    console.log('Seeding profiles...');
    const profiles = [
      { id: 'u-1', userId: 'u-1', username: 'youssef_benali', displayName: 'يوسف بنعلي', email: 'youssef@sultan.ma', phone: '+212661234567', city: 'الدار البيضاء', role: 'super_admin', isVerified: true, isBusiness: true, trustScore: 92, reputationScore: 88, sultanPower: 1500, coinsBalance: 2500, isSultanSupported: false, isRising: true, isFeatured: true, followerCount: 245, followingCount: 89, listingCount: 12, saleCount: 8, supportGivenCount: 15, supportReceivedCount: 32 },
      { id: 'u-2', userId: 'u-2', username: 'fatima_aloui', displayName: 'فاطمة الزهراء العلوي', email: 'fatima@sultan.ma', phone: '+212662345678', city: 'الرباط', role: 'admin', isVerified: true, isBusiness: false, trustScore: 88, reputationScore: 85, sultanPower: 1200, coinsBalance: 1800, isSultanSupported: true, isRising: false, isFeatured: true, followerCount: 189, followingCount: 67, listingCount: 8, saleCount: 5, supportGivenCount: 22, supportReceivedCount: 18 },
      { id: 'u-3', userId: 'u-3', username: 'karim_mansouri', displayName: 'كريم المنصوري', email: 'karim@sultan.ma', phone: '+212663456789', city: 'مراكش', role: 'user', isVerified: false, isBusiness: false, trustScore: 65, reputationScore: 60, sultanPower: 400, coinsBalance: 500, isSultanSupported: false, isRising: true, isFeatured: false, followerCount: 45, followingCount: 23, listingCount: 5, saleCount: 2, supportGivenCount: 3, supportReceivedCount: 7 },
      { id: 'u-4', userId: 'u-4', username: 'amina_bouzid', displayName: 'أمينة بوزيد', email: 'amina@sultan.ma', phone: '+212664567890', city: 'فاس', role: 'moderator', isVerified: true, isBusiness: true, trustScore: 95, reputationScore: 93, sultanPower: 2000, coinsBalance: 3500, isSultanSupported: false, isRising: false, isFeatured: true, followerCount: 312, followingCount: 45, listingCount: 15, saleCount: 12, supportGivenCount: 28, supportReceivedCount: 45 },
      { id: 'u-5', userId: 'u-5', username: 'rachid_fassi', displayName: 'رشيد الفاسي', email: 'rachid@sultan.ma', phone: '+212665678901', city: 'طنجة', role: 'user', isVerified: true, isBusiness: false, trustScore: 78, reputationScore: 72, sultanPower: 600, coinsBalance: 900, isSultanSupported: false, isRising: true, isFeatured: false, followerCount: 67, followingCount: 34, listingCount: 6, saleCount: 3, supportGivenCount: 8, supportReceivedCount: 12 },
      { id: 'u-6', userId: 'u-6', username: 'sara_benhaddou', displayName: 'سارة بنحدو', email: 'sara@sultan.ma', phone: '+212666789012', city: 'أكادير', role: 'user', isVerified: false, isBusiness: false, trustScore: 55, reputationScore: 50, sultanPower: 200, coinsBalance: 150, isSultanSupported: false, isRising: false, isFeatured: false, followerCount: 23, followingCount: 12, listingCount: 3, saleCount: 1, supportGivenCount: 1, supportReceivedCount: 4 },
      { id: 'u-7', userId: 'u-7', username: 'mohamed_idrissi', displayName: 'محمد الإدريسي', email: 'mohamed@sultan.ma', phone: '+212667890123', city: 'الدار البيضاء', role: 'admin', isVerified: true, isBusiness: true, trustScore: 90, reputationScore: 87, sultanPower: 1800, coinsBalance: 2800, isSultanSupported: true, isRising: false, isFeatured: true, followerCount: 267, followingCount: 56, listingCount: 10, saleCount: 7, supportGivenCount: 19, supportReceivedCount: 35 },
      { id: 'u-8', userId: 'u-8', username: 'nora_tetouani', displayName: 'نورة التطوانية', email: 'nora@sultan.ma', phone: '+212668901234', city: 'تطوان', role: 'user', isVerified: false, isBusiness: false, trustScore: 60, reputationScore: 55, sultanPower: 300, coinsBalance: 350, isSultanSupported: false, isRising: true, isFeatured: false, followerCount: 34, followingCount: 18, listingCount: 4, saleCount: 2, supportGivenCount: 5, supportReceivedCount: 6 },
      { id: 'u-9', userId: 'u-9', username: 'hamza_rabati', displayName: 'حمزة الرباطي', email: 'hamza@sultan.ma', phone: '+212669012345', city: 'الرباط', role: 'moderator', isVerified: true, isBusiness: false, trustScore: 82, reputationScore: 78, sultanPower: 900, coinsBalance: 1200, isSultanSupported: false, isRising: false, isFeatured: false, followerCount: 98, followingCount: 41, listingCount: 7, saleCount: 4, supportGivenCount: 12, supportReceivedCount: 15 },
      { id: 'u-10', userId: 'u-10', username: 'khadija_marrakchi', displayName: 'خديجة المراكشية', email: 'khadija@sultan.ma', phone: '+212660123456', city: 'مراكش', role: 'user', isVerified: true, isBusiness: true, trustScore: 97, reputationScore: 95, sultanPower: 2500, coinsBalance: 4200, isSultanSupported: true, isRising: false, isFeatured: true, followerCount: 456, followingCount: 78, listingCount: 18, saleCount: 14, supportGivenCount: 35, supportReceivedCount: 52 },
      { id: 'u-11', userId: 'u-11', username: 'omar_bidawi', displayName: 'عمر البيضاوي', email: 'omar@sultan.ma', phone: '+212661234000', city: 'الدار البيضاء', role: 'user', isVerified: false, isBusiness: false, trustScore: 45, reputationScore: 40, sultanPower: 100, coinsBalance: 50, isSultanSupported: false, isRising: false, isFeatured: false, followerCount: 8, followingCount: 5, listingCount: 1, saleCount: 0, supportGivenCount: 0, supportReceivedCount: 2 },
      { id: 'u-12', userId: 'u-12', username: 'layla_oujdiya', displayName: 'ليلى وجدية', email: 'layla@sultan.ma', phone: '+212662345000', city: 'الناظور', role: 'user', isVerified: true, isBusiness: false, trustScore: 86, reputationScore: 82, sultanPower: 1100, coinsBalance: 1600, isSultanSupported: false, isRising: true, isFeatured: false, followerCount: 134, followingCount: 29, listingCount: 9, saleCount: 6, supportGivenCount: 14, supportReceivedCount: 20 },
    ];
    for (const p of profiles) {
      await db.profile.upsert({ where: { id: p.id }, update: p, create: p });
    }

    // 5. Seed listings
    console.log('Seeding listings...');
    const profileIds = ['u-1','u-2','u-3','u-4','u-5','u-6','u-7','u-8','u-9','u-10','u-11','u-12'];
    let listingCount = 0;
    for (const l of listings) {
      const profileId = profileIds[(parseInt(l.id.replace('l-', '')) || 1) % 12];
      await db.listing.upsert({
        where: { id: l.id },
        update: { title: l.title, description: l.description, price: l.price, categoryId: l.categoryId, condition: l.condition, city: l.city, region: l.region || null, status: l.status, viewsCount: l.viewsCount || 0, likesCount: l.likesCount || 0, isFeatured: l.isFeatured || false, isUrgent: l.isUrgent || false, negotiation: l.negotiation !== false, delivery: l.delivery || false, profileId },
        create: { id: l.id, title: l.title, description: l.description, price: l.price, categoryId: l.categoryId, condition: l.condition, city: l.city, region: l.region || null, status: l.status, viewsCount: l.viewsCount || 0, likesCount: l.likesCount || 0, isFeatured: l.isFeatured || false, isUrgent: l.isUrgent || false, negotiation: l.negotiation !== false, delivery: l.delivery || false, profileId },
      });
      listingCount++;
    }

    // 6. Seed auctions
    console.log('Seeding auctions...');
    const auctions = [
      { id: 'auc-1', title: 'سيارة مرسيدس E-كلاس 2023', description: 'مرسيدس بنز E-كلاس موديل 2023 لون أبيض لؤلؤي، قطعت 15,000 كم.', startPrice: 450000, currentBid: 520000, endsAt: '2026-09-15T18:00:00Z', status: 'active' },
      { id: 'auc-2', title: 'أرض سكنية 500م² في تمارة', description: 'أرض سكنية مساحتها 500 متر مربع في حي هادئ بتمارة.', startPrice: 800000, currentBid: 950000, endsAt: '2026-09-20T20:00:00Z', status: 'active' },
      { id: 'auc-3', title: 'مجموعة ساعات رولكس نادرة', description: 'مجموعة 3 ساعات رولكس أصلية مع صناديقها وشهادات الضمان.', startPrice: 120000, currentBid: 185000, endsAt: '2026-09-10T22:00:00Z', status: 'active' },
      { id: 'auc-4', title: 'شقة فاخرة 3 غرف بالدار البيضاء', description: 'شقة 3 غرف وصالون في عمارة حديثة بالمعاريف.', startPrice: 950000, currentBid: 1100000, endsAt: '2026-09-18T16:00:00Z', status: 'active' },
      { id: 'auc-5', title: 'دراجة نارية BMW R1250GS', description: 'بي إم دبليو R1250GS أدفانتشر 2024، قطعت 5,200 كم.', startPrice: 135000, currentBid: 142000, endsAt: '2026-09-12T14:00:00Z', status: 'active' },
    ];
    for (const a of auctions) {
      await db.auction.upsert({ where: { id: a.id }, update: a, create: a });
    }

    // 7. Seed charity
    console.log('Seeding charity cases...');
    const charityCases = [
      { id: 'ch-1', title: 'كفالة يتيم من فاس', description: 'كفالة يتيم من فاس لتغطية تكاليف التعليم والسكن لمدة سنة.', goalAmount: 15000, collectedAmount: 11200, urgency: 'high', status: 'active' },
      { id: 'ch-2', title: 'بناء سقاية ماء في زاكورة', description: 'بناء سقاية ماء لمواجهة الجفاف. يستفيد منها أكثر من 200 عائلة.', goalAmount: 50000, collectedAmount: 34500, urgency: 'high', status: 'active' },
      { id: 'ch-3', title: 'تجهيز مدرسة قرية أمازيغية', description: 'تجهيز مدرسة ابتدائية في جبال الأطلس بالكتب والأثاث.', goalAmount: 25000, collectedAmount: 18900, urgency: 'medium', status: 'active' },
      { id: 'ch-4', title: 'مساعدة عائلات متضررة من الزلازل', description: 'مساعدات مادية وعينية للعائلات المتضررة من زلزال الحوز.', goalAmount: 100000, collectedAmount: 87500, urgency: 'high', status: 'active' },
    ];
    for (const c of charityCases) {
      await db.charityCase.upsert({ where: { id: c.id }, update: c, create: c });
    }

    // 8. Seed feature flags
    console.log('Seeding feature flags...');
    const flags = [
      { key: 'admin_panel', value: true, label: 'لوحة تحكم المدير', category: 'admin' },
      { key: 'auctions_enabled', value: true, label: 'المزادات', category: 'features' },
      { key: 'charity_enabled', value: true, label: 'التضامن', category: 'features' },
      { key: 'ai_chat', value: false, label: 'المساعد الذكي', category: 'ai' },
      { key: 'multi_language', value: true, label: 'تعدد اللغات', category: 'features' },
      { key: 'push_notifications', value: true, label: 'الإشعارات', category: 'features' },
      { key: 'dark_mode', value: true, label: 'الوضع الليلي', category: 'ui' },
      { key: 'verified_badge', value: true, label: 'شارة التوثيق', category: 'features' },
    ];
    for (const f of flags) {
      await db.featureFlag.upsert({ where: { key: f.key }, update: { value: f.value, label: f.label }, create: f });
    }

    const finalCount = await db.profile.count();
    return NextResponse.json({
      success: true,
      message: 'Database setup complete',
      tables: 10,
      profiles: finalCount,
      listings: listingCount,
      categories: categories.length,
      auctions: auctions.length,
      charityCases: charityCases.length,
      featureFlags: flags.length,
    });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
  }
}

export async function GET() {
  try {
    const count = await db.profile.count();
    const lcount = await db.listing.count();
    const ccount = await db.category.count();
    return NextResponse.json({ database: 'connected', profiles: count, listings: lcount, categories: ccount });
  } catch (error: any) {
    return NextResponse.json({ database: 'error', error: error.message }, { status: 503 });
  }
}
