import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { addJobExpenses } from '../../store/slices/jobSlice';

const JobExpenseForm = ({ jobId, onClose }) => {
  const dispatch = useDispatch();
  const [expenses, setExpenses] = useState([
    { 
      name: '', 
      cost: '', 
      shared: false, 
      job_ids: '' // String for comma-separated input
    }
  ]);
  const [error, setError] = useState(null);

  const handleAddExpense = () => {
    setExpenses([...expenses, { 
      name: '', 
      cost: '', 
      shared: false, 
      job_ids: ''
    }]);
  };

  const handleExpenseChange = (index, field, value) => {
    const updatedExpenses = [...expenses];
    
    if (field === 'shared' && !value) {
      // Reset job_ids when shared is unchecked
      updatedExpenses[index] = {
        ...updatedExpenses[index],
        shared: value,
        job_ids: ''
      };
    } else {
      updatedExpenses[index] = {
        ...updatedExpenses[index],
        [field]: field === 'cost' ? parseFloat(value) || '' : value
      };
    }
    
    setExpenses(updatedExpenses);
  };

  const handleRemoveExpense = (index) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter((_, i) => i !== index));
    }
  };

  const validateExpenses = (expensesToValidate) => {
    for (const expense of expensesToValidate) {
      if (!expense.name || !expense.cost) {
        return 'Name and cost are required for all expenses.';
      }
      if (expense.shared && !expense.job_ids.trim()) {
        return 'Please enter at least one job ID for shared expenses.';
      }
      if (expense.cost <= 0) {
        return 'Cost must be greater than 0.';
      }
    }
    return null;
  };

  const parseJobIds = (jobIdsString) => {
    try {
      const ids = jobIdsString
        .split(',')
        .map(id => {
          const parsed = parseInt(id.trim());
          if (isNaN(parsed) || parsed <= 0) {
            throw new Error(`Invalid job ID: ${id}`);
          }
          return parsed;
        })
        .filter(id => id !== jobId); // Filter out current jobId
        
      if (ids.length === 0) {
        throw new Error('No valid job IDs provided');
      }
      
      return ids;
    } catch (error) {
      setError(error.message);
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateExpenses(expenses);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Format expenses for API
      const formattedExpenses = expenses.map(expense => {
        const jobIds = expense.shared ? parseJobIds(expense.job_ids) : [];
        if (expense.shared && jobIds.length === 0) {
          throw new Error('Invalid job IDs for shared expense');
        }
        
        // Ensure job_ids is always an array, even if empty
        const expensePayload = {
          name: expense.name,
          cost: parseFloat(expense.cost),
          shared: expense.shared
        };
        
        // Only include job_ids if expense is shared
        if (expense.shared) {
          expensePayload.job_ids = jobIds;
        }
        
        return expensePayload;
      });

      console.log('Submitting expenses payload:', {
        jobId,
        expenses: formattedExpenses
      });

      await dispatch(addJobExpenses({ jobId, expenses: formattedExpenses }));
      onClose();
    } catch (err) {
      setError('Failed to add expenses. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {expenses.map((expense, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Expense #{index + 1}</h3>
            {expenses.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveExpense(index)}
              >
                Remove
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`name-${index}`}>Name</Label>
            <Input
              id={`name-${index}`}
              value={expense.name}
              onChange={(e) => handleExpenseChange(index, 'name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`cost-${index}`}>Cost</Label>
            <Input
              id={`cost-${index}`}
              type="number"
              step="0.01"
              min="0.01"
              value={expense.cost}
              onChange={(e) => handleExpenseChange(index, 'cost', e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`shared-${index}`}
                checked={expense.shared}
                onCheckedChange={(checked) => handleExpenseChange(index, 'shared', checked)}
              />
              <Label htmlFor={`shared-${index}`}>Shared Expense</Label>
            </div>

            {expense.shared && (
              <div className="space-y-2">
                <Label htmlFor={`job-ids-${index}`}>
                  Job IDs (comma-separated)
                </Label>
                <Input
                  id={`job-ids-${index}`}
                  value={expense.job_ids}
                  onChange={(e) => handleExpenseChange(index, 'job_ids', e.target.value)}
                  placeholder="e.g., 123, 124, 125"
                />
                <p className="text-sm text-gray-500">
                  Enter job IDs separated by commas
                </p>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={handleAddExpense}>
          Add Another Expense
        </Button>
        <Button type="submit">Save Expenses</Button>
      </div>
    </form>
  );
};

export default JobExpenseForm;
