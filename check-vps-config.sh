#!/bin/bash

# VPS Configuration Check Script for Sanity Studio
# This script verifies that the nginx configuration is correctly applied

echo "🔍 Checking VPS Configuration..."
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "docker-compose.production.yml" ]; then
    echo "❌ Error: docker-compose.production.yml not found"
    echo "   Please run this from /root/Gachabuild3"
    exit 1
fi

echo "✅ In correct directory: $(pwd)"
echo ""

# Check Git status
echo "📦 Checking Git status..."
git fetch origin
BEHIND=$(git rev-list HEAD..origin/master --count)
if [ "$BEHIND" -gt 0 ]; then
    echo "⚠️  WARNING: You are $BEHIND commits behind origin/master"
    echo "   Run: git pull origin master"
else
    echo "✅ Git is up to date with origin/master"
fi
echo ""

# Check nginx-ssl.conf content
echo "🔍 Checking nginx-ssl.conf CSP settings..."
if grep -q "https://core.sanity-cdn.com" nginx-ssl.conf; then
    echo "✅ CSP includes core.sanity-cdn.com"
else
    echo "❌ CSP does NOT include core.sanity-cdn.com"
fi

if grep -q "https://studio-static.sanity.io" nginx-ssl.conf; then
    echo "✅ CSP includes studio-static.sanity.io"
else
    echo "❌ CSP does NOT include studio-static.sanity.io"
fi
echo ""

# Check if containers are running
echo "🐳 Checking Docker containers..."
docker-compose -f docker-compose.production.yml ps
echo ""

# Check the actual config inside the nginx container
echo "🔍 Checking nginx container's active configuration..."
if docker-compose -f docker-compose.production.yml exec -T nginx cat /etc/nginx/nginx.conf | grep -q "https://core.sanity-cdn.com"; then
    echo "✅ Nginx container HAS updated CSP with Sanity CDN domains"
else
    echo "❌ Nginx container DOES NOT have updated CSP"
    echo "   The container needs to be restarted!"
fi
echo ""

# Show the actual CSP line from container
echo "📋 Current CSP in nginx container:"
docker-compose -f docker-compose.production.yml exec -T nginx cat /etc/nginx/nginx.conf | grep "Content-Security-Policy" | head -1
echo ""

echo "=================================="
echo "🎯 Recommended Actions:"
echo ""

if [ "$BEHIND" -gt 0 ]; then
    echo "1. Pull latest changes:"
    echo "   git pull origin master"
    echo ""
fi

if ! docker-compose -f docker-compose.production.yml exec -T nginx cat /etc/nginx/nginx.conf | grep -q "https://core.sanity-cdn.com"; then
    echo "2. Restart nginx to apply new configuration:"
    echo "   docker-compose -f docker-compose.production.yml restart nginx"
    echo ""
    echo "   OR force reload:"
    echo "   docker-compose -f docker-compose.production.yml stop nginx"
    echo "   docker-compose -f docker-compose.production.yml up -d nginx"
    echo ""
fi

echo "3. Clear browser cache and hard refresh:"
echo "   - Chrome/Edge: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)"
echo "   - Firefox: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)"
echo ""
echo "4. Test the studio:"
echo "   https://duetnightabyss.gachabuild.com/studio"

