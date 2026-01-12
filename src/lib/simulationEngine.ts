/**
 * Standalone Power System Simulation Engine for 16 Psyche
 * 
 * This module implements a complete power system simulation without any backend dependencies.
 * It models solar concentrators, photovoltaic cells, battery storage, and power management
 * under asteroid environmental conditions at 2.9 AU from the Sun.
 */

import type { ConcentratorTechnology, PVTechnology, BatteryTechnology } from '../data/technologies';

/**
 * Environmental constants for asteroid 16 Psyche at 2.9 AU from the Sun
 */
const PSYCHE_CONSTANTS = {
  SOLAR_CONSTANT_EARTH: 1361, // W/m² at 1 AU
  DISTANCE_AU: 2.9, // Distance from Sun in Astronomical Units
  ROTATION_PERIOD: 4.2, // hours
  TEMP_MIN: 100, // Kelvin (night side)
  TEMP_MAX: 270, // Kelvin (day side, sunlit)
  TEMP_REF: 298, // Reference temperature for PV cells (K)
};

/**
 * Calculate solar irradiance at 16 Psyche's distance from the Sun
 * Uses inverse square law: I = I₀ / d²
 */
function getSolarIrradiance(): number {
  return PSYCHE_CONSTANTS.SOLAR_CONSTANT_EARTH / (PSYCHE_CONSTANTS.DISTANCE_AU ** 2);
}

/**
 * Calculate sun angle based on asteroid rotation
 * Returns angle in radians (0 = facing sun, π = facing away)
 */
function getSunAngle(timeHours: number): number {
  const rotationsPerHour = 1 / PSYCHE_CONSTANTS.ROTATION_PERIOD;
  const angle = (timeHours * rotationsPerHour * 2 * Math.PI) % (2 * Math.PI);
  return angle;
}

/**
 * Calculate surface temperature based on sun exposure
 * Simple model: varies between min and max based on sun angle
 */
function getSurfaceTemperature(sunAngle: number): number {
  const tempRange = PSYCHE_CONSTANTS.TEMP_MAX - PSYCHE_CONSTANTS.TEMP_MIN;
  const temp = PSYCHE_CONSTANTS.TEMP_MIN + tempRange * Math.max(0, Math.cos(sunAngle));
  return temp;
}

/**
 * Calculate solar power incident on the concentrator
 * Includes sun-tracking (optimal orientation) and cosine losses
 */
function calculateConcentratorPower(
  timeHours: number,
  concentratorArea: number,
  concentratorEfficiency: number
): number {
  const irradiance = getSolarIrradiance();
  const sunAngle = getSunAngle(timeHours);
  
  // Sun-tracking system keeps array optimally oriented
  // Power is zero when sun is behind the asteroid (angle > π/2)
  const cosineLoss = Math.max(0, Math.cos(sunAngle));
  
  return irradiance * concentratorArea * concentratorEfficiency * cosineLoss;
}

/**
 * Calculate PV cell power output with temperature effects
 */
function calculatePVPower(
  concentratedPower: number,
  _concentrationRatio: number,
  _pvArea: number,
  pvEfficiency: number,
  tempCoefficient: number,
  surfaceTemp: number
): number {
  // Temperature effect on efficiency
  const tempDelta = surfaceTemp - PSYCHE_CONSTANTS.TEMP_REF;
  const efficiencyAdjustment = 1 + (tempCoefficient * tempDelta);
  const actualEfficiency = pvEfficiency * Math.max(0.1, efficiencyAdjustment);
  
  // Power output
  return concentratedPower * actualEfficiency;
}

/**
 * Calculate spacecraft power consumption
 * Varies based on operational mode (sunlit vs eclipse)
 */
function calculatePowerConsumption(timeHours: number, baseLoad: number): number {
  const sunAngle = getSunAngle(timeHours);
  const isDay = Math.cos(sunAngle) > 0;
  
  // Base load (always on): avionics, thermal control, etc.
  let totalLoad = baseLoad;
  
  // Science instruments (operate during day)
  if (isDay) {
    totalLoad += baseLoad * 1.5; // 150% of base load for instruments
  }
  
  // Communications (periodic, every ~6 hours)
  const commCycle = timeHours % 6;
  if (commCycle < 0.5) {
    totalLoad += baseLoad * 0.8; // 80% of base load for comms
  }
  
  // Heaters (operate during night/cold periods)
  if (!isDay) {
    totalLoad += baseLoad * 1.0; // 100% of base load for heaters
  }
  
  return totalLoad;
}

/**
 * Simulate battery charge/discharge dynamics
 */
function updateBatterySOC(
  currentSOC: number,
  powerNet: number,
  batteryCapacity: number,
  chargeEfficiency: number,
  dischargeEfficiency: number,
  timeStep: number
): number {
  let energyChange = powerNet * timeStep; // Wh
  
  // Apply efficiency losses
  if (energyChange > 0) {
    // Charging
    energyChange *= chargeEfficiency;
  } else {
    // Discharging
    energyChange /= dischargeEfficiency;
  }
  
  // Update SOC
  const socChange = energyChange / batteryCapacity;
  let newSOC = currentSOC + socChange;
  
  // Clamp to valid range
  newSOC = Math.max(0.15, Math.min(0.95, newSOC)); // 15% min, 95% max for battery health
  
  return newSOC;
}

/**
 * Simulation configuration interface
 */
