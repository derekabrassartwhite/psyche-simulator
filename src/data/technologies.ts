// Technology database for 16 Psyche Power System Simulator
// This file contains all 32 space power technologies with performance parameters

export interface ConcentratorTechnology {
  name: string;
  concentration_ratio: number;
  efficiency: number;
  mass_per_m2: number;
  trl: number;
  era: 'historical' | 'current' | 'theoretical';
}

export interface PVTechnology {
  name: string;
  efficiency: number;
  temp_coefficient: number;
  degradation_rate: number;
  mass_per_m2: number;
  trl: number;
  era: 'historical' | 'current' | 'theoretical';
}

export interface BatteryTechnology {
  name: string;
  energy_density: number;
  cycle_life: number;
  charge_efficiency: number;
  discharge_efficiency: number;
  self_discharge_rate: number;
  mass_per_wh: number;
  trl: number;
  era: 'historical' | 'current' | 'theoretical';
}

export const concentrators: ConcentratorTechnology[] = [
  {
    name: "Parabolic Dish Concentrator",
    concentration_ratio: 20,
    efficiency: 0.82,
    mass_per_m2: 3.5,
    trl: 9,
    era: "current"
  },
  {
    name: "Linear Fresnel Reflector",
    concentration_ratio: 15,
    efficiency: 0.85,
    mass_per_m2: 2.8,
    trl: 7,
    era: "current"
  },
  {
    name: "Compound Parabolic Concentrator (CPC)",
    concentration_ratio: 10,
    efficiency: 0.88,
    mass_per_m2: 2.2,
    trl: 8,
    era: "current"
  },
  {
    name: "Parabolic Trough",
    concentration_ratio: 5,
    efficiency: 0.75,
    mass_per_m2: 4.0,
    trl: 9,
    era: "historical"
  },
  {
    name: "Inflatable Fresnel Lens",
    concentration_ratio: 25,
    efficiency: 0.78,
    mass_per_m2: 1.5,
    trl: 5,
    era: "theoretical"
  },
  {
    name: "Holographic Concentrator",
    concentration_ratio: 30,
    efficiency: 0.75,
    mass_per_m2: 1.8,
    trl: 3,
    era: "theoretical"
  },
  {
    name: "Micro-Concentrator Array",
    concentration_ratio: 12,
    efficiency: 0.80,
    mass_per_m2: 2.5,
    trl: 6,
    era: "current"
  },
  {
    name: "Reflective Film Concentrator",
    concentration_ratio: 8,
    efficiency: 0.83,
    mass_per_m2: 2.0,
    trl: 7,
    era: "current"
  },
  {
    name: "Advanced Fresnel System",
    concentration_ratio: 18,
    efficiency: 0.87,
    mass_per_m2: 2.6,
    trl: 6,
    era: "current"
  }
];

export const pvCells: PVTechnology[] = [
  {
    name: "Silicon (Si)",
    efficiency: 0.15,
    temp_coefficient: -0.005,
    degradation_rate: 0.015,
    mass_per_m2: 1.2,
    trl: 9,
    era: "historical"
  },
  {
    name: "Gallium Arsenide (GaAs)",
    efficiency: 0.28,
    temp_coefficient: -0.004,
    degradation_rate: 0.008,
    mass_per_m2: 0.8,
    trl: 9,
    era: "current"
  },
  {
    name: "Triple-junction GaAs (3J)",
    efficiency: 0.32,
    temp_coefficient: -0.004,
    degradation_rate: 0.005,
    mass_per_m2: 0.7,
    trl: 9,
    era: "current"
  },
  {
    name: "Quad-junction IMM",
    efficiency: 0.34,
    temp_coefficient: -0.003,
    degradation_rate: 0.003,
    mass_per_m2: 0.6,
    trl: 8,
    era: "current"
  },
  {
    name: "Perovskite",
    efficiency: 0.25,
    temp_coefficient: -0.003,
    degradation_rate: 0.012,
    mass_per_m2: 0.4,
    trl: 5,
    era: "theoretical"
  },
  {
    name: "Quantum Dot Cells",
    efficiency: 0.45,
    temp_coefficient: -0.002,
    degradation_rate: 0.004,
    mass_per_m2: 0.5,
    trl: 5,
    era: "theoretical"
  },
  {
    name: "CIGS (Copper Indium Gallium Selenide)",
    efficiency: 0.22,
    temp_coefficient: -0.004,
    degradation_rate: 0.010,
    mass_per_m2: 0.9,
    trl: 8,
    era: "current"
  },
  {
    name: "Organic Photovoltaics",
    efficiency: 0.18,
    temp_coefficient: -0.003,
    degradation_rate: 0.020,
    mass_per_m2: 0.3,
    trl: 6,
    era: "theoretical"
  },
  {
    name: "Tandem Silicon/Perovskite",
    efficiency: 0.30,
    temp_coefficient: -0.003,
    degradation_rate: 0.008,
    mass_per_m2: 0.8,
    trl: 6,
    era: "theoretical"
  },
  {
    name: "Advanced Multi-junction (5J+)",
    efficiency: 0.38,
    temp_coefficient: -0.002,
    degradation_rate: 0.003,
    mass_per_m2: 0.6,
    trl: 7,
    era: "current"
  },
  {
    name: "Concentrator PV (CPV) Cells",
    efficiency: 0.40,
    temp_coefficient: -0.003,
    degradation_rate: 0.004,
    mass_per_m2: 0.5,
    trl: 7,
    era: "current"
  }
];

