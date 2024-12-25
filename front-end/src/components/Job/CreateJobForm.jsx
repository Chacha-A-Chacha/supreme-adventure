import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../../store/slices/jobSlice';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@/components/ui/alert';
import { AlertCircle, Plus, Trash } from 'lucide-react';

const initialFormState = {
  client_name: '',
  client_phone_number: '',
  description: '',
  job_type: 'in_house',
  vendor_name: '',
  vendor_cost_per_unit: '',
  total_units: '',
  pricing_per_unit: '',
  pricing_input: '',
  use_unit_pricing: true,
  timeframe: {
    start: '',
    end: ''
  },
  expenses: []
};

const CreateJobForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.client_name.trim()) {
      newErrors.client_name = 'Client name is required';
    }

    if (!formData.client_phone_number.trim()) {
      newErrors.client_phone_number = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.client_phone_number)) {
      newErrors.client_phone_number = 'Invalid phone number format';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.timeframe.start) {
      newErrors.start_date = 'Start date is required';
    }

    if (!formData.timeframe.end) {
      newErrors.end_date = 'End date is required';
    }

    // Validate pricing
    if (formData.use_unit_pricing) {
      if (formData.job_type === 'outsourced') {
        if (!formData.vendor_name.trim()) {
          newErrors.vendor_name = 'Vendor name is required';
        }
        if (!formData.vendor_cost_per_unit || formData.vendor_cost_per_unit <= 0) {
          newErrors.vendor_cost_per_unit = 'Valid vendor cost is required';
        }
        if (!formData.total_units || formData.total_units <= 0) {
          newErrors.total_units = 'Valid total units is required';
        }
        if (!formData.pricing_per_unit || formData.pricing_per_unit <= 0) {
          newErrors.pricing_per_unit = 'Valid pricing per unit is required';
        }
      }
    } else {
      if (!formData.pricing_input || formData.pricing_input <= 0) {
        newErrors.pricing_input = 'Base pricing is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('timeframe.')) {
      const timeframeField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        timeframe: {
          ...prev.timeframe,
          [timeframeField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleExpenseChange = (index, field, value) => {
    const updatedExpenses = [...formData.expenses];
    updatedExpenses[index] = {
      ...updatedExpenses[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      expenses: updatedExpenses
    }));
  };

  const addExpense = () => {
    setFormData(prev => ({
      ...prev,
      expenses: [...prev.expenses, { name: '', cost: '', shared: false }]
    }));
  };

  const removeExpense = (index) => {
    setFormData(prev => ({
      ...prev,
      expenses: prev.expenses.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const jobData = {
        ...formData,
        expenses: formData.expenses.filter(exp => exp.name && exp.cost),
        // If using unit pricing, set pricing_input to 0
        pricing_input: formData.use_unit_pricing ? 0 : parseFloat(formData.pricing_input),
        // If not using unit pricing, clear unit-related fields
        ...((!formData.use_unit_pricing || formData.job_type === 'in_house') && {
          vendor_cost_per_unit: 0,
          total_units: 0,
          pricing_per_unit: 0
        })
      };

      // Remove the use_unit_pricing field as it's not needed in the API
      delete jobData.use_unit_pricing;

      await dispatch(createJob(jobData)).unwrap();
      navigate('/jobs');
    } catch (error) {
      setSubmitError(error.message || 'Failed to create job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Job</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="client_name">Client Name</Label>
              <Input
                id="client_name"
                name="client_name"
                value={formData.client_name}
                onChange={handleInputChange}
                className={errors.client_name ? 'border-red-500' : ''}
              />
              {errors.client_name && (
                <p className="text-sm text-red-500">{errors.client_name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="client_phone_number">Phone Number</Label>
              <Input
                id="client_phone_number"
                name="client_phone_number"
                value={formData.client_phone_number}
                onChange={handleInputChange}
                className={errors.client_phone_number ? 'border-red-500' : ''}
              />
              {errors.client_phone_number && (
                <p className="text-sm text-red-500">{errors.client_phone_number}</p>
              )}
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div>
              <Label htmlFor="job_type">Job Type</Label>
              <Select
                name="job_type"
                value={formData.job_type}
                onValueChange={(value) =>
                  handleInputChange({ target: { name: 'job_type', value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_house">In-House</SelectItem>
                  <SelectItem value="outsourced">Outsourced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pricing Type Selection */}
            <div>
              <Label htmlFor="pricing_type">Pricing Method</Label>
              <Select
                value={formData.use_unit_pricing.toString()}
                onValueChange={(value) =>
                  handleInputChange({
                    target: {
                      name: 'use_unit_pricing',
                      value: value === 'true'
                    }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pricing method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Unit-based Pricing</SelectItem>
                  <SelectItem value="false">Base Pricing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Base Pricing Input */}
          {!formData.use_unit_pricing && (
            <div>
              <Label htmlFor="pricing_input">Base Price</Label>
              <Input
                type="number"
                id="pricing_input"
                name="pricing_input"
                value={formData.pricing_input}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={errors.pricing_input ? 'border-red-500' : ''}
              />
              {errors.pricing_input && (
                <p className="text-sm text-red-500">{errors.pricing_input}</p>
              )}
            </div>
          )}

          {/* Outsourced Job Fields */}
          {formData.job_type === 'outsourced' && formData.use_unit_pricing && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="vendor_name">Vendor Name</Label>
                <Input
                  id="vendor_name"
                  name="vendor_name"
                  value={formData.vendor_name}
                  onChange={handleInputChange}
                  className={errors.vendor_name ? 'border-red-500' : ''}
                />
                {errors.vendor_name && (
                  <p className="text-sm text-red-500">{errors.vendor_name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendor_cost_per_unit">Vendor Cost Per Unit</Label>
                  <Input
                    type="number"
                    id="vendor_cost_per_unit"
                    name="vendor_cost_per_unit"
                    value={formData.vendor_cost_per_unit}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={errors.vendor_cost_per_unit ? 'border-red-500' : ''}
                  />
                  {errors.vendor_cost_per_unit && (
                    <p className="text-sm text-red-500">{errors.vendor_cost_per_unit}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="pricing_per_unit">Pricing Per Unit</Label>
                  <Input
                    type="number"
                    id="pricing_per_unit"
                    name="pricing_per_unit"
                    value={formData.pricing_per_unit}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={errors.pricing_per_unit ? 'border-red-500' : ''}
                  />
                  {errors.pricing_per_unit && (
                    <p className="text-sm text-red-500">{errors.pricing_per_unit}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="total_units">Total Units</Label>
                  <Input
                    type="number"
                    id="total_units"
                    name="total_units"
                    value={formData.total_units}
                    onChange={handleInputChange}
                    min="1"
                    className={errors.total_units ? 'border-red-500' : ''}
                  />
                  {errors.total_units && (
                    <p className="text-sm text-red-500">{errors.total_units}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Timeframe */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeframe.start">Start Date</Label>
              <Input
                type="date"
                id="timeframe.start"
                name="timeframe.start"
                value={formData.timeframe.start}
                onChange={handleInputChange}
                className={errors.start_date ? 'border-red-500' : ''}
              />
              {errors.start_date && (
                <p className="text-sm text-red-500">{errors.start_date}</p>
              )}
            </div>

            <div>
              <Label htmlFor="timeframe.end">End Date</Label>
              <Input
                type="date"
                id="timeframe.end"
                name="timeframe.end"
                value={formData.timeframe.end}
                onChange={handleInputChange}
                className={errors.end_date ? 'border-red-500' : ''}
              />
              {errors.end_date && (
                <p className="text-sm text-red-500">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* Expenses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Expenses (Optional)</Label>
              <Button
                type="button"
                onClick={addExpense}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Expense
              </Button>
            </div>

            {formData.expenses.map((expense, index) => (
              <div key={index} className="flex items-center gap-4">
                <Input
                  placeholder="Expense name"
                  value={expense.name}
                  onChange={(e) => handleExpenseChange(index, 'name', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Cost"
                  value={expense.cost}
                  onChange={(e) => handleExpenseChange(index, 'cost', e.target.value)}
                  min="0"
                  step="0.01"
                />
                <Button
                  type="button"
                  onClick={() => removeExpense(index)}
                  variant="destructive"
                  size="icon"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Error Message */}
          {submitError && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>

      <CardFooter className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/jobs')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Job'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreateJobForm;
