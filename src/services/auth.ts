import api from './api';
import { AuthResponse, LoginCredentials } from '../types';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post('auth/login', credentials);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('adv-token');
  localStorage.removeItem('adv-user');
};