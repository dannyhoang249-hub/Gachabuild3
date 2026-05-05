#!/bin/bash

# Complete Sanity Studio Rebuild Script
# This ensures the build uses the correct Vite base path configuration

set -e

echo "🔧 Complete Sanity Studio Rebuild"
echo "=================================="
echo ""

# Check directory
if [ ! -f "docker-compose.production.yml" ]; then
    echo "❌ Error: Run this from /root/Gachabuild3"
    exit 1
fi

# Step 1: Pull latest code
echo "📦 Step 1: Pulling latest code..."
git pull origin master
echo ""

# Step 2: Verify sanity.config.ts has the base config
echo "🔍 Step 2: Verifying sanity.config.ts..."
if grep -q "base: '/studio/'" sanity.config.ts; then
    echo "✅ sanity.config.ts has base: '/studio/'"
else
    echo "❌ ERROR: sanity.config.ts is missing base: '/studio/'"
    echo "   The file needs to be updated!"
    exit 1
fi
echo ""

# Step 3: Stop the current studio container
echo "🛑 Step 3: Stopping sanity-studio container..."
docker-compose -f docker-compose.production.yml stop sanity-studio
echo ""

# Step 4: Remove the old container and image
echo "🗑️  Step 4: Removing old container and image..."
docker-compose -f docker-compose.production.yml rm -f sanity-studio
docker rmi gachabuild3-sanity-studio 2>/dev/null || echo "Image already removed"
echo ""

# Step 5: Build fresh with no cache
echo "🏗️  Step 5: Building fresh Sanity Studio (this takes 2-3 minutes)..."
docker-compose -f docker-compose.production.yml build --no-cache sanity-studio
echo ""

# Step 6: Start the new container
echo "🚀 Step 6: Starting new container..."
docker-compose -f docker-compose.production.yml up -d sanity-studio
echo ""

# Step 7: Wait for startup
echo "⏳ Waiting for container to be ready..."
sleep 5
echo ""

# Step 8: Check what files exist
echo "📁 Step 7: Checking build output..."
docker-compose -f docker-compose.production.yml exec -T sanity-studio ls -la /usr/share/nginx/html/ | head -20
echo ""

# Step 9: Check if index.html references /studio/static/
echo "🔍 Step 8: Checking if assets have correct paths..."
if docker-compose -f docker-compose.production.yml exec -T sanity-studio cat /usr/share/nginx/html/index.html | grep -q '/studio/static/'; then
    echo "✅ SUCCESS! Assets are correctly prefixed with /studio/static/"
else
    echo "⚠️  WARNING: Assets may not have /studio/ prefix"
    echo "   Checking index.html content..."
    docker-compose -f docker-compose.production.yml exec -T sanity-studio cat /usr/share/nginx/html/index.html | grep -o 'src="[^"]*"' | head -5
fi
echo ""

# Step 10: Check container status
echo "🐳 Step 9: Container status..."
docker-compose -f docker-compose.production.yml ps | grep sanity-studio
echo ""

echo "=================================="
echo "✅ Rebuild Complete!"
echo ""
echo "Next steps:"
echo "1. Clear browser cache COMPLETELY"
echo "2. Open in incognito/private mode: https://duetnightabyss.gachabuild.com/studio"
echo "3. Check console - should see /studio/static/ URLs"
echo ""

