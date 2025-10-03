import { Wrench, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import type { SensorReading } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface MaintenanceAlertsProps {
  reading: SensorReading;
}

export function MaintenanceAlerts({ reading }: MaintenanceAlertsProps) {
  const maintenanceTasks = [
    {
      id: 1,
      task: 'Solar Panel Cleaning',
      priority: 'medium',
      dueDate: '2024-01-15',
      status: 'pending',
      description: 'Clean dust and debris from solar panels for optimal efficiency',
      estimatedCost: 200,
      impact: 'May reduce generation by 15-20%'
    },
    {
      id: 2,
      task: 'Battery Voltage Check',
      priority: 'high',
      dueDate: '2024-01-10',
      status: 'overdue',
      description: 'Inspect battery connections and voltage levels',
      estimatedCost: 150,
      impact: 'Critical for system reliability'
    },
    {
      id: 3,
      task: 'Wind Turbine Lubrication',
      priority: 'low',
      dueDate: '2024-01-20',
      status: 'scheduled',
      description: 'Lubricate wind turbine bearings and check blade alignment',
      estimatedCost: 300,
      impact: 'Prevents mechanical wear'
    },
    {
      id: 4,
      task: 'System Calibration',
      priority: 'medium',
      dueDate: '2024-01-12',
      status: 'completed',
      description: 'Calibrate sensors and verify measurement accuracy',
      estimatedCost: 100,
      impact: 'Ensures accurate monitoring'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-300 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-amber-300 bg-amber-500/20 border-amber-500/30';
      case 'low': return 'text-blue-300 bg-blue-500/20 border-blue-500/30';
      default: return 'text-purple-300 bg-purple-500/20 border-purple-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'scheduled': return <Calendar className="w-4 h-4 text-blue-400" />;
      default: return <Wrench className="w-4 h-4 text-purple-400" />;
    }
  };

  const pendingTasks = maintenanceTasks.filter(task => task.status !== 'completed');
  const totalCost = pendingTasks.reduce((sum, task) => sum + task.estimatedCost, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <CardTitle>Maintenance Schedule</CardTitle>
          </div>
          <div className="text-right">
            <div className="text-sm text-purple-300">{pendingTasks.length} pending</div>
            <div className="text-xs text-amber-300">₹{totalCost} estimated</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="glass-dark p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-red-300">{maintenanceTasks.filter(t => t.status === 'overdue').length}</div>
              <div className="text-xs text-purple-200">Overdue</div>
            </div>
            <div className="glass-dark p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-amber-300">{maintenanceTasks.filter(t => t.status === 'pending').length}</div>
              <div className="text-xs text-purple-200">Pending</div>
            </div>
            <div className="glass-dark p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-blue-300">{maintenanceTasks.filter(t => t.status === 'scheduled').length}</div>
              <div className="text-xs text-purple-200">Scheduled</div>
            </div>
            <div className="glass-dark p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-emerald-300">{maintenanceTasks.filter(t => t.status === 'completed').length}</div>
              <div className="text-xs text-purple-200">Completed</div>
            </div>
          </div>

          {/* Maintenance Tasks */}
          <div className="space-y-3">
            {maintenanceTasks.map((task) => (
              <div
                key={task.id}
                className={`glass-dark p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01] ${
                  task.status === 'overdue' ? 'border-red-500/50' : 
                  task.status === 'completed' ? 'border-emerald-500/30' : 'border-white/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(task.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-white text-sm">{task.task}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full border font-semibold uppercase tracking-wide ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-purple-200 mb-2">{task.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-4">
                        <span className="text-purple-300">
                          📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        <span className="text-amber-300">
                          💰 ₹{task.estimatedCost}
                        </span>
                      </div>
                      <span className={`font-medium ${
                        task.status === 'overdue' ? 'text-red-300' :
                        task.status === 'completed' ? 'text-emerald-300' :
                        task.status === 'pending' ? 'text-amber-300' : 'text-blue-300'
                      }`}>
                        {task.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-cyan-300">
                      ⚠️ {task.impact}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Maintenance Tips */}
          <div className="mt-6 glass-dark p-4 rounded-xl border border-blue-500/30">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-blue-300 mb-2">
                  💡 Preventive Maintenance Tips
                </div>
                <div className="text-xs text-blue-200 leading-relaxed space-y-1">
                  <div>• Clean solar panels monthly during dry season</div>
                  <div>• Check battery terminals for corrosion weekly</div>
                  <div>• Monitor wind turbine vibrations during high winds</div>
                  <div>• Keep vegetation clear around equipment</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}