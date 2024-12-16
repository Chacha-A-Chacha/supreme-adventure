import Header from '../components/Shared/Header/Header.jsx';
import MaterialInventoryStatus from '../components/Material/MaterialInventoryStatus';
import MaterialDetailsList from '../components/Material/MaterialDetailsList';
import LowStockAlerts from '../components/Material/LowStockAlerts';
import  AddEditMaterialForm from '../components/Material/AddEditMaterialForm';


const materials = [
  { id: 1, name: 'Paper Rolls', stockLevel: 20, usage: 150, costPerUnit: 5.0, supplier: 'Supplier A' },
  { id: 2, name: 'Ink Cartridges', stockLevel: 5, usage: 200, costPerUnit: 25.0, supplier: 'Supplier B' },
  { id: 3, name: 'Vinyl Sheets', stockLevel: 50, usage: 100, costPerUnit: 15.0, supplier: 'Supplier C' },
  { id: 4, name: 'Fabric Rolls', stockLevel: 10, usage: 120, costPerUnit: 10.0, supplier: 'Supplier D' },
  { id: 5, name: 'Adhesives', stockLevel: 80, usage: 90, costPerUnit: 3.0, supplier: 'Supplier E' },
];

const actions = [
  { title: 'Add Material', href: '#', icon: '➕', primary: true, onClick: () => alert('Add Material') },
  { title: 'Reorder Material', href: '#', icon: '🔄', primary: false, onClick: () => alert('Reorder Material') },
];

const MaterialsManagement = () => {
  const handleAddEditMaterial = (material) => {
    console.log('Material submitted:', material);
    alert('Material submitted successfully!');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Header
        title="Materials Management"
        breadcrumbs={[{ label: 'Home', href: '/', current: false }, { label: 'Materials', href: '#', current: true }]}
        actions={actions}
      />

      {/* Material Inventory Status */}
      <div className="mt-6">
        <MaterialInventoryStatus materials={materials} lowStockThreshold={15} />
      </div>

      {/* Low Stock Alerts */}
      <div className="mt-10">
        <LowStockAlerts materials={materials} lowStockThreshold={15} />
      </div>

      {/* Material Details List */}
      <div className="mt-10">
        <MaterialDetailsList materials={materials} />
      </div>

      {/* Add/Edit Material Form */}
      <div className="mt-10">
        <AddEditMaterialForm onSubmit={handleAddEditMaterial} />
      </div>
    </div>
  );
};

export default MaterialsManagement;
