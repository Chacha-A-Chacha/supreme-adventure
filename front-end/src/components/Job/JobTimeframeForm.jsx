// JobTimeframeForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { updateJobTimeframe } from '../../store/slices/jobSlice';

const JobTimeframeForm = ({ jobId, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    reason_for_change: ''
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.start_date || !formData.end_date) {
      setError('Please fill in both dates.');
      return;
    }

    try {
      await dispatch(updateJobTimeframe({ jobId, timeframeData: formData }));
      onClose();
    } catch (err) {
      setError('Failed to update timeframe. Please try again.');
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
        <Label htmlFor="start-date">Start Date</Label>
        <Input
          id="start-date"
          type="date"
          value={formData.start_date}
          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="end-date">End Date</Label>
        <Input
          id="end-date"
          type="date"
          value={formData.end_date}
          onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Change</Label>
        <Textarea
          id="reason"
          value={formData.reason_for_change}
          onChange={(e) => setFormData({ ...formData, reason_for_change: e.target.value })}
          placeholder="Explain why the timeframe is being changed..."
        />
      </div>

      <Button type="submit">Update Timeframe</Button>
    </form>
  );
};

export default JobTimeframeForm;
