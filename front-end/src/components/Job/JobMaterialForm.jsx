import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addJobMaterials } from '../../store/slices/jobSlice';

export const MaterialsForm = ({ jobId, onClose }) => {
  const dispatch = useDispatch();
  const [materials, setMaterials] = useState([
    { material_id: '', usage_meters: '' }
  ]);

  const handleAddMaterial = () => {
    setMaterials([...materials, { material_id: '', usage_meters: '' }]);
  };

  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [field]: field === 'material_id' ? parseInt(value) : parseFloat(value)
    };
    setMaterials(updatedMaterials);
  };

  const handleRemoveMaterial = (index) => {
    if (materials.length > 1) {
      const updatedMaterials = materials.filter((_, i) => i !== index);
      setMaterials(updatedMaterials);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validMaterials = materials.filter(
      m => m.material_id && m.usage_meters
    );
    
    if (validMaterials.length > 0) {
      await dispatch(addJobMaterials({
        jobId,
        materials: validMaterials
      }));
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {materials.map((material, index) => (
        <div key={index} className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Material #{index + 1}</h4>
            {materials.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveMaterial(index)}
              >
                Remove
              </Button>
            )}
          </div>
          
          <div>
            <Label htmlFor={`material-id-${index}`}>Material ID</Label>
            <Input
              id={`material-id-${index}`}
              type="number"
              value={material.material_id}
              onChange={(e) => handleMaterialChange(index, 'material_id', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor={`usage-meters-${index}`}>Usage (meters)</Label>
            <Input
              id={`usage-meters-${index}`}
              type="number"
              step="0.01"
              value={material.usage_meters}
              onChange={(e) => handleMaterialChange(index, 'usage_meters', e.target.value)}
              required
            />
          </div>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleAddMaterial}
      >
        Add Another Material
      </Button>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save Materials</Button>
      </div>
    </form>
  );
};
