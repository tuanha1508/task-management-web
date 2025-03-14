import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Task, TaskFormData, TaskFilters } from '../types/task';

export const useTaskStore = defineStore('task', () => {
  // State
  const tasks = ref<Task[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const filters = ref<TaskFilters>({
    status: 'all',
    priority: 'all',
    searchQuery: ''
  });
  const sortBy = ref('dueDate');
  const sortDesc = ref(false);

  // Mock data for initial development
  const mockTasks: Task[] = [
    { 
      id: 1, 
      title: 'Design User Interface', 
      description: 'Create wireframes and mockups for the task management application. Include screens for dashboard, task list, task details, and user profile.',
      status: 'completed', 
      priority: 'high',
      dueDate: '2023-12-15', 
      assignee: { id: 1, name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
      createdBy: { id: 2, name: 'Jane Smith' },
      createdAt: '2023-12-01',
      updatedAt: '2023-12-14',
      tags: ['design', 'frontend'],
      comments: [
        { id: 1, user: { id: 2, name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' }, text: 'Please make sure to follow our design system guidelines.', timestamp: '2023-12-02' },
        { id: 2, user: { id: 1, name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' }, text: 'I\'ve completed the initial wireframes, please review.', timestamp: '2023-12-10' }
      ]
    },
    { 
      id: 2, 
      title: 'Implement Authentication', 
      description: 'Set up authentication using Supabase Auth with JWT. Implement login, registration, and password reset functionality.',
      status: 'in-progress', 
      priority: 'high',
      dueDate: '2023-12-20', 
      assignee: { id: 3, name: 'Robert Johnson', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
      createdBy: { id: 2, name: 'Jane Smith' },
      createdAt: '2023-12-05',
      updatedAt: '2023-12-12',
      tags: ['backend', 'security'],
      comments: [
        { id: 3, user: { id: 3, name: 'Robert Johnson', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' }, text: 'I\'ll be using Supabase Auth for this. Starting today.', timestamp: '2023-12-06' },
        { id: 4, user: { id: 2, name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' }, text: 'Make sure to implement proper error handling.', timestamp: '2023-12-08' }
      ]
    },
    { 
      id: 3, 
      title: 'Create Database Schema', 
      description: 'Design and implement database schema for task management',
      status: 'completed', 
      priority: 'medium',
      dueDate: '2023-12-10', 
      assignee: { id: 2, name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
      createdBy: { id: 1, name: 'John Doe' },
      createdAt: '2023-12-02',
      updatedAt: '2023-12-09',
      tags: ['database', 'backend'],
      comments: []
    },
    { 
      id: 4, 
      title: 'Set up CI/CD Pipeline', 
      description: 'Configure continuous integration and deployment pipeline',
      status: 'pending', 
      priority: 'low',
      dueDate: '2023-12-25', 
      assignee: { id: 4, name: 'Emily Brown', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
      createdBy: { id: 1, name: 'John Doe' },
      createdAt: '2023-12-08',
      updatedAt: '2023-12-08',
      tags: ['devops', 'automation'],
      comments: []
    },
    { 
      id: 5, 
      title: 'Implement Task Creation Feature', 
      description: 'Create UI and backend functionality for adding new tasks',
      status: 'in-progress', 
      priority: 'high',
      dueDate: '2023-12-22', 
      assignee: { id: 1, name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
      createdBy: { id: 3, name: 'Robert Johnson' },
      createdAt: '2023-12-10',
      updatedAt: '2023-12-11',
      tags: ['frontend', 'backend'],
      comments: []
    },
    { 
      id: 6, 
      title: 'Add Real-time Updates', 
      description: 'Implement Socket.io for real-time task updates',
      status: 'pending', 
      priority: 'medium',
      dueDate: '2023-12-28', 
      assignee: { id: 3, name: 'Robert Johnson', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
      createdBy: { id: 2, name: 'Jane Smith' },
      createdAt: '2023-12-12',
      updatedAt: '2023-12-12',
      tags: ['real-time', 'socket.io'],
      comments: []
    },
  ];

  // Getters
  const filteredTasks = computed(() => {
    let result = [...tasks.value];
    
    // Filter by query
    if (filters.value.searchQuery) {
      const query = filters.value.searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) || 
        task.description.toLowerCase().includes(query) ||
        task.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by status
    if (filters.value.status !== 'all') {
      result = result.filter(task => task.status === filters.value.status);
    }
    
    // Filter by priority
    if (filters.value.priority !== 'all') {
      result = result.filter(task => task.priority === filters.value.priority);
    }
    
    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy.value === 'dueDate') {
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy.value === 'priority') {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        comparison = priorityWeight[a.priority] - priorityWeight[b.priority];
      } else if (sortBy.value === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy.value === 'status') {
        comparison = a.status.localeCompare(b.status);
      }
      
      return sortDesc.value ? -comparison : comparison;
    });
    
    return result;
  });

  const taskById = (id: number) => {
    return tasks.value.find(task => task.id === id) || null;
  };

  const taskSummary = computed(() => {
    const total = tasks.value.length;
    const completed = tasks.value.filter(task => task.status === 'completed').length;
    const inProgress = tasks.value.filter(task => task.status === 'in-progress').length;
    const pending = tasks.value.filter(task => task.status === 'pending').length;
    
    return { total, completed, inProgress, pending };
  });

  // Actions
  const fetchTasks = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // In a real app, we would fetch from an API
      // For now, use our mock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      tasks.value = [...mockTasks];
    } catch (err) {
      error.value = 'Failed to fetch tasks';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const getTask = async (id: number) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // In a real app, we would fetch a specific task from an API
      // For now, find it in our mock data
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      return mockTasks.find(task => task.id === id) || null;
    } catch (err) {
      error.value = 'Failed to fetch task';
      console.error(err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const createTask = async (taskData: TaskFormData) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // In a real app, we would send to an API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // For now, create a new task with mock data
      const newTask: Task = {
        id: Math.max(0, ...tasks.value.map(t => t.id)) + 1,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status as 'pending' | 'in-progress' | 'completed',
        priority: taskData.priority as 'low' | 'medium' | 'high',
        dueDate: taskData.dueDate,
        assignee: { id: taskData.assigneeId || 1, name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' }, // Default to first user
        createdBy: { id: 1, name: 'John Doe' }, // Current user
        createdAt: new Date().toISOString().split('T')[0],
        tags: taskData.tags,
        comments: []
      };
      
      tasks.value.push(newTask);
      return newTask;
    } catch (err) {
      error.value = 'Failed to create task';
      console.error(err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const updateTask = async (id: number, taskData: TaskFormData) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // In a real app, we would send to an API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      const taskIndex = tasks.value.findIndex(task => task.id === id);
      
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }
      
      // Update task properties
      const updatedTask = {
        ...tasks.value[taskIndex],
        title: taskData.title,
        description: taskData.description,
        status: taskData.status as 'pending' | 'in-progress' | 'completed',
        priority: taskData.priority as 'low' | 'medium' | 'high',
        dueDate: taskData.dueDate,
        tags: taskData.tags,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      
      // Update assignee if changed
      if (taskData.assigneeId && taskData.assigneeId !== tasks.value[taskIndex].assignee.id) {
        const mockUsers = [
          { id: 1, name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
          { id: 2, name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
          { id: 3, name: 'Robert Johnson', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
          { id: 4, name: 'Emily Brown', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
        ];
        
        const newAssignee = mockUsers.find(user => user.id === taskData.assigneeId);
        
        if (newAssignee) {
          updatedTask.assignee = newAssignee;
        }
      }
      
      tasks.value[taskIndex] = updatedTask;
      return updatedTask;
    } catch (err) {
      error.value = 'Failed to update task';
      console.error(err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteTask = async (id: number) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // In a real app, we would send to an API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      const taskIndex = tasks.value.findIndex(task => task.id === id);
      
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }
      
      tasks.value.splice(taskIndex, 1);
      return true;
    } catch (err) {
      error.value = 'Failed to delete task';
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const addComment = async (taskId: number, comment: string) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // In a real app, we would send to an API
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      
      const taskIndex = tasks.value.findIndex(task => task.id === taskId);
      
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }
      
      const newComment = {
        id: Math.max(0, ...tasks.value[taskIndex].comments.map(c => c.id)) + 1,
        user: { id: 1, name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' }, // Current user
        text: comment,
        timestamp: new Date().toISOString().split('T')[0]
      };
      
      tasks.value[taskIndex].comments.push(newComment);
      return newComment;
    } catch (err) {
      error.value = 'Failed to add comment';
      console.error(err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const setFilters = (newFilters: Partial<TaskFilters>) => {
    filters.value = { ...filters.value, ...newFilters };
  };

  const setSorting = (field: string, descending: boolean) => {
    sortBy.value = field;
    sortDesc.value = descending;
  };

  return {
    // State
    tasks,
    isLoading,
    error,
    filters,
    sortBy,
    sortDesc,
    
    // Getters
    filteredTasks,
    taskById,
    taskSummary,
    
    // Actions
    fetchTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    addComment,
    setFilters,
    setSorting
  };
}); 