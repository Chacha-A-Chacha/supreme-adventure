export const validateJobProgress = (data, currentStatus) => {
    const errors = {};
  
    // Required field validation
    if (!data.progress_status) {
      errors.progress_status = 'Status is required';
    }
  
    // Status transition validation
    if (data.progress_status && currentStatus) {
      const allowedTransitions = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
      if (!allowedTransitions.includes(data.progress_status)) {
        errors.progress_status = `Cannot transition from ${currentStatus} to ${data.progress_status}`;
      }
    }
  
    // Notes length validation
    if (data.notes && data.notes.length > 1000) {
      errors.notes = 'Notes cannot exceed 1000 characters';
    }
  
    // Reason validation for status change
    if (data.progress_status === JOB_PROGRESS_STATUS.CANCELLED) {
      if (!data.reason_for_status_change) {
        errors.reason_for_status_change = 'Reason is required when cancelling a job';
      } else if (data.reason_for_status_change.length > 500) {
        errors.reason_for_status_change = 'Reason cannot exceed 500 characters';
      }
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  