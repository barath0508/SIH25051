import type { SensorReading } from '../types';

interface EnergyChartProps {
  readings: SensorReading[];
}

export function EnergyChart({ readings }: EnergyChartProps) {
  if (readings.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-purple-300">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-medium">Initializing neural data stream...</p>
        </div>
      </div>
    );
  }

  const maxPower = Math.max(
    ...readings.map(r => Math.max(r.solar.power, r.wind.power, r.load.power))
  );
  const scale = maxPower > 0 ? 180 / maxPower : 1;

  const currentTime = new Date().toLocaleTimeString();
  const efficiency = readings.length > 0 ? 
    ((readings[readings.length - 1].solar.power + readings[readings.length - 1].wind.power) / 
     readings[readings.length - 1].load.power * 100) : 0;

  return (
    <div className="h-64 relative bg-gradient-to-br from-slate-800/50 to-purple-900/30 rounded-xl p-4 overflow-hidden">
      {/* Real-time indicator */}
      <div className="absolute top-2 right-2 flex items-center gap-2 glass-dark px-3 py-1 rounded-lg z-10">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        <span className="text-xs text-emerald-300 font-medium">LIVE</span>
      </div>
      
      {/* Efficiency indicator */}
      <div className="absolute top-2 left-2 glass-dark px-3 py-1 rounded-lg z-10">
        <span className="text-xs text-purple-200">Efficiency: </span>
        <span className={`text-xs font-bold ${efficiency > 100 ? 'text-emerald-300' : efficiency > 80 ? 'text-blue-300' : 'text-amber-300'}`}>
          {efficiency.toFixed(0)}%
        </span>
      </div>

      <svg className="w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="none">
        <defs>
          <linearGradient id="solarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="windGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="loadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        <g stroke="rgba(255,255,255,0.1)" strokeWidth="1">
          {[0, 1, 2, 3, 4].map(i => (
            <line key={i} x1="0" y1={i * 45} x2="600" y2={i * 45} />
          ))}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <line key={i} x1={i * 120} y1="0" x2={i * 120} y2="180" />
          ))}
        </g>

        <g>
          {readings.length > 1 && (
            <>
              {/* Solar area */}
              <path
                d={`M ${readings.map((r, i) => {
                  const x = (i / (readings.length - 1)) * 600;
                  const y = 180 - (r.solar.power * scale);
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')} L 600 180 L 0 180 Z`}
                fill="url(#solarGradient)"
                stroke="#fbbf24"
                strokeWidth="3"
                filter="url(#glow)"
              />

              {/* Wind area */}
              <path
                d={`M ${readings.map((r, i) => {
                  const x = (i / (readings.length - 1)) * 600;
                  const y = 180 - (r.wind.power * scale);
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')} L 600 180 L 0 180 Z`}
                fill="url(#windGradient)"
                stroke="#06b6d4"
                strokeWidth="3"
                filter="url(#glow)"
              />

              {/* Load line */}
              <path
                d={`M ${readings.map((r, i) => {
                  const x = (i / (readings.length - 1)) * 600;
                  const y = 180 - (r.load.power * scale);
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}`}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="4"
                strokeDasharray="6 3"
                filter="url(#glow)"
              />

              {/* Data points */}
              {readings.map((r, i) => {
                const x = (i / (readings.length - 1)) * 600;
                return (
                  <g key={i}>
                    <circle cx={x} cy={180 - (r.solar.power * scale)} r="3" fill="#fbbf24" />
                    <circle cx={x} cy={180 - (r.wind.power * scale)} r="3" fill="#06b6d4" />
                    <circle cx={x} cy={180 - (r.load.power * scale)} r="3" fill="#8b5cf6" />
                  </g>
                );
              })}
            </>
          )}
        </g>
      </svg>

      <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-8">
        <div className="flex items-center gap-2 glass-dark px-3 py-1.5 rounded-lg">
          <div className="w-3 h-3 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />
          <span className="text-xs font-bold text-amber-200 uppercase tracking-wide">Solar</span>
        </div>
        <div className="flex items-center gap-2 glass-dark px-3 py-1.5 rounded-lg">
          <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
          <span className="text-xs font-bold text-cyan-200 uppercase tracking-wide">Wind</span>
        </div>
        <div className="flex items-center gap-2 glass-dark px-3 py-1.5 rounded-lg">
          <div className="w-3 h-3 rounded-full bg-violet-400 shadow-lg shadow-violet-400/50" />
          <span className="text-xs font-bold text-violet-200 uppercase tracking-wide">Load</span>
        </div>
      </div>
    </div>
  );
}
