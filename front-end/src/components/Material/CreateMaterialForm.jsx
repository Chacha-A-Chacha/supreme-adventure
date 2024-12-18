import React, { useState } from 'react';

const CreateMaterialForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    stock_level: '',
    min_threshold: '',
    cost_per_sq_meter: '',
    color: '',
    finish: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      custom_attributes: {
        color: formData.color,
        finish: formData.finish,
      },
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 p-6 bg-white rounded-md shadow-md">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Create New Material</h2>
        <p className="mt-1 text-sm text-gray-600">Fill in the details to add a new material.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="name" className="block text-sm font-medium text-gray-900">Material Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
            required
          />
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="type" className="block text-sm font-medium text-gray-900">Type</label>
          <input
            type="text"
            name="type"
            id="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="stock_level" className="block text-sm font-medium text-gray-900">Stock Level</label>
          <input
            type="number"
            name="stock_level"
            id="stock_level"
            value={formData.stock_level}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="min_threshold" className="block text-sm font-medium text-gray-900">Min Threshold</label>
          <input
            type="number"
            name="min_threshold"
            id="min_threshold"
            value={formData.min_threshold}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cost_per_sq_meter" className="block text-sm font-medium text-gray-900">Cost per Sq Meter</label>
          <input
            type="number"
            step="0.1"
            name="cost_per_sq_meter"
            id="cost_per_sq_meter"
            value={formData.cost_per_sq_meter}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
            required
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="color" className="block text-sm font-medium text-gray-900">Color</label>
          <input
            type="text"
            name="color"
            id="color"
            value={formData.color}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
          />
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="finish" className="block text-sm font-medium text-gray-900">Finish</label>
          <input
            type="text"
            name="finish"
            id="finish"
            value={formData.finish}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button type="button" className="text-sm font-semibold text-gray-900">Cancel</button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default CreateMaterialForm;
