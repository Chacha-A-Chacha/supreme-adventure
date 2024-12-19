import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMaterials } from '../../store/slices/materialSlice';
import { createJob } from '../../store/slices/jobSlice';
import { getPaymentStatuses } from '../../services/jobService';

const CreateJobForm = () => {
  const dispatch = useDispatch();
  const { materials } = useSelector((state) => state.materials);
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
  const [paymentStatuses, setPaymentStatuses] = useState([]);

  useEffect(() => {
    dispatch(fetchMaterials());
    getPaymentStatuses()
      .then(response => setPaymentStatuses(response.data.payment_statuses))
      .catch(error => console.error('Error fetching payment statuses:', error));
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMaterialChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial({ ...newMaterial, [name]: value });
  };

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
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
            value={formData.description}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
            required
          />
        </div>
        <div>
          <label htmlFor="progress_status" className="block text-sm font-medium text-gray-900">Progress Status</label>
          <select
            name="progress_status"
            id="progress_status"
            value={formData.progress_status}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label htmlFor="start" className="block text-sm font-medium text-gray-900">Start Date</label>
          <input
            type="date"
            name="start"
            id="start"
            value={formData.timeframe.start}
            onChange={(e) => setFormData({ ...formData, timeframe: { ...formData.timeframe, start: e.target.value } })}
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
          />
        </div>
        <div>
          <label htmlFor="end" className="block text-sm font-medium text-gray-900">End Date</label>
          <input
            type="date"
            name="end"
            id="end"
            value={formData.timeframe.end}
            onChange={(e) => setFormData({ ...formData, timeframe: { ...formData.timeframe, end: e.target.value } })}
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
          />
        </div>
        <div>
          <label htmlFor="pricing_input" className="block text-sm font-medium text-gray-900">Pricing Input</label>
          <input
            type="number"
            name="pricing_input"
            id="pricing_input"
            value={formData.pricing_input}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
          />
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-md font-medium text-gray-900">Material Usage</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="material_id" className="block text-sm font-medium text-gray-900">Material</label>
            <select
              name="material_id"
              id="material_id"
              value={newMaterial.material_id}
              onChange={handleMaterialChange}
              className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
            >
              <option value="">Select Material</option>
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="usage_meters" className="block text-sm font-medium text-gray-900">Usage Meters</label>
            <input
              type="number"
              name="usage_meters"
              id="usage_meters"
              value={newMaterial.usage_meters}
              onChange={handleMaterialChange}
              className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={handleAddMaterial}
              className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Material
            </button>
          </div>
        </div>
        <ul className="mt-4">
          {formData.material_usages.map((material, index) => (
            <li key={index}>
              Material ID: {material.material_id}, Usage Meters: {material.usage_meters}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <h3 className="text-md font-medium text-gray-900">Expenses</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="expense_name" className="block text-sm font-medium text-gray-900">Expense Name</label>
            <input
              type="text"
              name="name"
              id="expense_name"
              value={newExpense.name}
              onChange={handleExpenseChange}
              className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
            />
          </div>
          <div>
            <label htmlFor="expense_cost" className="block text-sm font-medium text-gray-900">Expense Cost</label>
            <input
              type="number"
              name="cost"
              id="expense_cost"
              value={newExpense.cost}
              onChange={handleExpenseChange}
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
              className="mt-2 block"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="job_ids" className="block text-sm font-medium text-gray-900">Job IDs (if shared)</label>
            <input
              type="text"
              name="job_ids"
              id="job_ids"
              value={newExpense.job_ids.join(', ')}
              onChange={(e) => setNewExpense({ ...newExpense, job_ids: e.target.value.split(',').map(id => parseInt(id.trim())) })}
              className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600"
              disabled={!newExpense.shared}
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={handleAddExpense}
              className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Expense
            </button>
          </div>
        </div>
        <ul className="mt-4">
          {formData.expenses.map((expense, index) => (
            <li key={index}>
              Name: {expense.name}, Cost: {expense.cost}, Shared: {expense.shared ? 'Yes' : 'No'}, Job IDs: {expense.job_ids.join(', ')}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Job
        </button>
      </div>
    </form>
  );
};

export default CreateJobForm;