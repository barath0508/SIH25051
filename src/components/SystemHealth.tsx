import { Activity, Wifi, Database, Cpu, HardDrive, Signal } from 'lucide-react';
import type { SensorReading } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface SystemHealthProps {
  reading: SensorReading;
  recentReadings: SensorReading[];
}

export function SystemHealth({ reading, recentReadings }: SystemHealthProps) {
  const systemMetrics = {
    connectivity: 98.5,
    dataQuality: 99.2,
    sensorHealth: 96.8,
    storageUsed: 23.4,
    cpuUsage: 12.3,
    memoryUsage: 34.7
  };

  const getHealthColor = (value: number) => {
    if (value >= 95) return 'text-emerald-400';
    if (value >= 85) return 'text-blue-400';
    if (value >= 70) return 'text-amber-400';
    return 'text-red-400';
  };

  const getHealthStatus = (value: number) => {
    if (value >= 95) return 'Excellent';
    if (value >= 85) return 'Good';
    if (value >= 70) return 'Fair';
    return 'Poor';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <CardTitle>System Health Monitor</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Connectivity */}
          <div className="glass-dark p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Wifi className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Network</div>
                <div className="text-xs text-purple-200">Connectivity</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-bold ${getHealthColor(systemMetrics.connectivity)}`}>
                {systemMetrics.connectivity.toFixed(1)}%
              </span>
              <span className={`text-xs font-semibold ${getHealthColor(systemMetrics.connectivity)}`}>
                {getHealthStatus(systemMetrics.connectivity)}
              </span>
            </div>
            <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500"
                style={{ width: `${systemMetrics.connectivity}%` }}
              />
            </div>
          </div>

          {/* Data Quality */}
          <div className="glass-dark p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Database className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Data Quality</div>
                <div className="text-xs text-purple-200">Accuracy</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-bold ${getHealthColor(systemMetrics.dataQuality)}`}>
                {systemMetrics.dataQuality.toFixed(1)}%
              </span>
              <span className={`text-xs font-semibold ${getHealthColor(systemMetrics.dataQuality)}`}>
                {getHealthStatus(systemMetrics.dataQuality)}
              </span>
            </div>
            <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${systemMetrics.dataQuality}%` }}
              />
            </div>
          </div>

          {/* Sensor Health */}
          <div className="glass-dark p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Signal className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Sensors</div>
                <div className="text-xs text-purple-200">Hardware</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-bold ${getHealthColor(systemMetrics.sensorHealth)}`}>
                {systemMetrics.sensorHealth.toFixed(1)}%
              </span>
              <span className={`text-xs font-semibold ${getHealthColor(systemMetrics.sensorHealth)}`}>
                {getHealthStatus(systemMetrics.sensorHealth)}
              </span>
            </div>
            <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-400 transition-all duration-500"
                style={{ width: `${systemMetrics.sensorHealth}%` }}
              />
            </div>
          </div>

          {/* Storage Usage */}
          <div className="glass-dark p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <HardDrive className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Storage</div>
                <div className="text-xs text-purple-200">SD Card</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">
                {systemMetrics.storageUsed.toFixed(1)}%
              </span>
              <span className="text-xs font-semibold text-emerald-300">
                Available
              </span>
            </div>
            <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-red-400 transition-all duration-500"
                style={{ width: `${systemMetrics.storageUsed}%` }}
              />
            </div>
          </div>

          {/* CPU Usage */}
          <div className="glass-dark p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">CPU</div>
                <div className="text-xs text-purple-200">ESP32</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">
                {systemMetrics.cpuUsage.toFixed(1)}%
              </span>
              <span className="text-xs font-semibold text-emerald-300">
                Optimal
              </span>
            </div>
            <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-500"
                style={{ width: `${systemMetrics.cpuUsage}%` }}
              />
            </div>
          </div>

          {/* Memory Usage */}
          <div className="glass-dark p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Memory</div>
                <div className="text-xs text-purple-200">RAM</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">
                {systemMetrics.memoryUsage.toFixed(1)}%
              </span>
              <span className="text-xs font-semibold text-blue-300">
                Good
              </span>
            </div>
            <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-purple-400 transition-all duration-500"
                style={{ width: `${systemMetrics.memoryUsage}%` }}
              />
            </div>
          </div>
        </div>

        {/* System Status Summary */}
        <div className="mt-6 glass-dark p-4 rounded-xl border border-blue-500/30">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-blue-300 mb-2">
                🔧 System Status: All Systems Operational
              </div>
              <div className="text-xs text-blue-200 leading-relaxed">
                <strong>Last Maintenance:</strong> 3 days ago • <strong>Next Scheduled:</strong> In 4 days
                <br />
                <strong>Data Backup:</strong> Automatic every 6 hours • <strong>Firmware:</strong> v2.1.3 (Latest)
                <br />
                <strong>Sensors Active:</strong> 8/8 • <strong>Communication:</strong> WiFi Strong Signal
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}