export const batteries: BatteryTechnology[] = [
  {
    name: "Nickel-Cadmium (NiCd)",
    energy_density: 50,
    cycle_life: 2000,
    charge_efficiency: 0.90,
    discharge_efficiency: 0.95,
    self_discharge_rate: 0.05,
    mass_per_wh: 0.020,
    trl: 9,
    era: "historical"
  },
  {
    name: "Nickel-Hydrogen (NiH2)",
    energy_density: 60,
    cycle_life: 20000,
    charge_efficiency: 0.90,
    discharge_efficiency: 0.95,
    self_discharge_rate: 0.02,
    mass_per_wh: 0.017,
    trl: 9,
    era: "current"
  },
  {
    name: "Lithium-ion (NMC)",
    energy_density: 220,
    cycle_life: 10000,
    charge_efficiency: 0.96,
    discharge_efficiency: 0.97,
    self_discharge_rate: 0.005,
    mass_per_wh: 0.0045,
    trl: 9,
    era: "current"
  },
  {
    name: "Lithium-ion (NCA)",
    energy_density: 240,
    cycle_life: 8000,
    charge_efficiency: 0.95,
    discharge_efficiency: 0.97,
    self_discharge_rate: 0.005,
    mass_per_wh: 0.0042,
    trl: 9,
    era: "current"
  },
  {
    name: "Lithium-ion (LFP)",
    energy_density: 150,
    cycle_life: 15000,
    charge_efficiency: 0.98,
    discharge_efficiency: 0.99,
    self_discharge_rate: 0.003,
    mass_per_wh: 0.0067,
    trl: 9,
    era: "current"
  },
  {
    name: "Lithium-Sulfur",
    energy_density: 300,
    cycle_life: 5000,
    charge_efficiency: 0.93,
    discharge_efficiency: 0.95,
    self_discharge_rate: 0.010,
    mass_per_wh: 0.0033,
    trl: 6,
    era: "theoretical"
  },
  {
    name: "Solid-State Lithium",
    energy_density: 400,
    cycle_life: 100000,
    charge_efficiency: 0.98,
    discharge_efficiency: 0.99,
    self_discharge_rate: 0.001,
    mass_per_wh: 0.0025,
    trl: 6,
    era: "theoretical"
  },
  {
    name: "Lithium-Air",
    energy_density: 500,
    cycle_life: 3000,
    charge_efficiency: 0.85,
    discharge_efficiency: 0.90,
    self_discharge_rate: 0.015,
    mass_per_wh: 0.0020,
    trl: 5,
    era: "theoretical"
  },
  {
    name: "Sodium-ion",
    energy_density: 120,
    cycle_life: 8000,
    charge_efficiency: 0.94,
    discharge_efficiency: 0.96,
    self_discharge_rate: 0.008,
    mass_per_wh: 0.0083,
    trl: 7,
    era: "current"
  },
  {
    name: "Aluminum-ion",
    energy_density: 200,
    cycle_life: 50000,
    charge_efficiency: 0.92,
    discharge_efficiency: 0.94,
    self_discharge_rate: 0.012,
    mass_per_wh: 0.0050,
    trl: 5,
    era: "theoretical"
  },
  {
    name: "Flow Battery (Vanadium)",
    energy_density: 40,
    cycle_life: 30000,
    charge_efficiency: 0.85,
    discharge_efficiency: 0.90,
    self_discharge_rate: 0.001,
    mass_per_wh: 0.025,
    trl: 8,
    era: "current"
  },
  {
    name: "Zinc-Bromine Flow",
    energy_density: 65,
    cycle_life: 25000,
    charge_efficiency: 0.88,
    discharge_efficiency: 0.92,
    self_discharge_rate: 0.002,
    mass_per_wh: 0.015,
    trl: 7,
    era: "current"
  }
];

export const getTechnologies = () => ({
  concentrators,
  pvCells,
  batteries
});
