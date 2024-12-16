import { useState } from 'react';
import { Bar } from 'react-chartjs-2'; // Assuming Chart.js is installed for bar chart visualization

const MaterialInventoryStatus = ({ materials, lowStockThreshold }) => {
  // Identify low stock and top-used materials
  const lowStockMaterials = materials.filter(
    (material) => material.stockLevel < lowStockThreshold
  );

  const topUsedMaterials = materials
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 5);

  // Data for inventory overview bar chart
  const inventoryData = {
    labels: materials.map((material) => material.name),
    datasets: [
      {
        label: 'Stock Levels',
        data: materials.map((material) => material.stockLevel),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-medium text-gray-900">Material Inventory Status</h2>

      {/* Low Stock Alerts */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-gray-700">Low Stock Alerts</h3>
        <ul className="mt-2 space-y-2">
          {lowStockMaterials.map((material) => (
            <li key={material.id} className="text-sm text-red-600">
              {material.name} - {material.stockLevel} units left
            </li>
          ))}
          {lowStockMaterials.length === 0 && (
            <p className="text-sm text-green-600">All materials are sufficiently stocked.</p>
          )}
        </ul>
      </div>

      {/* Top Used Materials */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-700">Top Used Materials</h3>
        <ul className="mt-2 space-y-2">
          {topUsedMaterials.map((material) => (
            <li key={material.id} className="text-sm text-gray-700">
              {material.name} - {material.usage} units used
            </li>
          ))}
        </ul>
      </div>

      {/* Inventory Overview */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-gray-700">Inventory Overview</h3>
        <Bar data={inventoryData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default MaterialInventoryStatus;
