#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# SULTAN — Database Setup for Supabase
# ═══════════════════════════════════════════════════════════════════
# Run this ONCE after cloning the project.
# Prerequisites: Node.js 20+, npm
# ═══════════════════════════════════════════════════════════════════

echo "SULTAN Database Setup"
echo "====================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "ERROR: .env file not found."
  echo "Copy ENVIRONMENT.example to .env and fill in your values."
  exit 1
fi

echo "Step 1: Installing dependencies..."
npm install --legacy-peer-deps

echo ""
echo "Step 2: Generating Prisma client..."
npx prisma generate

echo ""
echo "Step 3: Pushing schema to Supabase..."
echo "NOTE: If you get 'ENETUNREACH' or 'tenant not found',"
echo "your network may not support IPv6 or Supabase Pooler."
echo "In that case, use the Supabase Dashboard SQL Editor"
echo "and run the SQL from: supabase/migrations/00001_init.sql"
npx prisma db push --accept-data-loss 2>&1

if [ $? -eq 0 ]; then
  echo ""
  echo "Database setup complete!"
  echo "You can now run: npm run dev"
else
  echo ""
  echo "Auto-push failed. Manual fallback:"
  echo "  1. Go to Supabase Dashboard → SQL Editor"
  echo "  2. Paste the contents of supabase/migrations/00001_init.sql"
  echo "  3. Click Run"
  echo "  4. Then run: npx prisma generate"
fi