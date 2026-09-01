import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const runtime = 'edge'

const categories = [
  { id: 'c-marketplace', nameAr: 'السوق', nameFr: 'Marketplace', nameEn: 'Marketplace', icon: 'Store', slug: 'marketplace', order: 0, isActive: true },
  { id: 'c-electronics', nameAr: 'إلكترونيات', nameFr: 'Électronique', nameEn: 'Electronics', icon: 'Smartphone', slug: 'electronics', order: 1, isActive: true },
  { id: 'c-furniture', nameAr: 'أثاث', nameFr: 'Meubles', nameEn: 'Furniture', icon: 'Armchair', slug: 'furniture', order: 2, isActive: true },
  { id: 'c-fashion', nameAr: 'أزياء', nameFr: 'Mode', nameEn: 'Fashion', icon: 'Shirt', slug: 'fashion', order: 3, isActive: true },
  { id: 'c-animals', nameAr: 'حيوانات', nameFr: 'Animaux', nameEn: 'Animals', icon: 'PawPrint', slug: 'animals', order: 4, isActive: true },
  { id: 'c-hobbies', nameAr: 'هوايات', nameFr: 'Loisirs', nameEn: 'Hobbies', icon: 'Gamepad2', slug: 'hobbies', order: 5, isActive: true },
  { id: 'c-motors', nameAr: 'السيارات', nameFr: 'Véhicules', nameEn: 'Motors', icon: 'Car', slug: 'motors', order: 6, isActive: true },
  { id: 'c-realestate', nameAr: 'العقارات', nameFr: 'Immobilier', nameEn: 'Real Estate', icon: 'Building2', slug: 'realestate', order: 7, isActive: true },
  { id: 'c-food', nameAr: 'الطعام', nameFr: 'Alimentation', nameEn: 'Food', icon: 'UtensilsCrossed', slug: 'food', order: 8, isActive: true },
  { id: 'c-services', nameAr: 'الخدمات', nameFr: 'Services', nameEn: 'Services', icon: 'Wrench', slug: 'services', order: 9, isActive: true },
  { id: 'c-jobs', nameAr: 'الوظائف', nameFr: 'Emploi', nameEn: 'Jobs', icon: 'Briefcase', slug: 'jobs', order: 10, isActive: true },
  { id: 'c-auctions', nameAr: 'المزادات', nameFr: 'Enchères', nameEn: 'Auctions', icon: 'Gavel', slug: 'auctions', order: 11, isActive: true },
  { id: 'c-charity', nameAr: 'التضامن', nameFr: 'Solidarité', nameEn: 'Charity', icon: 'Heart', slug: 'charity', order: 12, isActive: true },
  { id: 'c-news', nameAr: 'الأخبار', nameFr: 'Actualités', nameEn: 'News', icon: 'Newspaper', slug: 'news', order: 13, isActive: true },
  { id: 'c-zawaj', nameAr: 'الزواج والتعارف', nameFr: 'Mariage', nameEn: 'Zawaj & Taaruf', icon: 'HeartHandshake', slug: 'zawaj', order: 14, isActive: true },
  { id: 'c-social', nameAr: 'السوشيال', nameFr: 'Social', nameEn: 'Social', icon: 'Users', slug: 'social', order: 15, isActive: true },
]

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

const profileIds = profiles.map(p => p.id)
const getProfileId = (i: number) => profileIds[(i - 1) % profileIds.length]

