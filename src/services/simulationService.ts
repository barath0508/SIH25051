import type { SensorReading, Alert, AIPrediction, EnergyAnalytics } from '../types';

class SimulationService {
  private intervalId: number | null = null;
  private listeners: ((reading: SensorReading) => void)[] = [];
  private alertListeners: ((alert: Alert) => void)[] = [];

  private lastSolarPower = 5000;
  private lastWindPower = 3000;
  private lastBatterySoc = 75;
  private lastBatterySoh = 98;
  private lastLoadPower = 4000;

  generateReading(microgridId: string): SensorReading {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    const solarMultiplier = hour >= 6 && hour <= 18
      ? Math.sin(((hour - 6) / 12) * Math.PI) * (0.8 + Math.random() * 0.4)
      : 0;

    const windMultiplier = 0.3 + Math.random() * 0.7 + Math.sin(hour / 24 * Math.PI * 2) * 0.2;

    const solarPower = Math.max(0, 10000 * solarMultiplier + (Math.random() - 0.5) * 1000);
    this.lastSolarPower = this.lastSolarPower * 0.7 + solarPower * 0.3;

    const windPower = Math.max(0, 5000 * windMultiplier + (Math.random() - 0.5) * 500);
    this.lastWindPower = this.lastWindPower * 0.7 + windPower * 0.3;

    const loadPower = 3000 + Math.random() * 3000 + (hour >= 18 && hour <= 22 ? 2000 : 0);
    this.lastLoadPower = this.lastLoadPower * 0.8 + loadPower * 0.2;

    const totalGeneration = this.lastSolarPower + this.lastWindPower;
    const batteryChange = (totalGeneration - this.lastLoadPower) / 10000;
    this.lastBatterySoc = Math.max(10, Math.min(100, this.lastBatterySoc + batteryChange));

    this.lastBatterySoh = Math.max(80, this.lastBatterySoh - Math.random() * 0.0001);

    const solarVoltage = 48 + (Math.random() - 0.5) * 2;
    const windVoltage = 48 + (Math.random() - 0.5) * 2;
    const batteryVoltage = 48 + (this.lastBatterySoc - 50) * 0.1;
    const loadVoltage = 48 + (Math.random() - 0.5) * 1;

    return {
      id: `reading-${Date.now()}-${Math.random()}`,
      microgridId,
      timestamp: now,
      solar: {
        voltage: solarVoltage,
        current: this.lastSolarPower / solarVoltage,
        power: this.lastSolarPower
      },
      wind: {
        voltage: windVoltage,
        current: this.lastWindPower / windVoltage,
        power: this.lastWindPower,
        speed: 3 + windMultiplier * 12
      },
      battery: {
        voltage: batteryVoltage,
        current: (totalGeneration - this.lastLoadPower) / batteryVoltage,
        soc: this.lastBatterySoc,
        soh: this.lastBatterySoh,
        temperature: 25 + Math.random() * 10
      },
      load: {
        voltage: loadVoltage,
        current: this.lastLoadPower / loadVoltage,
        power: this.lastLoadPower
      },
      ambientTemperature: 20 + Math.random() * 15
    };
  }

  detectAnomalies(reading: SensorReading): Alert[] {
    const alerts: Alert[] = [];

    if (reading.battery.soc < 20) {
      alerts.push({
        id: `alert-${Date.now()}-battery-low`,
        microgridId: reading.microgridId,
        type: 'warning',
        category: 'battery',
        title: 'Low Battery Charge',
        description: `Battery State of Charge is ${reading.battery.soc.toFixed(1)}%. Consider reducing load or increasing generation.`,
        severity: reading.battery.soc < 10 ? 5 : 3,
        status: 'active',
        createdAt: new Date()
      });
    }

    if (reading.battery.temperature > 45) {
      alerts.push({
        id: `alert-${Date.now()}-battery-temp`,
        microgridId: reading.microgridId,
        type: 'critical',
        category: 'battery',
        title: 'High Battery Temperature',
        description: `Battery temperature is ${reading.battery.temperature.toFixed(1)}°C. Risk of thermal damage.`,
        severity: 5,
        status: 'active',
        createdAt: new Date()
      });
    }

    if (reading.battery.soh < 85) {
      alerts.push({
        id: `alert-${Date.now()}-battery-health`,
        microgridId: reading.microgridId,
        type: 'warning',
        category: 'battery',
        title: 'Degraded Battery Health',
        description: `Battery State of Health is ${reading.battery.soh.toFixed(1)}%. Schedule maintenance soon.`,
        severity: 3,
        status: 'active',
        createdAt: new Date()
      });
    }

    if (reading.solar.power < 500 && new Date().getHours() >= 10 && new Date().getHours() <= 14) {
      alerts.push({
        id: `alert-${Date.now()}-solar-low`,
        microgridId: reading.microgridId,
        type: 'warning',
        category: 'solar',
        title: 'Low Solar Output',
        description: `Solar power output is only ${reading.solar.power.toFixed(0)}W during peak hours. Check for panel obstruction or fault.`,
        severity: 4,
        status: 'active',
        createdAt: new Date()
      });
    }

    if (reading.wind.speed > 20) {
      alerts.push({
        id: `alert-${Date.now()}-wind-high`,
        microgridId: reading.microgridId,
        type: 'critical',
        category: 'wind',
        title: 'High Wind Speed',
        description: `Wind speed is ${reading.wind.speed.toFixed(1)} m/s. Wind turbine may enter protection mode.`,
        severity: 4,
        status: 'active',
        createdAt: new Date()
      });
    }

    const powerBalance = reading.solar.power + reading.wind.power - reading.load.power;
    if (powerBalance < -2000 && reading.battery.soc < 30) {
      alerts.push({
        id: `alert-${Date.now()}-power-deficit`,
        microgridId: reading.microgridId,
        type: 'fault',
        category: 'system',
        title: 'Power Deficit',
        description: `System is consuming ${Math.abs(powerBalance).toFixed(0)}W more than generating. Battery depleting rapidly.`,
        severity: 5,
        status: 'active',
        createdAt: new Date()
      });
    }

    return alerts;
  }

