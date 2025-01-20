import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Shared/Header/Header.jsx';
import MaterialInventoryStatus from '../components/Material/MaterialInventoryStatus';
import MaterialDetailsList from '../components/Material/MaterialDetailsList';
import LowStockAlerts from '../components/Material/LowStockAlerts';
import CreateMaterialForm from '../components/Material/CreateMaterialForm';
import UpdateMaterialForm from '../components/Material/UpdateMaterialForm';
import RestockMaterialForm from '../components/Material/RestockMaterialForm';
import { 
  fetchMaterials, 
  addMaterial, 
  deleteMaterial, 
  editMaterial,
  restockMaterial 
} from '../store/slices/materialSlice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MaterialsManagement = () => {
  const dispatch = useDispatch();
  const { materials, status, error } = useSelector((state) => state.materials);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);

  // Create handlers
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddMaterial = (material) => {
    dispatch(addMaterial(material));
    setIsModalOpen(false);
  };

  // Update handlers
  const handleOpenUpdateModal = (material) => {
    setSelectedMaterial(material);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedMaterial(null);
  };

  const handleUpdateMaterial = (updatedMaterial) => {
    dispatch(editMaterial({ id: selectedMaterial.id, updatedData: updatedMaterial }));
    handleCloseUpdateModal();
  };

  // Delete handlers
  const handleOpenDeleteModal = (material) => {
    setSelectedMaterial(material);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedMaterial(null);
  };

  const handleDeleteMaterial = () => {
    dispatch(deleteMaterial(selectedMaterial.id));
    handleCloseDeleteModal();
  };

  // Restock handlers
  const handleOpenRestockModal = (material) => {
    setSelectedMaterial(material);
    setIsRestockModalOpen(true);
  };

  const handleCloseRestockModal = () => {
    setIsRestockModalOpen(false);
    setSelectedMaterial(null);
  };

  const handleRestockMaterial = (restockData) => {
    dispatch(restockMaterial({
      id: selectedMaterial.id,
      restockData: {
        ...restockData,
        material_id: selectedMaterial.id
      }
    }))
    .unwrap()
    .then(() => {
      handleCloseRestockModal();
    })
    .catch((error) => {
      console.error('Failed to restock:', error);
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Header
        title="Materials Management"
        breadcrumbs={[
          { label: 'Home', href: '/', current: false },
          { label: 'Materials', href: '#', current: true }
        ]}
        actions={[{
          label: 'Add Material',
          primary: true,
          onClick: handleOpenModal,
        }]}
      />

      {status === 'loading' && (
        <div className="flex justify-center p-8">
          <div className="text-gray-600">Loading materials...</div>
        </div>
      )}

      {status === 'failed' && (
        <Alert variant="destructive" className="mt-6">
          <AlertDescription>Error: {error}</AlertDescription>
        </Alert>
      )}

      {status === 'succeeded' && (
        <div className="mt-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 grid-cols-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MaterialInventoryStatus materials={materials} lowStockThreshold={15} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Low Stock Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LowStockAlerts materials={materials} lowStockThreshold={15} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="inventory">
              <Card>
                <CardContent className="pt-6">
                  <MaterialDetailsList 
                    materials={materials}
                    loadingState={status}
                    error={error}
                    onUpdate={handleOpenUpdateModal}
                    onDelete={handleOpenDeleteModal}
                    onRestock={handleOpenRestockModal}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Create Material Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b">
            <DialogTitle>Create New Material</DialogTitle>
            <DialogDescription>
              Add a new material to your inventory. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <CreateMaterialForm 
              onSubmit={handleAddMaterial} 
              onCancel={handleCloseModal}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Restock Material Modal */}
      <Dialog open={isRestockModalOpen} onOpenChange={setIsRestockModalOpen}>
        <DialogContent className="max-w-3xl h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b">
            <DialogTitle>Restock Material</DialogTitle>
            <DialogDescription>
              Restock {selectedMaterial?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            {selectedMaterial && (
              <RestockMaterialForm
                material={selectedMaterial} 
                onSubmit={handleRestockMaterial}
                onCancel={handleCloseRestockModal}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Material Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="max-w-3xl h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b">
            <DialogTitle>Update Material</DialogTitle>
            <DialogDescription>
              Update the details for {selectedMaterial?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            {selectedMaterial && (
              <UpdateMaterialForm 
                material={selectedMaterial} 
                onSubmit={handleUpdateMaterial}
                onCancel={handleCloseUpdateModal}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Material</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-medium">{selectedMaterial?.name}</span>? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteModal}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteMaterial}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MaterialsManagement;
