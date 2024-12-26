import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addJobMaterials } from '../../store/slices/jobSlice';
import { fetchMaterials } from '../../store/slices/materialSlice';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MaterialsForm = ({ jobId, onClose }) => {
  const dispatch = useDispatch();
  const materials = useSelector((state) => state.materials.items);
  const [formMaterials, setFormMaterials] = useState([
    { material_id: '', usage_meters: '' }
  ]);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);

  const handleAddMaterial = () => {
    setFormMaterials([...formMaterials, { material_id: '', usage_meters: '' }]);
  };

  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = [...formMaterials];
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [field]: field === 'material_id' ? value : parseFloat(value) || ''
    };
    setFormMaterials(updatedMaterials);
  };

  const handleRemoveMaterial = (index) => {
    if (formMaterials.length > 1) {
      const updatedMaterials = formMaterials.filter((_, i) => i !== index);
      setFormMaterials(updatedMaterials);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validMaterials = formMaterials.filter(
      m => m.material_id && m.usage_meters
    );
    
    if (validMaterials.length > 0) {
      try {
        await dispatch(addJobMaterials({ jobId, materials: validMaterials }));
        onClose();
      } catch (err) {
        setError('Failed to add materials. Please try again.');
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
      
      {formMaterials.map((material, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Material #{index + 1}</h3>
            {formMaterials.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveMaterial(index)}
              >
                Remove
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`material-${index}`}>Material</Label>
            <Select
              value={material.material_id.toString()}
              onValueChange={(value) => handleMaterialChange(index, 'material_id', value)}
            >
              <SelectTrigger id={`material-${index}`}>
                <SelectValue placeholder="Select a material" />
              </SelectTrigger>
              <SelectContent>
                {materials.map((mat) => (
                  <SelectItem key={mat.id} value={mat.id.toString()}>
                    {mat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`usage-${index}`}>Usage Meters</Label>
            <Input
              id={`usage-${index}`}
              type="number"
              step="0.01"
              value={material.usage_meters}
              onChange={(e) => handleMaterialChange(index, 'usage_meters', e.target.value)}
              required
            />
          </div>
        </div>
      ))}

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={handleAddMaterial}>
          Add Material
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default MaterialsForm;
