#!/bin/bash

# GachaBuild Deployment Script for Contabo Ubuntu VPS
# This script deploys the GachaBuild project with Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/home/ubuntu/gachabuild"
REPO_URL="https://github.com/dannyhoang249-hub/Gachabuild3.git"
DOMAIN="duetnightabyss.gachabuild.com"
EMAIL="dannyhoang249@gmail.com"

echo -e "${BLUE}🚀 Starting GachaBuild Deployment${NC}"
echo "=================================="

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as ubuntu user."
   exit 1
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
print_status "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    print_warning "Please log out and log back in for Docker group changes to take effect"
else
    print_status "Docker is already installed"
fi

# Install Docker Compose
print_status "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    print_status "Docker Compose is already installed"
fi

# Create project directory
print_status "Setting up project directory..."
if [ -d "$PROJECT_DIR" ]; then
    print_warning "Project directory already exists. Backing up..."
    sudo mv "$PROJECT_DIR" "${PROJECT_DIR}_backup_$(date +%Y%m%d_%H%M%S)"
fi

mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Clone repository
print_status "Cloning repository..."
git clone "$REPO_URL" .

# Create environment file
print_status "Creating environment configuration..."
cat > .env << EOF
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=u9m27k7u
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN="${SANITY_API_TOKEN}"

# Next.js Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Domain Configuration
DOMAIN=$DOMAIN
EOF

# Create production nginx configuration with SSL
print_status "Creating Nginx configuration with SSL..."
cat > nginx-ssl.conf << EOF
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }

    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone \$binary_remote_addr zone=login:10m rate=1r/s;

    server {
        listen 80;
        server_name $DOMAIN;
        
        # Redirect HTTP to HTTPS
        return 301 https://\$server_name\$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name $DOMAIN;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.sanity.io;" always;

        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

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
            proxy_read_timeout 86400;
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
    }
}
EOF

# Create production docker-compose with SSL
print_status "Creating production Docker Compose configuration..."
cat > docker-compose.production.yml << EOF
version: '3.8'

services:
  # Next.js Frontend Application
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SANITY_PROJECT_ID=\${NEXT_PUBLIC_SANITY_PROJECT_ID}
      - NEXT_PUBLIC_SANITY_DATASET=\${NEXT_PUBLIC_SANITY_DATASET}
      - SANITY_API_TOKEN=\${SANITY_API_TOKEN}
    restart: unless-stopped
    networks:
      - gachabuild-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Sanity Studio (Production)
  sanity-studio:
    build:
      context: .
      dockerfile: Dockerfile.studio
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SANITY_PROJECT_ID=${NEXT_PUBLIC_SANITY_PROJECT_ID}
      - NEXT_PUBLIC_SANITY_DATASET=${NEXT_PUBLIC_SANITY_DATASET}
      - SANITY_API_TOKEN=${SANITY_API_TOKEN}
    restart: unless-stopped
    networks:
      - gachabuild-network

  # Nginx reverse proxy with SSL
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-ssl.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
    restart: unless-stopped
    networks:
      - gachabuild-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  gachabuild-network:
    driver: bridge
EOF

# Create SSL certificate generation script
print_status "Creating SSL certificate setup..."
cat > setup-ssl.sh << 'EOF'
#!/bin/bash

# SSL Certificate Setup Script
set -e

DOMAIN="duetnightabyss.gachabuild.com"
EMAIL="dannyhoang249@gmail.com"

echo "🔐 Setting up SSL certificates for $DOMAIN"

# Create SSL directory
mkdir -p ssl

# Install certbot if not present
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    sudo apt update
    sudo apt install -y certbot
fi

# Stop nginx if running
sudo systemctl stop nginx 2>/dev/null || true

# Generate SSL certificate
echo "Generating SSL certificate..."
sudo certbot certonly --standalone -d "$DOMAIN" --email "$EMAIL" --agree-tos --non-interactive

# Copy certificates to project directory
sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ssl/cert.pem
sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" ssl/key.pem

# Set proper permissions
sudo chown -R $USER:$USER ssl/
chmod 600 ssl/key.pem
chmod 644 ssl/cert.pem

echo "✅ SSL certificates generated successfully!"
echo "📁 Certificates saved to: ssl/cert.pem and ssl/key.pem"
EOF

chmod +x setup-ssl.sh

# Create systemd service for auto-start
print_status "Creating systemd service..."
sudo tee /etc/systemd/system/gachabuild.service > /dev/null << EOF
[Unit]
Description=GachaBuild Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/local/bin/docker-compose -f docker-compose.production.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.production.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Enable the service
sudo systemctl daemon-reload
sudo systemctl enable gachabuild.service

# Create update script
print_status "Creating update script..."
cat > update.sh << 'EOF'
#!/bin/bash

# GachaBuild Update Script
set -e

echo "🔄 Updating GachaBuild..."

# Pull latest changes
git pull origin master

# Rebuild and restart containers
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml build --no-cache
docker-compose -f docker-compose.production.yml up -d

# Clean up old images
docker image prune -f

echo "✅ Update completed successfully!"
EOF

chmod +x update.sh

# Create backup script
print_status "Creating backup script..."
cat > backup.sh << 'EOF'
#!/bin/bash

# GachaBuild Backup Script
set -e

BACKUP_DIR="/home/ubuntu/backups/gachabuild"
DATE=$(date +%Y%m%d_%H%M%S)

echo "📦 Creating backup..."

mkdir -p "$BACKUP_DIR"

# Backup project files
tar -czf "$BACKUP_DIR/gachabuild_$DATE.tar.gz" \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.next \
    .

# Backup SSL certificates
if [ -d "ssl" ]; then
    cp -r ssl "$BACKUP_DIR/ssl_$DATE"
fi

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "gachabuild_*.tar.gz" -mtime +7 -delete
find "$BACKUP_DIR" -name "ssl_*" -mtime +7 -exec rm -rf {} \;

echo "✅ Backup completed: $BACKUP_DIR/gachabuild_$DATE.tar.gz"
EOF

chmod +x backup.sh

print_status "Deployment script completed!"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Run SSL setup: ./setup-ssl.sh"
echo "2. Start the application: docker-compose -f docker-compose.production.yml up -d"
echo "3. Check status: docker-compose -f docker-compose.production.yml ps"
echo "4. View logs: docker-compose -f docker-compose.production.yml logs -f"
echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo "• Update: ./update.sh"
echo "• Backup: ./backup.sh"
echo "• Stop: docker-compose -f docker-compose.production.yml down"
echo "• Start: docker-compose -f docker-compose.production.yml up -d"
echo "• Restart: docker-compose -f docker-compose.production.yml restart"
echo ""
echo -e "${GREEN}🎉 GachaBuild deployment setup completed!${NC}"
