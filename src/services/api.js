import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to every request if available
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Auth API
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (firstName, lastName, email, password, confirmPassword) => {
  const response = await api.post('/auth/register', { firstName, lastName, email, password, confirmPassword });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfileImage = async (profileImage) => {
  const response = await api.put('/auth/profile-image', { profileImage });
  return response.data;
};

export const changePassword = async (currentPassword, newPassword, confirmPassword) => {
  const response = await api.put('/auth/change-password', { 
    currentPassword, 
    newPassword, 
    confirmPassword 
  });
  return response.data;
};

export const deleteAccount = async (password) => {
  const response = await api.delete('/auth/delete-account', {
    data: { password }
  });
  return response.data;
};

// Links API
export const getLinks = async () => {
  const response = await api.get('/links');
  return response.data;
};

export const createLink = async (linkData) => {
  const response = await api.post('/links', linkData);
  return response.data;
};

export const deleteLink = async (id) => {
  const response = await api.delete(`/links/${id}`);
  return response.data;
};

// Todos API
export const getTodos = async () => {
  const response = await api.get('/todos');
  return response.data;
};

export const createTodo = async (todoData) => {
  const response = await api.post('/todos', todoData);
  return response.data;
};

export const updateTodo = async (id, todoData) => {
  const response = await api.put(`/todos/${id}`, todoData);
  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};

// Notifications API
export const getNotificationSettings = async () => {
  const response = await api.get('/notifications/settings');
  return response.data;
};

export const updateNotificationSettings = async (settings) => {
  const response = await api.put('/notifications/settings', settings);
  return response.data;
};

export const triggerTaskNotifications = async () => {
  const response = await api.post('/notifications/check-tasks');
  return response.data;
};

export const sendNewFeatureNotification = async (title, description) => {
  const response = await api.post('/notifications/new-feature', { title, description });
  return response.data;
};

export default api; 