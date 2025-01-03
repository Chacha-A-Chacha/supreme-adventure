import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Shared/Header/Header';
import MaterialInventoryStatus from '../components/Material/MaterialInventoryStatus';

const materials = [
  { id: 1, name: 'Paper Rolls', stockLevel: 20, usage: 150 },
  { id: 2, name: 'Ink Cartridges', stockLevel: 5, usage: 200 },
  { id: 3, name: 'Vinyl Sheets', stockLevel: 50, usage: 100 },
  { id: 4, name: 'Fabric Rolls', stockLevel: 10, usage: 120 },
  { id: 5, name: 'Adhesives', stockLevel: 80, usage: 90 },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleCreateJob = () => {
    navigate('/create-job');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Header
        title="Dashboard"
        breadcrumbs={[{ label: 'Home', href: '/', current: false }, { label: 'Dashboard', href: '#', current: true }]}
        actions={[{
          label: 'Create Job',
          primary: true,
          onClick: handleCreateJob,
        }]}
      />

      {/* Material Inventory Status */}
      <div className="mt-6">
        <MaterialInventoryStatus materials={materials} lowStockThreshold={15} />
      </div>

      {/* Add other sections like job tracking, financials, etc. */}
    </div>
  );
};

export default Dashboard;