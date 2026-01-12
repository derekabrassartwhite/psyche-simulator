# Quick Start Guide

## For Immediate Deployment (No Build Required)

The `dist/` folder contains the pre-built static site ready to deploy immediately.

### Option 1: Netlify Drop (Fastest - 30 seconds)
1. Go to https://app.netlify.com/drop
2. Drag the `dist/` folder from this project
3. Done! Your site is live with a random URL
4. (Optional) Change to custom domain in Netlify settings

### Option 2: GitHub Pages (5 minutes)
```bash
# From the psyche-static directory
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/psyche-simulator.git
git push -u origin main

# Deploy dist folder
git subtree push --prefix dist origin gh-pages
```
Then enable GitHub Pages in repository settings (Settings → Pages → Source: gh-pages branch)

### Option 3: Vercel (2 minutes)
```bash
npm i -g vercel
cd psyche-static
vercel --prod
```
Follow prompts, done!

## For Development

### Prerequisites
- Node.js 18+ or 20+
- pnpm (or npm/yarn)

### Install Dependencies
```bash
cd psyche-static
pnpm install
```

### Run Development Server
```bash
pnpm dev
```
Opens at http://localhost:5173

### Build for Production
```bash
pnpm build
```
Output in `dist/` directory

## Testing the Simulator

1. **Select a preset** (e.g., "Baseline Mission") to auto-fill all parameters
2. **Or customize**:
   - Choose solar concentrator (or None for direct PV)
   - Choose PV cell type
   - Choose battery system
   - Adjust system parameters (areas, capacity, load)
3. **Click "Run Simulation"**
4. **View results**:
   - Metrics summary (power, SOC, energy balance)
   - Power generation vs consumption chart
   - Battery state of charge chart
   - System viability assessment

## What Each Preset Does

- **Baseline Mission**: Balanced 3m² concentrator + triple-junction GaAs + Li-ion NMC (100W base load)
- **High-Power Science**: 5m² dish + quad-junction + Li-ion NCA (200W base load)
- **Minimal Mass**: 2m² inflatable Fresnel + triple-junction + Li-Sulfur (75W base load)
- **Extended Life**: 4m² CPC + quad-junction + NiH2 (120W base load)
- **No Concentrator**: 8m² direct PV + quad-junction + Li-ion NMC (100W base load)

## Understanding Results

### System Viability
- **Viable** ✓: Minimum battery SOC > 20% AND positive energy balance
- **Non-Viable** ✗: Battery depletes below 20% OR negative energy balance

### Key Metrics
- **Avg Power Generated**: Average solar power over simulation period
- **Peak Power**: Maximum instantaneous power (when facing sun)
- **Min SOC**: Lowest battery charge level (must stay > 20%)
- **Energy Balance**: Net energy surplus/deficit over full duration

### Health Score (0-5)
- 5/5: Excellent - Large surplus, high SOC maintained
- 3-4/5: Good - Adequate margins
- 1-2/5: Marginal - Meets minimum requirements
- 0/5: Failed - System not viable

## Customization Tips

### For Higher Power
- Increase concentrator area
- Use higher efficiency PV cells (quad-junction, concentrator PV)
- Increase PV array area

### For Longer Mission Life
- Choose low degradation PV cells
- Use high cycle-life batteries (NiH2, solid-state)
- Increase battery capacity for deeper reserves

### For Lower Mass
- Use inflatable concentrators
- Choose high energy density batteries (Li-Sulfur, Li-Air)
- Minimize array areas while maintaining viability

## Troubleshooting

### Simulation shows "Non-Viable"
- Increase solar collection area (concentrator or PV)
- Decrease base load
- Increase battery capacity
- Try a more efficient PV cell

### Charts not displaying
- Refresh the page
- Check browser console for errors
- Try a different browser

### Preset doesn't load
- Click the preset button again
- Manually verify all fields populated
- Check browser console for errors

## Next Steps

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to various platforms.

See [README.md](./README.md) for technical details about the simulation engine and architecture.
