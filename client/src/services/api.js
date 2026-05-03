// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL, // Ensure we are hitting the correct API endpoint
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get user from localStorage (set by Firebase auth)
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.accessToken || user.stsTokenManager?.accessToken) {
          const token = user.accessToken || user.stsTokenManager.accessToken;
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error parsing user from storage:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    // Handle common errors
    if (error.response?.status === 401) {
      console.log('Unauthorized access - redirecting to login');
    }
    
    return Promise.reject(error);
  }
);

// ==================== RECIPES API ====================
export const getRecipes = (params = {}) => {
  console.log('📥 Fetching recipes with params:', params);
  return api.get('/api/recipes', { params });
};

export const getRecipe = (id) => {
  console.log('📥 Fetching recipe:', id);
  return api.get(`/api/recipes/${id}`);
};

export const createRecipe = (recipeData) => {
  console.log('📝 Creating recipe:', recipeData.title);
  return api.post('/api/recipes', recipeData);
};

export const updateRecipe = (id, recipeData) => {
  console.log('✏️ Updating recipe:', id);
  return api.put(`/api/recipes/${id}`, recipeData);
};

export const likeRecipe = (id, data) => {
  console.log('❤️ Liking recipe:', id, 'by user:', data.userId);
  return api.post(`/api/recipes/${id}/like`, data);
};

export const saveRecipe = (id, data) => {
  console.log('💾 Saving recipe:', id, 'by user:', data.userId);
  return api.post(`/api/recipes/${id}/save`, data);
};

export const getSavedRecipes = (userId) => {
  console.log('📚 Fetching saved recipes for user:', userId);
  return api.get(`/api/recipes/saved/${userId}`)
};

export const getUserRecipes = (userId) => {
  console.log('👤 Fetching user recipes:', userId);
  return api.get(`/api/recipes/user/${userId}`);
};

export const deleteRecipe = (id) => {
  console.log('🗑️ Deleting recipe:', id);
  return api.delete(`/api/recipes/${id}`);
};

// ==================== AUTH API ====================
// These are compatible with your existing Firebase auth
export const verifyToken = (token) => {
  console.log('🔍 Verifying token');
  return api.post('/auth/verify', { token });
};

// Firebase-compatible auth functions
export const loginWithEmailPassword = (email, password) => {
  console.log('🔐 Logging in with email/password');
  return api.post('/auth/login', { email, password });
};

export const registerWithEmailPassword = (userData) => {
  console.log('👤 Registering with email/password');
  return api.post('/auth/register', userData);
};

export const getCurrentUser = () => {
  console.log('👤 Getting current user from API');
  return api.get('/auth/me');
};

export const updateUserProfile = (userData) => {
  console.log('✏️ Updating user profile');
  return api.put('/auth/profile', userData);
};

// ==================== FEEDBACK API ====================
export const submitFeedback = (feedbackData) => {
  console.log('📝 Submitting feedback for recipe:', feedbackData.recipeId);
  return api.post('/feedback', feedbackData);
};

export const getRecipeFeedback = (recipeId) => {
  console.log('💬 Fetching feedback for recipe:', recipeId);
  return api.get(`/feedback/recipe/${recipeId}`);
};

// ==================== UTILITY FUNCTIONS ====================
// These utilities work with Firebase auth storage
export const getCurrentUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user from storage:', error);
    return null;
  }
};

export const setCurrentUserToStorage = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuthStorage = () => {
  localStorage.removeItem('user');
  delete api.defaults.headers.common['Authorization'];
};

export const isAuthenticated = () => {
  const user = getCurrentUserFromStorage();
  return !!(user && (user.uid || user.email));
};

// ==================== HEALTH CHECK ====================
export const healthCheck = () => {
  console.log('🏥 Health check');
  return api.get('/health');
};

export const apiStatus = () => {
  console.log('📡 API status check');
  return api.get('/api/status');
};

export default api;