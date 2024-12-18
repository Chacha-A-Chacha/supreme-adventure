import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Shared/Header/Header.jsx';
import MaterialInventoryStatus from '../components/Material/MaterialInventoryStatus';
import MaterialDetailsList from '../components/Material/MaterialDetailsList';
import LowStockAlerts from '../components/Material/LowStockAlerts';
import CreateMaterialForm from '../components/Material/CreateMaterialForm';
import { fetchMaterials, addMaterial, deleteMaterial } from '../store/slices/materialSlice';
import UpdateMaterialForm from '../components/Material/UpdateMaterialForm';

const MaterialsManagement = () => {
  const dispatch = useDispatch();
  const { materials, status, error } = useSelector((state) => state.materials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);
 
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddMaterial = (material) => {
    dispatch(addMaterial(material));
    setIsModalOpen(false);
  };

  const handleOpenUpdateModal = (material) => {
    setSelectedMaterial(material);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedMaterial(null);
  };

  const handleUpdateMaterial = (updatedMaterial) => {
    dispatch(updateMaterial({ id: selectedMaterial.id, updatedData: updatedMaterial }));
    handleCloseUpdateModal();
  };

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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Header
        title="Materials Management"
        breadcrumbs={[{ label: 'Home', href: '/', current: false }, { label: 'Materials', href: '#', current: true }]}
        actions={[{
          label: 'Add Material',
          primary: true,
          onClick: handleOpenModal,
        }]}
      />

      {status === 'loading' && <div>Loading materials...</div>}
      {status === 'failed' && <div className="text-red-600">Error: {error}</div>}

      {status === 'succeeded' && (
        <>
          {/* Material Inventory Status */}
          <div className="mt-6">
            <MaterialInventoryStatus materials={materials} lowStockThreshold={15} />
          </div>

          {/* Low Stock Alerts */}
          <div className="mt-10">
            <LowStockAlerts materials={materials} lowStockThreshold={15} />
          </div>

          {/* Material Details List with Update/Delete Buttons */}
          <div className="mt-10">
            <MaterialDetailsList 
              materials={materials} 
              onUpdate={handleOpenUpdateModal} 
              onDelete={handleOpenDeleteModal} 
            />
          </div>
        </>
      )}

      {/* Modal for Adding Material */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-medium text-gray-900">Create New Material</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Close</span>
                &times;
              </button>
            </div>
            <div className="mt-4">
              <CreateMaterialForm onSubmit={handleAddMaterial} />
            </div>
          </div>
        </div>
      )}

      {/* Modal for Updating Material */}
      {isUpdateModalOpen && selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-medium text-gray-900">Update Material</h3>
              <button
                onClick={handleCloseUpdateModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Close</span>
                &times;
              </button>
            </div>
            <div className="mt-4">
              <UpdateMaterialForm material={selectedMaterial} onSubmit={handleUpdateMaterial} />
            </div>
          </div>
        </div>
      )}

      {/* Modal for Delete Confirmation */}
      {isDeleteModalOpen && selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="text-lg font-medium text-gray-900">Delete Material</h3>
            <p className="mt-4 text-sm text-gray-600">
              Are you sure you want to delete <strong>{selectedMaterial.name}</strong>? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={handleCloseDeleteModal} className="text-gray-700">Cancel</button>
              <button
                onClick={handleDeleteMaterial}
                className="rounded-md bg-red-600 px-3 py-2 text-white hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialsManagement;
