import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMaterials } from '../../store/slices/materialSlice';
import { createJob } from '../../store/slices/jobSlice';

const CreateJobForm = () => {
  const dispatch = useDispatch();
  const { materials, status: materialsStatus } = useSelector((state) => state.materials);
  const [formData, setFormData] = useState({
    client_name: '',
    client_phone_number: '',
    description: '',
    progress_status: 'pending',
    timeframe: { start: '', end: '' },
    pricing_input: '',
    material_usages: [],
    expenses: [],
  });

  const [newMaterial, setNewMaterial] = useState({ material_id: '', usage_meters: '' });
  const [newExpense, setNewExpense] = useState({ name: '', cost: '', shared: false, job_ids: [] });

  useEffect(() => {
    if (materialsStatus === 'idle') {
      dispatch(fetchMaterials());
    }
  }, [materialsStatus, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('timeframe')) {
      const key = name.split('.')[1];
      setFormData({ ...formData, timeframe: { ...formData.timeframe, [key]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddMaterial = () => {
    if (newMaterial.material_id && newMaterial.usage_meters) {
      setFormData({
        ...formData,
        material_usages: [...formData.material_usages, newMaterial],
      });
      setNewMaterial({ material_id: '', usage_meters: '' });
    }
  };

  const handleAddExpense = () => {
    if (newExpense.name && newExpense.cost) {
      setFormData({
        ...formData,
        expenses: [...formData.expenses, newExpense],
      });
      setNewExpense({ name: '', cost: '', shared: false, job_ids: [] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createJob(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-lg font-semibold text-gray-900">Create New Job</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="client_name" className="block text-sm font-medium text-gray-900">Client Name</label>
          <input
            type="text"
            name="client_name"
            id="client_name"
            value={formData.client_name}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
            required
          />
        </div>
        <div>
          <label htmlFor="client_phone_number" className="block text-sm font-medium text-gray-900">Client Phone Number</label>
          <input
            type="text"
            name="client_phone_number"
            id="client_phone_number"
            value={formData.client_phone_number}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-900">Job Description</label>
          <textarea
            name="description"
            id="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
            required
          />
        </div>
        <div>
          <label htmlFor="timeframe.start" className="block text-sm font-medium text-gray-900">Start Date</label>
          <input
            type="date"
            name="timeframe.start"
            id="timeframe.start"
            value={formData.timeframe.start}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
          />
        </div>
        <div>
          <label htmlFor="timeframe.end" className="block text-sm font-medium text-gray-900">End Date</label>
          <input
            type="date"
            name="timeframe.end"
            id="timeframe.end"
            value={formData.timeframe.end}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
          />
        </div>
        <div>
          <label htmlFor="pricing_input" className="block text-sm font-medium text-gray-900">Base Pricing</label>
          <input
            type="number"
            step="0.01"
            name="pricing_input"
            id="pricing_input"
            value={formData.pricing_input}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
          />
        </div>
      </div>

      {/* Material Usage Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900">Materials Used</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
          <div>
            <label htmlFor="material_id" className="block text-sm font-medium text-gray-900">Material</label>
            <select
              name="material_id"
              id="material_id"
              value={newMaterial.material_id}
              onChange={(e) => setNewMaterial({ ...newMaterial, material_id: e.target.value })}
              className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
            >
              <option value="">Select Material</option>
              {materials.map((material) => (
                <option key={material.id} value={material.id}>{material.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="usage_meters" className="block text-sm font-medium text-gray-900">Usage (meters)</label>
            <input
              type="number"
              name="usage_meters"
              id="usage_meters"
              value={newMaterial.usage_meters}
              onChange={(e) => setNewMaterial({ ...newMaterial, usage_meters: e.target.value })}
              className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddMaterial}
          className="mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Add Material
        </button>
        <ul className="mt-4 space-y-2">
          {formData.material_usages.map((usage, index) => (
            <li key={index} className="text-sm text-gray-700">
              Material ID: {usage.material_id}, Usage: {usage.usage_meters} meters
            </li>
          ))}
        </ul>
      </div>

      {/* Expenses Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900">Expenses</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4">
          <div>
            <label htmlFor="expense_name" className="block text-sm font-medium text-gray-900">Expense Name</label>
            <input
              type="text"
              name="name"
              id="expense_name"
              value={newExpense.name}
              onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
              className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
            />
          </div>
          <div>
            <label htmlFor="expense_cost" className="block text-sm font-medium text-gray-900">Cost</label>
            <input
              type="number"
              step="0.01"
              name="cost"
              id="expense_cost"
              value={newExpense.cost}
              onChange={(e) => setNewExpense({ ...newExpense, cost: e.target.value })}
              className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
            />
          </div>
          <div>
            <label htmlFor="shared" className="block text-sm font-medium text-gray-900">Shared</label>
            <input
              type="checkbox"
              name="shared"
              id="shared"
              checked={newExpense.shared}
              onChange={(e) => setNewExpense({ ...newExpense, shared: e.target.checked })}
              className="mt-2 block rounded-md border-gray-300 focus:outline-indigo-600"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddExpense}
          className="mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Add Expense
        </button>
        <ul className="mt-4 space-y-2">
          {formData.expenses.map((expense, index) => (
            <li key={index} className="text-sm text-gray-700">
              {expense.name}: ${expense.cost} {expense.shared ? '(Shared)' : ''}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Create Job
        </button>
      </div>
    </form>
  );
};

export default CreateJobForm;
