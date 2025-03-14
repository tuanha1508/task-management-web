import { defineStore } from 'pinia'
import api from '../services/api'

export interface Task {
  id: number
  title: string
  description: string
  creatorId: number
  creator?: {
    id: number
    username: string
  }
  assigneeId?: number
  assignee?: {
    id: number
    username: string
  }
  status: 'open' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
    loading: false,
    error: null as string | null
  }),
  
  getters: {
    openTasks: (state) => state.tasks.filter(task => task.status === 'open'),
    inProgressTasks: (state) => state.tasks.filter(task => task.status === 'in_progress'),
    completedTasks: (state) => state.tasks.filter(task => task.status === 'completed'),
    
    myCreatedTasks: (state) => {
      const userId = parseInt(localStorage.getItem('userId') || '0')
      return state.tasks.filter(task => task.creatorId === userId)
    },
    
    myAssignedTasks: (state) => {
      const userId = parseInt(localStorage.getItem('userId') || '0')
      return state.tasks.filter(task => task.assigneeId === userId)
    }
  },
  
  actions: {
    async fetchTasks() {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.get('/tasks')
        this.tasks = response.data
      } catch (error) {
        this.error = 'Failed to fetch tasks'
        console.error('Error fetching tasks:', error)
      } finally {
        this.loading = false
      }
    },
    
    async createTask(taskData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.post('/tasks', taskData)
        // Add the new task to the array
        this.tasks.push(response.data)
        return { success: true, task: response.data }
      } catch (error) {
        this.error = 'Failed to create task'
        console.error('Error creating task:', error)
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async updateTask(id: number, taskData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.patch(`/tasks/${id}`, taskData)
        
        // Update the task in the array
        const index = this.tasks.findIndex(task => task.id === id)
        if (index !== -1) {
          this.tasks[index] = response.data
        }
        
        return { success: true, task: response.data }
      } catch (error) {
        this.error = 'Failed to update task'
        console.error('Error updating task:', error)
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async updateTaskStatus(id: number, status: string) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.patch(`/tasks/${id}/status`, { status })
        
        // Update the task in the array
        const index = this.tasks.findIndex(task => task.id === id)
        if (index !== -1) {
          this.tasks[index] = response.data
        }
        
        return { success: true, task: response.data }
      } catch (error) {
        this.error = 'Failed to update task status'
        console.error('Error updating task status:', error)
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
    
    // Socket events handling
    addTask(task: Task) {
      const exists = this.tasks.some(t => t.id === task.id)
      if (!exists) {
        this.tasks.push(task)
      }
    },
    
    updateTaskFromSocket(updatedTask: Task) {
      const index = this.tasks.findIndex(task => task.id === updatedTask.id)
      if (index !== -1) {
        this.tasks[index] = updatedTask
      }
    }
  }
})