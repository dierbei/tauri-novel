import api from '../axios';
import { API_ENDPOINTS } from '../endpoints';
import type { ApiResponse, NovelResponse } from '../types';

export const novelsApi = {
  getList: async () => {
    const response = await api.get<ApiResponse<NovelResponse[]>>(
      API_ENDPOINTS.novels.list
    );
    return response.data;
  },

  getDetail: async (id: string) => {
    const response = await api.get<ApiResponse<NovelResponse>>(
      API_ENDPOINTS.novels.detail(id)
    );
    return response.data;
  },

  getChapters: async (id: string) => {
    const response = await api.get(API_ENDPOINTS.novels.chapters(id));
    return response.data;
  },

  getChapter: async (id: string, chapterId: string) => {
    const response = await api.get(
      API_ENDPOINTS.novels.chapter(id, chapterId)
    );
    return response.data;
  },
};