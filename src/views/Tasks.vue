<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTaskStore } from '../stores/taskStore';
import CreateTaskForm from '../components/tasks/CreateTaskForm.vue';

const route = useRoute();
const taskStore = useTaskStore();
const showFilterDialog = ref(false);
const showCreateTaskDialog = ref(false);

// Initialize from task store
const searchQuery = computed({
  get: () => taskStore.filters.searchQuery,
  set: (value) => taskStore.setFilters({ searchQuery: value })
});

const filterStatus = computed({
  get: () => taskStore.filters.status,
  set: (value) => taskStore.setFilters({ status: value })
});

const filterPriority = computed({
  get: () => taskStore.filters.priority,
  set: (value) => taskStore.setFilters({ priority: value })
});

const sortBy = computed({
  get: () => taskStore.sortBy,
  set: (value) => taskStore.setSorting(value, taskStore.sortDesc)
});

const sortDesc = computed({
  get: () => taskStore.sortDesc,
  set: (value) => taskStore.setSorting(taskStore.sortBy, value)
});

// Apply filters for "My Tasks" if specified in route
onMounted(async () => {
  // Fetch tasks from store
  await taskStore.fetchTasks();
  
  // Set "My Tasks" filter if route has filter=my
  if (route.query.filter === 'my') {
    // In a real app, we would filter by the logged-in user's ID
    // For this demo, we would handle this in the backend
    console.log('Showing my tasks');
  }
});

const filteredTasks = computed(() => {
  return taskStore.filteredTasks;
});

const openFilterDialog = () => {
  showFilterDialog.value = true;
};

const clearFilters = () => {
  taskStore.setFilters({
    status: 'all',
    priority: 'all',
    searchQuery: ''
  });
};

const getStatusColor = (status) => {
  return status === 'completed' ? 'success' 
    : status === 'in-progress' ? 'warning' 
    : 'error';
};

const getPriorityColor = (priority) => {
  return priority === 'high' ? 'error' 
    : priority === 'medium' ? 'warning' 
    : 'success';
};

const sortOptions = [
  { value: 'dueDate', text: 'Due Date' },
  { value: 'priority', text: 'Priority' },
  { value: 'title', text: 'Title' },
  { value: 'status', text: 'Status' }
];

const openCreateTaskDialog = () => {
  showCreateTaskDialog.value = true;
};
</script>

<template>
  <div>
    <v-row class="align-center mb-5">
      <v-col cols="12" sm="6">
        <h1 class="text-h4">
          {{ route.query.filter === 'my' ? 'My Tasks' : 'All Tasks' }}
        </h1>
      </v-col>
      
      <v-col cols="12" sm="6" class="text-sm-end">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          class="mr-2"
          @click="openCreateTaskDialog"
        >
          New Task
        </v-btn>
        
        <v-btn
          variant="outlined"
          prepend-icon="mdi-filter"
          @click="openFilterDialog"
        >
          Filter
        </v-btn>
      </v-col>
    </v-row>
    
    <!-- Search and Sort Controls -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          v-model="searchQuery"
          label="Search tasks"
          density="comfortable"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
        ></v-text-field>
      </v-col>
      
      <v-col cols="12" sm="6" md="4" class="d-flex">
        <v-select
          v-model="sortBy"
          label="Sort by"
          :items="sortOptions"
          density="comfortable"
          variant="outlined"
          hide-details
        ></v-select>
        
        <v-btn
          icon
          class="ml-2 mt-1"
          @click="sortDesc = !sortDesc"
        >
          <v-icon>{{ sortDesc ? 'mdi-sort-descending' : 'mdi-sort-ascending' }}</v-icon>
        </v-btn>
      </v-col>
      
      <v-col cols="12" md="4" class="text-md-end">
        <v-chip-group>
          <v-chip
            v-if="filterStatus !== 'all'"
            closable
            @click:close="filterStatus = 'all'"
          >
            Status: {{ filterStatus }}
          </v-chip>
          
          <v-chip
            v-if="filterPriority !== 'all'"
            closable
            @click:close="filterPriority = 'all'"
          >
            Priority: {{ filterPriority }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
    
    <!-- Loading State -->
    <v-skeleton-loader 
      v-if="taskStore.isLoading"
      type="list-item-three-line@6"
    ></v-skeleton-loader>
    
    <!-- Error State -->
    <v-alert
      v-else-if="taskStore.error"
      type="error"
      class="mb-4"
    >
      {{ taskStore.error }}
      <div class="mt-2">
        <v-btn
          variant="text"
          @click="taskStore.fetchTasks"
        >
          Retry
        </v-btn>
      </div>
    </v-alert>
    
    <!-- Tasks List -->
    <v-card v-else-if="filteredTasks.length > 0">
      <v-list lines="two">
        <v-list-item
          v-for="task in filteredTasks"
          :key="task.id"
          :to="`/task/${task.id}`"
        >
          <template v-slot:prepend>
            <v-avatar :color="getStatusColor(task.status)" size="36">
              <v-icon icon="mdi-check" v-if="task.status === 'completed'"></v-icon>
              <v-icon icon="mdi-progress-clock" v-else-if="task.status === 'in-progress'"></v-icon>
              <v-icon icon="mdi-clock" v-else></v-icon>
            </v-avatar>
          </template>
          
          <v-list-item-title class="text-h6">{{ task.title }}</v-list-item-title>
          
          <v-list-item-subtitle>
            <div class="d-flex flex-wrap">
              <span class="mr-4">Due: {{ task.dueDate }}</span>
              <span class="mr-4">Assignee: {{ task.assignee.name }}</span>
              <span class="mr-4">
                <v-icon size="small" :color="getPriorityColor(task.priority)"></v-icon>
                {{ task.priority }} priority
              </span>
            </div>
          </v-list-item-subtitle>
          
          <template v-slot:append>
            <div class="d-flex flex-column align-end">
              <v-chip
                :color="getStatusColor(task.status)"
                size="small"
                class="mb-1"
              >
                {{ task.status }}
              </v-chip>
              
              <div class="d-flex mt-1">
                <v-avatar size="24" class="ml-1">
                  <v-img :src="task.assignee.avatar" :alt="task.assignee.name"></v-img>
                </v-avatar>
              </div>
            </div>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
    
    <!-- Empty state -->
    <v-card v-else class="pa-5 text-center">
      <v-icon icon="mdi-clipboard-text-outline" size="64" class="mb-3"></v-icon>
      <h3 class="text-h6">No tasks found</h3>
      <p class="text-body-1 mb-4">Try changing your filters or create a new task</p>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateTaskDialog">
        New Task
      </v-btn>
    </v-card>
    
    <!-- Filter Dialog -->
    <v-dialog v-model="showFilterDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Filter Tasks</v-card-title>
        
        <v-card-text>
          <v-select
            v-model="filterStatus"
            label="Status"
            :items="['all', 'completed', 'in-progress', 'pending']"
            variant="outlined"
          ></v-select>
          
          <v-select
            v-model="filterPriority"
            label="Priority"
            :items="['all', 'high', 'medium', 'low']"
            variant="outlined"
          ></v-select>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="clearFilters">
            Clear
          </v-btn>
          <v-btn color="primary" @click="showFilterDialog = false">
            Apply
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Create Task Dialog -->
    <CreateTaskForm v-model:show-dialog="showCreateTaskDialog" />
  </div>
</template> 