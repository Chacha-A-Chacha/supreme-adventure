// LowStockAlerts Component
const LowStockAlerts = ({ materials, lowStockThreshold }) => {
  const lowStockMaterials = materials.filter(
    (material) => material.stockLevel < lowStockThreshold
  );

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Low Stock Alerts</h3>
      {lowStockMaterials.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {lowStockMaterials.map((material) => (
            <li key={material.id} className="text-sm text-red-600">
              {material.name} - {material.stockLevel} units left
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-green-600">All materials are sufficiently stocked.</p>
      )}
    </div>
  );
};


export default LowStockAlerts;