export interface SimulationConfig {
  concentrator: ConcentratorTechnology | null;
  pvCell: PVTechnology;
  battery: BatteryTechnology;
  concentratorArea: number;
  pvArea: number;
  batteryCapacity: number;
  baseLoad: number;
  durationHours: number;
  yearsInOperation: number;
}

/**
 * Simulation result interface
 */
export interface SimulationResult {
  time: number[];
  power_generated: number[];
  power_consumed: number[];
  battery_soc: number[];
  temperature: number[];
  metrics: {
    avg_power_generated: number;
    peak_power_generated: number;
    avg_power_consumed: number;
    peak_power_consumed: number;
    energy_balance: number;
    min_soc: number;
    final_soc: number;
    system_health: number;
    viable: boolean;
  };
}

/**
 * Main simulation function
 * Runs a time-domain simulation of the power system
 */
export function runSimulation(config: SimulationConfig): SimulationResult {
  // Validate required components
  if (!config.pvCell) {
    throw new Error('Cannot run simulation without photovoltaic cells');
  }
  if (!config.battery) {
    throw new Error('Cannot run simulation without battery');
  }
  
  // Simulation parameters
  const timeStep = 0.1; // hours (6 minutes)
  const numSteps = Math.floor(config.durationHours / timeStep);
  
  // Apply degradation based on years in operation
  const concentratorEff = config.concentrator 
    ? config.concentrator.efficiency * Math.pow(1 - 0.001, config.yearsInOperation)
    : 0;
  const pvEff = config.pvCell.efficiency * Math.pow(1 - config.pvCell.degradation_rate, config.yearsInOperation);
  
  // Initialize arrays
  const time: number[] = [];
  const powerGenerated: number[] = [];
  const powerConsumed: number[] = [];
  const batterySOC: number[] = [];
  const temperature: number[] = [];
  
  // Initial conditions
  let currentSOC = 0.80; // Start at 80% SOC
  
  // Simulation loop
  for (let step = 0; step < numSteps; step++) {
    const t = step * timeStep;
    
    // Calculate environmental conditions
    const sunAngle = getSunAngle(t);
    const surfaceTemp = getSurfaceTemperature(sunAngle);
    
    // Calculate power generation
    let pvPower = 0;
    
    if (config.concentrator) {
      // With concentrator
      const concentratorPower = calculateConcentratorPower(
        t,
        config.concentratorArea,
        concentratorEff
      );
      
      pvPower = calculatePVPower(
        concentratorPower,
        config.concentrator.concentration_ratio,
        config.pvArea,
        pvEff,
        config.pvCell.temp_coefficient,
        surfaceTemp
      );
    } else {
      // Direct PV without concentrator
      const irradiance = getSolarIrradiance();
      const sunAngleCalc = getSunAngle(t);
      const cosineLoss = Math.max(0, Math.cos(sunAngleCalc));
      const incidentPower = irradiance * config.pvArea * cosineLoss;
      
      const tempDelta = surfaceTemp - PSYCHE_CONSTANTS.TEMP_REF;
      const efficiencyAdjustment = 1 + (config.pvCell.temp_coefficient * tempDelta);
      const actualEfficiency = pvEff * Math.max(0.1, efficiencyAdjustment);
      
      pvPower = incidentPower * actualEfficiency;
    }
    
    // Calculate power consumption
    const loadPower = calculatePowerConsumption(t, config.baseLoad);
    
    // Net power
    const netPower = pvPower - loadPower;
    
    // Update battery
    currentSOC = updateBatterySOC(
      currentSOC,
      netPower,
      config.batteryCapacity,
      config.battery.charge_efficiency,
      config.battery.discharge_efficiency,
      timeStep
    );
    
    // Store results
    time.push(t);
    powerGenerated.push(pvPower);
    powerConsumed.push(loadPower);
    batterySOC.push(currentSOC);
    temperature.push(surfaceTemp);
  }
  
  // Calculate metrics
  const avgPowerGenerated = powerGenerated.reduce((a, b) => a + b, 0) / powerGenerated.length;
  const peakPowerGenerated = Math.max(...powerGenerated);
  const avgPowerConsumed = powerConsumed.reduce((a, b) => a + b, 0) / powerConsumed.length;
  const peakPowerConsumed = Math.max(...powerConsumed);
  
  const totalEnergyGenerated = powerGenerated.reduce((sum, p) => sum + p * timeStep, 0);
  const totalEnergyConsumed = powerConsumed.reduce((sum, p) => sum + p * timeStep, 0);
  const energyBalance = totalEnergyGenerated - totalEnergyConsumed;
  
  const minSOC = Math.min(...batterySOC);
  const finalSOC = batterySOC[batterySOC.length - 1];
  
  // System health score (0-5)
  let healthScore = 0;
  if (minSOC > 0.20) healthScore += 1;
  if (minSOC > 0.40) healthScore += 1;
  if (energyBalance > 0) healthScore += 1;
  if (finalSOC > 0.70) healthScore += 1;
  if (avgPowerGenerated > avgPowerConsumed * 1.2) healthScore += 1;
  
  const viable = minSOC > 0.20 && energyBalance > 0;
  
  return {
    time,
    power_generated: powerGenerated,
    power_consumed: powerConsumed,
    battery_soc: batterySOC,
    temperature,
    metrics: {
      avg_power_generated: avgPowerGenerated,
      peak_power_generated: peakPowerGenerated,
      avg_power_consumed: avgPowerConsumed,
      peak_power_consumed: peakPowerConsumed,
      energy_balance: energyBalance,
      min_soc: minSOC,
      final_soc: finalSOC,
      system_health: healthScore,
      viable,
    },
  };
}
