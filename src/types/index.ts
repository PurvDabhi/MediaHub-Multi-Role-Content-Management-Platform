export type UserRole = 'admin' | 'editor' | 'writer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Content {
  id: string;
  title: string;
  body: string;
  status: 'draft' | 'scheduled' | 'published';
  authorId: string;
  publishDate?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  uploadedBy: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface ContentState {
  items: Content[];
  currentContent: Content | null;
  loading: boolean;
  error: string | null;
}

export interface MediaState {
  files: MediaFile[];
  loading: boolean;
  error: string | null;
}