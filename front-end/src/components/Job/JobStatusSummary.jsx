import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JOB_PROGRESS_STATUS } from '../../constants/jobProgress';
import { 
  Clock, 
  PlayCircle, 
  PauseCircle, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';

const STATUS_CONFIG = {
  [JOB_PROGRESS_STATUS.PENDING]: {
    label: 'Pending',
    icon: Clock,
    variant: 'secondary',
    bgColor: 'bg-gray-100',
  },
  [JOB_PROGRESS_STATUS.IN_PROGRESS]: {
    label: 'In Progress',
    icon: PlayCircle,
    variant: 'default',
    bgColor: 'bg-blue-100',
  },
  [JOB_PROGRESS_STATUS.ON_HOLD]: {
    label: 'On Hold',
    icon: PauseCircle,
    variant: 'outline',
    bgColor: 'bg-yellow-100',
  },
  [JOB_PROGRESS_STATUS.COMPLETED]: {
    label: 'Completed',
    icon: CheckCircle,
    variant: 'success',
    bgColor: 'bg-green-100',
  },
  [JOB_PROGRESS_STATUS.CANCELLED]: {
    label: 'Cancelled',
    icon: XCircle,
    variant: 'destructive',
    bgColor: 'bg-red-100',
  },
};

const JobStatusSummary = () => {
  const { jobs } = useSelector((state) => state.jobs);

  if (!jobs?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Job Status Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No jobs available</p>
        </CardContent>
      </Card>
    );
  }

  const statusSummary = jobs.reduce((summary, job) => {
    summary[job.progress_status] = (summary[job.progress_status] || 0) + 1;
    return summary;
  }, {});

  const totalJobs = jobs.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Job Status Summary</span>
          <Badge variant="outline" className="ml-2">
            Total: {totalJobs}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {Object.entries(JOB_PROGRESS_STATUS).map(([key, value]) => {
            const count = statusSummary[value] || 0;
            const percentage = ((count / totalJobs) * 100).toFixed(1);
            const config = STATUS_CONFIG[value];
            const Icon = config.icon;

            return (
              <div
                key={value}
                className={`p-4 rounded-lg ${config.bgColor} transition-all hover:scale-[1.02]`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-gray-700" />
                    <span className="font-medium">{config.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={config.variant}>
                      {count}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {percentage}%
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProgressBarColor(value)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to get progress bar colors
const getProgressBarColor = (status) => {
  switch (status) {
    case JOB_PROGRESS_STATUS.PENDING:
      return 'bg-gray-500';
    case JOB_PROGRESS_STATUS.IN_PROGRESS:
      return 'bg-blue-500';
    case JOB_PROGRESS_STATUS.ON_HOLD:
      return 'bg-yellow-500';
    case JOB_PROGRESS_STATUS.COMPLETED:
      return 'bg-green-500';
    case JOB_PROGRESS_STATUS.CANCELLED:
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export default JobStatusSummary;
