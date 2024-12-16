const MaterialUsageReport = ({ materials }) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Material Usage Report</h3>
      <ul className="mt-4 space-y-2">
        {materials.map((material) => (
          <li key={material.id} className="flex justify-between text-sm text-gray-700">
            <span>{material.name}</span>
            <span>{material.usage} units used</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MaterialUsageReport;