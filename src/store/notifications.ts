import { defineStore } from 'pinia'
import api from '../services/api'

interface Notification {
  id: number
  userId: number
  relatedTaskId?: number
  type: string
  message: string
  isRead: boolean
  createdAt: string
}

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as Notification[],
    loading: false,
    error: null as string | null
  }),
  
  getters: {
    unreadNotifications: (state) => state.notifications.filter(n => !n.isRead),
    unreadCount: (state) => state.notifications.filter(n => !n.isRead).length
  },
  
  actions: {
    async fetchNotifications() {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.get('/notifications')
        this.notifications = response.data
      } catch (error) {
        this.error = 'Failed to fetch notifications'
        console.error('Error fetching notifications:', error)
      } finally {
        this.loading = false
      }
    },
    
    async markAsRead(id: number) {
      try {
        await api.patch(`/notifications/${id}/read`)
        
        // Update the notification in the array
        const notification = this.notifications.find(n => n.id === id)
        if (notification) {
          notification.isRead = true
        }
      } catch (error) {
        console.error('Error marking notification as read:', error)
      }
    },
    
    async markAllAsRead() {
      try {
        await api.patch('/notifications/read-all')
        
        // Update all notifications in the array
        this.notifications.forEach(notification => {
          notification.isRead = true
        })
      } catch (error) {
        console.error('Error marking all notifications as read:', error)
      }
    },
    
    // Add a new notification from socket
    addNotification(notification: Notification) {
      const exists = this.notifications.some(n => n.id === notification.id)
      if (!exists) {
        this.notifications.unshift(notification)
      }
    }
  }
})