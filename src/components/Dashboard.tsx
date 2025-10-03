import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Sun,
  Wind,
  Battery,
  Zap,
  Activity,
  TrendingUp,
  AlertCircle,
  Settings,
  Power,
  Sparkles,
  Shield,
  Thermometer
} from 'lucide-react';
import type { SensorReading, Alert, AIPrediction } from '../types';
import { simulationService } from '../services/simulationService';
import { MetricCard } from './MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { AlertBadge } from './AlertBadge';
import { EnergyChart } from './EnergyChart';
import { BatteryAnalytics } from './BatteryAnalytics';
import { AIPredictions } from './AIPredictions';
import { VillageImpact } from './VillageImpact';
import { MaintenanceAlerts } from './MaintenanceAlerts';
import { WeatherForecast } from './WeatherForecast';
import { SystemHealth } from './SystemHealth';
import { EnergyOptimizer } from './EnergyOptimizer';
import { CommunityHub } from './CommunityHub';

const MICROGRID_ID = 'demo-microgrid-001';

export function Dashboard() {
  const [currentReading, setCurrentReading] = useState<SensorReading | null>(null);
  const [recentReadings, setRecentReadings] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [systemStatus, setSystemStatus] = useState<'online' | 'offline' | 'fault'>('online');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, type: 'success' | 'warning' | 'error'}>>([]);
  const [dataExportFormat, setDataExportFormat] = useState<'csv' | 'json'>('csv');

  // Memoized calculations - moved before other hooks
  const totalGeneration = useMemo(() => 
    currentReading ? currentReading.solar.power + currentReading.wind.power : 0, 
    [currentReading]
  );
  
  const netPower = useMemo(() => 
    currentReading ? totalGeneration - currentReading.load.power : 0, 
    [totalGeneration, currentReading]
  );
  
  const activeAlertCount = useMemo(() => 
    alerts.filter(a => a.status === 'active').length, 
    [alerts]
  );

  // Data export function
  const exportData = useCallback(() => {
    if (!currentReading) return;
    
    const data = {
      timestamp: new Date().toISOString(),
      current: currentReading,
      recent: recentReadings,
      alerts: alerts,
      predictions: predictions
    };
    
    if (dataExportFormat === 'csv') {
      const csv = `Timestamp,Solar(kW),Wind(kW),Battery(%),Load(kW),Temperature(C)\n${recentReadings.map(r => 
        `${new Date(r.timestamp).toISOString()},${(r.solar.power/1000).toFixed(2)},${(r.wind.power/1000).toFixed(2)},${r.battery.soc.toFixed(1)},${(r.load.power/1000).toFixed(2)},${r.ambientTemperature.toFixed(1)}`
      ).join('\n')}`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `microgrid-data-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } else {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `microgrid-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    }
    
    setNotifications(prev => [...prev, {
      id: Date.now().toString(),
      message: `Data exported as ${dataExportFormat.toUpperCase()}`,
      type: 'success'
    }]);
  }, [recentReadings, currentReading, alerts, predictions, dataExportFormat]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'f':
            e.preventDefault();
            setIsFullscreen(!isFullscreen);
            break;
          case '?':
            e.preventDefault();
            setShowKeyboardShortcuts(!showKeyboardShortcuts);
            break;
          case 'e':
            e.preventDefault();
            exportData();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, showKeyboardShortcuts, recentReadings, currentReading, alerts, predictions, dataExportFormat]);

  // Auto-dismiss notifications
  useEffect(() => {
    notifications.forEach(notification => {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 3000);
    });
  }, [notifications]);

  useEffect(() => {
    const unsubscribeReading = simulationService.onReading((reading) => {
      setCurrentReading(reading);
      setRecentReadings(prev => [...prev.slice(-29), reading]);

      if (reading.battery.soc < 15 || reading.battery.temperature > 45) {
        setSystemStatus('fault');
      } else {
        setSystemStatus('online');
      }
    });

    const unsubscribeAlert = simulationService.onAlert((alert) => {
      setAlerts(prev => [alert, ...prev.slice(0, 9)]);
    });

    simulationService.startSimulation(MICROGRID_ID, 2000);

    const predictionInterval = setInterval(() => {
      if (currentReading) {
        const newPredictions = simulationService.generatePredictions(MICROGRID_ID, currentReading);
        setPredictions(newPredictions);
      }
    }, 30000);

    return () => {
      unsubscribeReading();
      unsubscribeAlert();
      simulationService.stopSimulation();
      clearInterval(predictionInterval);
    };
  }, []);

  useEffect(() => {
    if (currentReading) {
      const newPredictions = simulationService.generatePredictions(MICROGRID_ID, currentReading);
      setPredictions(newPredictions);
    }
  }, [currentReading]);

  if (!currentReading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center glass-dark rounded-3xl p-12 animate-float">
          <div className="relative">
            <Activity className="w-20 h-20 text-purple-400 mx-auto mb-6 animate-pulse-slow" />
            <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-purple-400/20 animate-ping" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 gradient-text">Initializing EcoPulse</h2>
          <p className="text-purple-200 text-lg">Connecting to renewable energy sources...</p>
          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = {
    online: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'EcoPulse Online', glow: 'shadow-emerald-500/50' },
    offline: { color: 'text-slate-400', bg: 'bg-slate-500/20', label: 'System Offline', glow: 'shadow-slate-500/50' },
    fault: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Critical Alert', glow: 'shadow-red-500/50' }
  };

  const status = statusConfig[systemStatus];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
      </div>

      <header className="glass-dark border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl sm:rounded-2xl neon-glow">
                  <Power className="w-6 h-6 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">EcoPulse</h1>
                <p className="text-xs sm:text-sm text-purple-200 font-medium hidden sm:block">Smart Energy Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-6">
              <div className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 ${status.bg} rounded-lg sm:rounded-xl border border-white/10`}>
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${systemStatus === 'online' ? 'bg-emerald-400 animate-pulse' : systemStatus === 'fault' ? 'bg-red-400 animate-pulse' : 'bg-slate-400'}`} />
                <span className={`text-xs sm:text-sm font-semibold ${status.color}`}>
                  {status.label}
                </span>
              </div>
              {activeAlertCount > 0 && (
                <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 bg-red-500/20 border border-red-500/30 rounded-lg sm:rounded-xl">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                  <span className="text-xs sm:text-sm font-bold text-red-300 hidden sm:inline">
                    {activeAlertCount} Critical Alert{activeAlertCount > 1 ? 's' : ''}
                  </span>
                  <span className="text-xs font-bold text-red-300 sm:hidden">
                    {activeAlertCount}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <select 
                  value={dataExportFormat} 
                  onChange={(e) => setDataExportFormat(e.target.value as 'csv' | 'json')}
                  className="text-xs bg-slate-800 text-white border border-white/20 rounded px-2 py-1 hidden sm:block"
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
                <button 
                  onClick={exportData}
                  className="p-2 sm:p-3 glass-dark rounded-lg sm:rounded-xl hover:bg-white/10 transition-all duration-300 group"
                  aria-label="Export Data"
                  title="Export Data (Ctrl+E)"
                >
                  <span className="text-xs sm:text-sm text-purple-300 group-hover:text-white transition-colors">📊</span>
                </button>
                <button 
                  className="p-2 sm:p-3 glass-dark rounded-lg sm:rounded-xl hover:bg-white/10 transition-all duration-300 group"
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        {/* Village Microgrid Overview */}
        <div className="mb-6 sm:mb-8 glass-dark p-4 sm:p-6 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Village Energy Status</h2>
                <p className="text-xs text-purple-200">Renewable Microgrid • Population: ~500</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-300">
                {new Date(currentReading.timestamp).toLocaleTimeString()}
              </div>
              <div className="text-xs text-emerald-300">₹{((totalGeneration * 0.005) / 1000 * 24).toFixed(0)} saved today</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="glass-dark p-3 rounded-lg text-center">
              <div className="text-xl sm:text-2xl font-bold text-emerald-400">{((currentReading.solar.power + currentReading.wind.power) / 1000).toFixed(1)}</div>
              <div className="text-xs text-purple-200">Clean Energy (kW)</div>
              <div className="text-xs text-emerald-300 mt-1">🌱 {(((currentReading.solar.power + currentReading.wind.power) / 1000) * 0.82).toFixed(1)}kg CO₂ saved</div>
            </div>
            <div className="glass-dark p-3 rounded-lg text-center">
              <div className="text-xl sm:text-2xl font-bold text-violet-400">{(currentReading.load.power / 1000).toFixed(1)}</div>
              <div className="text-xs text-purple-200">Village Load (kW)</div>
              <div className="text-xs text-blue-300 mt-1">~{Math.round((currentReading.load.power / 1000) / 0.5)} homes powered</div>
            </div>
            <div className="glass-dark p-3 rounded-lg text-center">
              <div className={`text-xl sm:text-2xl font-bold ${netPower >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {netPower >= 0 ? '+' : ''}{(netPower / 1000).toFixed(1)}
              </div>
              <div className="text-xs text-purple-200">Net Power (kW)</div>
              <div className={`text-xs mt-1 ${netPower >= 0 ? 'text-emerald-300' : 'text-amber-300'}`}>
                {netPower >= 0 ? '⚡ Surplus' : '🔋 Using Battery'}
              </div>
            </div>
            <div className="glass-dark p-3 rounded-lg text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-400">{currentReading.battery.soc.toFixed(0)}%</div>
              <div className="text-xs text-purple-200">Energy Reserve</div>
              <div className="text-xs text-cyan-300 mt-1">
                ~{Math.round((currentReading.battery.soc / 100) * 8)}h backup
              </div>
            </div>
          </div>

          {/* Weather & Environmental */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-sm font-bold text-white">Clear Sky</div>
                  <div className="text-xs text-purple-200">Solar Optimal</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="text-sm font-bold text-white">{currentReading.wind.speed.toFixed(1)} m/s</div>
                  <div className="text-xs text-purple-200">Wind Speed</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-400" />
                <div>
                  <div className="text-sm font-bold text-white">{currentReading.ambientTemperature.toFixed(0)}°C</div>
                  <div className="text-xs text-purple-200">Temperature</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-sm font-bold text-emerald-300">99.2%</div>
                  <div className="text-xs text-purple-200">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <MetricCard
            title="Solar Harvest"
            value={currentReading.solar.power / 1000}
            unit="kW"
            icon={Sun}
            iconColor="from-amber-400 to-orange-500"
            status={currentReading.solar.power < 500 && new Date().getHours() >= 10 && new Date().getHours() <= 14 ? 'warning' : 'normal'}
            trend={recentReadings.length > 1 ? {
              value: ((currentReading.solar.power - recentReadings[recentReadings.length - 2].solar.power) / recentReadings[recentReadings.length - 2].solar.power) * 100,
              label: 'vs prev'
            } : undefined}
          />
          <MetricCard
            title="Wind Capture"
            value={currentReading.wind.power / 1000}
            unit="kW"
            icon={Wind}
            iconColor="from-cyan-400 to-blue-500"
            trend={recentReadings.length > 1 ? {
              value: ((currentReading.wind.power - recentReadings[recentReadings.length - 2].wind.power) / recentReadings[recentReadings.length - 2].wind.power) * 100,
              label: 'vs prev'
            } : undefined}
          />
          <MetricCard
            title="Energy Reserve"
            value={currentReading.battery.soc}
            unit="%"
            icon={Battery}
            iconColor="from-emerald-400 to-green-500"
            status={currentReading.battery.soc < 20 ? 'critical' : currentReading.battery.soc < 40 ? 'warning' : 'normal'}
          />
          <MetricCard
            title="Power Draw"
            value={currentReading.load.power / 1000}
            unit="kW"
            icon={Zap}
            iconColor="from-violet-400 to-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle>EcoPulse Analytics</CardTitle>
                </div>
                <div className="flex items-center gap-2 text-purple-300">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Real-time Stream</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <EnergyChart readings={recentReadings} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <CardTitle>System Vitals</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-purple-200">Net Energy Flow</span>
                    <span className={`text-xl font-bold ${netPower >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {netPower >= 0 ? '+' : ''}{(netPower / 1000).toFixed(2)} kW
                    </span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ${netPower >= 0 ? 'bg-gradient-to-r from-emerald-500 to-green-400' : 'bg-gradient-to-r from-red-500 to-orange-400'}`}
                      style={{ width: `${Math.min(Math.abs(netPower / 100), 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-purple-200">Battery Integrity</span>
                    <span className="text-xl font-bold text-white">
                      {currentReading.battery.soh.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-400 transition-all duration-700"
                      style={{ width: `${currentReading.battery.soh}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-dark p-4 rounded-xl">
                    <div className="text-xs text-purple-300 mb-1">Wind Velocity</div>
                    <div className="text-lg font-bold text-white">
                      {currentReading.wind.speed.toFixed(1)} m/s
                    </div>
                  </div>
                  <div className="glass-dark p-4 rounded-xl">
                    <div className="text-xs text-purple-300 mb-1">Ambient Temp</div>
                    <div className="text-lg font-bold text-white">
                      {currentReading.ambientTemperature.toFixed(1)}°C
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="text-xs text-purple-300 mb-2">Total Generation</div>
                  <div className="text-3xl font-bold gradient-text">
                    {(totalGeneration / 1000).toFixed(2)} kW
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BatteryAnalytics reading={currentReading} />
          <AIPredictions predictions={predictions} />
        </div>

        {/* Village-Specific Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <VillageImpact reading={currentReading} recentReadings={recentReadings} />
          <MaintenanceAlerts reading={currentReading} />
        </div>

        {/* Weather Planning */}
        <div className="mb-8">
          <WeatherForecast />
        </div>

        {/* System Health */}
        <div className="mb-8">
          <SystemHealth reading={currentReading} recentReadings={recentReadings} />
        </div>

        {/* Advanced Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <EnergyOptimizer reading={currentReading} />
          <CommunityHub />
        </div>

        {alerts.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle>EcoPulse Alerts</CardTitle>
                </div>
                <span className="text-sm text-purple-300 font-medium">
                  {activeAlertCount} active signals
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.slice(0, 5).map(alert => (
                  <AlertBadge key={alert.id} alert={alert} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Keyboard Shortcuts Help */}
        {showKeyboardShortcuts && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-dark p-6 rounded-2xl border border-white/20 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Keyboard Shortcuts</h3>
                <button 
                  onClick={() => setShowKeyboardShortcuts(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <span className="text-white text-xl">×</span>
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-200">Toggle Fullscreen</span>
                  <kbd className="px-2 py-1 bg-slate-700 text-white rounded text-xs">Ctrl + F</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Show Shortcuts</span>
                  <kbd className="px-2 py-1 bg-slate-700 text-white rounded text-xs">Ctrl + ?</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Export Data</span>
                  <kbd className="px-2 py-1 bg-slate-700 text-white rounded text-xs">Ctrl + E</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Refresh Data</span>
                  <kbd className="px-2 py-1 bg-slate-700 text-white rounded text-xs">F5</kbd>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        <div className="fixed top-20 right-4 z-50 space-y-2">
          {notifications.map(notification => (
            <div key={notification.id} className={`glass-dark px-4 py-3 rounded-lg border animate-slide-in ${
              notification.type === 'success' ? 'border-emerald-500/50 bg-emerald-500/10' :
              notification.type === 'warning' ? 'border-amber-500/50 bg-amber-500/10' :
              'border-red-500/50 bg-red-500/10'
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {notification.type === 'success' ? '✓' : notification.type === 'warning' ? '⚠' : '✗'}
                </span>
                <span className={`text-sm font-medium ${
                  notification.type === 'success' ? 'text-emerald-300' :
                  notification.type === 'warning' ? 'text-amber-300' :
                  'text-red-300'
                }`}>
                  {notification.message}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Performance Panel */}
        <div className="fixed bottom-4 right-4 z-40 space-y-2">
          <div className="glass-dark px-3 py-2 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-300 font-medium">
                {recentReadings.length > 0 ? `${recentReadings.length}/30 samples` : 'Connecting...'}
              </span>
            </div>
          </div>
          <div className="glass-dark px-3 py-2 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-purple-300">Efficiency:</span>
              <span className="text-white font-bold">
                {currentReading ? ((totalGeneration / currentReading.load.power) * 100).toFixed(0) : 0}%
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
