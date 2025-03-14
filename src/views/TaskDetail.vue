<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTaskStore } from '../stores/taskStore';
import type { TaskFormData } from '../types/task';

const route = useRoute();
const router = useRouter();
const taskStore = useTaskStore();
const taskId = computed(() => Number(route.params.id));
const showDeleteDialog = ref(false);
const showEditDialog = ref(false);
const commentText = ref('');

// Form data for editing
const editForm = ref<TaskFormData>({
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: '',
  assigneeId: null,
  tags: []
});

// Mock users for assignee selection
const users = ref([
  { id: 1, name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 2, name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: 3, name: 'Robert Johnson', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: 4, name: 'Emily Brown', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
]);

// Fetch the task
onMounted(async () => {
  if (!taskStore.tasks.length) {
    // If the store doesn't have tasks yet, fetch them first
    await taskStore.fetchTasks();
  }
  
  // Then get the specific task
  await fetchTask();
});

// Watch for route changes (if navigating between different tasks)
watch(() => route.params.id, fetchTask);

async function fetchTask() {
  const task = taskStore.taskById(taskId.value);
  
  if (task) {
    // Initialize edit form with task data
    editForm.value = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assigneeId: task.assignee.id,
      tags: [...task.tags]
    };
  } else {
    // Task not found - fetch it directly or redirect
    const fetchedTask = await taskStore.getTask(taskId.value);
    
    if (!fetchedTask) {
      router.push('/tasks');
    } else {
      editForm.value = {
        title: fetchedTask.title,
        description: fetchedTask.description,
        status: fetchedTask.status,
        priority: fetchedTask.priority,
        dueDate: fetchedTask.dueDate,
        assigneeId: fetchedTask.assignee.id,
        tags: [...fetchedTask.tags]
      };
    }
  }
}

// Get the current task
const task = computed(() => {
  return taskStore.taskById(taskId.value);
});

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

const openEditDialog = () => {
  showEditDialog.value = true;
};

const saveTask = async () => {
  await taskStore.updateTask(taskId.value, editForm.value);
  showEditDialog.value = false;
};

const addComment = async () => {
  if (!commentText.value.trim()) return;
  
  await taskStore.addComment(taskId.value, commentText.value);
  commentText.value = '';
};

const confirmDelete = () => {
  showDeleteDialog.value = true;
};

const deleteTask = async () => {
  const success = await taskStore.deleteTask(taskId.value);
  
  if (success) {
    showDeleteDialog.value = false;
    router.push('/tasks');
  }
};
</script>

