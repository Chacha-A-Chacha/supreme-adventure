const AddEditMaterialForm = ({ onSubmit, material = {} }) => {
  return (
    <form
      className="rounded-lg bg-white p-6 shadow-sm border border-gray-200"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(material);
      }}
    >
      <h3 className="text-lg font-medium text-gray-900">
        {material.id ? 'Edit Material' : 'Add Material'}
      </h3>
      <div className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="material-name"
            className="block text-sm font-medium text-gray-700"
          >
            Material Name
          </label>
          <input
            id="material-name"
            type="text"
            defaultValue={material.name || ''}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
            required
          />
        </div>
        <div>
          <label
            htmlFor="stock-level"
            className="block text-sm font-medium text-gray-700"
          >
            Stock Level
          </label>
          <input
            id="stock-level"
            type="number"
            defaultValue={material.stockLevel || ''}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
            required
          />
        </div>
        <div>
          <label
            htmlFor="cost-per-unit"
            className="block text-sm font-medium text-gray-700"
          >
            Cost Per Unit
          </label>
          <input
            id="cost-per-unit"
            type="number"
            step="0.01"
            defaultValue={material.costPerUnit || ''}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
            required
          />
        </div>
        <div>
          <label
            htmlFor="supplier"
            className="block text-sm font-medium text-gray-700"
          >
            Supplier
          </label>
          <input
            id="supplier"
            type="text"
            defaultValue={material.supplier || ''}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
            required
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {material.id ? 'Update Material' : 'Add Material'}b
        </button>
      </div>
    </form>
  );
};


export default AddEditMaterialForm;
