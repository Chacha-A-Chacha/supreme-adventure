import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createJob,
  selectJobsLoadingState,
  selectJobsErrors,
  resetJobErrors,
} from "../../store/slices/jobSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Plus, Trash } from "lucide-react";

const initialFormState = {
  client_name: "",
  client_phone_number: "",
  description: "",
  job_type: "in_house",
  vendor_name: "",
  vendor_cost_per_unit: "",
  total_units: "",
  pricing_per_unit: "",
  pricing_input: "",
  use_unit_pricing: true,
  timeframe: {
    start: "",
    end: "",
  },
  expenses: [],
};

const CreateJobForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadingState = useSelector(selectJobsLoadingState);
  const jobError = useSelector((state) => state.jobs.errors.createJob);
  const isSubmitting = loadingState.createJob === "loading";

  useEffect(() => {
    if (loadingState.createJob === "succeeded") {
      setFormData(initialFormState);
      setErrors({});
      
      const timer = setTimeout(() => {
        navigate("/jobs");
      }, 5000);
  
      // Cleanup timer if component unmounts
      return () => clearTimeout(timer);
    }
  }, [loadingState.createJob, navigate]);

  useEffect(() => {
    return () => {
      dispatch(resetJobErrors());
    };
  }, [dispatch]);

  const formatKenyanPhone = useCallback((phone) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) return "254" + cleaned.substring(1);
    if (cleaned.startsWith("254")) return cleaned;
    if (cleaned.startsWith("7") || cleaned.startsWith("1")) return "254" + cleaned;
    return cleaned;
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.client_name.trim()) {
      newErrors.client_name = "Client name is required";
    }
    const formattedPhone = formatKenyanPhone(formData.client_phone_number);
    if (!/^254[17]\d{8}$/.test(formattedPhone)) {
      newErrors.client_phone_number =
        "Invalid phone number format. Use format: 07XX XXX XXX or 01XX XXX XXX";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.timeframe.start) {
      newErrors.start_date = "Start date is required";
    }
    if (
      !formData.timeframe.end ||
      new Date(formData.timeframe.end) <= new Date(formData.timeframe.start)
    ) {
      newErrors.end_date = "End date must be after start date";
    }
    if (formData.use_unit_pricing) {
      if (formData.job_type === "outsourced") {
        if (!formData.vendor_name.trim()) {
          newErrors.vendor_name = "Vendor name is required";
        }
        if (
          !formData.vendor_cost_per_unit ||
          formData.vendor_cost_per_unit <= 0
        ) {
          newErrors.vendor_cost_per_unit = "Vendor cost per unit is required";
        }
        if (!formData.total_units || formData.total_units <= 0) {
          newErrors.total_units = "Total units are required";
        }
        if (!formData.pricing_per_unit || formData.pricing_per_unit <= 0) {
          newErrors.pricing_per_unit = "Pricing per unit is required";
        }
      }
    } else {
      if (!formData.pricing_input || formData.pricing_input <= 0) {
        newErrors.pricing_input = "Base pricing is required";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, formatKenyanPhone]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    if (name === "client_phone_number") {
      const formattedPhone = formatKenyanPhone(value);
      if (formattedPhone.length <= 12) {
        setFormData((prev) => ({
          ...prev,
          client_phone_number: formattedPhone,
        }));
      }
    } else if (name.includes("timeframe.")) {
      const timeframeField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        timeframe: {
          ...prev.timeframe,
          [timeframeField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }, [formatKenyanPhone]);

  const handleExpenseChange = useCallback((index, field, value) => {
    setFormData((prev) => {
      const updatedExpenses = [...prev.expenses];
      updatedExpenses[index] = {
        ...updatedExpenses[index],
        [field]: value,
      };
      return {
        ...prev,
        expenses: updatedExpenses,
      };
    });
  }, []);

  const addExpense = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      expenses: [...prev.expenses, { name: "", cost: "", shared: false, job_ids: "" }],
    }));
  }, []);

  const removeExpense = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const jobData = {
      ...formData,
      expenses: formData.expenses.map((expense) => ({
        ...expense,
        job_ids: expense.job_ids
          ? expense.job_ids.split(",").map((id) => id.trim())
          : [],
      })),
      pricing_input: formData.use_unit_pricing
        ? 0
        : parseFloat(formData.pricing_input),
      ...((!formData.use_unit_pricing || formData.job_type === "in_house") && {
        vendor_cost_per_unit: 0,
        total_units: 0,
        pricing_per_unit: 0,
      }),
    };

    // Remove unnecessary fields
    delete jobData.use_unit_pricing;

    try {
      await dispatch(createJob(jobData)).unwrap();
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Job</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Client Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="client_name">Client Name</Label>
              <Input
                id="client_name"
                name="client_name"
                value={formData.client_name}
                onChange={handleInputChange}
                className={errors.client_name ? "border-red-500" : ""}
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
                placeholder="07XX XXX XXX or 01XX XXX XXX"
                className={errors.client_phone_number ? "border-red-500" : ""}
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter number starting with 07 or 01 - will auto-format to 254
              </p>
              {errors.client_phone_number && (
                <p className="text-sm text-red-500">
                  {errors.client_phone_number}
                </p>
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
                  errors.description ? "border-red-500" : "border-gray-300"
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
                  handleInputChange({ target: { name: "job_type", value } })
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
                      name: "use_unit_pricing",
                      value: value === "true",
                    },
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
                className={errors.pricing_input ? "border-red-500" : ""}
              />
              {errors.pricing_input && (
                <p className="text-sm text-red-500">{errors.pricing_input}</p>
              )}
            </div>
          )}

          {/* Outsourced Job Fields */}
          {formData.job_type === "outsourced" && formData.use_unit_pricing && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="vendor_name">Vendor Name</Label>
                <Input
                  id="vendor_name"
                  name="vendor_name"
                  value={formData.vendor_name}
                  onChange={handleInputChange}
                  className={errors.vendor_name ? "border-red-500" : ""}
                />
                {errors.vendor_name && (
                  <p className="text-sm text-red-500">{errors.vendor_name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendor_cost_per_unit">
                    Vendor Cost Per Unit
                  </Label>
                  <Input
                    type="number"
                    id="vendor_cost_per_unit"
                    name="vendor_cost_per_unit"
                    value={formData.vendor_cost_per_unit}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={
                      errors.vendor_cost_per_unit ? "border-red-500" : ""
                    }
                  />
                  {errors.vendor_cost_per_unit && (
                    <p className="text-sm text-red-500">
                      {errors.vendor_cost_per_unit}
                    </p>
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
                    className={errors.pricing_per_unit ? "border-red-500" : ""}
                  />
                  {errors.pricing_per_unit && (
                    <p className="text-sm text-red-500">
                      {errors.pricing_per_unit}
                    </p>
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
                    className={errors.total_units ? "border-red-500" : ""}
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
                className={errors.start_date ? "border-red-500" : ""}
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
                className={errors.end_date ? "border-red-500" : ""}
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
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Expense name"
                  value={expense.name}
                  onChange={(e) => handleExpenseChange(index, 'name', e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Cost"
                  value={expense.cost}
                  onChange={(e) => handleExpenseChange(index, 'cost', e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-32"
                />
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`shared-${index}`}
                    checked={expense.shared}
                    onCheckedChange={(checked) =>
                      handleExpenseChange(index, 'shared', checked)
                    }
                  />
                  <Label 
                    htmlFor={`shared-${index}`} 
                    className="text-sm text-muted-foreground"
                  >
                    Shared
                  </Label>
                </div>
                <Button
                  type="button"
                  onClick={() => removeExpense(index)}
                  variant="destructive"
                  size="icon"
                  className="flex-shrink-0"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>

              {expense.shared && (
                <div className="ml-4 space-y-2">
                  <Label
                    htmlFor={`job_ids-${index}`}
                    className="text-sm text-gray-600"
                  >
                    Enter job IDs to share expense with (comma-separated)
                  </Label>
                  <Input
                    id={`job_ids-${index}`}
                    placeholder="e.g., 123, 456, 789"
                    value={expense.job_ids || ''}
                    onChange={(e) =>
                      handleExpenseChange(index, 'job_ids', e.target.value)
                    }
                    className="w-full"
                  />
                </div>
              )}
            </div>
          ))}
          </div>
          
          {jobError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{jobError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/jobs")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Job"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateJobForm;
