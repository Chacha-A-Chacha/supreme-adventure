import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMachines,
  addMachine,
  selectAllMachines,
  selectMachinesLoadingState,
  selectMachineErrors,
} from '../../store/slices/machineSlice';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, Plus } from 'lucide-react';

const MachineList = () => {
  const dispatch = useDispatch();
  const machines = useSelector(selectAllMachines);
  const loading = useSelector(selectMachinesLoadingState);
  const error = useSelector(selectMachineErrors);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMachine, setNewMachine] = useState({
    name: '',
    model: '',
    serial_number: '',
    status: 'active'
  });

  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMachine(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addMachine(newMachine)).unwrap();
      setIsDialogOpen(false);
      setNewMachine({
        name: '',
        model: '',
        serial_number: '',
        status: 'active'
      });
    } catch (error) {
      console.error('Failed to create machine:', error);
    }
  };

  if (loading === 'loading') {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Machines</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Machine
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Machine</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Machine Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newMachine.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  name="model"
                  value={newMachine.model}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="serial_number">Serial Number</Label>
                <Input
                  id="serial_number"
                  name="serial_number"
                  value={newMachine.serial_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading === 'loading'}
              >
                {loading === 'loading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Machine'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {machines.length > 0 ? (
            machines.map((machine) => (
              <div
                key={machine.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{machine.name}</p>
                  <p className="text-sm text-gray-500">
                    Model: {machine.model} | Serial: {machine.serial_number}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    machine.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {machine.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No machines found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MachineList;
