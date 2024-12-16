// MaterialDetailsList Component
const MaterialDetailsList = ({ materials }) => {
  return (
    <div className="rounded-lg bg-white shadow-sm border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Material Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock Level
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cost Per Unit
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Supplier
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {materials.map((material) => (
            <tr key={material.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.stockLevel}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${material.costPerUnit}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.supplier}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default MaterialDetailsList;