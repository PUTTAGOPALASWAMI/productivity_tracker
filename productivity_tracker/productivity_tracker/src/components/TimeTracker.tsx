import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';

interface TimeTrackerProps {
  activeTaskId: string | null;
  onStart: (taskId: string) => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
}

export const TimeTracker: React.FC<TimeTrackerProps> = ({
  activeTaskId,
  onStart,
  onPause,
  onStop,
  onReset
}) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && activeTaskId) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, activeTaskId]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (activeTaskId) {
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    onPause();
  };

  const handleStop = () => {
    setIsRunning(false);
    onStop();
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    onReset();
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-center">Time Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-mono font-bold gradient-primary bg-clip-text text-transparent">
            {formatTime(time)}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {activeTaskId ? 'Task active' : 'No active task'}
          </p>
        </div>

        <div className="flex justify-center space-x-2">
          {!isRunning ? (
            <Button
              variant="hero"
              size="lg"
              onClick={handleStart}
              disabled={!activeTaskId}
              className="transition-bounce"
            >
              <Play className="h-5 w-5 mr-2" />
              Start
            </Button>
          ) : (
            <Button
              variant="warning"
              size="lg"
              onClick={handlePause}
              className="transition-bounce"
            >
              <Pause className="h-5 w-5 mr-2" />
              Pause
            </Button>
          )}

          <Button
            variant="destructive"
            size="lg"
            onClick={handleStop}
            disabled={!isRunning && time === 0}
            className="transition-bounce"
          >
            <Square className="h-5 w-5 mr-2" />
            Stop
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={handleReset}
            disabled={time === 0}
            className="transition-bounce"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};