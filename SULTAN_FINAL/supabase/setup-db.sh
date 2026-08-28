#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# SULTAN — Database Setup for Supabase
# ═══════════════════════════════════════════════════════════════════
# This script pushes the Prisma schema to your Supabase PostgreSQL database.
# Run it ONCE after cloning the project.
# ═══════════════════════════════════════════════════════════════════

echo "SULTAN Database Setup"
echo "====================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "ERROR: .env file not found. Copy ENVIRONMENT.example to .env and fill in your values."
  exit 1
fi

echo "Step 1: Installing dependencies..."
npm install

echo ""
echo "Step 2: Generating Prisma client..."
npx prisma generate

echo ""
echo "Step 3: Pushing schema to Supabase..."
npx prisma db push

echo ""
echo "Step 4: Seeding initial data (optional)..."
# You can add: npx prisma db seed

echo ""
echo "Database setup complete!"
echo "You can now run: npm run dev"
