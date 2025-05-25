// API Endpoints configuration
export const API_ENDPOINTS = {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refreshToken: '/auth/refresh-token',
    },
    novels: {
      list: '/novels',
      detail: (id: string) => `/novels/${id}`,
      chapters: (id: string) => `/novels/${id}/chapters`,
      chapter: (id: string, chapterId: string) => `/novels/${id}/chapters/${chapterId}`,
    },
    user: {
      profile: '/user/profile',
      settings: '/user/settings',
      library: '/user/library',
    },
  } as const;