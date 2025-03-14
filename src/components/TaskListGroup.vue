<template>
    <div>
      <v-progress-linear
        v-if="loading"
        indeterminate
        color="primary"
      ></v-progress-linear>
      
      <div v-else-if="tasks.length === 0" class="text-center py-5">
        <v-icon icon="mdi-clipboard-text-off" size="large" class="mb-2"></v-icon>
        <p class="text-body-1">No tasks found</p>
      </div>
      
      <v-list v-else>
        <v-list-item
          v-for="task in tasks"
          :key="task.id"
          :title="task.title"
          :subtitle="task.description"
        >
          <template v-slot:prepend>
            <v-chip
              :color="getPriorityColor(task.priority)"
              size="small"
              class="mr-2"
            >
              {{ task.priority }}
            </v-chip>
          </template>
          
          <template v-slot:append>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  variant="text"
                  v-bind="props"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              
              <v-list>
                <v-list-item
                  v-if="task.status === 'open'"
                  @click="updateStatus(task.id, 'in_progress')"
                  prepend-icon="mdi-play"
                >
                  Start Working
                </v-list-item>
                
                <v-list-item
                  v-if="task.status === 'in_progress'"
                  @click="updateStatus(task.id, 'completed')"
                  prepend-icon="mdi-check"
                >
                  Mark Completed
                </v-list-item>
                
                <v-list-item
                  v-if="task.status === 'completed'"
                  @click="updateStatus(task.id, 'open')"
                  prepend-icon="mdi-refresh"
                >
                  Reopen
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          
          <template v-slot:subtitle>
            <div class="d-flex flex-column mt-1">
              <div class="text-caption">
                <v-icon size="small" class="mr-1">mdi-account</v-icon>
                {{ task.creator?.username || 'Unknown' }}
              </div>
              
              <div v-if="task.dueDate" class="text-caption">
                <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                {{ formatDate(task.dueDate) }}
              </div>
            </div>
          </template>
        </v-list-item>
      </v-list>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue'
  import { format } from 'date-fns'
  
  const props = defineProps({
    tasks: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['update-status'])
  
  // Format date
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy')
  }
  
  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'grey'
    }
  }
  
  // Update task status
  const updateStatus = (taskId, newStatus) => {
    emit('update-status', taskId, newStatus)
  }
  </script>