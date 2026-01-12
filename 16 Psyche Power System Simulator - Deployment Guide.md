# 16 Psyche Power System Simulator - Deployment Guide

This is a fully independent static site with **zero dependencies on Manus** or any backend services. You can deploy it to any static hosting platform.

## What's Included

✅ **Complete simulation engine** - All physics calculations run in the browser  
✅ **32 space power technologies** - Embedded directly in the code  
✅ **5 configuration presets** - Quick-start scenarios  
✅ **Interactive charts** - Real-time visualization with Recharts  
✅ **Responsive design** - Works on desktop, tablet, and mobile  
✅ **No authentication** - Publicly accessible tool  
✅ **No backend** - Pure frontend application  

## Project Structure

```
psyche-static/
├── dist/                    # Built files (ready to deploy)
├── src/
│   ├── components/
│   │   └── Simulator.tsx    # Main UI component
│   ├── data/
│   │   ├── technologies.ts  # 32 space power technologies
│   │   └── presets.ts       # Configuration presets
│   ├── lib/
│   │   └── simulationEngine.ts  # Physics simulation engine
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── index.css            # Styles
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.ts           # Build configuration
└── tsconfig.json            # TypeScript configuration
```

## Local Development

### Prerequisites
- Node.js 18+ (or 20+)
- pnpm (or npm/yarn)

### Setup
```bash
cd psyche-static
pnpm install
```

### Development Server
```bash
pnpm dev
```
Opens at http://localhost:5173

### Build for Production
```bash
pnpm build
```
Output in `dist/` directory

### Preview Production Build
```bash
pnpm preview
```

## Deployment Options

### Option 1: GitHub Pages (Free)

**Step 1: Create GitHub repository**
```bash
cd psyche-static
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/derekabrassartwhite/psyche-simulator.git
git push -u origin main
```

**Step 2: Configure for GitHub Pages**

Update `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/psyche-simulator/',  // Replace with your repo name
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

**Step 3: Build and deploy**
```bash
pnpm build
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

**Step 4: Enable GitHub Pages**
- Go to repository Settings → Pages
- Source: Deploy from branch `gh-pages`
- Save

Your site will be at: `https://derekabrassartwhite.github.io/psyche-simulator/`

### Option 2: Netlify (Free)

**Method A: Drag & Drop**
1. Run `pnpm build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist/` folder
4. Done! Your site is live

**Method B: Git Integration**
1. Push code to GitHub/GitLab/Bitbucket
2. Go to https://app.netlify.com
3. Click "Add new site" → "Import an existing project"
4. Connect your repository
5. Build settings:
   - Build command: `pnpm build`
   - Publish directory: `dist`
6. Deploy!

**Custom Domain:**
- Go to Site settings → Domain management
- Add custom domain
- Follow DNS configuration instructions

### Option 3: Vercel (Free)

**Method A: CLI**
```bash
npm i -g vercel
cd psyche-static
vercel
```

**Method B: Git Integration**
1. Push code to GitHub
2. Go to https://vercel.com
3. Click "Add New" → "Project"
4. Import your repository
5. Build settings (auto-detected):
   - Framework Preset: Vite
   - Build Command: `pnpm build`
   - Output Directory: `dist`
6. Deploy!

**Custom Domain:**
- Go to Project Settings → Domains
- Add custom domain
- Follow DNS configuration instructions

### Option 4: Your Own Server

**Upload via FTP/SFTP:**
1. Build: `pnpm build`
2. Upload entire `dist/` folder to your web server
3. Point your domain to the `dist/` directory

**Example nginx configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/psyche-simulator/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Example Apache .htaccess:**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Option 5: Cloudflare Pages (Free)

1. Push code to GitHub
2. Go to https://dash.cloudflare.com
3. Pages → Create a project
4. Connect your repository
5. Build settings:
   - Build command: `pnpm build`
   - Build output directory: `dist`
6. Deploy!

## Custom Domain Setup

All platforms above support custom domains. General steps:

1. **Add domain in hosting platform** (Netlify/Vercel/Cloudflare/etc.)
2. **Update DNS records** at your domain registrar:
   - **A record**: Point to hosting platform's IP
   - **CNAME record**: Point to hosting platform's domain
3. **Enable HTTPS** (usually automatic)
4. **Wait for DNS propagation** (5 minutes to 48 hours)

## Environment Considerations

### No Backend Required
This application runs entirely in the browser. No server-side code, no databases, no API keys.

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (14+)
- Mobile browsers: ✅ Full support

### Performance
- Initial load: ~800 KB (gzipped: ~240 KB)
- Simulation runs: Instant (client-side JavaScript)
- No network requests after initial load

## Updating the Site

1. Make changes to source code
2. Test locally: `pnpm dev`
3. Build: `pnpm build`
4. Deploy updated `dist/` folder

For Git-based deployments (GitHub Pages, Netlify, Vercel):
```bash
git add .
git commit -m "Update simulator"
git push
```
Deployment happens automatically.

## Troubleshooting

### Build fails with TypeScript errors
```bash
pnpm build --mode development
```
Check console for specific errors.

### Site shows blank page
- Check browser console for errors
- Verify `base` path in `vite.config.ts` matches deployment URL
- Ensure all files in `dist/` were uploaded

### Charts not displaying
- Recharts requires proper container sizing
- Check that parent elements have defined height
- Verify no CSS conflicts

### Simulation not running
- Open browser console
- Check for JavaScript errors
- Verify technology data loaded correctly

## Technical Details

### Technologies Used
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **Recharts** - Data visualization
- **Wouter** - Lightweight routing (if needed for future expansion)

### Simulation Engine
- **Language**: Pure TypeScript (no Python dependencies)
- **Execution**: Client-side in browser
- **Performance**: ~1000 timesteps in <100ms
- **Accuracy**: Matches original Python implementation

### Data Storage
- **Technologies**: Embedded in `src/data/technologies.ts`
- **Presets**: Embedded in `src/data/presets.ts`
- **No external files**: Everything bundled in JavaScript

## License

MIT License - Free to use, modify, and distribute.

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all files deployed correctly
3. Test in different browsers
4. Check hosting platform documentation

## Next Steps

After deployment, you can:
- Add more configuration presets
- Implement comparison mode (multiple configurations)
- Add PDF export functionality
- Create optimization engine
- Add more advanced physics models
- Implement mission timeline simulation

All features can be added without any backend - everything runs in the browser!
