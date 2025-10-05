#!/bin/bash

# GitHub Pages Deployment Script
echo "🚀 Deploying ArtVault to GitHub Pages..."

# Build the static site
echo "📦 Building static site..."
npm run build

# Create .nojekyll file to bypass Jekyll processing
echo "📝 Creating .nojekyll file..."
touch out/.nojekyll

# Add CNAME file for custom domain (optional)
# echo "your-domain.com" > out/CNAME

echo "✅ Static site built successfully!"
echo "📁 Output directory: ./out"
echo ""
echo "🔧 Next steps:"
echo "1. Commit and push the 'out' directory to your gh-pages branch"
echo "2. Enable GitHub Pages in your repository settings"
echo "3. Set source to 'gh-pages' branch"
echo ""
echo "🌐 Your site will be available at:"
echo "https://[your-username].github.io/[repository-name]"
