import { Process, GanttChartItem, SchedulerResult, SchedulerMetrics } from '@/types/scheduler';

const calculateMetrics = (
  processes: Process[],
  ganttChart: GanttChartItem[],
  totalTime: number
): SchedulerMetrics => {
  const n = processes.length;
  const totalWaitingTime = processes.reduce((sum, p) => sum + (p.waitingTime || 0), 0);
  const totalTurnaroundTime = processes.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0);
  const totalResponseTime = processes.reduce((sum, p) => sum + (p.responseTime || 0), 0);

  const idleTime = totalTime - processes.reduce((sum, p) => sum + p.burstTime, 0);
  const cpuUtilization = ((totalTime - idleTime) / totalTime) * 100;

  return {
    averageWaitingTime: totalWaitingTime / n,
    averageTurnaroundTime: totalTurnaroundTime / n,
    averageResponseTime: totalResponseTime / n,
    cpuUtilization,
    throughput: n / totalTime,
  };
};

export const fcfs = (processes: Process[]): SchedulerResult => {
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const ganttChart: GanttChartItem[] = [];
  let currentTime = 0;
  const responseMap = new Map<string, number>();

  sortedProcesses.forEach((process) => {
    if (currentTime < process.arrivalTime) {
      currentTime = process.arrivalTime;
    }

    if (!responseMap.has(process.id)) {
      responseMap.set(process.id, currentTime - process.arrivalTime);
    }

    ganttChart.push({
      processId: process.id,
      startTime: currentTime,
      endTime: currentTime + process.burstTime,
    });

    currentTime += process.burstTime;
    process.completionTime = currentTime;
    process.turnaroundTime = process.completionTime - process.arrivalTime;
    process.waitingTime = process.turnaroundTime - process.burstTime;
    process.responseTime = responseMap.get(process.id);
  });

  const metrics = calculateMetrics(sortedProcesses, ganttChart, currentTime);

  return {
    processes: sortedProcesses,
    ganttChart,
    metrics,
    algorithm: 'FCFS',
  };
};

export const sjf = (processes: Process[]): SchedulerResult => {
  const remainingProcesses = processes.map((p) => ({ ...p, remainingTime: p.burstTime }));
  const ganttChart: GanttChartItem[] = [];
  const completedProcesses: Process[] = [];
  let currentTime = 0;
  const responseMap = new Map<string, number>();

  while (completedProcesses.length < processes.length) {
    const availableProcesses = remainingProcesses.filter(
      (p) => p.arrivalTime <= currentTime && p.remainingTime! > 0
    );

    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }

    const shortestJob = availableProcesses.reduce((min, p) =>
      p.burstTime < min.burstTime ? p : min
    );

    if (!responseMap.has(shortestJob.id)) {
      responseMap.set(shortestJob.id, currentTime - shortestJob.arrivalTime);
    }

    ganttChart.push({
      processId: shortestJob.id,
      startTime: currentTime,
      endTime: currentTime + shortestJob.burstTime,
    });

    currentTime += shortestJob.burstTime;
    shortestJob.completionTime = currentTime;
    shortestJob.turnaroundTime = shortestJob.completionTime - shortestJob.arrivalTime;
    shortestJob.waitingTime = shortestJob.turnaroundTime - shortestJob.burstTime;
    shortestJob.responseTime = responseMap.get(shortestJob.id);
    shortestJob.remainingTime = 0;
    completedProcesses.push(shortestJob);
  }

  const metrics = calculateMetrics(completedProcesses, ganttChart, currentTime);

  return {
    processes: completedProcesses,
    ganttChart,
    metrics,
    algorithm: 'SJF',
  };
};


export const roundRobin = (processes: Process[], quantum: number = 4): SchedulerResult => {
  const queue = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const ganttChart: GanttChartItem[] = [];
  let currentTime = 0;
  const responseMap = new Map<string, number>();
  const readyQueue: Process[] = [];
  const completedProcesses: Process[] = [];

  queue.forEach((p) => {
    p.remainingTime = p.burstTime;
  });

  let index = 0;

  while (completedProcesses.length < processes.length) {
    while (index < queue.length && queue[index].arrivalTime <= currentTime) {
      readyQueue.push(queue[index]);
      index++;
    }

    if (readyQueue.length === 0) {
      currentTime++;
      continue;
    }

    const process = readyQueue.shift()!;

    if (!responseMap.has(process.id)) {
      responseMap.set(process.id, currentTime - process.arrivalTime);
    }

    const executionTime = Math.min(quantum, process.remainingTime!);
    ganttChart.push({
      processId: process.id,
      startTime: currentTime,
      endTime: currentTime + executionTime,
    });

    currentTime += executionTime;
    process.remainingTime! -= executionTime;

    while (index < queue.length && queue[index].arrivalTime <= currentTime) {
      readyQueue.push(queue[index]);
      index++;
    }

    if (process.remainingTime === 0) {
      process.completionTime = currentTime;
      process.turnaroundTime = process.completionTime - process.arrivalTime;
      process.waitingTime = process.turnaroundTime - process.burstTime;
      process.responseTime = responseMap.get(process.id);
      completedProcesses.push(process);
    } else {
      readyQueue.push(process);
    }
  }

  const metrics = calculateMetrics(completedProcesses, ganttChart, currentTime);

  return {
    processes: completedProcesses,
    ganttChart,
    metrics,
    algorithm: 'Round Robin',
  };
};

export const priorityScheduling = (processes: Process[]): SchedulerResult => {
  const remainingProcesses = processes.map((p) => ({ ...p, remainingTime: p.burstTime }));
  const ganttChart: GanttChartItem[] = [];
  const completedProcesses: Process[] = [];
  let currentTime = 0;
  const responseMap = new Map<string, number>();

  while (completedProcesses.length < processes.length) {
    const availableProcesses = remainingProcesses.filter(
      (p) => p.arrivalTime <= currentTime && p.remainingTime! > 0
    );

    if (availableProcesses.length === 0) {
      currentTime++;
      continue;
    }

    const highestPriority = availableProcesses.reduce((max, p) =>
      p.priority > max.priority ? p : max
    );

    if (!responseMap.has(highestPriority.id)) {
      responseMap.set(highestPriority.id, currentTime - highestPriority.arrivalTime);
    }

    ganttChart.push({
      processId: highestPriority.id,
      startTime: currentTime,
      endTime: currentTime + highestPriority.burstTime,
    });

    currentTime += highestPriority.burstTime;
    highestPriority.completionTime = currentTime;
    highestPriority.turnaroundTime = highestPriority.completionTime - highestPriority.arrivalTime;
    highestPriority.waitingTime = highestPriority.turnaroundTime - highestPriority.burstTime;
    highestPriority.responseTime = responseMap.get(highestPriority.id);
    highestPriority.remainingTime = 0;
    completedProcesses.push(highestPriority);
  }

  const metrics = calculateMetrics(completedProcesses, ganttChart, currentTime);

  return {
    processes: completedProcesses,
    ganttChart,
    metrics,
    algorithm: 'Priority',
  };
};
