import { GanttChartItem } from '@/types/scheduler';
import { Card } from '@/components/ui/card';

interface GanttChartProps {
  ganttChart: GanttChartItem[];
  algorithm: string;
}

export const GanttChart = ({ ganttChart, algorithm }: GanttChartProps) => {
  if (ganttChart.length === 0) {
    return (
      <Card className="p-8 border-border bg-card shadow-card">
        <div className="text-center text-muted-foreground">
          <p>No execution data yet</p>
          <p className="text-sm mt-2">Run a scheduling algorithm to see the Gantt chart</p>
        </div>
      </Card>
    );
  }

  const totalTime = Math.max(...ganttChart.map((item) => item.endTime));
  const colors = [
    'bg-primary',
    'bg-accent',
    'bg-warning',
    'bg-destructive',
    'bg-success',
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
  ];

  const getColor = (processId: string) => {
    const index = parseInt(processId.replace('P', '')) - 1;
    return colors[index % colors.length];
  };

  return (
    <Card className="p-6 border-border bg-card shadow-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Gantt Chart</h3>
          <span className="text-sm text-muted-foreground font-mono">
            Algorithm: {algorithm}
          </span>
        </div>

        <div className="relative">
          <div className="flex h-16 gap-[1px] bg-border rounded-lg overflow-hidden">
            {ganttChart.map((item, index) => {
              const width = ((item.endTime - item.startTime) / totalTime) * 100;
              return (
                <div
                  key={index}
                  className={`${getColor(item.processId)} flex items-center justify-center transition-all duration-500 animate-slide-in`}
                  style={{
                    width: `${width}%`,
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <span className="text-xs font-bold text-background font-mono">
                    {item.processId}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-2 text-xs text-muted-foreground font-mono">
            {ganttChart.map((item, index) => (
              <div key={index} className="flex flex-col items-center" style={{ width: `${((item.endTime - item.startTime) / totalTime) * 100}%` }}>
                <span>{item.startTime}</span>
                {index === ganttChart.length - 1 && (
                  <span className="ml-auto">{item.endTime}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          {Array.from(new Set(ganttChart.map((item) => item.processId))).map((pid) => (
            <div key={pid} className="flex items-center gap-2">
              <div className={`w-4 h-4 ${getColor(pid)} rounded`}></div>
              <span className="text-sm font-mono">{pid}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
