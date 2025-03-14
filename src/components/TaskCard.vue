<template>
  <v-card class="task-card mb-3" :class="priorityClass">
    <v-card-title class="d-flex justify-space-between align-center">
      <div class="text-truncate">{{ task.title }}</div>
      <v-chip size="small" :color="statusColor" class="ml-2">{{ statusText }}</v-chip>
    </v-card-title>
    
    <v-card-text>
      <p v-if="task.description" class="text-body-2 mb-2">{{ task.description }}</p>
      
      <div class="d-flex align-center mb-2">
        <v-icon size="small" color="grey" class="mr-1">mdi-account</v-icon>
        <span class="text-caption">Created by: {{ task.creator?.username || 'Unknown' }}</span>
      </div>
      
      <div v-if="task.assignee" class="d-flex align-center mb-2">
        <v-icon size="small" color="grey" class="mr-1">mdi-account-check</v-icon>
        <span class="text-caption">Assigned to: {{ task.assignee.username }}</span>
      </div>
      
      <div v-if="task.dueDate" class="d-flex align-center">
        <v-icon size="small" color="grey" class="mr-1">mdi-calendar</v-icon>
        <span class="text-caption">Due: {{ formatDate(task.dueDate) }}</span>
      </div>
    </v-card-text>
    
    <v-card-actions>
      <v-spacer></v-spacer>
      
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            variant="text"
            size="small"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-if="task.status === 'open'" @click="updateStatus('in_progress')">
            <v-list-item-title>Start Working</v-list-item-title>
          </v-list-item>
          
          <v-list-item v-if="task.status === 'in_progress'" @click="updateStatus('completed')">
            <v-list-item-title>Mark Completed</v-list-item-title>
          </v-list-item>
          
          <v-list-item v-if="task.status === 'completed'" @click="updateStatus('open')">
            <v-list-item-title>Reopen Task</v-list-item-title>
          </v-list-item>
          
          <v-divider></v-divider>
          
          <v-list-item @click="$emit('edit', task)">
            <v-list-item-title>Edit</v-list-item-title>
          </v-list-item>
          
          <v-list-item @click="$emit('delete', task.id)" class="text-error">
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';
import { useTasksStore } from '../store/tasks';

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['edit', 'delete']);
const tasksStore = useTasksStore();

const statusText = computed(() => {
  const statusMap = {
    open: 'Open',
    in_progress: 'In Progress',
    completed: 'Completed'
  };
  return statusMap[props.task.status] || props.task.status;
});

const statusColor = computed(() => {
  const colorMap = {
    open: 'blue',
    in_progress: 'orange',
    completed: 'green'
  };
  return colorMap[props.task.status] || 'grey';
});

const priorityClass = computed(() => {
  const classMap = {
    low: 'priority-low',
    medium: 'priority-medium',
    high: 'priority-high'
  };
  return classMap[props.task.priority] || '';
});

const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch (error) {
    return dateString;
  }
};

const updateStatus = async (status) => {
  await tasksStore.updateTaskStatus(props.task.id, status);
};
</script>

<style scoped>
.task-card {
  transition: all 0.3s ease;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.priority-low {
  border-left: 4px solid #8bc34a;
}

.priority-medium {
  border-left: 4px solid #ff9800;
}

.priority-high {
  border-left: 4px solid #f44336;
}
</style> 