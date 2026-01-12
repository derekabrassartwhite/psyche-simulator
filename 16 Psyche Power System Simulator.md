# 16 Psyche Power System Simulator

A fully independent, browser-based simulation tool for designing and analyzing power systems for NASA's mission to asteroid 16 Psyche at 2.9 AU from the Sun.

## Features

- **32 Space Power Technologies** - 9 solar concentrators, 11 PV cells, 12 battery systems
- **Physics-Based Simulation** - Accurate modeling of solar irradiance, temperature effects, and power dynamics
- **Interactive Visualization** - Real-time charts showing power generation, consumption, and battery state of charge
- **Configuration Presets** - 5 pre-configured scenarios for common mission profiles
- **System Viability Assessment** - Automatic evaluation of power system health and sustainability
- **Zero Dependencies** - Runs entirely in the browser, no backend required

## Quick Start

### Development
```bash
pnpm install
pnpm dev
```
Open http://localhost:5173

### Production Build
```bash
pnpm build
```
Output in `dist/` directory

## Deployment

This is a static site that can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Any web server

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## How It Works

### Simulation Engine
The simulator models a complete spacecraft power system operating on asteroid 16 Psyche:

1. **Solar Irradiance** - Calculates available sunlight at 2.9 AU using inverse square law (162 W/m²)
2. **Rotation Dynamics** - Models 4.2-hour asteroid rotation affecting sun exposure
3. **Solar Concentration** - Optional concentrators (5x to 30x) focus sunlight onto smaller PV arrays
4. **Photovoltaic Conversion** - Temperature-dependent efficiency with realistic degradation
5. **Power Management** - Balances generation vs consumption (science instruments, communications, thermal control)
6. **Battery Dynamics** - Charge/discharge cycles with efficiency losses and SOC constraints
7. **System Health** - Evaluates viability based on energy balance and minimum battery SOC

### Technology Database
All 32 technologies are embedded with real performance parameters:
- **Concentrators**: Parabolic dishes, Fresnel lenses, CPCs, inflatable systems
- **PV Cells**: Silicon, GaAs, multi-junction, perovskite, quantum dots
- **Batteries**: NiCd, NiH2, Li-ion variants, solid-state, flow batteries

### Configuration Presets
- **Baseline Mission** - Balanced system for small spacecraft
- **High-Power Science** - Instrument-heavy missions
- **Minimal Mass** - Lightweight for mass-constrained missions
- **Extended Life** - Long-duration robustness
- **No Concentrator** - Direct PV array configuration

## Technical Stack

- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS 4 (styling)
- Recharts (visualization)
- Pure client-side execution

## Project Structure

```
src/
├── components/
│   └── Simulator.tsx          # Main UI component
├── data/
│   ├── technologies.ts        # 32 space power technologies
│   └── presets.ts             # Configuration presets
├── lib/
│   └── simulationEngine.ts    # Physics simulation engine
├── App.tsx                    # Root component
└── main.tsx                   # Entry point
```

## Performance

- **Build size**: ~800 KB (240 KB gzipped)
- **Simulation speed**: 1000 timesteps in <100ms
- **No network requests**: Everything runs locally after initial load

## Browser Support

- Chrome/Edge ✅
- Firefox ✅
- Safari 14+ ✅
- Mobile browsers ✅

## License

MIT License - Free to use, modify, and distribute.

## Credits

Based on research for NASA's Psyche mission to explore the metal-rich asteroid 16 Psyche. Technology parameters sourced from peer-reviewed literature and space mission documentation.

## Contributing

This is an independent project. Feel free to fork and customize for your own use cases.

## Future Enhancements

Potential additions (all client-side):
- Multi-configuration comparison mode
- PDF report generation
- Optimization engine for automated design
- Advanced thermal modeling
- Multi-year mission timeline simulation
- Cost-benefit analysis