// Minimal listings data (25 key listings for quick seed)
const listings = [
  { id: 'l-1', title: 'آيفون 15 برو ماكس 256GB', description: 'هاتف آيفون 15 برو ماكس لون تيتانيوم الطبيعي، 256 غيغابايت، حالة ممتازة مع جميع الملحقات.', price: 12400, categoryId: 'c-electronics', condition: 'likeNew', city: 'الدار البيضاء', region: 'الدار البيضاء-سطات', status: 'active', viewsCount: 342, likesCount: 28, isFeatured: true, isUrgent: false, negotiation: true, delivery: true, profileId: 'u-1' },
  { id: 'l-2', title: 'سامسونغ جالكسي S24 Ultra', description: 'جالكسي S24 Ultra 512 غيغابايت لون تيتانيوم رمادي مع قلم S Pen. جديد لم يُفتح.', price: 13900, categoryId: 'c-electronics', condition: 'new', city: 'الدار البيضاء', region: 'الدار البيضاء-سطات', status: 'active', viewsCount: 567, likesCount: 45, isFeatured: true, isUrgent: false, negotiation: false, delivery: true, profileId: 'u-7' },
  { id: 'l-3', title: 'لابتوب ماك بوك برو M3', description: 'ماك بوك برو 14 بوصة M3 Pro، 18GB RAM، 512GB SSD. مناسب للمصممين والمطورين.', price: 18500, categoryId: 'c-electronics', condition: 'likeNew', city: 'الرباط', region: 'الرباط-سلا-القنيطرة', status: 'active', viewsCount: 289, likesCount: 19, isFeatured: false, isUrgent: false, negotiation: true, delivery: true, profileId: 'u-2' },
  { id: 'l-4', title: 'شاشة جيمنج 27 بوصة 165Hz', description: 'شاشة LG UltraGear 27 بوصة QHD 165Hz زمن استجابة 1ms HDR400.', price: 4200, categoryId: 'c-electronics', condition: 'new', city: 'الدار البيضاء', region: 'الدار البيضاء-سطات', status: 'active', viewsCount: 198, likesCount: 14, isFeatured: false, isUrgent: false, negotiation: true, delivery: false, profileId: 'u-5' },
  { id: 'l-5', title: 'بلايستيشن 5 مع ألعاب', description: 'بلايستيشن 5 نسخة الديسك مع 3 ألعاب ووحدة تحكم إضافية.', price: 4800, categoryId: 'c-electronics', condition: 'used', city: 'مراكش', region: 'مراكش-آسفي', status: 'active', viewsCount: 456, likesCount: 38, isFeatured: true, isUrgent: true, negotiation: true, delivery: true, profileId: 'u-3' },
  { id: 'l-6', title: 'سماعات AirPods Pro 2', description: 'سماعات آبل AirPods Pro الجيل الثاني مع USB-C وإلغاء الضوضاء.', price: 2800, categoryId: 'c-electronics', condition: 'new', city: 'فاس', region: 'فاس-مكناس', status: 'active', viewsCount: 234, likesCount: 16, isFeatured: false, isUrgent: false, negotiation: false, delivery: true, profileId: 'u-4' },
  { id: 'l-7', title: 'كاميرا سوني A7 IV', description: 'كاميرا ميرورلس سوني A7 IV بدقة 33 ميغابكسل مع عدسة 28-70mm.', price: 22000, categoryId: 'c-electronics', condition: 'likeNew', city: 'الدار البيضاء', region: 'الدار البيضاء-سطات', status: 'active', viewsCount: 156, likesCount: 11, isFeatured: false, isUrgent: false, negotiation: true, delivery: false, profileId: 'u-1' },
  { id: 'l-8', title: 'قفطان مغربي أصلي مطرز', description: 'قفطان نسائي فاخر من القماش الحريري مع تطريز يدوي بالخيوط الذهبية.', price: 4500, categoryId: 'c-fashion', condition: 'new', city: 'فاس', region: 'فاس-مكناس', status: 'active', viewsCount: 567, likesCount: 48, isFeatured: true, isUrgent: false, negotiation: true, delivery: true, profileId: 'u-4' },
  { id: 'l-9', title: 'حذاء نايكي اير ماكس 90', description: 'حذاء رياضي نايكي اير ماكس 90 كلاسيكي لون أبيض/رمادي مقاس 43.', price: 1200, categoryId: 'c-fashion', condition: 'new', city: 'الدار البيضاء', region: 'الدار البيضاء-سطات', status: 'active', viewsCount: 345, likesCount: 29, isFeatured: false, isUrgent: false, negotiation: true, delivery: true, profileId: 'u-7' },
  { id: 'l-10', title: 'طاولة سفرة مغربية صناعة يدوية', description: 'طاولة سفرة من خشب الأرز المغربي منحوتة يدويا بنقوش زليج أصيلة.', price: 12000, categoryId: 'c-furniture', condition: 'new', city: 'مراكش', region: 'مراكش-آسفي', status: 'active', viewsCount: 389, likesCount: 32, isFeatured: true, isUrgent: false, negotiation: true, delivery: false, profileId: 'u-10' },
  { id: 'l-11', title: 'أريكة حديثة 3 مقاعد', description: 'أريكة عصرية من القماش المخمل الرمادي مع وسائد إضافية.', price: 6500, categoryId: 'c-furniture', condition: 'new', city: 'الدار البيضاء', region: 'الدار البيضاء-سطات', status: 'active', viewsCount: 234, likesCount: 18, isFeatured: false, isUrgent: false, negotiation: true, delivery: true, profileId: 'u-1' },
  { id: 'l-12', title: 'مطبخ مودرن جاهز للتركيب', description: 'مطبخ مودرن كامل مع رخام كوارتز وأجهزة مدمجة.', price: 32000, categoryId: 'c-furniture', condition: 'new', city: 'الدار البيضاء', region: 'الدار البيضاء-سطات', status: 'active', viewsCount: 445, likesCount: 36, isFeatured: true, isUrgent: false, negotiation: true, delivery: false, profileId: 'u-7' },
  { id: 'l-13', title: 'دراجة نارية هوندا CB500X', description: 'هوندا CB500X موديل 2024 لون أسود 500 سي سي قطعت 3200 كم.', price: 52000, categoryId: 'c-motors', condition: 'likeNew', city: 'طنجة', region: 'طنجة-تطوان-الحسيمة', status: 'active', viewsCount: 423, likesCount: 34, isFeatured: true, isUrgent: false, negotiation: true, delivery: false, profileId: 'u-5' },
  { id: 'l-14', title: 'مرسيدس بنز C-كلاس 2022', description: 'مرسيدس C200 موديل 2022 لون فضي قطعت 35000 كم صيانة وكالة.', price: 385000, categoryId: 'c-motors', condition: 'used', city: 'الدار البيضاء', region: 'الدار البيضاء-سطات', status: 'active', viewsCount: 678, likesCount: 52, isFeatured: true, isUrgent: false, negotiation: true, delivery: false, profileId: 'u-1' },
  { id: 'l-15', title: 'شقة 3 غرف بالمعاريف', description: 'شقة 85 م² 3 غرف وصالون في عمارة حديثة بالمعاريف.', price: 850000, categoryId: 'c-realestate', condition: 'new', city: 'الدار البيضاء', region: 'الدار البيضاء-سطات', status: 'active', viewsCount: 534, likesCount: 41, isFeatured: true, isUrgent: false, negotiation: true, delivery: false, profileId: 'u-7' },
  { id: 'l-16', title: 'فيلا بسيدي بوسعيد 4 غرف', description: 'فيلا 250 م² مع حديقة ومسبح في حي هادئ بسيد بوسعيد.', price: 2500000, categoryId: 'c-realestate', condition: 'new', city: 'طنجة', region: 'طنجة-تطوان-الحسيمة', status: 'active', viewsCount: 312, likesCount: 28, isFeatured: false, isUrgent: false, negotiation: true, delivery: false, profileId: 'u-5' },
  { id: 'l-17', title: 'هواية طائرة درون DJI Mini', description: 'درون DJI Mini 4 Pro مع كاميرا 4K HDR ومستشعرات تجنب العوائق.', price: 8500, categoryId: 'c-hobbies', condition: 'new', city: 'مراكش', region: 'مراكش-آسفي', status: 'active', viewsCount: 234, likesCount: 19, isFeatured: false, isUrgent: false, negotiation: false, delivery: true, profileId: 'u-3' },
  { id: 'l-18', title: 'دراجة جبلية Trek 2024', description: 'دراجة جبلية Trek Marlin 7 موديل 2024 مقاس L مع معدات شيمانو.', price: 7500, categoryId: 'c-hobbies', condition: 'new', city: 'أكادير', region: 'سوس-ماسة', status: 'active', viewsCount: 167, likesCount: 14, isFeatured: false, isUrgent: false, negotiation: true, delivery: true, profileId: 'u-6' },
  { id: 'l-19', title: 'قطط شيرواة صغار للت adoption', description: '3 قطط شيرواة صغار عمر 2 شهر مطعمين ومفحوصين طبيا.', price: 0, categoryId: 'c-animals', condition: 'new', city: 'الدار البيضاء', region: 'الدار البيضاء-سطات', status: 'active', viewsCount: 890, likesCount: 67, isFeatured: true, isUrgent: false, negotiation: false, delivery: false, profileId: 'u-11' },
  { id: 'l-20', title: 'كلب لابرادور للبيع', description: 'كلب لابرادور ريتريفر ذكر عمر 8 أشهر مطعم ومفحوص.', price: 3000, categoryId: 'c-animals', condition: 'new', city: 'الرباط', region: 'الرباط-سلا-القنيطرة', status: 'active', viewsCount: 345, likesCount: 23, isFeatured: false, isUrgent: false, negotiation: true, delivery: false, profileId: 'u-9' },
  { id: 'l-21', title: 'خدمة تصميم جرافيك احترافي', description: 'مصمم جرافيك محترف مع 10 سنوات خبرة. هوية بصرية وسوشيال ميديا.', price: 500, categoryId: 'c-services', condition: 'new', city: 'الدار البيضاء', region: 'الدار البيضاء-سطات', status: 'active', viewsCount: 567, likesCount: 42, isFeatured: true, isUrgent: false, negotiation: true, delivery: true, profileId: 'u-1' },
  { id: 'l-22', title: 'مطلوب مطور React Native', description: 'شركة ناشئة تبحث عن مطور React Native للعمل عن بعد.', price: 15000, categoryId: 'c-jobs', condition: 'new', city: 'الدار البيضاء', region: 'الدار البيضاء-سطات', status: 'active', viewsCount: 789, likesCount: 56, isFeatured: true, isUrgent: true, negotiation: false, delivery: false, profileId: 'u-7' },
  { id: 'l-23', title: 'طاجين برياد باللحم والمشمش', description: 'طاجين تقليدي مطبوخ على الحطب مع لحم الغنم والمشمش المجفف.', price: 120, categoryId: 'c-food', condition: 'new', city: 'مراكش', region: 'مراكش-آسفي', status: 'active', viewsCount: 234, likesCount: 18, isFeatured: false, isUrgent: false, negotiation: false, delivery: true, profileId: 'u-10' },
  { id: 'l-24', title: 'حلويات مغربية فاخرة للمناسبات', description: 'صندوق حلويات مغربية متنوعة 2 كغ مع شريعة وكعب غزال.', price: 350, categoryId: 'c-food', condition: 'new', city: 'فاس', region: 'فاس-مكناس', status: 'active', viewsCount: 345, likesCount: 27, isFeatured: false, isUrgent: false, negotiation: true, delivery: true, profileId: 'u-4' },
  { id: 'l-25', title: 'iPhone 14 Pro Max 128GB', description: 'آيفون 14 برو ماكس 128 غيغابايت لون أسود فضي بحالة ممتازة.', price: 9800, categoryId: 'c-electronics', condition: 'used', city: 'الرباط', region: 'الرباط-سلا-القنيطرة', status: 'active', viewsCount: 412, likesCount: 33, isFeatured: false, isUrgent: false, negotiation: true, delivery: true, profileId: 'u-2' },
]

