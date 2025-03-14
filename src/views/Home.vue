<script setup lang="ts">
import { ref } from 'vue';

// Mock data for dashboard - will be replaced with real data from API later
const taskSummary = ref({
  total: 24,
  completed: 14,
  inProgress: 7,
  pending: 3
});

const recentTasks = ref([
  { id: 1, title: 'Design User Interface', status: 'completed', dueDate: '2023-12-15', priority: 'high' },
  { id: 2, title: 'Implement Authentication', status: 'in-progress', dueDate: '2023-12-20', priority: 'high' },
  { id: 3, title: 'Create Database Schema', status: 'completed', dueDate: '2023-12-10', priority: 'medium' },
  { id: 4, title: 'Set up CI/CD Pipeline', status: 'pending', dueDate: '2023-12-25', priority: 'low' },
]);

const teamMembers = ref([
  { id: 1, name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', taskCount: 8 },
  { id: 2, name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', taskCount: 6 },
  { id: 3, name: 'Robert Johnson', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', taskCount: 5 },
  { id: 4, name: 'Emily Brown', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', taskCount: 5 },
]);
</script>

<template>
  <div>
    <h1 class="text-h4 mb-6">Dashboard</h1>
    
    <!-- Task Summary Cards -->
    <v-row>
      <v-col cols="12" md="3">
        <v-card class="mx-auto" color="primary" theme="dark">
          <v-card-text class="text-center">
            <div class="text-h4 font-weight-bold">{{ taskSummary.total }}</div>
            <div class="text-subtitle-1">Total Tasks</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card class="mx-auto" color="success" theme="dark">
          <v-card-text class="text-center">
            <div class="text-h4 font-weight-bold">{{ taskSummary.completed }}</div>
            <div class="text-subtitle-1">Completed</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card class="mx-auto" color="warning" theme="dark">
          <v-card-text class="text-center">
            <div class="text-h4 font-weight-bold">{{ taskSummary.inProgress }}</div>
            <div class="text-subtitle-1">In Progress</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card class="mx-auto" color="error" theme="dark">
          <v-card-text class="text-center">
            <div class="text-h4 font-weight-bold">{{ taskSummary.pending }}</div>
            <div class="text-subtitle-1">Pending</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Recent Tasks and Team Members -->
    <v-row class="mt-6">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="text-h6">
            Recent Tasks
            <v-spacer></v-spacer>
            <v-btn variant="text" color="primary" to="/tasks">
              View All
            </v-btn>
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-list lines="two">
            <v-list-item
              v-for="task in recentTasks"
              :key="task.id"
              :to="`/task/${task.id}`"
            >
              <template v-slot:prepend>
                <v-icon
                  :color="task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'warning' : 'error'"
                  :icon="task.status === 'completed' ? 'mdi-check-circle' : task.status === 'in-progress' ? 'mdi-progress-clock' : 'mdi-alert-circle'"
                ></v-icon>
              </template>
              
              <v-list-item-title>{{ task.title }}</v-list-item-title>
              
              <v-list-item-subtitle>
                Due: {{ task.dueDate }} | Priority: {{ task.priority }}
              </v-list-item-subtitle>
              
              <template v-slot:append>
                <v-chip
                  :color="task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'warning' : 'error'"
                  size="small"
                >
                  {{ task.status }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title class="text-h6">
            Team Members
            <v-spacer></v-spacer>
            <v-btn variant="text" color="primary" to="/teams">
              View All
            </v-btn>
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-list>
            <v-list-item
              v-for="member in teamMembers"
              :key="member.id"
            >
              <template v-slot:prepend>
                <v-avatar size="40">
                  <v-img :src="member.avatar" :alt="member.name"></v-img>
                </v-avatar>
              </template>
              
              <v-list-item-title>{{ member.name }}</v-list-item-title>
              
              <v-list-item-subtitle>
                {{ member.taskCount }} Tasks
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template> 