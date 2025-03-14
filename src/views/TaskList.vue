<template>
    <div>
      <div class="d-flex justify-space-between align-center mb-4">
        <h1 class="text-h4">Tasks</h1>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="showCreateTaskDialog = true"
        >
          New Task
        </v-btn>
      </div>
      
      <v-tabs v-model="activeTab" class="mb-4">
        <v-tab value="open">Open</v-tab>
        <v-tab value="in-progress">In Progress</v-tab>
        <v-tab value="completed">Completed</v-tab>
      </v-tabs>
      
      <v-window v-model="activeTab">
        <v-window-item value="open">
          <task-list-group 
            :tasks="openTasks" 
            :loading="loading" 
            @update-status="updateTaskStatus"
          />
        </v-window-item>
        
        <v-window-item value="in-progress">
          <task-list-group 
            :tasks="inProgressTasks" 
            :loading="loading" 
            @update-status="updateTaskStatus"
          />
        </v-window-item>
        
        <v-window-item value="completed">
          <task-list-group 
            :tasks="completedTasks" 
            :loading="loading" 
            @update-status="updateTaskStatus"
          />
        </v-window-item>
      </v-window>
      
      <!-- Create Task Dialog -->
      <v-dialog v-model="showCreateTaskDialog" max-width="600px">
        <v-card>
          <v-card-title>Create New Task</v-card-title>
          <v-card-text>
            <v-form ref="createTaskForm">
              <v-text-field
                v-model="newTask.title"
                label="Title"
                :rules="[v => !!v || 'Title is required']"
                required
              ></v-text-field>
              
              <v-textarea
                v-model="newTask.description"
                label="Description"
              ></v-textarea>
              
              <v-select
                v-model="newTask.priority"
                label="Priority"
                :items="[
                  { title: 'Low', value: 'low' },
                  { title: 'Medium', value: 'medium' },
                  { title: 'High', value: 'high' }
                ]"
              ></v-select>
              
              <v-text-field
                v-model="newTask.dueDate"
                label="Due Date"
                type="date"
              ></v-text-field>
            </v-form>
          </v-card-text>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" @click="showCreateTaskDialog = false">Cancel</v-btn>
            <v-btn 
              color="primary" 
              :loading="creating"
              @click="createTask"
            >
              Create
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, inject } from 'vue'
  import { useTasksStore } from '../store/tasks'
  import TaskListGroup from '../components/TaskListGroup.vue'
  
  const tasksStore = useTasksStore()
  const socket = inject('socket') as any
  
  const activeTab = ref('open')
  const showCreateTaskDialog = ref(false)
  const creating = ref(false)
  const createTaskForm = ref(null)
  
  const newTask = ref({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: null
  })
  
  // Computed properties for filtered tasks
  const openTasks = computed(() => tasksStore.openTasks)
  const inProgressTasks = computed(() => tasksStore.inProgressTasks)
  const completedTasks = computed(() => tasksStore.completedTasks)
  const loading = computed(() => tasksStore.loading)
  
  onMounted(async () => {
    await tasksStore.fetchTasks()
    
    // Socket event listeners
    socket.on('task:created', (task) => {
      tasksStore.addTask(task)
    })
    
    socket.on('task:updated', (task) => {
      tasksStore.updateTaskFromSocket(task)
    })
    
    socket.on('task:status-changed', (task) => {
      tasksStore.updateTaskFromSocket(task)
    })
  })
  
  // Create a new task
  const createTask = async () => {
    const isValid = await createTaskForm.value?.validate()
    if (!isValid?.valid) return
    
    creating.value = true
    
    try {
      // Using socket for real-time updates
      await socket.emit('task:create', newTask.value)
      
      // Reset form
      newTask.value = {
        title: '',
        description: '',
        priority: 'medium',
        dueDate: null
      }
      
      showCreateTaskDialog.value = false
    } catch (error) {
      console.error('Error creating task:', error)
    } finally {
      creating.value = false
    }
  }
  
  // Update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      // Using socket for real-time updates
      await socket.emit('task:change-status', {
        id: taskId,
        data: { status: newStatus }
      })
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }
  </script>