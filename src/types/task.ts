export interface User {
  id: number;
  name: string;
  avatar?: string;
}

export interface Comment {
  id: number;
  user: User;
  text: string;
  timestamp: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignee: User;
  createdBy: User;
  createdAt: string;
  updatedAt?: string;
  tags: string[];
  comments: Comment[];
}

export interface TaskFormData {
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assigneeId: number | null;
  tags: string[];
}

export interface TaskFilters {
  status: string;
  priority: string;
  searchQuery: string;
} 