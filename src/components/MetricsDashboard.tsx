import { SchedulerMetrics } from '@/types/scheduler';
import { Card } from '@/components/ui/card';
import { Clock, TrendingUp, Cpu, Zap } from 'lucide-react';

interface MetricsDashboardProps {
  metrics: SchedulerMetrics | null;
}

export const MetricsDashboard = ({ metrics }: MetricsDashboardProps) => {
  if (!metrics) {
    return (
      <Card className="p-8 border-border bg-card shadow-card">
        <div className="text-center text-muted-foreground">
          <p>No metrics available</p>
          <p className="text-sm mt-2">Run a scheduling algorithm to see performance metrics</p>
        </div>
      </Card>
    );
  }

  const metricCards = [
    {
      label: 'Avg Waiting Time',
      value: metrics.averageWaitingTime.toFixed(2),
      unit: 'ms',
      icon: Clock,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Avg Turnaround Time',
      value: metrics.averageTurnaroundTime.toFixed(2),
      unit: 'ms',
      icon: TrendingUp,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      label: 'CPU Utilization',
      value: metrics.cpuUtilization.toFixed(2),
      unit: '%',
      icon: Cpu,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: 'Throughput',
      value: metrics.throughput.toFixed(3),
      unit: 'proc/ms',
      icon: Zap,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((metric, index) => (
        <Card
          key={metric.label}
          className="p-6 border-border bg-card shadow-card transition-smooth hover:shadow-glow animate-slide-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${metric.bg}`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono">
                {metric.value}
                <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">{metric.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
