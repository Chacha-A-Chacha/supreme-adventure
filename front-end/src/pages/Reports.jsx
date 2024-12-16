import Header from '../components/Shared/Header/Header';
import JobPerformanceReport from '../components/Reports/JobPerformanceReport.jsx';
import ProfitabilityReport from '../components/Reports/ProfitabilityReport.jsx';
import MaterialUsageReport from '../components/Reports/MaterialUsageReport.jsx';
import MachineUsageReport from '../components/Reports/MachineUsageReport';


const sampleProfitabilityData = [
  { id: 1, name: 'Client A', revenue: 12000, profit: 4500 },
  { id: 2, name: 'Client B', revenue: 8000, profit: 3200 },
  { id: 3, name: 'Client C', revenue: 15000, profit: 6000 },
];

const sampleMaterialData = [
  { id: 1, name: 'Paper Rolls', usage: 150 },
  { id: 2, name: 'Vinyl Sheets', usage: 200 },
  { id: 3, name: 'Ink Cartridges', usage: 50 },
];

const sampleJobData = [
  { id: 1, status: 'Completed' },
  { id: 2, status: 'Ongoing' },
  { id: 3, status: 'Completed' },
  { id: 4, status: 'Delayed' },
  { id: 5, status: 'Ongoing' },
];

const sampleMachineData = [
  { id: 1, name: 'Printer A', totalUsage: 1200, materialUsage: 500 },
  { id: 2, name: 'Printer B', totalUsage: 800, materialUsage: 400 },
  { id: 3, name: 'Printer C', totalUsage: 1500, materialUsage: 700 },
];

const Reports = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Header
        title="Reports"
        breadcrumbs={[{ label: 'Home', href: '/', current: false }, { label: 'Reports', href: '#', current: true }]}
      />

      <div className="mt-6 space-y-10">
        {/* Profitability Report */}
        <ProfitabilityReport data={sampleProfitabilityData} />

        {/* Material Usage Report */}
        <MaterialUsageReport materials={sampleMaterialData} />

        {/* Job Performance Report */}
        <JobPerformanceReport jobs={sampleJobData} />

        {/* Machine Usage Report */}
        <MachineUsageReport machines={sampleMachineData} />
      </div>
    </div>
  );
};

export default Reports;