const auctions = [
  { id: 'auc-1', title: 'سيارة مرسيدس E-كلاس 2023', description: 'مرسيدس بنز E-كلاس موديل 2023 لون أبيض لؤلؤي قطعت 15000 كم.', startPrice: 450000, currentBid: 520000, endsAt: '2026-09-15T18:00:00Z', status: 'active', images: '[]' },
  { id: 'auc-2', title: 'أرض سكنية 500م² في تمارة', description: 'أرض سكنية 500 م² في حي هادئ بتمارة قريبة من المرافق.', startPrice: 800000, currentBid: 950000, endsAt: '2026-09-20T20:00:00Z', status: 'active', images: '[]' },
  { id: 'auc-3', title: 'مجموعة ساعات رولكس نادرة', description: 'مجموعة 3 ساعات رولكس أصلية: سوب مارينر ديتونا ودايت جاست.', startPrice: 120000, currentBid: 185000, endsAt: '2026-09-10T22:00:00Z', status: 'active', images: '[]' },
  { id: 'auc-4', title: 'شقة فاخرة 3 غرف بالدار البيضاء', description: 'شقة 3 غرف في المعاريف تشطيب فاخر مع تراس وإطلالة.', startPrice: 950000, currentBid: 1100000, endsAt: '2026-09-18T16:00:00Z', status: 'active', images: '[]' },
  { id: 'auc-5', title: 'دراجة نارية BMW R1250GS', description: 'بي إم دبليو R1250GS أدفانتشر 2024 قطعت 5200 كم.', startPrice: 135000, currentBid: 142000, endsAt: '2026-09-12T14:00:00Z', status: 'active', images: '[]' },
]

