-- SULTAN Platform - Supabase Table Creation SQL
-- Run this in Supabase Dashboard > SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. Profile Table
-- ============================================
CREATE TABLE IF NOT EXISTS "Profile" (
  "id" TEXT PRIMARY KEY,
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
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 2. Category Table
-- ============================================
CREATE TABLE IF NOT EXISTS "Category" (
  "id" TEXT PRIMARY KEY,
  "nameAr" TEXT NOT NULL,
  "nameFr" TEXT NOT NULL,
  "nameEn" TEXT NOT NULL,
  "icon" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "parentId" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- ============================================
-- 3. Listing Table
-- ============================================
CREATE TABLE IF NOT EXISTS "Listing" (
  "id" TEXT PRIMARY KEY,
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
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "profileId" TEXT NOT NULL,
  CONSTRAINT "Listing_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Listing_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================
-- 4. ListingSave Table
-- ============================================
CREATE TABLE IF NOT EXISTS "ListingSave" (
  "id" TEXT PRIMARY KEY,
  "listingId" TEXT NOT NULL,
  "profileId" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "ListingSave_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "ListingSave_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================
-- 5. Message Table
-- ============================================
CREATE TABLE IF NOT EXISTS "Message" (
  "id" TEXT PRIMARY KEY,
  "content" TEXT NOT NULL,
  "senderId" TEXT NOT NULL,
  "receiverId" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================
-- 6. WalletTransaction Table
-- ============================================
CREATE TABLE IF NOT EXISTS "WalletTransaction" (
  "id" TEXT PRIMARY KEY,
  "profileId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'SC',
  "status" TEXT NOT NULL DEFAULT 'completed',
  "source" TEXT,
  "destination" TEXT,
  "referenceId" TEXT,
  "metadata" TEXT NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "WalletTransaction_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================
-- 7. SupportEvent Table
-- ============================================
CREATE TABLE IF NOT EXISTS "SupportEvent" (
  "id" TEXT PRIMARY KEY,
  "supporterId" TEXT NOT NULL,
  "recipientId" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "message" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "SupportEvent_supporterId_fkey" FOREIGN KEY ("supporterId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "SupportEvent_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================
-- 8. Auction Table
-- ============================================
CREATE TABLE IF NOT EXISTS "Auction" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "startPrice" DOUBLE PRECISION NOT NULL,
  "currentBid" DOUBLE PRECISION NOT NULL,
  "endsAt" TIMESTAMPTZ NOT NULL,
  "images" TEXT NOT NULL DEFAULT '[]',
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 9. CharityCase Table
-- ============================================
CREATE TABLE IF NOT EXISTS "CharityCase" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "goalAmount" DOUBLE PRECISION NOT NULL,
  "collectedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "urgency" TEXT NOT NULL DEFAULT 'medium',
  "images" TEXT NOT NULL DEFAULT '[]',
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 10. FeatureFlag Table
-- ============================================
CREATE TABLE IF NOT EXISTS "FeatureFlag" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "key" TEXT NOT NULL UNIQUE,
  "value" BOOLEAN NOT NULL DEFAULT false,
  "label" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 11. AuditLog Table
-- ============================================
CREATE TABLE IF NOT EXISTS "AuditLog" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "adminId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "target" TEXT,
  "oldValue" TEXT,
  "newValue" TEXT,
  "reason" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- INDEXES for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS "Listing_categoryId_idx" ON "Listing"("categoryId");
CREATE INDEX IF NOT EXISTS "Listing_profileId_idx" ON "Listing"("profileId");
CREATE INDEX IF NOT EXISTS "Listing_status_idx" ON "Listing"("status");
CREATE INDEX IF NOT EXISTS "Listing_city_idx" ON "Listing"("city");
CREATE INDEX IF NOT EXISTS "Listing_createdAt_idx" ON "Listing"("createdAt");
CREATE INDEX IF NOT EXISTS "Listing_price_idx" ON "Listing"("price");
CREATE INDEX IF NOT EXISTS "Profile_city_idx" ON "Profile"("city");
CREATE INDEX IF NOT EXISTS "Profile_role_idx" ON "Profile"("role");
CREATE INDEX IF NOT EXISTS "Profile_createdAt_idx" ON "Profile"("createdAt");
CREATE INDEX IF NOT EXISTS "Message_senderId_idx" ON "Message"("senderId");
CREATE INDEX IF NOT EXISTS "Message_receiverId_idx" ON "Message"("receiverId");
CREATE INDEX IF NOT EXISTS "Auction_status_idx" ON "Auction"("status");

-- ============================================
-- Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Listing" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ListingSave" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WalletTransaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SupportEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Auction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CharityCase" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FeatureFlag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access (bypasses RLS automatically)
-- Allow anon read access for public data
CREATE POLICY "Public profiles are viewable by everyone" ON "Profile" FOR SELECT USING (true);
CREATE POLICY "Public categories are viewable by everyone" ON "Category" FOR SELECT USING (true);
CREATE POLICY "Public listings are viewable by everyone" ON "Listing" FOR SELECT USING (true);
CREATE POLICY "Public auctions are viewable by everyone" ON "Auction" FOR SELECT USING (true);
CREATE POLICY "Public charity cases are viewable by everyone" ON "CharityCase" FOR SELECT USING (true);
CREATE POLICY "Public feature flags are viewable by everyone" ON "FeatureFlag" FOR SELECT USING (true);

-- Allow anon inserts for new users/listings
CREATE POLICY "Anyone can create a profile" ON "Profile" FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create a listing" ON "Listing" FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create a message" ON "Message" FOR INSERT WITH CHECK (true);

-- Service role can do everything (RLS policies don't apply to service_role by default in Supabase)
-- But let's be explicit for updates/deletes
CREATE POLICY "Service role can update profiles" ON "Profile" FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Service role can delete profiles" ON "Profile" FOR DELETE USING (true);
CREATE POLICY "Service role can update listings" ON "Listing" FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Service role can delete listings" ON "Listing" FOR DELETE USING (true);
CREATE POLICY "Service role can update categories" ON "Category" FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Service role can insert categories" ON "Category" FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update auctions" ON "Auction" FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Service role can insert auctions" ON "Auction" FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can insert charity cases" ON "CharityCase" FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update charity cases" ON "CharityCase" FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Service role can insert feature flags" ON "FeatureFlag" FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update feature flags" ON "FeatureFlag" FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Service role can insert audit logs" ON "AuditLog" FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can insert wallet transactions" ON "WalletTransaction" FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can insert support events" ON "SupportEvent" FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can insert listing saves" ON "ListingSave" FOR INSERT WITH CHECK (true);

-- ============================================
-- UpdatedAt trigger function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "Profile_updatedAt" BEFORE UPDATE ON "Profile" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER "Category_updatedAt" BEFORE UPDATE ON "Category" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER "Listing_updatedAt" BEFORE UPDATE ON "Listing" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER "FeatureFlag_updatedAt" BEFORE UPDATE ON "FeatureFlag" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Full-text search index for listings
-- ============================================
CREATE INDEX IF NOT EXISTS "Listing_title_search_idx" ON "Listing" USING gin(to_tsvector('arabic', "title"));
CREATE INDEX IF NOT EXISTS "Listing_description_search_idx" ON "Listing" USING gin(to_tsvector('arabic', "description"));

-- Done! Run the seed endpoint after this: GET /api/seed
