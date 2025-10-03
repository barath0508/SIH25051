import { Battery, Thermometer, Activity, TrendingUp, Zap } from 'lucide-react';
import type { SensorReading } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface BatteryAnalyticsProps {
  reading: SensorReading;
}

export function BatteryAnalytics({ reading }: BatteryAnalyticsProps) {
  const batteryStatus = reading.battery.soc > 80 ? 'Quantum Charged' :
                        reading.battery.soc > 50 ? 'Optimal' :
                        reading.battery.soc > 20 ? 'Moderate' : 'Critical Alert';

  const healthStatus = reading.battery.soh > 95 ? 'Peak Performance' :
                       reading.battery.soh > 85 ? 'Stable' :
                       reading.battery.soh > 70 ? 'Degrading' : 'Service Required';

  const tempStatus = reading.battery.temperature < 30 ? 'Optimal' :
                     reading.battery.temperature < 40 ? 'Normal' :
                     reading.battery.temperature < 50 ? 'Elevated' : 'Critical';

  const isCharging = reading.battery.current > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <Battery className="w-5 h-5 text-white" />
            </div>
            <CardTitle>Neural Battery Core</CardTitle>
          </div>
          <div className={`px-4 py-2 rounded-xl text-sm font-bold border ${
            isCharging ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}>
            {isCharging ? '⚡ Charging' : '🔋 Discharging'}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-bold text-purple-200 uppercase tracking-wide">Energy Reserve</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">
                  {reading.battery.soc.toFixed(1)}%
                </div>
                <div className={`text-sm font-semibold ${
                  reading.battery.soc > 80 ? 'text-emerald-300' :
                  reading.battery.soc > 50 ? 'text-blue-300' :
                  reading.battery.soc > 20 ? 'text-amber-300' : 'text-red-300'
                }`}>{batteryStatus}</div>
              </div>
            </div>
            <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  reading.battery.soc > 80 ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
                  reading.battery.soc > 50 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                  reading.battery.soc > 20 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-red-500 to-orange-400'
                } shadow-lg`}
                style={{ width: `${reading.battery.soc}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-bold text-purple-200 uppercase tracking-wide">System Integrity</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">
                  {reading.battery.soh.toFixed(1)}%
                </div>
                <div className={`text-sm font-semibold ${
                  reading.battery.soh > 95 ? 'text-emerald-300' :
                  reading.battery.soh > 85 ? 'text-blue-300' :
                  reading.battery.soh > 70 ? 'text-amber-300' : 'text-red-300'
                }`}>{healthStatus}</div>
              </div>
            </div>
            <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  reading.battery.soh > 95 ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
                  reading.battery.soh > 85 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                  reading.battery.soh > 70 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-red-500 to-orange-400'
                } shadow-lg`}
                style={{ width: `${reading.battery.soh}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
            <div className="glass-dark p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <Thermometer className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-bold text-purple-200 uppercase tracking-wide">Core Temp</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {reading.battery.temperature.toFixed(1)}°C
              </div>
              <div className={`text-xs font-semibold ${
                reading.battery.temperature < 40 ? 'text-emerald-300' : 'text-orange-300'
              }`}>
                {tempStatus}
              </div>
            </div>

            <div className="glass-dark p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
                  <TrendingUp className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-bold text-purple-200 uppercase tracking-wide">Flow Rate</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {Math.abs(reading.battery.current).toFixed(1)}A
              </div>
              <div className={`text-xs font-semibold ${isCharging ? 'text-emerald-300' : 'text-amber-300'}`}>
                {isCharging ? 'Energy Input' : 'Energy Output'}
              </div>
            </div>
          </div>

          <div className="glass-dark p-4 rounded-xl border border-blue-500/30">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-blue-300 mb-2">
                  Quantum Battery Management Online
                </div>
                <div className="text-xs text-blue-200 leading-relaxed">
                  Neural algorithms are optimizing charge cycles, thermal regulation, and longevity protocols to maximize energy efficiency and extend operational lifespan.
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
