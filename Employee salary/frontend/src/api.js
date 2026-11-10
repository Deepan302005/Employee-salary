// api.js
import axios from 'axios';

// Base URL for the R Plumber backend API (default: localhost:8000)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // 5 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const fetchDashboardMetrics = async (department = 'All') => {
  const params = department && department !== 'All' ? { department } : {};
  const response = await apiClient.get('/dashboard', { params });
  return response.data;
};

export const fetchEmployees = async (department = 'All') => {
  const params = department && department !== 'All' ? { department } : {};
  const response = await apiClient.get('/employees', { params });
  return response.data;
};

export const fetchDepartments = async (department = 'All') => {
  const params = department && department !== 'All' ? { department } : {};
  const response = await apiClient.get('/departments', { params });
  return response.data;
};

export const fetchGender = async (department = 'All') => {
  const params = department && department !== 'All' ? { department } : {};
  const response = await apiClient.get('/gender', { params });
  return response.data;
};

export const fetchExperience = async (department = 'All') => {
  const params = department && department !== 'All' ? { department } : {};
  const response = await apiClient.get('/experience', { params });
  return response.data;
};

export default apiClient;
