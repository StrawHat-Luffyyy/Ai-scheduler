import { useState } from 'react';
import { Process, SchedulingAlgorithm, SchedulerResult } from '@/types/scheduler';
import { ProcessInputForm } from '@/components/ProcessInputForm';
import { AlgorithmSelector } from '@/components/AlgorithmSelector';
import { GanttChart } from '@/components/GanttChart';
import { MetricsDashboard } from '@/components/MetricsDashboard';
import { ProcessTable } from '@/components/ProcessTable';
import { fcfs, sjf, srtf, roundRobin, priorityScheduling } from '@/utils/schedulingAlgorithms';
import { toast } from 'sonner';
import { Cpu, Sparkles } from 'lucide-react';

const Index = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SchedulingAlgorithm>('FCFS');
  const [result, setResult] = useState<SchedulerResult | null>(null);

  const handleRunSimulation = () => {
    if (processes.length === 0) {
      toast.error('Please add at least one process');
      return;
    }

    let simulationResult: SchedulerResult;

    try {
      switch (selectedAlgorithm) {
        case 'FCFS':
          simulationResult = fcfs(processes);
          break;
        case 'SJF':
          simulationResult = sjf(processes);
          break;
        case 'SRTF':
          simulationResult = srtf(processes);
          break;
        case 'RR':
          simulationResult = roundRobin(processes, 4);
          break;
        case 'Priority':
          simulationResult = priorityScheduling(processes);
          break;
        case 'AI':
          toast.info('AI Scheduler coming soon! Using SJF for now.');
          simulationResult = sjf(processes);
          break;
        default:
          simulationResult = fcfs(processes);
      }

      setResult(simulationResult);
      toast.success(`${selectedAlgorithm} simulation completed`);
    } catch (error) {
      toast.error('Simulation failed. Please check your inputs.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="container mx-auto px-4 py-12 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Process Scheduling</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Process Scheduler
              <span className="block mt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Simulator
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Visualize and compare CPU scheduling algorithms with real-time Gantt charts,
              performance metrics, and AI-powered optimization.
            </p>

            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary font-mono">6</div>
                <div className="text-sm text-muted-foreground">Algorithms</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="text-3xl font-bold text-accent font-mono">∞</div>
                <div className="text-sm text-muted-foreground">Processes</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="flex items-center gap-1 text-3xl font-bold text-success font-mono">
                  <Cpu className="w-8 h-8" />
                </div>
                <div className="text-sm text-muted-foreground">Real-time</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input & Controls */}
          <div className="lg:col-span-1 space-y-6">
            <ProcessInputForm processes={processes} onProcessesChange={setProcesses} />
            <AlgorithmSelector
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmChange={setSelectedAlgorithm}
              onRunSimulation={handleRunSimulation}
              disabled={processes.length === 0}
            />
          </div>

          {/* Right Column - Visualization & Results */}
          <div className="lg:col-span-2 space-y-6">
            <GanttChart
              ganttChart={result?.ganttChart || []}
              algorithm={result?.algorithm || 'None'}
            />
            <MetricsDashboard metrics={result?.metrics || null} />
            <ProcessTable processes={result?.processes || []} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Built with React, TypeScript, and Tailwind CSS</p>
            <p className="mt-1">Operating Systems Lab Project • 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
