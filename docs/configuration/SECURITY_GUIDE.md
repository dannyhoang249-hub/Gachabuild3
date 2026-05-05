# 🔒 Security Guide - Token Sanitization & Rotation

## ⚠️ CRITICAL SECURITY ISSUES FOUND & RESOLVED

### Leaked Secrets Removed
The following hardcoded secrets have been identified and removed from the codebase:

1. **Sanity API Token** - Found in multiple deployment scripts and config files
2. **GitHub Token** - Found in deployment scripts  
3. **VPS Password** - Found in documentation

### Files Modified
- `scripts/deploy-production.sh`
- `PRODUCTION_DEPLOYMENT_GUIDE.md`
- `vps-deploy.sh`
- `ultimate-deploy.sh`
- `simple-deploy.sh`
- `quick-deploy.sh`
- `env.production`
- `deploy.sh`
- `DEPLOYMENT_GUIDE.md`
- `scripts/README.md`

## 🛡️ Environment Variables Template

Create your environment files using this template:

```bash
# Copy template for development
cp .env.template .env.local

# Copy template for production
cp .env.template .env.production
```

### Required Environment Variables:

```env
# =============================================================================
# SANITY CMS CONFIGURATION
# =============================================================================
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token_here
SANITY_WEBHOOK_SECRET=your_webhook_secret_here

# =============================================================================
# NEXT.JS CONFIGURATION
# =============================================================================
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# =============================================================================
# DOMAIN & DEPLOYMENT CONFIGURATION
# =============================================================================
DOMAIN=localhost:3000
NEXT_PUBLIC_DOMAIN=localhost:3000

# =============================================================================
# TRANSLATION SERVICES
# =============================================================================
OPENAI_API_KEY=your_openai_api_key_here
DEEPL_API_KEY=your_deepl_api_key_here

# =============================================================================
# CLOUD STORAGE CONFIGURATION
# =============================================================================
R2_ACCOUNT_ID=your_r2_account_id_here
R2_ACCESS_KEY_ID=your_r2_access_key_id_here
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key_here
R2_BUCKET_NAME=your_r2_bucket_name_here
R2_PUBLIC_URL=your_r2_public_url_here

# =============================================================================
# VERSION CONTROL & DEPLOYMENT
# =============================================================================
GITHUB_REPO=https://github.com/your-username/your-repo.git
GITHUB_TOKEN=your_github_token_here

# =============================================================================
# WEBHOOK CONFIGURATION
# =============================================================================
WEBHOOK_SECRET=your_webhook_secret_here

# =============================================================================
# DEVELOPMENT TOOLS
# =============================================================================
DEBUG=false
```

## 🔄 Token Rotation Process

### Immediate Actions Required:

1. **Revoke Compromised Tokens**
   ```bash
   # Revoke the Sanity API token immediately
   # Go to https://www.sanity.io/manage and revoke the leaked token
   
   # Revoke the GitHub token immediately  
   # Go to https://github.com/settings/tokens and revoke the leaked token
   ```

2. **Generate New Tokens**
   ```bash
   # Generate new Sanity API token
   # Generate new GitHub token
   # Generate new webhook secrets
   ```

3. **Update Environment Variables**
   ```bash
   # Update .env.local with new development tokens
   # Update .env.production with new production tokens
   # Update deployment scripts with new tokens
   ```

### Token Rotation Checklist:

- [ ] Revoke old Sanity API token
- [ ] Generate new Sanity API token
- [ ] Revoke old GitHub token
- [ ] Generate new GitHub token
- [ ] Update all environment files
- [ ] Update deployment scripts
- [ ] Test application functionality
- [ ] Update production deployment
- [ ] Document rotation date

## 🧹 Git History Cleanup

The leaked secrets are still in git history. To completely remove them:

### Option 1: BFG Repo-Cleaner (Recommended)
```bash
# Install BFG
brew install bfg  # macOS
# or download from https://rtyley.github.io/bfg-repo-cleaner/

# Remove secrets from history
bfg --replace-text secrets.txt
```

### Option 2: git filter-branch (Advanced)
```bash
# Remove specific token from history
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch scripts/deploy-production.sh' \
  --prune-empty --tag-name-filter cat -- --all

# Force push to remote
git push origin --force --all
```

### Option 3: Fresh Repository (Nuclear Option)
```bash
# Create new repository
# Copy clean codebase
# Update remote origin
git remote set-url origin https://github.com/your-username/new-repo.git
```

## 🛡️ Security Best Practices

### Environment Variables
- ✅ Never commit `.env*` files
- ✅ Use `.env.template` for documentation
- ✅ Rotate tokens regularly
- ✅ Use different tokens for dev/prod

### Git Security
- ✅ Updated `.gitignore` to block sensitive files
- ✅ Use pre-commit hooks to scan for secrets
- ✅ Regular security audits

### Deployment Security
- ✅ Use environment variables in deployment scripts
- ✅ Never hardcode secrets in scripts
- ✅ Use secure deployment methods

## 🔍 Ongoing Security Monitoring

### Regular Checks:
- [ ] Weekly secret scanning
- [ ] Monthly token rotation
- [ ] Quarterly security audit
- [ ] Annual penetration testing

### Tools to Use:
- `git-secrets` - Pre-commit hook for secret detection
- `truffleHog` - Secret scanning tool
- `gitleaks` - Git secret scanner

## 📞 Emergency Response

If you suspect additional token leaks:

1. **Immediately revoke** all potentially compromised tokens
2. **Generate new tokens** for all services
3. **Update all environments** with new tokens
4. **Scan entire codebase** for additional leaks
5. **Clean git history** if necessary
6. **Document incident** and lessons learned

## 🎯 Next Steps

1. Complete token rotation immediately
2. Implement pre-commit hooks for secret detection
3. Set up automated security scanning
4. Train team on secure development practices
5. Establish regular security review process
