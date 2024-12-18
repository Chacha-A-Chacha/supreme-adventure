const MachineUsageTable = ({ machines }) => {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 mt-6">
        <h3 className="text-lg font-medium text-gray-900">Machine Usage Table</h3>
        <table className="mt-4 min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Machine</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Usage (Meters)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material Usage (Meters)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {machines.map((machine) => (
              <tr key={machine.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{machine.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{machine.totalUsage} meters</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{machine.materialUsage} meters</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


export default MachineUsageTable;