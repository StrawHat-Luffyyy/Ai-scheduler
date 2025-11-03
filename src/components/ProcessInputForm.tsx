import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Process } from '@/types/scheduler';
import { toast } from 'sonner';

interface ProcessInputFormProps {
  processes: Process[];
  onProcessesChange: (processes: Process[]) => void;
}

export const ProcessInputForm = ({ processes, onProcessesChange }: ProcessInputFormProps) => {
  const [formData, setFormData] = useState({
    arrivalTime: '',
    burstTime: '',
    priority: '',
  });

  const handleAddProcess = () => {
    if (!formData.arrivalTime || !formData.burstTime || !formData.priority) {
      toast.error('Please fill all fields');
      return;
    }

    const newProcess: Process = {
      id: `P${processes.length + 1}`,
      arrivalTime: parseInt(formData.arrivalTime),
      burstTime: parseInt(formData.burstTime),
      priority: parseInt(formData.priority),
    };

    onProcessesChange([...processes, newProcess]);
    setFormData({ arrivalTime: '', burstTime: '', priority: '' });
    toast.success(`Process ${newProcess.id} added`);
  };

  const handleDeleteProcess = (id: string) => {
    onProcessesChange(processes.filter((p) => p.id !== id));
    toast.success(`Process ${id} removed`);
  };

  const handleQuickFill = () => {
    const sampleProcesses: Process[] = [
      { id: 'P1', arrivalTime: 0, burstTime: 8, priority: 3 },
      { id: 'P2', arrivalTime: 1, burstTime: 4, priority: 1 },
      { id: 'P3', arrivalTime: 2, burstTime: 9, priority: 4 },
      { id: 'P4', arrivalTime: 3, burstTime: 5, priority: 2 },
      { id: 'P5', arrivalTime: 4, burstTime: 2, priority: 5 },
    ];
    onProcessesChange(sampleProcesses);
    toast.success('Sample data loaded');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 border-border bg-card shadow-card">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Add Process</h3>
            <Button variant="outline" size="sm" onClick={handleQuickFill}>
              Quick Fill
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="arrivalTime">Arrival Time</Label>
              <Input
                id="arrivalTime"
                type="number"
                min="0"
                placeholder="0"
                value={formData.arrivalTime}
                onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="burstTime">Burst Time</Label>
              <Input
                id="burstTime"
                type="number"
                min="1"
                placeholder="5"
                value={formData.burstTime}
                onChange={(e) => setFormData({ ...formData, burstTime: e.target.value })}
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                min="1"
                placeholder="1"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <Button onClick={handleAddProcess} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Process
          </Button>
        </div>
      </Card>

      {processes.length > 0 && (
        <Card className="p-6 border-border bg-card shadow-card">
          <h3 className="text-lg font-semibold mb-4">Process Queue</h3>
          <div className="space-y-2">
            {processes.map((process) => (
              <div
                key={process.id}
                className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border transition-smooth hover:border-primary"
              >
                <div className="flex items-center gap-6 text-sm font-mono">
                  <span className="font-bold text-primary">{process.id}</span>
                  <span className="text-muted-foreground">AT: {process.arrivalTime}</span>
                  <span className="text-muted-foreground">BT: {process.burstTime}</span>
                  <span className="text-muted-foreground">P: {process.priority}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteProcess(process.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
