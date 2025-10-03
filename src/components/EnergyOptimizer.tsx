import { Lightbulb, Target, TrendingDown, Zap } from 'lucide-react';
import type { SensorReading } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface EnergyOptimizerProps {
  reading: SensorReading;
}

export function EnergyOptimizer({ reading }: EnergyOptimizerProps) {
  const efficiency = ((reading.solar.power + reading.wind.power) / reading.load.power * 100);
  const batteryOptimal = reading.battery.soc > 80;
  const solarPeak = new Date().getHours() >= 10 && new Date().getHours() <= 16;

  const recommendations = [
    {
      id: 1,
      title: solarPeak ? 'Peak Solar Hours' : 'Low Solar Period',
      description: solarPeak 
        ? 'Optimal time for high-energy tasks like water heating, EV charging'
        : 'Consider deferring non-essential loads to peak hours',
      priority: solarPeak ? 'high' : 'medium',
      savings: solarPeak ? '₹45/day' : '₹20/day',
      icon: Lightbulb
    },
    {
      id: 2,
      title: batteryOptimal ? 'Battery Fully Charged' : 'Battery Conservation',
      description: batteryOptimal
        ? 'Excess energy available - good time for community activities'
        : 'Prioritize essential loads, avoid high-power appliances',
      priority: batteryOptimal ? 'low' : 'high',
      savings: '₹30/day',
      icon: Target
    },
    {
      id: 3,
      title: 'Load Balancing',
      description: efficiency > 120 
        ? 'Surplus energy - consider storing or sharing with neighbors'
        : 'Optimize load distribution across peak generation hours',
      priority: 'medium',
      savings: '₹25/day',
      icon: TrendingDown
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30';
      case 'medium': return 'text-amber-300 bg-amber-500/20 border-amber-500/30';
      case 'low': return 'text-blue-300 bg-blue-500/20 border-blue-500/30';
      default: return 'text-purple-300 bg-purple-500/20 border-purple-500/30';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <CardTitle>Smart Energy Optimizer</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-purple-200">Current Efficiency</span>
            <span className={`text-2xl font-bold ${efficiency > 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {efficiency.toFixed(0)}%
            </span>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-700 ${efficiency > 100 ? 'bg-gradient-to-r from-emerald-500 to-green-400' : 'bg-gradient-to-r from-amber-500 to-yellow-400'}`}
              style={{ width: `${Math.min(efficiency, 100)}%` }}
            />
          </div>
          <div className="text-xs text-purple-300 mt-2">
            {efficiency > 120 ? 'Excellent - Surplus available' : 
             efficiency > 100 ? 'Good - Meeting demand' : 
             'Optimize - Using battery/grid'}
          </div>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="glass-dark p-4 rounded-xl border border-white/10">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                  <rec.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-white text-sm">{rec.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full border font-semibold ${getPriorityColor(rec.priority)}`}>
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-purple-200 mb-2">{rec.description}</p>
                  <div className="text-xs text-emerald-300 font-semibold">
                    Potential savings: {rec.savings}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 glass-dark p-4 rounded-xl border border-green-500/30">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-green-300 mb-2">
                AI Optimization Active
              </div>
              <div className="text-xs text-green-200 leading-relaxed">
                Smart algorithms are continuously analyzing your energy patterns to maximize efficiency and minimize costs. 
                Follow the recommendations above for optimal savings.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}