---
title: "SSL Certificate Setup"
description: "SSL certificate configuration for VPS deployment with Let's Encrypt"
last_updated: "2025-10-27"
related_files: ["deployment-guide.md", "troubleshooting.md"]
tags: ["ssl", "https", "letsencrypt", "security", "vps"]
---

# SSL Certificate Setup

Complete guide for setting up SSL certificates for VPS deployment using Let's Encrypt.

## 🔒 Let's Encrypt Setup (Recommended)

### 1. Install Certbot

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx -y
```

### 2. Obtain Certificate

```bash
# Stop nginx if running
sudo systemctl stop nginx

# Obtain certificate
sudo certbot certonly --standalone \
  -d duetnightabyss.gachabuild.com \
  -d studio.duetnightabyss.gachabuild.com \
  --email your-email@example.com \
  --agree-tos \
  --non-interactive
```

### 3. Configure Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Add to crontab
sudo crontab -e

# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

### 4. Copy Certificates for Docker

```bash
# Create SSL directory
mkdir -p ./ssl

# Copy certificates
sudo cp /etc/letsencrypt/live/duetnightabyss.gachabuild.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/duetnightabyss.gachabuild.com/privkey.pem ./ssl/key.pem

# Set permissions
sudo chown $USER:$USER ./ssl/*.pem
chmod 644 ./ssl/cert.pem
chmod 600 ./ssl/key.pem
```

## 🛡️ Manual Certificate Setup

### 1. Generate Private Key

```bash
# Create SSL directory
mkdir -p ./ssl

# Generate private key
openssl genrsa -out ./ssl/key.pem 2048
```

### 2. Generate Certificate Signing Request (CSR)

```bash
openssl req -new -key ./ssl/key.pem -out ./ssl/cert.csr

# Fill in the information:
# Country Name: US
# State: Your State
# City: Your City
# Organization: Your Organization
# Organizational Unit: IT Department
# Common Name: duetnightabyss.gachabuild.com
# Email: your-email@example.com
# Challenge password: (leave blank)
```

### 3. Purchase and Install Certificate

1. Submit CSR to your Certificate Authority (CA)
2. Download the certificate files
3. Copy to `./ssl/cert.pem`

## 🔧 Nginx SSL Configuration

### Enhanced SSL Configuration

Create `nginx-ssl.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    upstream frontend {
        server frontend:3000;
    }

    upstream studio {
        server sanity-studio:3333;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name duetnightabyss.gachabuild.com studio.duetnightabyss.gachabuild.com;
        return 301 https://$server_name$request_uri;
    }

    # Main site HTTPS
    server {
        listen 443 ssl http2;
        server_name duetnightabyss.gachabuild.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # OCSP Stapling
        ssl_stapling on;
        ssl_stapling_verify on;
        resolver 8.8.8.8 8.8.4.4 valid=300s;
        resolver_timeout 5s;

        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }

    # Sanity Studio HTTPS
    server {
        listen 443 ssl http2;
        server_name studio.duetnightabyss.gachabuild.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://studio;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

## 🔄 Certificate Renewal Script

Create `renew-ssl.sh`:

```bash
#!/bin/bash

# SSL Certificate Renewal Script
LOG_FILE="/var/log/ssl-renewal.log"
DOCKER_COMPOSE_FILE="docker-compose.production.yml"

echo "$(date): Starting SSL certificate renewal" >> $LOG_FILE

# Renew certificates
sudo certbot renew --quiet

# Check if renewal was successful
if [ $? -eq 0 ]; then
    echo "$(date): Certificate renewal successful" >> $LOG_FILE
    
    # Copy new certificates
    sudo cp /etc/letsencrypt/live/duetnightabyss.gachabuild.com/fullchain.pem ./ssl/cert.pem
    sudo cp /etc/letsencrypt/live/duetnightabyss.gachabuild.com/privkey.pem ./ssl/key.pem
    
    # Set permissions
    sudo chown $USER:$USER ./ssl/*.pem
    chmod 644 ./ssl/cert.pem
    chmod 600 ./ssl/key.pem
    
    # Restart nginx container
    docker-compose -f $DOCKER_COMPOSE_FILE restart nginx
    
    echo "$(date): Nginx restarted with new certificates" >> $LOG_FILE
else
    echo "$(date): Certificate renewal failed" >> $LOG_FILE
fi
```

Make it executable and add to crontab:

```bash
chmod +x renew-ssl.sh

# Add to crontab
crontab -e

# Add this line (runs monthly):
0 3 1 * * /path/to/renew-ssl.sh
```

## 🧪 Testing SSL Configuration

### 1. Test Certificate Installation

```bash
# Check certificate details
openssl x509 -in ./ssl/cert.pem -text -noout

# Test SSL connection
openssl s_client -connect duetnightabyss.gachabuild.com:443 -servername duetnightabyss.gachabuild.com
```

### 2. Online SSL Tests

- [SSL Labs Test](https://www.ssllabs.com/ssltest/)
- [SSL Checker](https://www.sslshopper.com/ssl-checker.html)

### 3. Verify HTTPS Redirect

```bash
# Should redirect to HTTPS
curl -I http://duetnightabyss.gachabuild.com

# Should return 200 OK
curl -I https://duetnightabyss.gachabuild.com
```

## 🚨 Troubleshooting

### Common SSL Issues

**1. Certificate Not Found:**
```bash
# Check certificate files exist
ls -la ./ssl/

# Verify permissions
ls -la ./ssl/*.pem
```

**2. Mixed Content Warnings:**
- Ensure all resources use HTTPS URLs
- Update asset URLs to use HTTPS
- Check for hardcoded HTTP links

**3. Certificate Expired:**
```bash
# Check expiration date
openssl x509 -in ./ssl/cert.pem -noout -dates

# Force renewal
sudo certbot renew --force-renewal
```

**4. Nginx SSL Errors:**
```bash
# Test nginx configuration
docker-compose -f docker-compose.production.yml exec nginx nginx -t

# Check nginx logs
docker-compose -f docker-compose.production.yml logs nginx
```

### Certificate Validation Errors

**Domain Validation Failed:**
1. Ensure DNS records point to your server
2. Check firewall allows ports 80/443
3. Verify domain ownership

**Rate Limiting:**
- Let's Encrypt has rate limits (5 certificates per week per domain)
- Use staging environment for testing: `--staging` flag

## 🔒 Security Best Practices

### 1. Strong SSL Configuration

- Use TLS 1.2+ only
- Disable weak ciphers
- Enable HSTS headers
- Implement OCSP stapling

### 2. Certificate Management

- Monitor certificate expiration
- Use automated renewal
- Keep private keys secure (600 permissions)
- Regular security audits

### 3. Additional Security

```nginx
# Additional security headers
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()";
```

## 📋 SSL Checklist

- [ ] Domain DNS points to server IP
- [ ] Firewall allows ports 80/443
- [ ] Certbot installed and configured
- [ ] Certificate obtained successfully
- [ ] Nginx SSL configuration updated
- [ ] Auto-renewal configured
- [ ] HTTPS redirect working
- [ ] SSL test passes (A+ rating)
- [ ] Mixed content issues resolved
- [ ] Security headers implemented
