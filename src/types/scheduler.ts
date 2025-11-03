export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  remainingTime?: number;
  completionTime?: number;
  turnaroundTime?: number;
  waitingTime?: number;
  responseTime?: number;
}

export interface GanttChartItem {
  processId: string;
  startTime: number;
  endTime: number;
}

export interface SchedulerMetrics {
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  averageResponseTime: number;
  cpuUtilization: number;
  throughput: number;
}

export interface SchedulerResult {
  processes: Process[];
  ganttChart: GanttChartItem[];
  metrics: SchedulerMetrics;
  algorithm: string;
}

export type SchedulingAlgorithm = 'FCFS' | 'SJF' | 'RR' | 'Priority' | 'AI';
