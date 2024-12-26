// JobProgressForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateJobProgress } from '../../store/slices/jobSlice';

const JobProgressForm = ({ jobId, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    progress_status: '',
    notes: '',
    completed_at: null,
    reason_for_status_change: ''
  });
  const [error, setError] = useState(null);

  const progressStatuses = [
    'pending',
    'in_progress',
    'on_hold',
    'completed',
    'cancelled'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.progress_status) {
      setError('Please select a status.');
      return;
    }

    try {
      await dispatch(updateJobProgress({ jobId, progressData: formData }));
      onClose();
    } catch (err) {
      setError('Failed to update progress. Please try again.');
    }
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
          onValueChange={(value) => setFormData({ ...formData, progress_status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {progressStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status.replace('_', ' ').toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any relevant notes..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Status Change</Label>
        <Textarea
          id="reason"
          value={formData.reason_for_status_change}
          onChange={(e) => setFormData({ ...formData, reason_for_status_change: e.target.value })}
          placeholder="Explain why the status is being changed..."
        />
      </div>

      <Button type="submit">Update Progress</Button>
    </form>
  );
};

export default JobProgressForm;