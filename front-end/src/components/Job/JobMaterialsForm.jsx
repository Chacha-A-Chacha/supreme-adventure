import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
    { 
      material_id: '', 
      quantity_used: '',
      wastage: '',
      notes: ''
    }
  ]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (materialsStatus === 'idle') {
      console.log("Fetching materials...");
      dispatch(fetchMaterials());
    }
  }, [dispatch, materialsStatus]);

  const handleAddMaterial = () => {
    setFormMaterials([...formMaterials, { 
      material_id: '', 
      quantity_used: '',
      wastage: '',
      notes: ''
    }]);
  };

  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = [...formMaterials];
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [field]: field === 'material_id' 
        ? value 
        : (field === 'quantity_used' || field === 'wastage') 
          ? parseFloat(value) || ''
          : value
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
      if (mat.material_id && mat.quantity_used) {
        const material = materials.find(m => m.id.toString() === mat.material_id);
        if (material && mat.quantity_used > material.stock_level) {
          errors.push(`Material #${index + 1} exceeds available stock (${material.stock_level}m available)`);
        }
        if (mat.wastage && mat.wastage > mat.quantity_used) {
          errors.push(`Material #${index + 1} wastage cannot exceed quantity used`);
        }
      }
    });
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validMaterials = formMaterials.filter(
      m => m.material_id && m.quantity_used
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
      // Clean up the data before submission
      const materialsToSubmit = validMaterials.map(mat => ({
        material_id: mat.material_id,
        job_id: jobId,
        quantity_used: mat.quantity_used,
        ...(mat.wastage && { wastage: mat.wastage }),
        ...(mat.notes && { notes: mat.notes.trim() })
      }));

      await dispatch(addJobMaterials({ jobId, materials: materialsToSubmit })).unwrap();
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
            <Label htmlFor={`quantity-${index}`}>Quantity Used (meters)</Label>
            <Input
              id={`quantity-${index}`}
              type="number"
              min="0.01"
              step="0.01"
              value={material.quantity_used}
              onChange={(e) => handleMaterialChange(index, 'quantity_used', e.target.value)}
              required
              className="w-full"
            />
            {material.material_id && (
              <p className="text-sm text-gray-500">
                Available: {materials.find(m => m.id.toString() === material.material_id)?.stock_level}m
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`wastage-${index}`}>Wastage (meters)</Label>
            <Input
              id={`wastage-${index}`}
              type="number"
              min="0"
              step="0.01"
              value={material.wastage}
              onChange={(e) => handleMaterialChange(index, 'wastage', e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`notes-${index}`}>Notes (optional)</Label>
            <Textarea
              id={`notes-${index}`}
              value={material.notes}
              onChange={(e) => handleMaterialChange(index, 'notes', e.target.value)}
              className="w-full"
              maxLength={225}
              placeholder="Add any additional notes here..."
            />
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
