// services/machineService.jsx
import axios from 'axios';
import { API_BASE_URL } from '../config';

// Create a new machine
export const createMachine = (machineData) => 
  axios.post(`${API_BASE_URL}/machine/create`, machineData);

// Get all machines
export const getMachines = () => 
  axios.get(`${API_BASE_URL}/machine/list`);

// Get all machine readings (paginated)
export const getMachineReadings = (page = 1, per_page = 10) => 
    axios.get(`${API_BASE_URL}/machine/readings/list`, {
      params: {
        page,
        per_page
      }
    });

// Create a machine reading
export const createMachineReading = (readingData) => 
  axios.post(`${API_BASE_URL}/machine/readings/create`, readingData);

// Get readings for a specific job
export const getJobReadings = (jobId) => 
  axios.get(`${API_BASE_URL}/machine/readings/job/${jobId}`);

// Get readings for specific machine with date filter
export const getMachineReadingsByMachine = (machineId, startDate = null, endDate = null) => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    return axios.get(`${API_BASE_URL}/machine/readings/machine/${machineId}`, { params });
  };

// Example usage:
/*
// Create a new machine
const newMachine = {
  name: "Roland VS-640i",
  model: "VS-640i",
  serial_number: "ROL2024VS640I001",
  status: "active"
};

// Log a machine reading
const newReading = {
  job_id: 1,
  machine_id: 1,
  start_meter: 45678.25,
  end_meter: 45690.75,
  operator_id: 1  // optional
};

// Get readings with date filter
const startDate = "2025-01-01";
const endDate = "2025-01-31";
getMachineReadings(1, startDate, endDate);
*/