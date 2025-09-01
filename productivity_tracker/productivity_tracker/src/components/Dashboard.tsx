import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  Plus, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  Target,
  Calendar,
  Timer
} from 'lucide-react';
import { TaskList } from './TaskList';
import { TimeTracker } from './TimeTracker';
import { Analytics } from './Analytics';

interface Task {
  id: string;
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  timeSpent: number;
  estimatedTime: number;
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design UI Components',
      category: 'Design',
      priority: 'high',
      completed: false,
      timeSpent: 120,
      estimatedTime: 180
    },
    {
      id: '2',
      title: 'Implement Authentication',
      category: 'Development',
      priority: 'high',
      completed: true,
      timeSpent: 240,
      estimatedTime: 200
    },
    {
      id: '3',
      title: 'Write Documentation',
      category: 'Documentation',
      priority: 'medium',
      completed: false,
      timeSpent: 60,
      estimatedTime: 120
    }
  ]);

  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTimeSpent = tasks.reduce((sum, task) => sum + task.timeSpent, 0);
  const totalEstimatedTime = tasks.reduce((sum, task) => sum + task.estimatedTime, 0);
  const completionRate = (completedTasks / tasks.length) * 100;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const toggleTimer = (taskId: string) => {
    if (activeTimer === taskId) {
      setActiveTimer(null);
    } else {
      setActiveTimer(taskId);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimer) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
        setTasks(prev => prev.map(task => 
          task.id === activeTimer 
            ? { ...task, timeSpent: task.timeSpent + 1 }
            : task
        ));
      }, 60000); // Update every minute
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Productivity Tracker
        </h1>
        <p className="text-muted-foreground text-lg">
          Track your tasks, manage your time, and boost your productivity
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} completed
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(totalTimeSpent)}</div>
            <p className="text-xs text-muted-foreground">
              of {formatTime(totalEstimatedTime)} estimated
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Timer</CardTitle>
            <Timer className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeTimer ? formatTime(currentTime) : '0h 0m'}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeTimer ? 'Running' : 'Stopped'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Tasks</CardTitle>
                  <CardDescription>
                    Manage and track your current tasks
                  </CardDescription>
                </div>
                <Button variant="hero" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant={task.completed ? "success" : "ghost"}
                      size="sm"
                      onClick={() => setTasks(prev => prev.map(t => 
                        t.id === task.id ? { ...t, completed: !t.completed } : t
                      ))}
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
                  <Button
                    variant={activeTimer === task.id ? "destructive" : "primary"}
                    size="sm"
                    onClick={() => toggleTimer(task.id)}
                    disabled={task.completed}
                  >
                    {activeTimer === task.id ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Analytics Sidebar */}
        <div className="space-y-6">
          <Analytics tasks={tasks} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;