const charityCases = [
  { id: 'ch-1', title: 'كفالة يتيم من فاس', description: 'كفالة يتيم من مدينة فاس لتغطية تكاليف التعليم والسكن لمدة سنة.', goalAmount: 15000, collectedAmount: 11200, urgency: 'high', images: '[]', status: 'active' },
  { id: 'ch-2', title: 'بناء سقاية ماء في زاكورة', description: 'بناء سقاية ماء لمواجهة الجفاف في زاكورة يستفيد منه 200 عائلة.', goalAmount: 50000, collectedAmount: 34500, urgency: 'high', images: '[]', status: 'active' },
  { id: 'ch-3', title: 'تجهيز مدرسة قرية أمازيغية', description: 'تجهيز مدرسة ابتدائية في الأطلس بالكتب والأدوات والأثاث.', goalAmount: 25000, collectedAmount: 18900, urgency: 'medium', images: '[]', status: 'active' },
  { id: 'ch-4', title: 'مساعدة عائلات متضررة من الزلازل', description: 'مساعدات مادية وعينية للعائلات المتضررة من زلزال الحوز.', goalAmount: 100000, collectedAmount: 87500, urgency: 'high', images: '[]', status: 'active' },
]

const featureFlags = [
  { key: 'admin_panel', value: true, label: 'لوحة تحكم المدير', category: 'admin' },
  { key: 'auctions_enabled', value: true, label: 'المزادات', category: 'features' },
  { key: 'charity_enabled', value: true, label: 'التضامن', category: 'features' },
  { key: 'ai_chat', value: false, label: 'المساعد الذكي', category: 'ai' },
  { key: 'multi_language', value: true, label: 'تعدد اللغات', category: 'features' },
  { key: 'push_notifications', value: true, label: 'الإشعارات', category: 'features' },
  { key: 'dark_mode', value: true, label: 'الوضع الليلي', category: 'ui' },
  { key: 'verified_badge', value: true, label: 'شارة التوثيق', category: 'features' },
]

