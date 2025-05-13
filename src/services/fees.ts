import { Fee, Process } from '../types';
import api from './api';

export const getFees = async (): Promise<any[]> => {
  const response = await api.get('/honorario');
  return response.data;
};

export const createFee = async (fee: Omit<Fee, 'id'>): Promise<any> => {
  const response = await api.post('/honorario', fee);
  return response.data;
};

export const updateFee = async (id: string, fee: Partial<any>): Promise<Fee> => {
  const response = await api.patch(`/honorario/${id}`, fee);
  return response.data;
};

export const deleteFee = async (id: string): Promise<void> => {
  await api.delete(`/honorario/${id}`);
};

export const getProcesses = async (): Promise<Process[]> => {
  const response = await api.get('/processo/list');
  return response.data;
};

export const findFee = async (id: string): Promise<any> => {
  const response = await api.get(`/honorario/${id}`);
  return response.data;
}

export const removeFee = async (id: string): Promise<void> => {
  await api.delete(`/honorario/${id}`);
}