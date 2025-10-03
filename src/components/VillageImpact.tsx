import { Coins, Users, Leaf, Zap, TrendingUp, Home } from 'lucide-react';
import type { SensorReading } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface VillageImpactProps {
  reading: SensorReading;
  recentReadings: SensorReading[];
}

export function VillageImpact({ reading, recentReadings }: VillageImpactProps) {
  const totalGeneration = reading.solar.power + reading.wind.power;
  const dailyGeneration = recentReadings.length > 0 ? 
    recentReadings.reduce((sum, r) => sum + r.solar.power + r.wind.power, 0) / recentReadings.length * 24 / 1000 : 0;
  
  const costSavings = dailyGeneration * 5; // ₹5 per kWh saved vs grid
  const co2Saved = dailyGeneration * 0.82; // kg CO2 per kWh
  const homesSupported = Math.round(totalGeneration / 500); // 500W per home average

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <CardTitle>Community Impact</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Economic Impact */}
          <div className="space-y-4">
            <div className="glass-dark p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                  <Coins className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-bold text-purple-200 uppercase tracking-wide">Economic Benefits</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 text-sm">Daily Savings</span>
                  <span className="text-emerald-300 font-bold text-lg">₹{costSavings.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 text-sm">Monthly Est.</span>
                  <span className="text-emerald-300 font-bold">₹{(costSavings * 30).toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 text-sm">Annual Est.</span>
                  <span className="text-emerald-300 font-bold">₹{(costSavings * 365).toFixed(0)}</span>
                </div>
              </div>
            </div>

            <div className="glass-dark p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-bold text-purple-200 uppercase tracking-wide">Village Coverage</span>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{homesSupported}</div>
                <div className="text-purple-200 text-sm">Homes Currently Powered</div>
                <div className="text-cyan-300 text-xs mt-1">Out of ~100 village homes</div>
              </div>
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="space-y-4">
            <div className="glass-dark p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-bold text-purple-200 uppercase tracking-wide">Environmental Impact</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 text-sm">CO₂ Saved Today</span>
                  <span className="text-green-300 font-bold text-lg">{co2Saved.toFixed(1)} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 text-sm">Monthly Est.</span>
                  <span className="text-green-300 font-bold">{(co2Saved * 30).toFixed(0)} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 text-sm">Trees Equivalent</span>
                  <span className="text-green-300 font-bold">🌳 {Math.round(co2Saved * 30 / 22)} trees/month</span>
                </div>
              </div>
            </div>

            <div className="glass-dark p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-bold text-purple-200 uppercase tracking-wide">System Health</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 text-sm">Efficiency</span>
                  <span className="text-blue-300 font-bold">{((totalGeneration / reading.load.power) * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 text-sm">Uptime</span>
                  <span className="text-emerald-300 font-bold">99.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 text-sm">Reliability</span>
                  <span className="text-green-300 font-bold">Excellent</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Message */}
        <div className="mt-6 glass-dark p-4 rounded-xl border border-emerald-500/30">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-300 mb-2">
                🎉 Village Energy Independence Achievement
              </div>
              <div className="text-xs text-emerald-200 leading-relaxed">
                Your community is generating <strong>{((totalGeneration / reading.load.power) * 100).toFixed(0)}%</strong> of its energy needs from clean, renewable sources. 
                This sustainable approach is saving the village money while protecting the environment for future generations.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}