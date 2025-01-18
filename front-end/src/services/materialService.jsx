// services/materialService.jsx

import axios from 'axios';
import { API_BASE_URL } from '../config';

// Fetch all materials
export const getMaterials = () => axios.get(`${API_BASE_URL}/materials/list`);

// Create a new material
export const createMaterial = (data) => 
  axios.post(`${API_BASE_URL}/materials/create`, data);

// Restock an existing material
export const restockMaterial = (data) =>
  axios.post(`${API_BASE_URL}/materials/restock`, data);

// Update an existing material
export const updateMaterial = (data) =>
  axios.post(`${API_BASE_URL}/materials/adjust-stock`, data);

// Delete a material (optional for completeness)
export const deleteMaterial = (id) => 
  axios.delete(`${API_BASE_URL}/materials/delete_material`);
