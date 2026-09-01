import { PrismaClient } from '@prisma/client'
import { categories, listings, cities } from '../src/lib/seed-data'

const prisma = new PrismaClient()

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
]

// Profile ID mapping for listings
const profileIds = ['u-1','u-2','u-3','u-4','u-5','u-6','u-7','u-8','u-9','u-10','u-11','u-12']
const getProfileId = (i: number) => profileIds[(i - 1) % profileIds.length]

async function main() {
  console.log('Seeding database...')

  // 1. Seed categories
  console.log('Creating categories...')
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: { nameAr: cat.nameAr, nameFr: cat.nameFr, nameEn: cat.nameEn, icon: cat.icon, slug: cat.slug, order: cat.order },
      create: { id: cat.id, nameAr: cat.nameAr, nameFr: cat.nameFr, nameEn: cat.nameEn, icon: cat.icon, slug: cat.slug, order: cat.order },
    })
  }
  console.log(`Created ${categories.length} categories`)

  // 2. Seed profiles
  console.log('Creating profiles...')
  for (const p of profiles) {
    await prisma.profile.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    })
  }
  console.log(`Created ${profiles.length} profiles`)

  // 3. Seed listings
  console.log('Creating listings...')
  let count = 0
  for (const l of listings) {
    const profileId = getProfileId(parseInt(l.id.replace('l-', '')) || 1)
    await prisma.listing.upsert({
      where: { id: l.id },
      update: {
        title: l.title,
        description: l.description,
        price: l.price,
        categoryId: l.categoryId,
        condition: l.condition,
        city: l.city,
        region: l.region || null,
        status: l.status,
        viewsCount: l.viewsCount || 0,
        likesCount: l.likesCount || 0,
        isFeatured: l.isFeatured || false,
        isPromoted: l.isPromoted || false,
        isUrgent: l.isUrgent || false,
        negotiation: l.negotiation !== false,
        delivery: l.delivery || false,
        profileId,
      },
      create: {
        id: l.id,
        title: l.title,
        description: l.description,
        price: l.price,
        categoryId: l.categoryId,
        condition: l.condition,
        city: l.city,
        region: l.region || null,
        status: l.status,
        viewsCount: l.viewsCount || 0,
        likesCount: l.likesCount || 0,
        isFeatured: l.isFeatured || false,
        isPromoted: l.isPromoted || false,
        isUrgent: l.isUrgent || false,
        negotiation: l.negotiation !== false,
        delivery: l.delivery || false,
        profileId,
      },
    })
    count++
  }
  console.log(`Created ${count} listings`)

  // 4. Seed auctions
  console.log('Creating auctions...')
  const auctionData = [
    { id: 'auc-1', title: 'سيارة مرسيدس E-كلاس 2023', description: 'مرسيدس بنز E-كلاس موديل 2023 لون أبيض لؤلؤي، قطعت 15,000 كم. بحالة ممتازة مع صيانة كاملة من الوكالة.', startPrice: 450000, currentBid: 520000, endsAt: '2026-09-15T18:00:00Z', status: 'active', images: '[]' },
    { id: 'auc-2', title: 'أرض سكنية 500م² في تمارة', description: 'أرض سكنية مساحتها 500 متر مربع في حي هادئ بتمارة، قريبة من جميع المرافق. وثائق قانونية كاملة.', startPrice: 800000, currentBid: 950000, endsAt: '2026-09-20T20:00:00Z', status: 'active', images: '[]' },
    { id: 'auc-3', title: 'مجموعة ساعات رولكس نادرة', description: 'مجموعة 3 ساعات رولكس أصلية: سوب مارينر، ديتونا، ودايت جاست. جميعها مع صناديقها الأصلية وشهادات الضمان.', startPrice: 120000, currentBid: 185000, endsAt: '2026-09-10T22:00:00Z', status: 'active', images: '[]' },
    { id: 'auc-4', title: 'شقة فاخرة 3 غرف بالدار البيضاء', description: 'شقة 3 غرف نوم وصالون كبير في عمارة حديثة بالمعاريف. تشطيب فاخر مع تراس وإطلالة على المحيط.', startPrice: 950000, currentBid: 1100000, endsAt: '2026-09-18T16:00:00Z', status: 'active', images: '[]' },
    { id: 'auc-5', title: 'دراجة نارية BMW R1250GS', description: 'بي إم دبليو R1250GS أدفانتشر موديل 2024، قطعت 5,200 كم. مع صندوقين جانبيين وخزانة خلفية أصلية.', startPrice: 135000, currentBid: 142000, endsAt: '2026-09-12T14:00:00Z', status: 'active', images: '[]' },
  ]

  for (const a of auctionData) {
    await prisma.auction.upsert({
      where: { id: a.id },
      update: a,
      create: a,
    })
  }
  console.log(`Created ${auctionData.length} auctions`)

  // 5. Seed charity cases
  console.log('Creating charity cases...')
  const charityData = [
    { id: 'ch-1', title: 'كفالة يتيم من فاس', description: 'كفالة يتيم من مدينة فاس لتغطية تكاليف التعليم والسكن والطعام لمدة سنة كاملة. المبلغ يغطي كل الاحتياجات الأساسية.', goalAmount: 15000, collectedAmount: 11200, urgency: 'high', images: '[]', status: 'active' },
    { id: 'ch-2', title: 'بناء سقاية ماء في أقليم زاكورة', description: 'بناء سقاية ماء لمواجهة الجفاف في منطقة زاكورة. المشروع يستفيد منه أكثر من 200 عائلة.', goalAmount: 50000, collectedAmount: 34500, urgency: 'high', images: '[]', status: 'active' },
    { id: 'ch-3', title: 'تجهيز مدرسة قرية أمازيغية', description: 'تجهيز مدرسة ابتدائية في جبال الأطلس بالكتب والأدوات والأثاث. المدرسة تخدم 3 قرى مجاورة.', goalAmount: 25000, collectedAmount: 18900, urgency: 'medium', images: '[]', status: 'active' },
    { id: 'ch-4', title: 'مساعدة عائلات متضررة من الزلازل', description: 'تقديم مساعدات مادية وعينية للعائلات المتضررة من زلزال الحوز. تشمل مواد البناء والطعام والملابس.', goalAmount: 100000, collectedAmount: 87500, urgency: 'high', images: '[]', status: 'active' },
  ]

  for (const c of charityData) {
    await prisma.charityCase.upsert({
      where: { id: c.id },
      update: c,
      create: c,
    })
  }
  console.log(`Created ${charityData.length} charity cases`)

  // 6. Seed feature flags
  console.log('Creating feature flags...')
  const flags = [
    { key: 'admin_panel', value: true, label: 'لوحة تحكم المدير', category: 'admin' },
    { key: 'auctions_enabled', value: true, label: 'المزادات', category: 'features' },
    { key: 'charity_enabled', value: true, label: 'التضامن', category: 'features' },
    { key: 'ai_chat', value: false, label: 'المساعد الذكي', category: 'ai' },
    { key: 'multi_language', value: true, label: 'تعدد اللغات', category: 'features' },
    { key: 'push_notifications', value: true, label: 'الإشعارات', category: 'features' },
    { key: 'dark_mode', value: true, label: 'الوضع الليلي', category: 'ui' },
    { key: 'verified_badge', value: true, label: 'شارة التوثيق', category: 'features' },
  ]

  for (const f of flags) {
    await prisma.featureFlag.upsert({
      where: { key: f.key },
      update: { value: f.value, label: f.label },
      create: f,
    })
  }
  console.log(`Created ${flags.length} feature flags`)

  console.log('\nDatabase seeded successfully!')
  console.log(`  - ${categories.length} categories`)
  console.log(`  - ${profiles.length} profiles`)
  console.log(`  - ${count} listings`)
  console.log(`  - ${auctionData.length} auctions`)
  console.log(`  - ${charityData.length} charity cases`)
  console.log(`  - ${flags.length} feature flags`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
