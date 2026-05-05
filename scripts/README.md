# 🚀 GachaBuild Production Deployment Scripts

This directory contains scripts for deploying GachaBuild to production on Ubuntu VPS with Docker, Nginx, and SSL.

## 📁 Scripts Overview

| Script | Purpose | Usage |
|--------|---------|-------|
| `reset-vps.sh` | Complete VPS cleanup and Docker installation | `sudo ./scripts/reset-vps.sh` |
| `deploy-production.sh` | Deploy GachaBuild application with Docker | `sudo ./scripts/deploy-production.sh` |
| `setup-letsencrypt.sh` | Configure Let's Encrypt SSL certificates | `sudo ./scripts/setup-letsencrypt.sh` |
| `complete-deployment.sh` | Run all deployment steps automatically | `sudo ./scripts/complete-deployment.sh` |

## 🎯 Quick Start

### From Windows (Recommended)
1. Double-click `deploy-to-vps.bat`
2. Choose option 1 for complete automated deployment
3. Wait for deployment to complete
4. Visit https://duetnightabyss.gachabuild.com

### From Linux/Mac
```bash
# SSH into your VPS
ssh root@62.146.238.212

# Clone repository
git clone git@github.com:dannyhoang249-hub/Gachabuild.git
cd Gachabuild

# Make scripts executable
chmod +x scripts/*.sh

# Run complete deployment
sudo ./scripts/complete-deployment.sh
```

## ⚠️ Important Notes

- **VPS Credentials:**
  - IP: `62.146.238.212`
  - User: `root`
  - Password: `[REDACTED]`

- **Domain:** `duetnightabyss.gachabuild.com`

- **Sanity Configuration:**
  - Project ID: `u9m27k7u`
  - API Token: Already configured in scripts

## 🔧 What Each Script Does

### `reset-vps.sh`
- Stops and removes all Docker containers/images
- Cleans Docker system completely
- Updates system packages
- Installs Docker and Docker Compose
- Configures firewall (SSH, HTTP, HTTPS)
- Sets up swap file (2GB)
- Creates project directory

### `deploy-production.sh`
- Clones/updates repository from GitHub
- Creates production environment configuration
- Builds Docker images for frontend and Sanity Studio
- Sets up Nginx reverse proxy
- Generates self-signed SSL certificates
- Starts all services
- Creates systemd service for auto-start
- Sets up log rotation

### `setup-letsencrypt.sh`
- Installs certbot via snap
- Generates Let's Encrypt SSL certificates
- Updates Nginx configuration for SSL
- Sets up automatic certificate renewal
- Tests SSL configuration

### `complete-deployment.sh`
- Runs all three scripts in sequence
- Includes final verification steps
- Provides comprehensive status report

## 🌐 After Deployment

Your site will be available at:
- **Main Website:** https://duetnightabyss.gachabuild.com
- **CMS Studio:** https://duetnightabyss.gachabuild.com/studio
- **Health Check:** https://duetnightabyss.gachabuild.com/health

## 🔧 Management Commands

```bash
# View logs
docker-compose -f docker-compose.production.yml logs -f

# Restart services
docker-compose -f docker-compose.production.yml restart

# Check service status
docker-compose -f docker-compose.production.yml ps

# Update deployment
./update-production.sh

# Stop services
docker-compose -f docker-compose.production.yml down
```

## 🚨 Troubleshooting

### Common Issues

1. **Scripts not executable:**
   ```bash
   chmod +x scripts/*.sh
   ```

2. **Permission denied:**
   ```bash
   sudo ./scripts/[script-name].sh
   ```

3. **Domain not accessible:**
   - Check DNS settings
   - Verify firewall: `sudo ufw status`

4. **SSL certificate issues:**
   - Check certificate: `sudo certbot certificates`
   - Test renewal: `sudo certbot renew --dry-run`

## 📊 Monitoring

### Health Checks
- Application: https://duetnightabyss.gachabuild.com/health
- SSL Certificate: `openssl s_client -connect duetnightabyss.gachabuild.com:443`

### Resource Usage
```bash
# Check Docker resource usage
docker stats

# Check disk usage
df -h

# Check memory usage
free -h
```

## 🔄 Updates

To update your deployment:

```bash
cd /home/ubuntu/gachabuild
git pull origin main
./update-production.sh
```

## 📋 Prerequisites

- Ubuntu 22.04 LTS VPS
- SSH access to VPS
- GitHub SSH key configured
- Domain DNS pointing to VPS IP

## 🆘 Support

If you encounter issues:

1. Check the logs: `docker-compose logs`
2. Verify environment: `cat .env.production`
3. Check SSL status: `sudo certbot certificates`
4. Test domain: `curl -I https://duetnightabyss.gachabuild.com`

**Contact:** admin@gachabuild.com