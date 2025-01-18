import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const CreateMaterialForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    material_code: "",
    name: "",
    category: "",
    type: "",
    unit_of_measure: "",
    min_threshold: "",
    reorder_quantity: "",
    cost_per_unit: "",
    stock_level: "0",
    specifications: {
      width: "",
      thickness: "",
    },
    supplier: {
      name: "",
      phone_number: "",
      contact_info: {
        email: "",
      },
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSupplierContactChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      supplier: {
        ...prev.supplier,
        contact_info: {
          ...prev.supplier.contact_info,
          [field]: value,
        },
      },
    }));
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // String length validations
    if (!formData.material_code || formData.material_code.length > 50) {
      newErrors.material_code = 'Material code must be between 1 and 50 characters';
    }
    if (!formData.name || formData.name.length > 100) {
      newErrors.name = 'Name must be between 1 and 100 characters';
    }
    if (!formData.category || formData.category.length > 50) {
      newErrors.category = 'Category must be between 1 and 50 characters';
    }
    if (!formData.type || formData.type.length > 50) {
      newErrors.type = 'Type must be between 1 and 50 characters';
    }
    if (!formData.unit_of_measure || formData.unit_of_measure.length > 20) {
      newErrors.unit_of_measure = 'Unit of measure must be between 1 and 20 characters';
    }

    // Number validations
    if (parseFloat(formData.stock_level) < 0) {
      newErrors.stock_level = 'Stock level must be 0 or greater';
    }
    if (!formData.min_threshold || parseFloat(formData.min_threshold) < 0) {
      newErrors.min_threshold = 'Minimum threshold is required and must be 0 or greater';
    }
    if (!formData.reorder_quantity || parseFloat(formData.reorder_quantity) < 0) {
      newErrors.reorder_quantity = 'Reorder quantity is required and must be 0 or greater';
    }
    if (!formData.cost_per_unit || parseFloat(formData.cost_per_unit) < 0) {
      newErrors.cost_per_unit = 'Cost per unit is required and must be 0 or greater';
    }

    // Supplier validations
    if (!formData.supplier.name) {
      newErrors.supplier_name = 'Supplier name is required';
    }
    if (!formData.supplier.phone_number) {
      newErrors.supplier_phone = 'Supplier phone number is required';
    }
    if (!formData.supplier.contact_info.email) {
      newErrors.supplier_email = 'Supplier email is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const formattedData = {
      ...formData,
      min_threshold: parseFloat(formData.min_threshold),
      reorder_quantity: parseFloat(formData.reorder_quantity),
      cost_per_unit: parseFloat(formData.cost_per_unit),
      stock_level: parseFloat(formData.stock_level),
      specifications: {
        width: parseFloat(formData.specifications.width),
        thickness: parseFloat(formData.specifications.thickness),
      },
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="material_code">Material Code</Label>
            {errors.material_code && (
              <p className="text-sm text-red-500">{errors.material_code}</p>
            )}
            <Input
              id="material_code"
              name="material_code"
              placeholder="e.g., VNL-001"
              value={formData.material_code}
              onChange={handleChange}
              required
              maxLength={50}
              minLength={1}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Material name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={100}
              minLength={1}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange({ target: { name: 'category', value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vinyl">Vinyl</SelectItem>
                <SelectItem value="Laminate">Laminate</SelectItem>
                <SelectItem value="Paper">Paper</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleChange({ target: { name: 'type', value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Adhesive">Adhesive</SelectItem>
                <SelectItem value="Heat-Sensitive">Heat-Sensitive</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stock Management */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Management</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="unit_of_measure">Unit of Measure</Label>
            <Select
              value={formData.unit_of_measure}
              onValueChange={(value) => handleChange({ target: { name: 'unit_of_measure', value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meters">Meters</SelectItem>
                <SelectItem value="sheets">Sheets</SelectItem>
                <SelectItem value="rolls">Rolls</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock_level">Initial Stock Level</Label>
            <Input
              type="number"
              id="stock_level"
              name="stock_level"
              min="0"
              step="0.01"
              value={formData.stock_level}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="min_threshold">Minimum Threshold</Label>
            <Input
              type="number"
              id="min_threshold"
              name="min_threshold"
              min="0"
              step="0.01"
              value={formData.min_threshold}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reorder_quantity">Reorder Quantity</Label>
            <Input
              type="number"
              id="reorder_quantity"
              name="reorder_quantity"
              min="0"
              step="0.01"
              value={formData.reorder_quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost_per_unit">Cost per Unit</Label>
            <Input
              type="number"
              id="cost_per_unit"
              name="cost_per_unit"
              min="0"
              step="0.01"
              value={formData.cost_per_unit}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Specifications</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="width">Width (m)</Label>
            <Input
              type="number"
              id="width"
              min="0"
              step="0.01"
              value={formData.specifications.width}
              onChange={(e) => handleNestedChange('specifications', 'width', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thickness">Thickness (mm)</Label>
            <Input
              type="number"
              id="thickness"
              min="0"
              step="0.01"
              value={formData.specifications.thickness}
              onChange={(e) => handleNestedChange('specifications', 'thickness', e.target.value)}
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
            <Input
              id="supplier_name"
              value={formData.supplier.name}
              onChange={(e) => handleNestedChange('supplier', 'name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier_phone">Phone Number</Label>
            <Input
              id="supplier_phone"
              value={formData.supplier.phone_number}
              onChange={(e) => handleNestedChange('supplier', 'phone_number', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier_email">Email</Label>
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

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit">Create Material</Button>
      </div>
    </form>
  );
};

export default CreateMaterialForm;
