import React, { useState } from 'react';
import CreateMaterialForm from './CreateMaterialForm';

const UpdateMaterialForm = ({ material, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: material.name || '',
    type: material.type || '',
    stock_level: material.stock_level || '',
    min_threshold: material.min_threshold || '',
    cost_per_sq_meter: material.cost_per_sq_meter || '',
    color: material.custom_attributes?.color || '',
    finish: material.custom_attributes?.finish || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      custom_attributes: {
        color: formData.color,
        finish: formData.finish,
      },
    };
    onSubmit({ id: material.id, updatedData });
  };

  return <CreateMaterialForm formData={formData} onSubmit={handleSubmit} onChange={handleChange} />;
};

export default UpdateMaterialForm;
