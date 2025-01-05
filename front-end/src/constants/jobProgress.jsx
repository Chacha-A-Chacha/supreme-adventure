// constants/jobProgress.js
export const JOB_PROGRESS_STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    ON_HOLD: 'on_hold',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  };
  
export const ALLOWED_STATUS_TRANSITIONS = {
    [JOB_PROGRESS_STATUS.PENDING]: [
      JOB_PROGRESS_STATUS.IN_PROGRESS,
      JOB_PROGRESS_STATUS.CANCELLED
    ],
    [JOB_PROGRESS_STATUS.IN_PROGRESS]: [
      JOB_PROGRESS_STATUS.ON_HOLD,
      JOB_PROGRESS_STATUS.COMPLETED,
      JOB_PROGRESS_STATUS.CANCELLED
    ],
    [JOB_PROGRESS_STATUS.ON_HOLD]: [
      JOB_PROGRESS_STATUS.IN_PROGRESS,
      JOB_PROGRESS_STATUS.CANCELLED
    ],
    [JOB_PROGRESS_STATUS.COMPLETED]: [
      JOB_PROGRESS_STATUS.IN_PROGRESS
    ],
    [JOB_PROGRESS_STATUS.CANCELLED]: []
  };
