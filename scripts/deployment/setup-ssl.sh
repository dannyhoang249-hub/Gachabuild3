#!/bin/bash

# SSL Certificate Setup Script for GachaBuild
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

# Create certificate renewal script
cat > renew-ssl.sh << 'EOF'
#!/bin/bash
# SSL Certificate Renewal Script

set -e

echo "🔄 Renewing SSL certificates..."

# Renew certificates
sudo certbot renew --quiet

# Copy renewed certificates
sudo cp "/etc/letsencrypt/live/duetnightabyss.gachabuild.com/fullchain.pem" ssl/cert.pem
sudo cp "/etc/letsencrypt/live/duetnightabyss.gachabuild.com/privkey.pem" ssl/key.pem

# Set proper permissions
sudo chown -R $USER:$USER ssl/
chmod 600 ssl/key.pem
chmod 644 ssl/cert.pem

# Reload nginx
docker-compose -f docker-compose.production.yml restart nginx

echo "✅ SSL certificates renewed successfully!"
EOF

chmod +x renew-ssl.sh

# Add to crontab for automatic renewal
(crontab -l 2>/dev/null; echo "0 2 * * * cd $PWD && ./renew-ssl.sh") | crontab -

echo "📅 Automatic SSL renewal scheduled (daily at 2 AM)"
echo "✅ SSL setup completed!"
