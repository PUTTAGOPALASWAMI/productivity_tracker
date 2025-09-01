import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Play, Pause, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  timeSpent: number;
  estimatedTime: number;
}

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTimer: (taskId: string) => void;
  activeTimer: string | null;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onDeleteTask,
  onToggleTimer,
  activeTimer
}) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="glass-card transition-smooth hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant={task.completed ? "success" : "ghost"}
                  size="sm"
                  onClick={() => onToggleComplete(task.id)}
                  className="transition-bounce"
                >
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
                <div>
                  <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary">{task.category}</Badge>
                    <Badge 
                      variant={task.priority === 'high' ? 'destructive' : 
                              task.priority === 'medium' ? 'warning' : 'secondary'}
                    >
                      {task.priority}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatTime(task.timeSpent)} / {formatTime(task.estimatedTime)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={activeTimer === task.id ? "destructive" : "primary"}
                  size="sm"
                  onClick={() => onToggleTimer(task.id)}
                  disabled={task.completed}
                  className="transition-smooth"
                >
                  {activeTimer === task.id ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteTask(task.id)}
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive transition-smooth"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};