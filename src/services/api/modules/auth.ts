import api from '../axios';
import { API_ENDPOINTS } from '../endpoints';
import type { ApiResponse, LoginRequest, LoginResponse, User } from '../types';

export const authApi = {
  login: async (data: LoginRequest) => {
    const response = await api.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.auth.login,
      data
    );
    return response.data;
  },

  register: async (data: LoginRequest) => {
    const response = await api.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.auth.register,
      data
    );
    return response.data;
  },

  logout: async () => {
    const response = await api.post<ApiResponse<void>>(API_ENDPOINTS.auth.logout);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<ApiResponse<User>>(API_ENDPOINTS.user.profile);
    return response.data;
  },
};