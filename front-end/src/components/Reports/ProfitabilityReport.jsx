export const ProfitabilityReport = ({ data }) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Profitability Report</h3>
      <table className="mt-4 min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Revenue</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Profit</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((client) => (
            <tr key={client.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${client.revenue.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${client.profit.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
