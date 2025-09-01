import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Clock, Target, Calendar } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  timeSpent: number;
  estimatedTime: number;
}

interface AnalyticsProps {
  tasks: Task[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ tasks }) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const totalTimeSpent = tasks.reduce((sum, task) => sum + task.timeSpent, 0);
  const totalEstimatedTime = tasks.reduce((sum, task) => sum + task.estimatedTime, 0);
  const timeEfficiency = totalEstimatedTime > 0 ? (totalEstimatedTime / totalTimeSpent) * 100 : 0;

  const categoryStats = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = { total: 0, completed: 0, timeSpent: 0 };
    }
    acc[task.category].total += 1;
    if (task.completed) acc[task.category].completed += 1;
    acc[task.category].timeSpent += task.timeSpent;
    return acc;
  }, {} as Record<string, { total: number; completed: number; timeSpent: number }>);

  const priorityStats = tasks.reduce((acc, task) => {
    if (!acc[task.priority]) {
      acc[task.priority] = { total: 0, completed: 0 };
    }
    acc[task.priority].total += 1;
    if (task.completed) acc[task.priority].completed += 1;
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-success" />
            <span>Overall Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tasks Completed</span>
              <span>{completedTasks}/{totalTasks}</span>
            </div>
            <Progress value={completionRate} className="h-2" />
            <div className="text-center text-sm text-muted-foreground">
              {completionRate.toFixed(1)}% complete
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Time Efficiency</span>
              <span>{formatTime(totalTimeSpent)} / {formatTime(totalEstimatedTime)}</span>
            </div>
            <Progress 
              value={Math.min(timeEfficiency, 100)} 
              className="h-2"
              // @ts-ignore
              indicatorClassName={timeEfficiency > 100 ? "bg-warning" : "bg-success"}
            />
            <div className="text-center text-sm text-muted-foreground">
              {timeEfficiency.toFixed(1)}% efficiency
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <span>By Category</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(categoryStats).map(([category, stats]) => (
            <div key={category} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{category}</span>
                <span>{stats.completed}/{stats.total}</span>
              </div>
              <Progress 
                value={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0} 
                className="h-2" 
              />
              <div className="text-xs text-muted-foreground">
                {formatTime(stats.timeSpent)} spent
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Priority Breakdown */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-warning" />
            <span>By Priority</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(priorityStats).map(([priority, stats]) => (
            <div key={priority} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className={`w-3 h-3 rounded-full ${
                    priority === 'high' ? 'bg-destructive' :
                    priority === 'medium' ? 'bg-warning' : 'bg-success'
                  }`}
                />
                <span className="text-sm font-medium capitalize">{priority}</span>
              </div>
              <span className="text-sm">{stats.completed}/{stats.total}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-accent" />
            <span>Quick Stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Active Tasks</span>
            <span className="font-medium">{totalTasks - completedTasks}</span>
          </div>
          <div className="flex justify-between">
            <span>Average Time/Task</span>
            <span className="font-medium">
              {totalTasks > 0 ? formatTime(Math.round(totalTimeSpent / totalTasks)) : '0h 0m'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Most Productive</span>
            <span className="font-medium">
              {Object.entries(categoryStats).length > 0 
                ? Object.entries(categoryStats).reduce((a, b) => 
                    categoryStats[a[0]].timeSpent > categoryStats[b[0]].timeSpent ? a : b
                  )[0]
                : 'N/A'
              }
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};