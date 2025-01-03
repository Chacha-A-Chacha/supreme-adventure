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
      job_ids: ''
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
      if (!jobIdsString.trim()) {
        return [];
      }
      
      const idStrings = jobIdsString.split(',').map(id => id.trim());
      const ids = idStrings.map(id => {
        const parsed = parseInt(id);
        if (isNaN(parsed) || parsed <= 0) {
          throw new Error(`Invalid job ID: ${id}`);
        }
        return parsed;
      });
      
      const filteredIds = ids.filter(id => id !== jobId);
      
      if (ids.length > 0 && filteredIds.length === 0) {
        throw new Error('Cannot share expense with the same job');
      }
      
      return filteredIds;
    } catch (error) {
      throw new Error(`Job IDs error: ${error.message}`);
    }
  };

  const validatePayloadStructure = (payload) => {
    // Check top-level structure
    if (!payload.jobId || typeof payload.jobId !== 'number') {
      throw new Error('Invalid jobId');
    }
    
    if (!Array.isArray(payload.expenses) || payload.expenses.length === 0) {
      throw new Error('Expenses must be a non-empty array');
    }

    // Check each expense object
    payload.expenses.forEach((expense, index) => {
      if (typeof expense.name !== 'string' || expense.name.trim() === '') {
        throw new Error(`Expense #${index + 1}: Name must be a non-empty string`);
      }
      
      if (typeof expense.cost !== 'number' || expense.cost <= 0) {
        throw new Error(`Expense #${index + 1}: Cost must be a positive number`);
      }
      
      if (typeof expense.shared !== 'boolean') {
        throw new Error(`Expense #${index + 1}: Shared must be a boolean`);
      }
      
      if (expense.shared) {
        if (!Array.isArray(expense.job_ids) || expense.job_ids.length === 0) {
          throw new Error(`Expense #${index + 1}: Shared expense must have at least one job ID`);
        }
        
        if (expense.job_ids.some(id => typeof id !== 'number' || id <= 0)) {
          throw new Error(`Expense #${index + 1}: Invalid job ID in shared expense`);
        }
      }
    });

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Basic form validation
      const validationError = validateExpenses(expenses);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Format and validate each expense
      const formattedExpenses = expenses.map((expense, index) => {
        try {
          const formattedExpense = {
            name: expense.name.trim(),
            cost: parseFloat(expense.cost),
            shared: expense.shared
          };

          if (expense.shared) {
            const jobIds = parseJobIds(expense.job_ids);
            if (jobIds.length === 0) {
              throw new Error('No valid job IDs for shared expense');
            }
            formattedExpense.job_ids = jobIds;
          }

          return formattedExpense;
        } catch (err) {
          throw new Error(`Expense #${index + 1}: ${err.message}`);
        }
      });

      // Construct and validate final payload
      const payload = {
        jobId,
        expenses: formattedExpenses
      };

      // Validate payload structure
      validatePayloadStructure(payload);

      // Log the final payload for verification
      console.log('Submitting expenses payload:', payload);

      // Submit the payload
      await dispatch(addJobExpenses(payload));
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add expenses. Please try again.');
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