#!/bin/bash

# =============================================================================
# GachaBuild VPS Reset Script
# =============================================================================
# This script completely cleans and resets the VPS environment for a fresh
# deployment of GachaBuild.
# =============================================================================

set -e  # Exit on any error

echo "🚀 Starting VPS Reset for GachaBuild Deployment"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

print_status "Starting VPS cleanup process..."

# 1. Stop all running containers
print_status "Stopping all Docker containers..."
if command -v docker &> /dev/null; then
    docker stop $(docker ps -aq) 2>/dev/null || true
    print_success "All containers stopped"
else
    print_warning "Docker not found, skipping container cleanup"
fi

# 2. Remove all containers
print_status "Removing all Docker containers..."
if command -v docker &> /dev/null; then
    docker rm $(docker ps -aq) 2>/dev/null || true
    print_success "All containers removed"
fi

# 3. Remove all Docker images
print_status "Removing all Docker images..."
if command -v docker &> /dev/null; then
    docker rmi $(docker images -q) 2>/dev/null || true
    print_success "All Docker images removed"
fi

# 4. Clean Docker system completely
print_status "Cleaning Docker system (volumes, networks, cache)..."
if command -v docker &> /dev/null; then
    docker system prune -af --volumes 2>/dev/null || true
    print_success "Docker system cleaned"
fi

# 5. Remove old project directories
print_status "Removing old project directories..."
rm -rf /home/ubuntu/gachabuild 2>/dev/null || true
rm -rf /root/gachabuild 2>/dev/null || true
print_success "Old project directories removed"

# 6. Create fresh project directory
print_status "Creating fresh project directory..."
mkdir -p /home/ubuntu/gachabuild
chown ubuntu:ubuntu /home/ubuntu/gachabuild
print_success "Fresh project directory created"

# 7. Update system packages
print_status "Updating system packages..."
apt update -y
apt upgrade -y
print_success "System packages updated"

# 8. Install essential packages
print_status "Installing essential packages..."
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
print_success "Essential packages installed"

# 9. Install Docker if not present
if ! command -v docker &> /dev/null; then
    print_status "Installing Docker..."
    
    # Remove old Docker installations
    apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
    
    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Add Docker repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Update package index
    apt update -y
    
    # Install Docker
    apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Start and enable Docker
    systemctl start docker
    systemctl enable docker
    
    # Add ubuntu user to docker group
    usermod -aG docker ubuntu
    
    print_success "Docker installed and configured"
else
    print_success "Docker already installed"
fi

# 10. Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_status "Installing Docker Compose..."
    apt install -y docker-compose-plugin
    print_success "Docker Compose installed"
else
    print_success "Docker Compose already available"
fi

# 11. Configure firewall (if ufw is available)
if command -v ufw &> /dev/null; then
    print_status "Configuring firewall..."
    ufw --force reset
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    print_success "Firewall configured"
fi

# 12. Set up swap file if not exists
if [ ! -f /swapfile ]; then
    print_status "Creating swap file..."
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    print_success "Swap file created"
else
    print_success "Swap file already exists"
fi

# 13. Clean up temporary files
print_status "Cleaning up temporary files..."
apt autoremove -y
apt autoclean
rm -rf /tmp/*
print_success "Temporary files cleaned"

# 14. Set proper permissions
print_status "Setting proper permissions..."
chown -R ubuntu:ubuntu /home/ubuntu
print_success "Permissions set"

print_success "VPS reset completed successfully!"
echo ""
echo "=============================================="
echo "✅ VPS is now clean and ready for deployment"
echo "📁 Project directory: /home/ubuntu/gachabuild"
echo "🐳 Docker: Installed and configured"
echo "🔥 Firewall: Configured (SSH, HTTP, HTTPS)"
echo "💾 Swap: 2GB configured"
echo "=============================================="
echo ""
echo "Next steps:"
echo "1. Run the deployment script: ./scripts/deploy-production.sh"
echo "2. Or manually clone the repository and deploy"
echo ""
