#!/bin/bash

# =============================================================================
# Let's Encrypt SSL Setup Script for GachaBuild
# =============================================================================
# This script sets up Let's Encrypt SSL certificates for production
# Domain: duetnightabyss.gachabuild.com
# =============================================================================

set -e  # Exit on any error

echo "🔒 Setting up Let's Encrypt SSL for GachaBuild"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="duetnightabyss.gachabuild.com"
PROJECT_DIR="/home/ubuntu/gachabuild"
EMAIL="admin@gachabuild.com"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run this script as root (use sudo)"
    exit 1
fi

# Check if domain is accessible
print_status "Checking if domain $DOMAIN is accessible..."
if curl -s "http://$DOMAIN" >/dev/null 2>&1; then
    print_success "Domain is accessible"
else
    print_error "Domain $DOMAIN is not accessible. Please check DNS settings."
    exit 1
fi

# Install snapd if not present
if ! command -v snap &> /dev/null; then
    print_status "Installing snapd..."
    apt update
    apt install -y snapd
    print_success "snapd installed"
fi

# Install certbot via snap
print_status "Installing certbot..."
snap install core; snap refresh core
snap install --classic certbot
ln -sf /snap/bin/certbot /usr/bin/certbot
print_success "certbot installed"

# Stop nginx temporarily for certificate generation
print_status "Stopping nginx for certificate generation..."
cd $PROJECT_DIR
docker-compose -f docker-compose.production.yml stop nginx
print_success "nginx stopped"

# Generate Let's Encrypt certificate
print_status "Generating Let's Encrypt certificate for $DOMAIN..."
certbot certonly --standalone \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --domains $DOMAIN,www.$DOMAIN \
    --non-interactive

print_success "Let's Encrypt certificate generated"

# Copy certificates to project directory
print_status "Copying certificates to project directory..."
mkdir -p ssl
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/cert.pem
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/key.pem
chown ubuntu:ubuntu ssl/cert.pem ssl/key.pem
chmod 644 ssl/cert.pem
chmod 600 ssl/key.pem
print_success "Certificates copied"

# Create certificate renewal script
print_status "Creating certificate renewal script..."
cat > /etc/cron.d/certbot-renew << EOF
# Renew Let's Encrypt certificates twice daily
0 12 * * * root /usr/bin/certbot renew --quiet --post-hook "cd $PROJECT_DIR && cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/cert.pem && cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/key.pem && chown ubuntu:ubuntu ssl/cert.pem ssl/key.pem && chmod 644 ssl/cert.pem && chmod 600 ssl/key.pem && docker-compose -f docker-compose.production.yml restart nginx"
0 0 * * * root /usr/bin/certbot renew --quiet --post-hook "cd $PROJECT_DIR && cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/cert.pem && cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/key.pem && chown ubuntu:ubuntu ssl/cert.pem ssl/key.pem && chmod 644 ssl/cert.pem && chmod 600 ssl/key.pem && docker-compose -f docker-compose.production.yml restart nginx"
EOF

print_success "Certificate renewal cron job created"

# Update nginx configuration for Let's Encrypt
print_status "Updating nginx configuration for Let's Encrypt..."
cat > nginx-ssl.conf << EOF
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Logging
    log_format main '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                    '\$status \$body_bytes_sent "\$http_referer" '
                    '"\$http_user_agent" "\$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;
    
    # Basic settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone \$binary_remote_addr zone=login:10m rate=1r/s;

    # Upstream servers
    upstream frontend {
        server frontend:3000;
    }
    
    upstream sanity-studio {
        server sanity-studio:3333;
    }

    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name $DOMAIN www.$DOMAIN;
        return 301 https://\$server_name\$request_uri;
    }

    # Main HTTPS server
    server {
        listen 443 ssl http2;
        server_name $DOMAIN www.$DOMAIN;

        # SSL Configuration (Let's Encrypt)
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;
        ssl_stapling on;
        ssl_stapling_verify on;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;" always;

        # Main application
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_cache_bypass \$http_upgrade;
            proxy_read_timeout 300s;
            proxy_connect_timeout 75s;
        }

        # Sanity Studio
        location /studio {
            proxy_pass http://sanity-studio;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_cache_bypass \$http_upgrade;
            proxy_read_timeout 300s;
            proxy_connect_timeout 75s;
        }

        # Static assets caching
        location /_next/static/ {
            proxy_pass http://frontend;
            proxy_cache_valid 200 1y;
            add_header Cache-Control "public, immutable";
        }

        # API rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # Security.txt
        location /.well-known/security.txt {
            return 200 "Contact: $EMAIL\nExpires: 2025-12-31T23:59:59.000Z\nPreferred-Languages: en\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF

print_success "Nginx configuration updated"

# Restart nginx with new certificates
print_status "Restarting nginx with Let's Encrypt certificates..."
docker-compose -f docker-compose.production.yml up -d nginx
print_success "nginx restarted"

# Test SSL configuration
print_status "Testing SSL configuration..."
sleep 5

if curl -s "https://$DOMAIN" >/dev/null 2>&1; then
    print_success "SSL is working correctly!"
else
    print_warning "SSL test failed, but certificates are installed"
fi

# Display final information
echo ""
echo "=============================================="
echo "🔒 Let's Encrypt SSL Setup Complete!"
echo "=============================================="
echo ""
echo "✅ SSL Certificate: Installed and configured"
echo "🔄 Auto-renewal: Enabled (twice daily check)"
echo "🌐 HTTPS URL: https://$DOMAIN"
echo "🎨 CMS Studio: https://$DOMAIN/studio"
echo ""
echo "📋 Certificate Details:"
echo "  • Issuer: Let's Encrypt"
echo "  • Valid for: $DOMAIN, www.$DOMAIN"
echo "  • Expires: $(openssl x509 -in ssl/cert.pem -noout -dates | grep notAfter | cut -d= -f2)"
echo ""
echo "🔧 Management Commands:"
echo "  • Check certificate status: certbot certificates"
echo "  • Manual renewal: certbot renew"
echo "  • Test renewal: certbot renew --dry-run"
echo ""
echo "✅ SSL setup completed successfully!"
