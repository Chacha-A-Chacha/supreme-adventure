import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  updateJobProgress,
  selectJobById,
  selectJobsLoadingState,
  selectJobsErrors,
  resetJobErrors
} from '../../store/slices/jobSlice';
import { JOB_PROGRESS_STATUS, ALLOWED_STATUS_TRANSITIONS } from '../../constants/jobProgress';
import { validateJobProgress } from '../../utils/jobProgressValidation';

const JobProgressForm = ({ jobId, onClose }) => {
  const dispatch = useDispatch();
  const job = useSelector(state => selectJobById(state, Number(jobId)));
  const loadingState = useSelector(state => 
    selectJobsLoadingState(state).updateJobProgress
  );
  const error = useSelector(state => 
    selectJobsErrors(state).updateJobProgress
  );

  const [formData, setFormData] = useState({
    progress_status: job?.progress_status || '',
    notes: '',
    reason_for_status_change: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (job) {
      setFormData(prevData => ({
        ...prevData,
        progress_status: job.progress_status || ''
      }));
    }
  }, [job]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setValidationErrors(prev => ({ ...prev, [field]: null }));
  };

  // Format payload according to backend requirements
  const formatPayload = (data) => {
    // Start with required field
    const payload = {
      progress_status: data.progress_status,
    };

    // Only add optional fields if they have non-empty values
    if (data.notes?.trim()) {
      payload.notes = data.notes.trim();
    }

    // Add reason_for_status_change only for CANCELLED status
    if (data.progress_status === JOB_PROGRESS_STATUS.CANCELLED) {
      if (data.reason_for_status_change?.trim()) {
        payload.reason_for_status_change = data.reason_for_status_change.trim();
      }
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(resetJobErrors());

    const validation = validateJobProgress(formData, job?.progress_status);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    try {
      const payload = formatPayload(formData);
      console.log('Submitting progress update:', payload);
      await dispatch(updateJobProgress({
        jobId: Number(jobId),
        progressData: payload
      })).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  // Get allowed status transitions
  const getAllowedTransitions = (currentStatus) => {
    return currentStatus ? ALLOWED_STATUS_TRANSITIONS[currentStatus] : Object.values(JOB_PROGRESS_STATUS);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.progress_status}
          onValueChange={(value) => handleInputChange('progress_status', value)}
          disabled={loadingState === 'loading'}
        >
          <SelectTrigger className={validationErrors.progress_status ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(JOB_PROGRESS_STATUS)
              .filter(([_, value]) => getAllowedTransitions(job?.progress_status).includes(value))
              .map(([key, value]) => (
                <SelectItem key={value} value={value}>
                  {key.replace(/_/g, ' ')}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {validationErrors.progress_status && (
          <p className="text-sm text-red-500 mt-1">{validationErrors.progress_status}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Add any relevant notes... (max 1000 characters)"
          className={validationErrors.notes ? 'border-red-500' : ''}
          maxLength={1000}
          disabled={loadingState === 'loading'}
        />
        {validationErrors.notes && (
          <p className="text-sm text-red-500 mt-1">{validationErrors.notes}</p>
        )}
        <p className="text-sm text-gray-500">
          {formData.notes.length}/1000 characters
        </p>
      </div>

      {formData.progress_status === JOB_PROGRESS_STATUS.CANCELLED && (
        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Cancellation</Label>
          <Textarea
            id="reason"
            value={formData.reason_for_status_change}
            onChange={(e) => handleInputChange('reason_for_status_change', e.target.value)}
            placeholder="Please provide a reason for cancellation... (max 500 characters)"
            className={validationErrors.reason_for_status_change ? 'border-red-500' : ''}
            maxLength={500}
            disabled={loadingState === 'loading'}
            required
          />
          {validationErrors.reason_for_status_change && (
            <p className="text-sm text-red-500 mt-1">{validationErrors.reason_for_status_change}</p>
          )}
          <p className="text-sm text-gray-500">
            {formData.reason_for_status_change.length}/500 characters
          </p>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          disabled={loadingState === 'loading'}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={loadingState === 'loading'}
        >
          {loadingState === 'loading' ? 'Updating...' : 'Update Progress'}
        </Button>
      </div>
    </form>
  );
};

export default JobProgressForm;
