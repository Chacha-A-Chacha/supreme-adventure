// JobExpenseForm.jsx
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
    { name: '', cost: '', shared: false, job_ids: [] }
  ]);
  const [error, setError] = useState(null);

  const handleAddExpense = () => {
    setExpenses([...expenses, { name: '', cost: '', shared: false, job_ids: [] }]);
  };

  const handleExpenseChange = (index, field, value) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index] = {
      ...updatedExpenses[index],
      [field]: field === 'cost' ? parseFloat(value) || '' : value
    };
    setExpenses(updatedExpenses);
  };

  const handleRemoveExpense = (index) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validExpenses = expenses.filter(exp => exp.name && exp.cost);
    
    if (validExpenses.length > 0) {
      try {
        await dispatch(addJobExpenses({ jobId, expenses: validExpenses }));
        onClose();
      } catch (err) {
        setError('Failed to add expenses. Please try again.');
      }
    } else {
      setError('Please fill in all required fields.');
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
              value={expense.cost}
              onChange={(e) => handleExpenseChange(index, 'cost', e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id={`shared-${index}`}
              checked={expense.shared}
              onCheckedChange={(checked) => handleExpenseChange(index, 'shared', checked)}
            />
            <Label htmlFor={`shared-${index}`}>Shared Expense</Label>
          </div>
        </div>
      ))}

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={handleAddExpense}>
          Add Expense
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default JobExpenseForm;
