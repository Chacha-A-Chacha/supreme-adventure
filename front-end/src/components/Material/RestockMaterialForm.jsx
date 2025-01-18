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

const RestockMaterialForm = ({ material, onSubmit, onCancel }) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    material_id: material?.id || "",
    quantity: "",
    reference_number: "",
    cost_per_unit: material?.cost_per_unit?.toString() || "",
    supplier: {
      name: material?.supplier?.name || "",
      phone_number: material?.supplier?.phone_number || "",
      contact_info: {
        email: material?.supplier?.contact_info?.email || "",
      },
    },
    notes: "",
  });

  const validateForm = () => {
    const newErrors = {};

    // Quantity validation
    if (!formData.quantity || parseFloat(formData.quantity) <= 0.1) {
      newErrors.quantity = "Quantity must be greater than 0.1";
    }

    // Reference number validation
    if (!formData.reference_number || formData.reference_number.length > 50) {
      newErrors.reference_number = "Reference number is required and must be less than 50 characters";
    }

    // Cost per unit validation
    if (formData.cost_per_unit && parseFloat(formData.cost_per_unit) < 0) {
      newErrors.cost_per_unit = "Cost per unit must be 0 or greater";
    }

    // Notes validation
    if (formData.notes && formData.notes.length > 255) {
      newErrors.notes = "Notes must be less than 255 characters";
    }

    // Supplier validations
    if (!formData.supplier.name) {
      newErrors.supplier_name = "Supplier name is required";
    }
    if (!formData.supplier.phone_number) {
      newErrors.supplier_phone = "Supplier phone number is required";
    }
    if (!formData.supplier.contact_info.email) {
      newErrors.supplier_email = "Supplier email is required";
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

  const handleSupplierChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      supplier: {
        ...prev.supplier,
        [field]: value
      }
    }));
  };

  const handleSupplierContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      supplier: {
        ...prev.supplier,
        contact_info: {
          ...prev.supplier.contact_info,
          [field]: value
        }
      }
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
      quantity: parseFloat(formData.quantity),
      cost_per_unit: formData.cost_per_unit ? parseFloat(formData.cost_per_unit) : null,
    };

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Material Information */}
      <Card>
        <CardHeader>
          <CardTitle>Restock Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity to Restock</Label>
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity}</p>
            )}
            <Input
              id="quantity"
              name="quantity"
              type="number"
              step="0.1"
              min="0.1"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference_number">Reference Number (PO)</Label>
            {errors.reference_number && (
              <p className="text-sm text-red-500">{errors.reference_number}</p>
            )}
            <Input
              id="reference_number"
              name="reference_number"
              maxLength={50}
              value={formData.reference_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost_per_unit">Cost per Unit</Label>
            {errors.cost_per_unit && (
              <p className="text-sm text-red-500">{errors.cost_per_unit}</p>
            )}
            <Input
              id="cost_per_unit"
              name="cost_per_unit"
              type="number"
              step="0.01"
              min="0"
              value={formData.cost_per_unit}
              onChange={handleChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Supplier Information */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="supplier_name">Supplier Name</Label>
            {errors.supplier_name && (
              <p className="text-sm text-red-500">{errors.supplier_name}</p>
            )}
            <Input
              id="supplier_name"
              value={formData.supplier.name}
              onChange={(e) => handleSupplierChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier_phone">Phone Number</Label>
            {errors.supplier_phone && (
              <p className="text-sm text-red-500">{errors.supplier_phone}</p>
            )}
            <Input
              id="supplier_phone"
              value={formData.supplier.phone_number}
              onChange={(e) => handleSupplierChange('phone_number', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier_email">Email</Label>
            {errors.supplier_email && (
              <p className="text-sm text-red-500">{errors.supplier_email}</p>
            )}
            <Input
              type="email"
              id="supplier_email"
              value={formData.supplier.contact_info.email}
              onChange={(e) => handleSupplierContactChange('email', e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
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
              maxLength={255}
              rows={3}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit">Submit Restock</Button>
      </div>
    </form>
  );
};

export default RestockMaterialForm;
