import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.parkmobil.com/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = ''// Get token from secure storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getClosestMaps() {
  // TODO: Implement actual API call to get nearby maps
  // This is a mock implementation
  return [
    {
      id: '1',
      name: 'Central Park Garage',
      distance: 0.5,
      address: '123 Main Street',
    },
    {
      id: '2',
      name: 'Downtown Parking',
      distance: 1.2,
      address: '456 Market Street',
    },
    {
      id: '3',
      name: 'Shopping Mall Parking',
      distance: 2.3,
      address: '789 Commerce Ave',
    },
  ];
}

export default apiClient; 