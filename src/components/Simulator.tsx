import { useState, useMemo } from 'react';
import { runSimulation, type SimulationResult } from '../lib/simulationEngine';
import { getTechnologies } from '../data/technologies';
import { presets, type PresetConfig } from '../data/presets';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

export function Simulator() {
  const technologies = getTechnologies();
  
  // Simulation state
  const [selectedConcentrator, setSelectedConcentrator] = useState<string>('Linear Fresnel Reflector');
  const [selectedPV, setSelectedPV] = useState<string>('Triple-junction GaAs (3J)');
  const [selectedBattery, setSelectedBattery] = useState<string>('Lithium-ion (NMC)');
  const [concentratorArea, setConcentratorArea] = useState(3);
  const [pvArea, setPvArea] = useState(1);
  const [batteryCapacity, setBatteryCapacity] = useState(8000);
  const [baseLoad, setBaseLoad] = useState(100);
  const [durationHours, setDurationHours] = useState(48);
  const [yearsOperation, setYearsOperation] = useState(0);
  
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Handle preset selection
  const handlePresetSelect = (preset: PresetConfig) => {
    setSelectedConcentrator(preset.concentrator || '');
    setSelectedPV(preset.pvCell);
    setSelectedBattery(preset.battery);
    setConcentratorArea(preset.parameters.concentratorArea);
    setPvArea(preset.parameters.pvArea);
    setBatteryCapacity(preset.parameters.batteryCapacity);
    setBaseLoad(preset.parameters.baseLoad);
    setDurationHours(preset.parameters.duration);
    setYearsOperation(preset.parameters.years);
  };
  
  // Handle simulation run
  const handleRunSimulation = () => {
    setIsRunning(true);
    setError(null);
    
    try {
      const concentrator = selectedConcentrator 
        ? technologies.concentrators.find(c => c.name === selectedConcentrator) || null
        : null;
      const pvCell = technologies.pvCells.find(p => p.name === selectedPV);
      const battery = technologies.batteries.find(b => b.name === selectedBattery);
      
      if (!pvCell || !battery) {
        throw new Error('Please select PV cell and battery');
      }
      
      const result = runSimulation({
        concentrator,
        pvCell,
        battery,
        concentratorArea,
        pvArea,
        batteryCapacity,
        baseLoad,
        durationHours,
        yearsInOperation: yearsOperation
      });
      
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed');
    } finally {
      setIsRunning(false);
    }
  };
  
  // Get selected technology details
  const concentratorDetails = useMemo(() => {
    if (!selectedConcentrator) return null;
    return technologies.concentrators.find(c => c.name === selectedConcentrator);
  }, [selectedConcentrator]);
  
  const pvDetails = useMemo(() => {
    return technologies.pvCells.find(p => p.name === selectedPV);
  }, [selectedPV]);
  
  const batteryDetails = useMemo(() => {
    return technologies.batteries.find(b => b.name === selectedBattery);
  }, [selectedBattery]);
  
  // Prepare chart data
  const chartData = useMemo(() => {
    if (!results) return [];
    return results.time.map((t, i) => ({
      time: t,
      generated: results.power_generated[i],
      consumed: results.power_consumed[i],
      soc: results.battery_soc[i] * 100,
    }));
  }, [results]);
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            16 Psyche Power System Simulator
          </h1>
          <p className="text-lg text-gray-600">
            Design and simulate power systems for NASA's mission to asteroid 16 Psyche at 2.9 AU from the Sun
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Presets */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Configuration Presets</h2>
              <div className="space-y-2">
                {presets.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className="w-full text-left px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{preset.name}</div>
                    <div className="text-sm text-gray-600">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Technology Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Technology Selection</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Solar Concentrator
                  </label>
                  <select
                    value={selectedConcentrator}
                    onChange={(e) => setSelectedConcentrator(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">None (Direct PV)</option>
                    {technologies.concentrators.map(c => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.concentration_ratio}x, {(c.efficiency * 100).toFixed(0)}%)
                      </option>
                    ))}
                  </select>
                  {concentratorDetails && (
                    <div className="mt-2 text-sm text-gray-600">
                      <div>Concentration: {concentratorDetails.concentration_ratio}x</div>
                      <div>Efficiency: {(concentratorDetails.efficiency * 100).toFixed(1)}%</div>
                      <div>TRL: {concentratorDetails.trl}/9</div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photovoltaic Cell
                  </label>
                  <select
                    value={selectedPV}
                    onChange={(e) => setSelectedPV(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {technologies.pvCells.map(p => (
                      <option key={p.name} value={p.name}>
                        {p.name} ({(p.efficiency * 100).toFixed(0)}%)
                      </option>
                    ))}
                  </select>
                  {pvDetails && (
                    <div className="mt-2 text-sm text-gray-600">
                      <div>Efficiency: {(pvDetails.efficiency * 100).toFixed(1)}%</div>
                      <div>Temp Coeff: {(pvDetails.temp_coefficient * 1000).toFixed(2)} %/K</div>
                      <div>TRL: {pvDetails.trl}/9</div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Battery System
                  </label>
                  <select
                    value={selectedBattery}
                    onChange={(e) => setSelectedBattery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {technologies.batteries.map(b => (
                      <option key={b.name} value={b.name}>
                        {b.name} ({b.energy_density} Wh/kg)
                      </option>
                    ))}
                  </select>
                  {batteryDetails && (
                    <div className="mt-2 text-sm text-gray-600">
                      <div>Energy Density: {batteryDetails.energy_density} Wh/kg</div>
                      <div>Cycle Life: {batteryDetails.cycle_life.toLocaleString()}</div>
                      <div>TRL: {batteryDetails.trl}/9</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* System Parameters */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">System Parameters</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Concentrator Area (m²)
                  </label>
                  <input
                    type="number"
                    value={concentratorArea}
                    onChange={(e) => setConcentratorArea(Number(e.target.value))}
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PV Array Area (m²)
                  </label>
                  <input
                    type="number"
                    value={pvArea}
                    onChange={(e) => setPvArea(Number(e.target.value))}
                    min="0.1"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Battery Capacity (Wh)
                  </label>
                  <input
                    type="number"
                    value={batteryCapacity}
                    onChange={(e) => setBatteryCapacity(Number(e.target.value))}
                    min="100"
                    step="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Load (W)
                  </label>
                  <input
                    type="number"
                    value={baseLoad}
                    onChange={(e) => setBaseLoad(Number(e.target.value))}
                    min="10"
                    step="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (hours)
                  </label>
                  <input
                    type="number"
                    value={durationHours}
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                    min="4.2"
                    step="4.2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years in Operation
                  </label>
                  <input
                    type="number"
                    value={yearsOperation}
                    onChange={(e) => setYearsOperation(Number(e.target.value))}
                    min="0"
                    max="20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <button
                onClick={handleRunSimulation}
                disabled={isRunning}
                className="w-full mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isRunning ? 'Running Simulation...' : 'Run Simulation'}
              </button>
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}
            </div>
          </div>
          
          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {results ? (
              <>
                {/* Metrics Summary */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Simulation Results</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600">Avg Power Gen</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {results.metrics.avg_power_generated.toFixed(1)} W
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600">Peak Power</div>
                      <div className="text-2xl font-bold text-green-600">
                        {results.metrics.peak_power_generated.toFixed(1)} W
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600">Min SOC</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {(results.metrics.min_soc * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="text-sm text-gray-600">Energy Balance</div>
                      <div className="text-2xl font-bold text-orange-600">
                        {(results.metrics.energy_balance / 1000).toFixed(2)} kWh
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${results.metrics.viable ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="font-semibold">
                      System Status: {results.metrics.viable ? '✓ Viable' : '✗ Non-Viable'}
                    </div>
                    <div className="text-sm mt-1">
                      Health Score: {results.metrics.system_health}/5
                    </div>
                  </div>
                </div>
                
                {/* Power Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Power Generation vs Consumption</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" label={{ value: 'Time (hours)', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Power (W)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="generated" stroke="#3b82f6" name="Generated" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="consumed" stroke="#ef4444" name="Consumed" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Battery SOC Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Battery State of Charge</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" label={{ value: 'Time (hours)', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'SOC (%)', angle: -90, position: 'insideLeft' }} domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="soc" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="SOC" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-gray-400 text-lg">
                  Configure your power system and click "Run Simulation" to see results
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
