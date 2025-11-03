import { Process } from '@/types/scheduler';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ProcessTableProps {
  processes: Process[];
}

export const ProcessTable = ({ processes }: ProcessTableProps) => {
  if (processes.length === 0 || !processes[0].completionTime) {
    return null;
  }

  return (
    <Card className="p-6 border-border bg-card shadow-card">
      <h3 className="text-lg font-semibold mb-4">Process Details</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="font-mono">PID</TableHead>
              <TableHead className="font-mono">Arrival</TableHead>
              <TableHead className="font-mono">Burst</TableHead>
              <TableHead className="font-mono">Priority</TableHead>
              <TableHead className="font-mono">Completion</TableHead>
              <TableHead className="font-mono">Turnaround</TableHead>
              <TableHead className="font-mono">Waiting</TableHead>
              <TableHead className="font-mono">Response</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processes.map((process) => (
              <TableRow key={process.id} className="border-border">
                <TableCell className="font-bold text-primary font-mono">
                  {process.id}
                </TableCell>
                <TableCell className="font-mono">{process.arrivalTime}</TableCell>
                <TableCell className="font-mono">{process.burstTime}</TableCell>
                <TableCell className="font-mono">{process.priority}</TableCell>
                <TableCell className="font-mono">{process.completionTime}</TableCell>
                <TableCell className="font-mono">{process.turnaroundTime}</TableCell>
                <TableCell className="font-mono">{process.waitingTime}</TableCell>
                <TableCell className="font-mono">{process.responseTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
