// API Response Types
export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
  }
  
  // Error Types
  export interface ApiError {
    message: string;
    code: string;
    status: number;
  }
  
  // Auth Types
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: User;
  }
  
  export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    createdAt: string;
  }
  
  // Novel Types
  export interface NovelResponse {
    id: string;
    title: string;
    author: string;
    cover: string;
    synopsis: string;
    genre: string[];
    rating: number;
    status: '连载中' | '已完结';
  }