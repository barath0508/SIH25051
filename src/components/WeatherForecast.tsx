import { Sun, Cloud, CloudRain, Wind, Eye, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

export function WeatherForecast() {
  const forecast = [
    {
      day: 'Today',
      condition: 'sunny',
      temp: { high: 32, low: 18 },
      windSpeed: 12,
      humidity: 45,
      solarPotential: 95,
      windPotential: 70
    },
    {
      day: 'Tomorrow',
      condition: 'partly-cloudy',
      temp: { high: 29, low: 16 },
      windSpeed: 15,
      humidity: 60,
      solarPotential: 75,
      windPotential: 85
    },
    {
      day: 'Day 3',
      condition: 'cloudy',
      temp: { high: 26, low: 14 },
      windSpeed: 8,
      humidity: 75,
      solarPotential: 45,
      windPotential: 40
    },
    {
      day: 'Day 4',
      condition: 'rainy',
      temp: { high: 24, low: 12 },
      windSpeed: 20,
      humidity: 85,
      solarPotential: 25,
      windPotential: 90
    }
  ];

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-6 h-6 text-amber-400" />;
      case 'partly-cloudy': return <Cloud className="w-6 h-6 text-slate-300" />;
      case 'cloudy': return <Cloud className="w-6 h-6 text-slate-400" />;
      case 'rainy': return <CloudRain className="w-6 h-6 text-blue-400" />;
      default: return <Sun className="w-6 h-6 text-amber-400" />;
    }
  };

  const getPotentialColor = (potential: number) => {
    if (potential >= 80) return 'text-emerald-400';
    if (potential >= 60) return 'text-blue-400';
    if (potential >= 40) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <CardTitle>Weather & Generation Forecast</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {forecast.map((day, index) => (
            <div key={index} className="glass-dark p-4 rounded-xl">
              <div className="text-center mb-3">
                <div className="text-sm font-bold text-white mb-1">{day.day}</div>
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(day.condition)}
                </div>
                <div className="text-xs text-purple-200 capitalize">{day.condition.replace('-', ' ')}</div>
              </div>

              <div className="space-y-3">
                {/* Temperature */}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-purple-200">Temp</span>
                  <span className="text-sm font-bold text-white">
                    {day.temp.high}°/{day.temp.low}°C
                  </span>
                </div>

                {/* Wind & Humidity */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Wind className="w-3 h-3 text-cyan-400" />
                    <span className="text-purple-200">{day.windSpeed}m/s</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-blue-400" />
                    <span className="text-purple-200">{day.humidity}%</span>
                  </div>
                </div>

                {/* Generation Potential */}
                <div className="pt-2 border-t border-white/10">
                  <div className="text-xs text-purple-200 mb-2">Generation Potential</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <Sun className="w-3 h-3 text-amber-400" />
                        <span className="text-xs text-purple-200">Solar</span>
                      </div>
                      <span className={`text-xs font-bold ${getPotentialColor(day.solarPotential)}`}>
                        {day.solarPotential}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <Wind className="w-3 h-3 text-cyan-400" />
                        <span className="text-xs text-purple-200">Wind</span>
                      </div>
                      <span className={`text-xs font-bold ${getPotentialColor(day.windPotential)}`}>
                        {day.windPotential}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Weather Insights */}
        <div className="mt-6 glass-dark p-4 rounded-xl border border-cyan-500/30">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-cyan-300 mb-2">
                🌤️ Weather Insights for Energy Planning
              </div>
              <div className="text-xs text-cyan-200 leading-relaxed">
                <strong>Today:</strong> Excellent solar conditions expected. Consider running high-energy tasks during peak hours (10 AM - 4 PM).
                <br />
                <strong>Tomorrow:</strong> Good wind conditions. Battery charging may be optimal during evening hours.
                <br />
                <strong>Day 4:</strong> Rainy conditions will reduce solar but increase wind generation. Ensure battery reserves are adequate.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}