<template>
  <div>
    <!-- Loading State -->
    <v-skeleton-loader
      v-if="taskStore.isLoading"
      type="card-heading, list-item-three-line, card-heading, paragraph, divider, list-item-three-line, list-item-three-line"
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
          @click="fetchTask"
        >
          Retry
        </v-btn>
      </div>
    </v-alert>
    
    <div v-else-if="task">
      <!-- Task Header -->
      <v-row class="align-center mb-4">
        <v-col cols="12" sm="8">
          <div class="d-flex align-center">
            <v-chip
              :color="getStatusColor(task.status)"
              class="mr-3"
            >
              {{ task.status }}
            </v-chip>
            
            <h1 class="text-h4">{{ task.title }}</h1>
          </div>
          
          <div class="mt-2 text-subtitle-1">
            Created by {{ task.createdBy.name }} on {{ task.createdAt }}
          </div>
        </v-col>
        
        <v-col cols="12" sm="4" class="text-sm-end">
          <v-btn
            color="primary"
            variant="outlined"
            prepend-icon="mdi-pencil"
            class="mr-2"
            @click="openEditDialog"
          >
            Edit
          </v-btn>
          
          <v-btn
            color="error"
            variant="outlined"
            prepend-icon="mdi-delete"
            @click="confirmDelete"
          >
            Delete
          </v-btn>
        </v-col>
      </v-row>
      
      <!-- Main Content -->
      <v-row>
        <v-col cols="12" md="8">
          <!-- Task Description -->
          <v-card class="mb-4">
            <v-card-title>Description</v-card-title>
            <v-card-text>
              <p class="text-body-1">{{ task.description }}</p>
              
              <div class="mt-4">
                <v-chip
                  v-for="(tag, index) in task.tags"
                  :key="index"
                  class="mr-2"
                  size="small"
                >
                  {{ tag }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
          
          <!-- Comments -->
          <v-card>
            <v-card-title>Comments ({{ task.comments.length }})</v-card-title>
            
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="comment in task.comments"
                  :key="comment.id"
                  class="mb-3"
                >
                  <template v-slot:prepend>
                    <v-avatar size="40">
                      <v-img :src="comment.user.avatar" :alt="comment.user.name"></v-img>
                    </v-avatar>
                  </template>
                  
                  <v-list-item-title>{{ comment.user.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ comment.timestamp }}</v-list-item-subtitle>
                  
                  <v-list-item-text class="mt-2">
                    {{ comment.text }}
                  </v-list-item-text>
                </v-list-item>
              </v-list>
              
              <!-- Add Comment -->
              <v-textarea
                v-model="commentText"
                label="Add a comment"
                rows="3"
                variant="outlined"
                class="mt-4"
              ></v-textarea>
              
              <v-btn
                color="primary"
                @click="addComment"
                :disabled="!commentText.trim() || taskStore.isLoading"
                :loading="taskStore.isLoading"
              >
                Add Comment
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="4">
          <!-- Task Details -->
          <v-card>
            <v-card-title>Details</v-card-title>
            
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-account"></v-icon>
                </template>
                <v-list-item-title>Assignee</v-list-item-title>
                <template v-slot:append>
                  <div class="d-flex align-center">
                    <v-avatar size="24" class="mr-2">
                      <v-img :src="task.assignee.avatar" :alt="task.assignee.name"></v-img>
                    </v-avatar>
                    {{ task.assignee.name }}
                  </div>
                </template>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-calendar"></v-icon>
                </template>
                <v-list-item-title>Due Date</v-list-item-title>
                <template v-slot:append>
                  {{ task.dueDate }}
                </template>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon :color="getPriorityColor(task.priority)"></v-icon>
                </template>
                <v-list-item-title>Priority</v-list-item-title>
                <template v-slot:append>
                  <v-chip
                    :color="getPriorityColor(task.priority)"
                    size="small"
                  >
                    {{ task.priority }}
                  </v-chip>
                </template>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-clock-outline"></v-icon>
                </template>
                <v-list-item-title>Last Updated</v-list-item-title>
                <template v-slot:append>
                  {{ task.updatedAt || task.createdAt }}
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </div>
    
    <!-- Not Found -->
    <v-alert
      v-else
      type="warning"
      class="mb-4"
    >
      Task not found. The task may have been deleted or you don't have access to it.
      <div class="mt-4">
        <v-btn color="primary" to="/tasks">
          View All Tasks
        </v-btn>
      </div>
    </v-alert>
    
    <!-- Edit Task Dialog -->
    <v-dialog v-model="showEditDialog" max-width="800">
      <v-card>
        <v-card-title class="text-h5">Edit Task</v-card-title>
        
        <v-card-text>
          <v-text-field
            v-model="editForm.title"
            label="Title"
            variant="outlined"
          ></v-text-field>
          
          <v-textarea
            v-model="editForm.description"
            label="Description"
            variant="outlined"
            rows="4"
          ></v-textarea>
          
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="editForm.status"
                label="Status"
                :items="['pending', 'in-progress', 'completed']"
                variant="outlined"
              ></v-select>
            </v-col>
            
            <v-col cols="12" sm="6">
              <v-select
                v-model="editForm.priority"
                label="Priority"
                :items="['low', 'medium', 'high']"
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="editForm.dueDate"
                label="Due Date"
                type="date"
                variant="outlined"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" sm="6">
              <v-select
                v-model="editForm.assigneeId"
                label="Assignee"
                :items="users.map(user => ({ title: user.name, value: user.id }))"
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>
          
          <v-combobox
            v-model="editForm.tags"
            label="Tags"
            multiple
            chips
            variant="outlined"
          ></v-combobox>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showEditDialog = false">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="saveTask"
            :loading="taskStore.isLoading"
            :disabled="taskStore.isLoading"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Delete Task</v-card-title>
        
        <v-card-text>
          Are you sure you want to delete this task? This action cannot be undone.
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showDeleteDialog = false">
            Cancel
          </v-btn>
          <v-btn
            color="error"
            @click="deleteTask"
            :loading="taskStore.isLoading"
            :disabled="taskStore.isLoading"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template> 