export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'operator' | 'manager';
  avatarUrl?: string;
}

export interface Microgrid {
  id: string;
  name: string;
  location: string;
  capacityKwh: number;
  batteryCapacityKwh: number;
  solarCapacityKw: number;
  windCapacityKw: number;
  status: 'online' | 'offline' | 'maintenance' | 'fault';
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SensorReading {
  id: string;
  microgridId: string;
  timestamp: Date;
  solar: {
    voltage: number;
    current: number;
    power: number;
  };
  wind: {
    voltage: number;
    current: number;
    power: number;
    speed: number;
  };
  battery: {
    voltage: number;
    current: number;
    soc: number;
    soh: number;
    temperature: number;
  };
  load: {
    voltage: number;
    current: number;
    power: number;
  };
  ambientTemperature: number;
}

export interface Alert {
  id: string;
  microgridId: string;
  type: 'fault' | 'warning' | 'info' | 'critical';
  category: 'battery' | 'solar' | 'wind' | 'load' | 'system';
  title: string;
  description: string;
  severity: 1 | 2 | 3 | 4 | 5;
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  createdAt: Date;
}

export interface EnergyAnalytics {
  id: string;
  microgridId: string;
  date: Date;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  solarEnergyKwh: number;
  windEnergyKwh: number;
  batteryChargedKwh: number;
  batteryDischargedKwh: number;
  loadConsumedKwh: number;
  gridExportKwh: number;
  gridImportKwh: number;
  efficiencyPercent: number;
}

export interface AIPrediction {
  id: string;
  microgridId: string;
  predictionType: 'failure' | 'energy' | 'battery_life' | 'maintenance';
  predictionDate: Date;
  confidenceScore: number;
  predictedValue: Record<string, unknown>;
  actualValue?: Record<string, unknown>;
  createdAt: Date;
}

export interface MaintenanceLog {
  id: string;
  microgridId: string;
  type: 'preventive' | 'corrective' | 'inspection';
  title: string;
  description: string;
  performedBy?: string;
  scheduledDate?: Date;
  completedDate?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
}
