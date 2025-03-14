<template>
  <v-app>
    <v-app-bar v-if="isAuthenticated" color="primary">
      <v-app-bar-title>Task Management App</v-app-bar-title>
      <v-spacer></v-spacer>
      
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-badge
            :content="unreadCount"
            :model-value="unreadCount > 0"
            color="error"
          >
            <v-btn v-bind="props" icon>
              <v-icon>mdi-bell</v-icon>
            </v-btn>
          </v-badge>
        </template>
        
        <v-list width="300">
          <v-list-subheader>Notifications</v-list-subheader>
          <v-list-item
            v-for="notification in notifications"
            :key="notification.id"
            :title="notification.message"
            :subtitle="formatDate(notification.createdAt)"
            :class="{ 'bg-grey-lighten-4': !notification.isRead }"
            @click="markNotificationAsRead(notification.id)"
          ></v-list-item>
          
          <v-list-item v-if="notifications.length === 0">
            <v-list-item-title>No notifications</v-list-item-title>
          </v-list-item>
          
          <v-divider></v-divider>
          <v-list-item
            v-if="unreadCount > 0"
            @click="markAllNotificationsAsRead"
          >
            <v-list-item-title class="text-center">Mark all as read</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    
    <v-navigation-drawer v-if="isAuthenticated" permanent>
      <v-list>
        <v-list-item
          title="Tasks"
          prepend-icon="mdi-format-list-checks"
          to="/tasks"
        ></v-list-item>
        <v-list-item
          title="My Tasks"
          prepend-icon="mdi-account-check"
          to="/my-tasks"
        ></v-list-item>
        <v-list-item
          title="Profile"
          prepend-icon="mdi-account"
          to="/profile"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
    
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
    
    <v-snackbar
      v-model="showNotification"
      :timeout="3000"
      color="info"
    >
      {{ notificationMessage }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          icon="mdi-close"
          @click="showNotification = false"
        ></v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './store/auth'
import { useNotificationsStore } from './store/notifications'
import { format } from 'date-fns'

const router = useRouter()
const authStore = useAuthStore()
const notificationsStore = useNotificationsStore()
const socket = inject('socket') as any

const isAuthenticated = computed(() => authStore.isAuthenticated)
const notifications = computed(() => notificationsStore.notifications)
const unreadCount = computed(() => notificationsStore.unreadCount)

const showNotification = ref(false)
const notificationMessage = ref('')

// Format date helper
const formatDate = (date: string | Date) => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

// Handle socket events
onMounted(async () => {
  if (isAuthenticated.value) {
    // Connect websocket
    socket.connect()
    
    // Load notifications
    await notificationsStore.fetchNotifications()
    
    // Listen for real-time notifications
    socket.on('notification:new', (notification: any) => {
      notificationsStore.addNotification(notification)
      notificationMessage.value = notification.message
      showNotification.value = true
    })
    
    // Listen for task events
    socket.on('task:created', () => {
      notificationMessage.value = 'A new task has been created'
      showNotification.value = true
    })
    
    socket.on('task:status-changed', () => {
      notificationMessage.value = 'A task status has been updated'
      showNotification.value = true
    })
  }
})

onBeforeUnmount(() => {
  socket.disconnect()
})

// Mark notification as read
const markNotificationAsRead = (id: number) => {
  notificationsStore.markAsRead(id)
}

// Mark all notifications as read
const markAllNotificationsAsRead = () => {
  notificationsStore.markAllAsRead()
}

// Logout
const logout = () => {
  socket.disconnect()
  authStore.logout()
  router.push('/login')
}
</script>