  generatePredictions(microgridId: string, currentReading: SensorReading): AIPrediction[] {
    const predictions: AIPrediction[] = [];

    const batteryLifePrediction: AIPrediction = {
      id: `pred-${Date.now()}-battery-life`,
      microgridId,
      predictionType: 'battery_life',
      predictionDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      confidenceScore: 0.87,
      predictedValue: {
        estimatedSohInOneYear: Math.max(70, currentReading.battery.soh - 5),
        recommendedReplacementDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000),
        cyclesDegrading: 'moderate',
        costSavings: 15000
      },
      createdAt: new Date()
    };
    predictions.push(batteryLifePrediction);

    const energyForecast: AIPrediction = {
      id: `pred-${Date.now()}-energy`,
      microgridId,
      predictionType: 'energy',
      predictionDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      confidenceScore: 0.92,
      predictedValue: {
        next24hSolarKwh: 85 + Math.random() * 20,
        next24hWindKwh: 45 + Math.random() * 15,
        next24hLoadKwh: 95 + Math.random() * 10,
        expectedBatterySocEnd: currentReading.battery.soc + 5 - Math.random() * 10
      },
      createdAt: new Date()
    };
    predictions.push(energyForecast);

    if (currentReading.battery.temperature > 35 || currentReading.battery.soh < 90) {
      const maintenancePrediction: AIPrediction = {
        id: `pred-${Date.now()}-maintenance`,
        microgridId,
        predictionType: 'maintenance',
        predictionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        confidenceScore: 0.78,
        predictedValue: {
          component: 'Battery Management System',
          reason: currentReading.battery.temperature > 35 ? 'High operating temperature' : 'Declining health metrics',
          urgency: 'medium',
          estimatedCost: 2500
        },
        createdAt: new Date()
      };
      predictions.push(maintenancePrediction);
    }

    return predictions;
  }

  generateDailyAnalytics(microgridId: string): EnergyAnalytics {
    return {
      id: `analytics-${Date.now()}`,
      microgridId,
      date: new Date(),
      period: 'daily',
      solarEnergyKwh: 85 + Math.random() * 30,
      windEnergyKwh: 45 + Math.random() * 20,
      batteryChargedKwh: 35 + Math.random() * 15,
      batteryDischargedKwh: 40 + Math.random() * 15,
      loadConsumedKwh: 95 + Math.random() * 20,
      gridExportKwh: 15 + Math.random() * 10,
      gridImportKwh: 5 + Math.random() * 5,
      efficiencyPercent: 88 + Math.random() * 8
    };
  }

  startSimulation(microgridId: string, intervalMs: number = 2000) {
    if (this.intervalId !== null) {
      this.stopSimulation();
    }

    this.intervalId = window.setInterval(() => {
      const reading = this.generateReading(microgridId);
      this.listeners.forEach(listener => listener(reading));

      const alerts = this.detectAnomalies(reading);
      alerts.forEach(alert => {
        this.alertListeners.forEach(listener => listener(alert));
      });
    }, intervalMs);
  }

  stopSimulation() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  onReading(listener: (reading: SensorReading) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  onAlert(listener: (alert: Alert) => void) {
    this.alertListeners.push(listener);
    return () => {
      this.alertListeners = this.alertListeners.filter(l => l !== listener);
    };
  }
}

export const simulationService = new SimulationService();
