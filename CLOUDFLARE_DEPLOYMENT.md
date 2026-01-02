# Cloudflare Pages Deployment Guide

This guide will help you deploy your portfolio website to Cloudflare Pages.

## Prerequisites

- A Cloudflare account (free tier works perfectly)
- Your GitHub repository connected to Cloudflare

## Deployment Steps

### Option 1: Deploy via Cloudflare Dashboard (Recommended)

1. **Log in to Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to **Pages** in the sidebar

2. **Create a New Project**
   - Click **Create a project**
   - Select **Connect to Git**
   - Authorize Cloudflare to access your GitHub account
   - Select your repository: `leon-madara/my-website`

3. **Configure Build Settings**
   - **Project name**: `leons-portfolio` (or your preferred name)
   - **Production branch**: `main`
   - **Build command**: (leave empty - no build needed for static site)
   - **Build output directory**: `.` (root directory)
   - **Root directory**: (leave empty or set to `.`)

4. **Environment Variables** (if needed)
   - Add any environment variables if your site requires them
   - For this static site, none are needed

5. **Deploy**
   - Click **Save and Deploy**
   - Cloudflare will automatically deploy your site
   - You'll get a URL like: `https://leons-portfolio.pages.dev`

### Option 2: Deploy via Wrangler CLI

If you prefer using the command line:

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Pages
wrangler pages deploy . --project-name=leons-portfolio
```

## Custom Domain Setup

1. **Add Custom Domain**
   - In your Cloudflare Pages project, go to **Custom domains**
   - Click **Set up a custom domain**
   - Enter your domain (e.g., `yourdomain.com`)

2. **DNS Configuration**
   - Cloudflare will automatically configure DNS
   - Or manually add a CNAME record:
     - **Type**: CNAME
     - **Name**: `@` (or `www` for www subdomain)
     - **Target**: `your-project.pages.dev`

3. **SSL/TLS**
   - Cloudflare automatically provisions SSL certificates
   - Ensure SSL/TLS encryption mode is set to **Full** or **Full (strict)**

## Automatic Deployments

Cloudflare Pages automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request gets a preview deployment

## Performance Optimizations

Cloudflare Pages automatically provides:
- Global CDN distribution for fast loading worldwide
- Automatic HTTPS/SSL certificates
- DDoS protection
- Image optimization (via Cloudflare Images if enabled)
- Automatic compression (Brotli/Gzip)

### Adding Custom Headers (Optional)

To add custom security headers, you can use Cloudflare Pages Functions:
1. Create a `functions/_headers.ts` file
2. Or configure headers in the Cloudflare dashboard under **Rules** > **Transform Rules**

## File Structure

Your site structure is already optimized for Cloudflare Pages:
```
/
├── index.html          # Homepage
├── about.html          # About page
├── contact.html        # Contact page
├── portfolio.html      # Portfolio page
├── css/                # Stylesheets
├── js/                 # JavaScript files
├── images/             # Images
└── _redirects          # URL routing rules
```

## Troubleshooting

### Issue: 404 errors on routes
- Solution: The `_redirects` file handles clean URLs. Ensure it's in your root directory.

### Issue: Assets not loading
- Solution: Check that all asset paths are relative (not absolute). Cloudflare Pages serves from the root.

### Issue: Build fails
- Solution: Since this is a static site, no build is needed. Leave build command empty.

## Monitoring

- View deployment logs in the Cloudflare Pages dashboard
- Check analytics in the **Analytics** tab
- Monitor performance with Cloudflare's built-in analytics

## Support

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Community](https://community.cloudflare.com/)
