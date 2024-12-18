import axios from 'axios';
import { API_BASE_URL } from '../config';

// Fetch all materials
export const getMaterials = () => axios.get(`${API_BASE_URL}/in-house/materials`);

// Create a new material
export const createMaterial = (data) => 
  axios.post(`${API_BASE_URL}/in-house/new_material`, data);

// Update an existing material
export const updateMaterial = (id, data) =>
  axios.put(`${API_BASE_URL}/in-house/update_material/${id}`, data);

// Delete a material (optional for completeness)
export const deleteMaterial = (id) => 
  axios.delete(`${API_BASE_URL}/in-house/delete_material/${id}`);
