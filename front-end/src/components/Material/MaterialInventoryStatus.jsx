import React, { useEffect, useRef } from 'react';
import { Chart, CategoryScale } from 'chart.js';
import 'chart.js/auto';

Chart.register(CategoryScale);

const MaterialInventoryStatus = ({ materials = [], lowStockThreshold = 20 }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Update chart when materials data changes
  useEffect(() => {
    if (materials.length > 0) {
      const ctx = chartRef.current.getContext('2d');

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: materials.map((material) => material.name),
          datasets: [
            {
              label: 'Stock Levels',
              data: materials.map((material) => material.stock_level),
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'category',
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [materials]);

  // Identify low stock and top-used materials
  const lowStockMaterials = materials.filter(
    (material) => material.stock_level < lowStockThreshold
  );

  const topUsedMaterials = [...materials]
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 5);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Material Inventory Status</h2>

      {/* Low Stock Alerts */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-red-600">Low Stock Alerts</h3>
        <ul className="mt-2 space-y-2">
          {lowStockMaterials.map((material) => (
            <li key={material.id} className="text-sm text-red-600">
              {material.name} - {material.stock_level} units left
            </li>
          ))}
          {lowStockMaterials.length === 0 && (
            <p className="text-sm text-green-600">All materials are sufficiently stocked.</p>
          )}
        </ul>
      </div>

      {/* Top Used Materials */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700">Top Used Materials</h3>
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
        <h3 className="text-lg font-semibold text-gray-700">Inventory Overview</h3>
        <div style={{ height: '300px' }}>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default MaterialInventoryStatus;
