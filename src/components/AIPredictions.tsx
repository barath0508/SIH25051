import { Brain, TrendingUp, Wrench, AlertTriangle, Calendar, Cpu, Sparkles } from 'lucide-react';
import type { AIPrediction } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface AIPredictionsProps {
  predictions: AIPrediction[];
}

export function AIPredictions({ predictions }: AIPredictionsProps) {
  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'energy': return TrendingUp;
      case 'battery_life': return Calendar;
      case 'maintenance': return Wrench;
      case 'failure': return AlertTriangle;
      default: return Brain;
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.9) return 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30';
    if (score >= 0.7) return 'text-blue-300 bg-blue-500/20 border-blue-500/30';
    return 'text-amber-300 bg-amber-500/20 border-amber-500/30';
  };

  const formatPredictionValue = (prediction: AIPrediction) => {
    switch (prediction.predictionType) {
      case 'energy':
        return {
          title: 'Neural Energy Forecast (24h)',
          items: [
            { label: 'Solar Harvest', value: `${(prediction.predictedValue.next24hSolarKwh as number).toFixed(1)} kWh` },
            { label: 'Wind Capture', value: `${(prediction.predictedValue.next24hWindKwh as number).toFixed(1)} kWh` },
            { label: 'Load Demand', value: `${(prediction.predictedValue.next24hLoadKwh as number).toFixed(1)} kWh` }
          ]
        };
      case 'battery_life':
        return {
          title: 'Quantum Battery Projection',
          items: [
            { label: 'SoH in 1 Year', value: `${(prediction.predictedValue.estimatedSohInOneYear as number).toFixed(1)}%` },
            { label: 'Degradation Pattern', value: prediction.predictedValue.cyclesDegrading as string },
            { label: 'Cost Optimization', value: `$${prediction.predictedValue.costSavings}` }
          ]
        };
      case 'maintenance':
        return {
          title: 'Predictive Maintenance Alert',
          items: [
            { label: 'Target Component', value: prediction.predictedValue.component as string },
            { label: 'Analysis Result', value: prediction.predictedValue.reason as string },
            { label: 'Investment Required', value: `$${prediction.predictedValue.estimatedCost}` }
          ]
        };
      default:
        return {
          title: 'Neural Prediction',
          items: []
        };
    }
  };

  if (predictions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <CardTitle>Neural Intelligence Hub</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="relative">
              <Brain className="w-16 h-16 mx-auto mb-4 text-purple-400 animate-pulse" />
              <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-purple-400/20 animate-ping" />
            </div>
            <p className="text-purple-200 font-medium">Processing quantum data streams...</p>
            <div className="mt-4 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <CardTitle>Neural Intelligence Hub</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {predictions.map((prediction) => {
            const Icon = getPredictionIcon(prediction.predictionType);
            const formatted = formatPredictionValue(prediction);
            const confidenceColor = getConfidenceColor(prediction.confidenceScore);

            return (
              <div
                key={prediction.id}
                className="glass-dark p-5 rounded-xl border border-white/10 hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-2 text-lg">
                      {formatted.title}
                    </h4>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-3 py-1.5 rounded-full font-bold border ${confidenceColor} uppercase tracking-wide`}>
                        {(prediction.confidenceScore * 100).toFixed(0)}% Neural Confidence
                      </span>
                      <span className="text-xs text-purple-300 font-medium">
                        {new Date(prediction.predictionDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {formatted.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 glass-dark rounded-lg">
                      <span className="text-purple-200 font-medium">{item.label}:</span>
                      <span className="font-bold text-white text-lg">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="glass-dark p-5 rounded-xl border border-purple-500/30">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-300" />
                  <span className="text-sm font-bold text-purple-300 uppercase tracking-wide">
                    Quantum Analytics Engine Active
                  </span>
                </div>
                <div className="text-sm text-purple-200 leading-relaxed">
                  Advanced neural networks are continuously analyzing multi-dimensional data patterns to predict system behaviors, optimize performance metrics, and prevent critical failures before they occur.
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
