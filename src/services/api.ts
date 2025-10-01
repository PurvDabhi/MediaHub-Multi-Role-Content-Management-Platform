import axios from 'axios';
import { Content, MediaFile } from '@/types';
import { handleApiError } from '@/utils/errorHandler';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    handleApiError(error);
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  register: async (userData: { name: string; email: string; password: string; role?: string }) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },
};

export const contentAPI = {
  getAll: async (): Promise<Content[]> => {
    const { data } = await api.get('/content');
    return data;
  },
  create: async (contentData: Partial<Content>): Promise<Content> => {
    const { data } = await api.post('/content', contentData);
    return data;
  },
  update: async (id: string, contentData: Partial<Content>): Promise<Content> => {
    const { data } = await api.put(`/content/${id}`, contentData);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/content/${id}`);
    return id;
  },
};

export const mediaAPI = {
  getAll: async (): Promise<MediaFile[]> => {
    const { data } = await api.get('/media');
    return data;
  },
  upload: async (file: File): Promise<MediaFile> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/media/upload', formData);
    return data;
  },
};

export const usersAPI = {
  getAll: async () => {
    const { data } = await api.get('/users');
    return data;
  },
};