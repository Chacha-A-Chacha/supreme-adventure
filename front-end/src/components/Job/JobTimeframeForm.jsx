import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { updateJobTimeframe } from '../../store/slices/jobSlice';

const JobTimeframeForm = ({ jobId, start, end, onClose }) => {
  const dispatch = useDispatch();
  
  // Format dates for input fields (YYYY-MM-DD)
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Get default dates if no initial dates are provided
  const getDefaultDates = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return {
      start: today.toISOString().split('T')[0],
      end: nextWeek.toISOString().split('T')[0]
    };
  };

  // Initialize form with existing dates or defaults
  const defaults = getDefaultDates();
  const [formData, setFormData] = useState({
    start_date: formatDate(start) || defaults.start,
    end_date: formatDate(end) || defaults.end,
    reason_for_change: ''
  });
  
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dates
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    
    if (endDate < startDate) {
      setError('End date cannot be earlier than start date.');
      return;
    }

    try {
      console.log('Submitting timeframe update...');
      const result = await dispatch(updateJobTimeframe({ 
        jobId, 
        timeframeData: {
          ...formData,
          start_date: formData.start_date,
          end_date: formData.end_date,
          reason_for_change: formData.reason_for_change.trim()
        }
      }));
      
      if (result.error) {
        console.log('Update failed with error:', result.error);
        console.log('Error details:', result.payload);
      } else {
        console.log('Update successful:', result.payload);
      }
      
      onClose();
    } catch (err) {
      console.log('Form submission error:', err);
      setError('Failed to update timeframe. Please try again.');
    }
  };

  const handleDateChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    setError(null); // Clear error when user makes changes
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
          onChange={handleDateChange('start_date')}
          required
          min={defaults.start} // Prevent selecting dates in the past
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="end-date">End Date</Label>
        <Input
          id="end-date"
          type="date"
          value={formData.end_date}
          onChange={handleDateChange('end_date')}
          required
          min={formData.start_date} // Prevent selecting end date before start date
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Change</Label>
        <Textarea
          id="reason"
          value={formData.reason_for_change}
          onChange={handleDateChange('reason_for_change')}
          placeholder="Please provide a reason for changing the timeframe..."
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Update Timeframe</Button>
      </div>
    </form>
  );
};

export default JobTimeframeForm;
