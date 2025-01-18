import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ADJUSTMENT_REASONS = {
  INVENTORY_COUNT: "Inventory Count",
  DAMAGE: "Damage",
  QUALITY_ISSUE: "Quality Issue",
  SYSTEM_CORRECTION: "System Correction",
  OTHER: "Other"
};

const UpdateMaterialForm = ({ material, onSubmit, onCancel }) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    material_id: material?.id || "",
    new_stock_level: material?.stock_level?.toString() || "",
    adjustment_reason: "",
    reference_number: "",
    notes: "",
  });

  const validateForm = () => {
    const newErrors = {};

    // Stock level validation
    if (!formData.new_stock_level || parseFloat(formData.new_stock_level) < 0) {
      newErrors.new_stock_level = "Stock level must be 0 or greater";
    }

    // Reference number validation
    if (formData.reference_number && formData.reference_number.length > 50) {
      newErrors.reference_number = "Reference number must be less than 50 characters";
    }

    // Adjustment reason validation
    if (!formData.adjustment_reason) {
      newErrors.adjustment_reason = "Adjustment reason is required";
    }

    // Notes validation
    if (!formData.notes || formData.notes.length < 1) {
      newErrors.notes = "Notes are required";
    } else if (formData.notes.length > 255) {
      newErrors.notes = "Notes must be less than 255 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const submissionData = {
      ...formData,
      material_id: parseInt(formData.material_id),
      new_stock_level: parseFloat(formData.new_stock_level),
    };

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Current Material Info */}
      <Card>
        <CardHeader>
          <CardTitle>Current Material Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Material Name</Label>
              <p className="font-medium">{material?.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Current Stock Level</Label>
              <p className="font-medium">{material?.stock_level} {material?.unit_of_measure}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock Adjustment */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Adjustment</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new_stock_level">New Stock Level</Label>
              {errors.new_stock_level && (
                <p className="text-sm text-red-500">{errors.new_stock_level}</p>
              )}
              <Input
                id="new_stock_level"
                name="new_stock_level"
                type="number"
                step="0.01"
                min="0"
                value={formData.new_stock_level}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference_number">Reference Number</Label>
              {errors.reference_number && (
                <p className="text-sm text-red-500">{errors.reference_number}</p>
              )}
              <Input
                id="reference_number"
                name="reference_number"
                maxLength={50}
                value={formData.reference_number}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adjustment_reason">Adjustment Reason</Label>
              {errors.adjustment_reason && (
                <p className="text-sm text-red-500">{errors.adjustment_reason}</p>
              )}
              <Select
                value={formData.adjustment_reason}
                onValueChange={(value) => 
                  handleChange({ target: { name: 'adjustment_reason', value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ADJUSTMENT_REASONS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes}</p>
            )}
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Provide detailed explanation for the adjustment"
              required
              maxLength={255}
              rows={4}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground">
              {formData.notes.length}/255 characters
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit">Update Stock Level</Button>
      </div>
    </form>
  );
};

export default UpdateMaterialForm;
