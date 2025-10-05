# 🚀 GitHub Pages Deployment Guide

Deploy your ArtVault NFT marketplace directly to GitHub Pages for free hosting!

## 📋 Prerequisites

- ✅ GitHub repository (already set up)
- ✅ Node.js installed locally
- ✅ Git configured

## 🎯 Deployment Options

### Option 1: Automatic Deployment (Recommended)

**Using GitHub Actions** - Deploys automatically when you push to main branch.

#### Setup Steps:

1. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click "Settings" → "Pages"
   - Under "Source", select "GitHub Actions"
   - Save the settings

2. **Push the workflow:**
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Add GitHub Pages deployment workflow"
   git push origin main
   ```

3. **Wait for deployment:**
   - Go to "Actions" tab in your repository
   - Watch the deployment workflow run
   - Once complete, your site will be live!

**Your site will be available at:**
`https://[your-username].github.io/artvault-nft-platform`

### Option 2: Manual Deployment

**Build and deploy manually** - Good for testing and custom control.

#### Setup Steps:

1. **Build the static site:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create gh-pages branch:**
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   cp -r frontend/out/* .
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

3. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch
   - Save

### Option 3: Using the Deployment Script

**Automated script** - Simplifies the manual process.

```bash
cd frontend
./deploy-github.sh
```

Then follow the instructions in the script output.

## 🔧 Configuration

### Custom Domain (Optional)

To use a custom domain:

1. **Add CNAME file:**
   ```bash
   echo "your-domain.com" > frontend/out/CNAME
   ```

2. **Update DNS:**
   - Add CNAME record pointing to `[username].github.io`

### Environment Variables

For production deployment, you may need to set:

- `NEXT_PUBLIC_PINATA_API_KEY`
- `NEXT_PUBLIC_PINATA_SECRET_KEY`

Add these in your GitHub repository secrets if needed.

## 📁 File Structure

```
artvault/
├── .github/workflows/deploy.yml    # GitHub Actions workflow
├── frontend/
│   ├── deploy-github.sh            # Deployment script
│   ├── next.config.ts             # Static export config
│   └── out/                        # Generated static files
└── GITHUB-PAGES-DEPLOYMENT.md     # This guide
```

## 🚨 Important Notes

### Static Export Limitations

Since we're using static export, some features are disabled:

- ❌ Server-side rendering (SSR)
- ❌ API routes
- ❌ Dynamic imports
- ❌ Image optimization

### What Still Works

- ✅ Client-side rendering
- ✅ Static generation
- ✅ Web3 wallet connections
- ✅ NFT minting and viewing
- ✅ All UI components

## 🔄 Updating Your Site

### Automatic Updates (Option 1)
Just push to main branch - GitHub Actions handles the rest!

### Manual Updates (Option 2 & 3)
```bash
cd frontend
npm run build
# Then redeploy using your chosen method
```

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version (18+ recommended)
- Ensure all dependencies are installed
- Check for TypeScript/ESLint errors

### Site Not Loading
- Verify GitHub Pages is enabled
- Check the Actions tab for deployment status
- Ensure `out` directory contains built files

### Images Not Loading
- Static export uses unoptimized images
- Ensure image paths are correct
- Check CORS settings for external images

## 🎉 Success!

Once deployed, your ArtVault NFT marketplace will be live on GitHub Pages with:

- ✅ Free hosting
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Custom domain support
- ✅ Automatic deployments

**Your live site:** `https://[username].github.io/artvault-nft-platform`
