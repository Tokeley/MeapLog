import axios from 'axios';
import { AuthResponse, BlogPost, ResearchPaper } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', { username, password });
  return response.data;
};

// Blog API
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const response = await api.get<BlogPost[]>('/blog');
  return response.data;
};

export const getBlogPost = async (id: string): Promise<BlogPost> => {
  const response = await api.get<BlogPost>(`/blog/${id}`);
  return response.data;
};

export const createBlogPost = async (post: Omit<BlogPost, '_id' | 'author' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> => {
  const response = await api.post<BlogPost>('/blog', post);
  return response.data;
};

export const updateBlogPost = async (id: string, post: Partial<BlogPost>): Promise<BlogPost> => {
  const response = await api.put<BlogPost>(`/blog/${id}`, post);
  return response.data;
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  await api.delete(`/blog/${id}`);
};

// Get all unique tags from blog posts
export const getBlogTags = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/blog/tags');
  return response.data;
};

// Papers API
export const getPapers = async (): Promise<ResearchPaper[]> => {
  const response = await api.get<ResearchPaper[]>('/papers');
  return response.data;
};

export const getPaper = async (id: string): Promise<ResearchPaper> => {
  const response = await api.get<ResearchPaper>(`/papers/${id}`);
  return response.data;
};

export const createPaper = async (paper: Omit<ResearchPaper, '_id' | 'addedBy' | 'createdAt' | 'updatedAt'>): Promise<ResearchPaper> => {
  const response = await api.post<ResearchPaper>('/papers', paper);
  return response.data;
};

export const updatePaper = async (id: string, paper: Partial<ResearchPaper>): Promise<ResearchPaper> => {
  const response = await api.put<ResearchPaper>(`/papers/${id}`, paper);
  return response.data;
};

export const deletePaper = async (id: string): Promise<void> => {
  await api.delete(`/papers/${id}`);
};

// Get all unique tags from papers
export const getPaperTags = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/papers/tags');
  return response.data;
};

export const togglePaperRead = async (id: string): Promise<ResearchPaper> => {
  const response = await api.put<ResearchPaper>(`/papers/${id}/read`);
  return response.data;
};

export const updatePaperNotes = async (id: string, notes: string): Promise<ResearchPaper> => {
  const response = await api.put<ResearchPaper>(`/papers/${id}/notes`, { notes });
  return response.data;
}; 