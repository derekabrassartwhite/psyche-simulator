/**
 * Configuration presets for common mission scenarios
 */

export interface PresetConfig {
  id: string;
  name: string;
  description: string;
  concentrator: string | null;
  pvCell: string;
  battery: string;
  parameters: {
    concentratorArea: number;
    pvArea: number;
    batteryCapacity: number;
    baseLoad: number;
    duration: number;
    years: number;
  };
}

export const presets: PresetConfig[] = [
  {
    id: "baseline",
    name: "Baseline Mission",
    description: "Balanced system for small spacecraft operations",
    concentrator: "Linear Fresnel Reflector",
    pvCell: "Triple-junction GaAs (3J)",
    battery: "Lithium-ion (NMC)",
    parameters: {
      concentratorArea: 3.0,
      pvArea: 1.0,
      batteryCapacity: 8000,
      baseLoad: 100,
      duration: 48,
      years: 0
    }
  },
  {
    id: "high-power",
    name: "High-Power Science",
    description: "High-power system for instrument-heavy missions",
    concentrator: "Parabolic Dish Concentrator",
    pvCell: "Quad-junction IMM",
    battery: "Lithium-ion (NCA)",
    parameters: {
      concentratorArea: 5.0,
      pvArea: 1.5,
      batteryCapacity: 15000,
      baseLoad: 200,
      duration: 48,
      years: 0
    }
  },
  {
    id: "minimal-mass",
    name: "Minimal Mass",
    description: "Lightweight system for mass-constrained missions",
    concentrator: "Inflatable Fresnel Lens",
    pvCell: "Triple-junction GaAs (3J)",
    battery: "Lithium-Sulfur",
    parameters: {
      concentratorArea: 2.0,
      pvArea: 0.5,
      batteryCapacity: 5000,
      baseLoad: 75,
      duration: 48,
      years: 0
    }
  },
  {
    id: "extended-life",
    name: "Extended Life",
    description: "Robust system optimized for long mission duration",
    concentrator: "Compound Parabolic Concentrator (CPC)",
    pvCell: "Quad-junction IMM",
    battery: "Nickel-Hydrogen (NiH2)",
    parameters: {
      concentratorArea: 4.0,
      pvArea: 1.2,
      batteryCapacity: 12000,
      baseLoad: 120,
      duration: 48,
      years: 0
    }
  },
  {
    id: "no-concentrator",
    name: "No Concentrator",
    description: "Direct PV array without concentration optics",
    concentrator: null,
    pvCell: "Quad-junction IMM",
    battery: "Lithium-ion (NMC)",
    parameters: {
      concentratorArea: 0,
      pvArea: 8.0,
      batteryCapacity: 10000,
      baseLoad: 100,
      duration: 48,
      years: 0
    }
  }
];