export async function GET() {
  try {
    const results: Record<string, any> = {}

    // 1. Check if already seeded
    const { count: existingProfiles } = await supabase
      .from('Profile').select('id', { count: 'exact', head: true })

    if ((existingProfiles || 0) > 0) {
      return NextResponse.json({
        success: true,
        message: 'Database already seeded',
        profiles: existingProfiles,
      })
    }

    // 2. Seed Categories
    const { error: catErr } = await supabase.from('Category').upsert(categories, { onConflict: 'id' })
    if (catErr) throw new Error(`Categories: ${catErr.message}`)
    results.categories = categories.length

    // 3. Seed Profiles
    const { error: profErr } = await supabase.from('Profile').upsert(profiles, { onConflict: 'id' })
    if (profErr) throw new Error(`Profiles: ${profErr.message}`)
    results.profiles = profiles.length

    // 4. Seed Listings
    const { error: listErr } = await supabase.from('Listing').upsert(listings, { onConflict: 'id' })
    if (listErr) throw new Error(`Listings: ${listErr.message}`)
    results.listings = listings.length

    // 5. Seed Auctions
    const { error: aucErr } = await supabase.from('Auction').upsert(auctions, { onConflict: 'id' })
    if (aucErr) throw new Error(`Auctions: ${aucErr.message}`)
    results.auctions = auctions.length

    // 6. Seed Charity Cases
    const { error: charErr } = await supabase.from('CharityCase').upsert(charityCases, { onConflict: 'id' })
    if (charErr) throw new Error(`Charity: ${charErr.message}`)
    results.charity = charityCases.length

    // 7. Seed Feature Flags
    const { error: flagErr } = await supabase.from('FeatureFlag').upsert(featureFlags, { onConflict: 'key' })
    if (flagErr) throw new Error(`FeatureFlags: ${flagErr.message}`)
    results.featureFlags = featureFlags.length

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      ...results,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      hint: 'Make sure you ran supabase/tables.sql in Supabase Dashboard SQL Editor first',
    }, { status: 500 })
  }
}
