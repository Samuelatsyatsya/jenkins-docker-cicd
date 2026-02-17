import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          toast.error(data.message || 'Validation error');
          break;
        case 401:
          toast.error('Session expired. Please login again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(data.message || 'An error occurred');
      }
    } else if (error.request) {
      // Request made but no response
      toast.error('Network error. Please check your connection.');
    } else {
      // Something happened in setting up the request
      toast.error('Request error. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

// Game API
export const gameApi = {
  // Submit game result
  submitGame: async (gameData) => {
    const response = await api.post('/game/submit', gameData);
    return response.data;
  },

  // Get leaderboard
  getLeaderboard: async (limit = 10) => {
    const response = await api.get('/game/leaderboard', {
      params: { limit }
    });
    return response.data;
  },

  // Get player stats
  getPlayerStats: async (username) => {
    const response = await api.get(`/game/player/${username}`);
    return response.data;
  },

  // Get game history
  getGameHistory: async (username, page = 1, limit = 10) => {
    const response = await api.get(`/game/player/${username}/history`, {
      params: { page, limit }
    });
    return response.data;
  },
  
// Health check
healthCheck: async () => {
  try {
    const response = await api.get('/health'); // Use api instance with baseURL
    return response.data;
  } catch (error) {
    throw error;
  }
}

};

export default api;