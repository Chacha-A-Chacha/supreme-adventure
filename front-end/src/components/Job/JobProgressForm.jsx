// components/JobProgressForm.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateJobProgress, selectJobById } from '../../store/slices/jobSlice';
import { JOB_PROGRESS_STATUS } from '../../constants/jobProgress';
import { validateJobProgress } from '../../utils/jobProgressValidation';

const JobProgressForm = ({ jobId, onClose }) => {
  const dispatch = useDispatch();
  const job = useSelector(state => selectJobById(state, jobId));
  const [formData, setFormData] = useState({
    progress_status: '',
    notes: '',
    completed_at: null,
    reason_for_status_change: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

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
    // Clear validation error for the field being changed
    setValidationErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const validation = validateJobProgress(formData, job?.progress_status);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    try {
      await dispatch(updateJobProgress({
        jobId,
        progressData: formData
      })).unwrap();
      onClose();
    } catch (error) {
      setSubmitError(error.message || 'Failed to update progress. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitError && (
        <Alert variant="destructive">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.progress_status}
          onValueChange={(value) => handleInputChange('progress_status', value)}
        >
          <SelectTrigger className={validationErrors.progress_status ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(JOB_PROGRESS_STATUS).map(([key, value]) => (
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
          placeholder="Add any relevant notes..."
          className={validationErrors.notes ? 'border-red-500' : ''}
        />
        {validationErrors.notes && (
          <p className="text-sm text-red-500 mt-1">{validationErrors.notes}</p>
        )}
      </div>

      {formData.progress_status === JOB_PROGRESS_STATUS.CANCELLED && (
        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Cancellation</Label>
          <Textarea
            id="reason"
            value={formData.reason_for_status_change}
            onChange={(e) => handleInputChange('reason_for_status_change', e.target.value)}
            placeholder="Please provide a reason for cancellation..."
            className={validationErrors.reason_for_status_change ? 'border-red-500' : ''}
          />
          {validationErrors.reason_for_status_change && (
            <p className="text-sm text-red-500 mt-1">{validationErrors.reason_for_status_change}</p>
          )}
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Update Progress
        </Button>
      </div>
    </form>
  );
};


export default JobProgressForm;