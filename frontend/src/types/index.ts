export interface User {
  id: number;
  username: string;
  isAdmin: boolean;
}

export interface BlogPost {
  _id: string;
  title: string;
  caption: string;
  content: string;
  author: User;
  tags: string[];
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface ResearchPaper {
  _id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  url: string;
  isRead: boolean;
  notes: string;
  tags: string[];
  addedBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
} 