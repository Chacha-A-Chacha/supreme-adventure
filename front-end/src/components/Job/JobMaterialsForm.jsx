import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { addJobMaterials } from '../../store/slices/jobSlice';
import { fetchMaterials } from '../../store/slices/materialSlice';
import { CircleSlash } from 'lucide-react';

const JobMaterialsForm = ({ jobId, onClose }) => {
  const dispatch = useDispatch();
  const materials = useSelector((state) => state.materials.materials);
  const materialsStatus = useSelector((state) => state.materials.status);
  const [formMaterials, setFormMaterials] = useState([
    { material_id: '', usage_meters: '' }
  ]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (materialsStatus === 'idle') {
        console.log("Fetching materials...");
      dispatch(fetchMaterials());
    }
  }, [dispatch, materialsStatus]);

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
      setFormMaterials(formMaterials.filter((_, i) => i !== index));
    }
  };

  const validateMaterials = () => {
    const errors = [];
    formMaterials.forEach((mat, index) => {
      if (mat.material_id && mat.usage_meters) {
        const material = materials.find(m => m.id.toString() === mat.material_id);
        if (material && mat.usage_meters > material.stock_level) {
          errors.push(`Material #${index + 1} exceeds available stock (${material.stock_level}m available)`);
        }
      }
    });
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validMaterials = formMaterials.filter(
      m => m.material_id && m.usage_meters
    );
    
    if (validMaterials.length === 0) {
      setError('Please fill in all required fields.');
      return;
    }

    const stockErrors = validateMaterials();
    if (stockErrors.length > 0) {
      setError(stockErrors.join('\n'));
      return;
    }

    try {
      await dispatch(addJobMaterials({ jobId, materials: validMaterials })).unwrap();
      onClose();
    } catch (err) {
      setError('Failed to add materials. Please try again.');
    }
  };

  if (materialsStatus === 'loading') {
    return <div className="p-4 text-center">Loading materials...</div>;
  }

  if (materialsStatus === 'failed') {
    return (
      <Alert variant="destructive" className="mb-4">
        <CircleSlash className="h-4 w-4" />
        <AlertDescription>Failed to load materials. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
        </Alert>
      )}
      
      {formMaterials.map((material, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg bg-gray-50">
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
                  <SelectItem 
                    key={mat.id} 
                    value={mat.id.toString()}
                    className="flex justify-between"
                  >
                    <span>{mat.name}</span>
                    <span className="text-gray-500 ml-2">
                      ({mat.stock_level}m in stock)
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`usage-${index}`}>Usage (meters)</Label>
            <Input
              id={`usage-${index}`}
              type="number"
              min="0.01"
              step="0.01"
              value={material.usage_meters}
              onChange={(e) => handleMaterialChange(index, 'usage_meters', e.target.value)}
              required
              className="w-full"
            />
            {material.material_id && (
              <p className="text-sm text-gray-500">
                Available: {materials.find(m => m.id.toString() === material.material_id)?.stock_level}m
              </p>
            )}
          </div>
        </div>
      ))}

      <div className="flex gap-4 justify-between">
        <Button type="button" variant="outline" onClick={handleAddMaterial}>
          Add Another Material
        </Button>
        <div className="space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Materials</Button>
        </div>
      </div>
    </form>
  );
};

export default JobMaterialsForm;