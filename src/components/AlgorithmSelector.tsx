import { SchedulingAlgorithm } from '@/types/scheduler';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Cpu, Brain } from 'lucide-react';

interface AlgorithmSelectorProps {
  selectedAlgorithm: SchedulingAlgorithm;
  onAlgorithmChange: (algorithm: SchedulingAlgorithm) => void;
  onRunSimulation: () => void;
  disabled: boolean;
}

export const AlgorithmSelector = ({
  selectedAlgorithm,
  onAlgorithmChange,
  onRunSimulation,
  disabled,
}: AlgorithmSelectorProps) => {
  const algorithms: { value: SchedulingAlgorithm; label: string; description: string }[] = [
    { value: 'FCFS', label: 'FCFS', description: 'First Come First Served' },
    { value: 'SJF', label: 'SJF', description: 'Shortest Job First' },
    { value: 'RR', label: 'Round Robin', description: 'Time Quantum: 4ms' },
    { value: 'Priority', label: 'Priority', description: 'Higher priority first' },
    { value: 'AI', label: 'AI Scheduler', description: 'ML-powered optimization' },
  ];

  return (
    <Card className="p-6 border-border bg-card shadow-card">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Select Scheduling Algorithm</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {algorithms.map((algo) => (
            <button
              key={algo.value}
              onClick={() => onAlgorithmChange(algo.value)}
              disabled={disabled && algo.value === 'AI'}
              className={`p-4 rounded-lg border-2 transition-smooth text-left ${
                selectedAlgorithm === algo.value
                  ? 'border-primary bg-primary/10 shadow-glow'
                  : 'border-border bg-secondary hover:border-primary/50'
              } ${disabled && algo.value === 'AI' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-2 mb-1">
                {algo.value === 'AI' && <Brain className="w-4 h-4 text-accent" />}
                <span className="font-semibold text-sm">{algo.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">{algo.description}</p>
            </button>
          ))}
        </div>

        <Button
          onClick={onRunSimulation}
          disabled={disabled}
          className="w-full shadow-glow"
          size="lg"
        >
          <Cpu className="w-4 h-4 mr-2" />
          Run Simulation
        </Button>
      </div>
    </Card>
  );
};
