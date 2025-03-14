<template>
  <v-form @submit.prevent="submitForm" ref="form">
    <v-card>
      <v-card-title>
        {{ isEdit ? 'Edit Task' : 'Create New Task' }}
      </v-card-title>
      
      <v-card-text>
        <v-text-field
          v-model="taskData.title"
          label="Task Title"
          :rules="[v => !!v || 'Title is required']"
          required
        ></v-text-field>
        
        <v-textarea
          v-model="taskData.description"
          label="Description"
          rows="3"
        ></v-textarea>
        
        <v-select
          v-model="taskData.priority"
          label="Priority"
          :items="priorityOptions"
          item-title="text"
          item-value="value"
        ></v-select>
        
        <v-select
          v-model="taskData.status"
          label="Status"
          :items="statusOptions"
          item-title="text"
          item-value="value"
        ></v-select>
        
        <v-menu
          v-model="dateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          min-width="auto"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="formattedDueDate"
              label="Due Date"
              readonly
              v-bind="props"
              clearable
              @click:clear="taskData.dueDate = null"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="taskData.dueDate"
            @update:model-value="dateMenu = false"
          ></v-date-picker>
        </v-menu>
        
        <v-autocomplete
          v-model="taskData.assigneeId"
          label="Assign To"
          :items="users"
          item-title="username"
          item-value="id"
          clearable
        ></v-autocomplete>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          variant="text"
          @click="$emit('cancel')"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          type="submit"
          :loading="loading"
        >
          {{ isEdit ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { format } from 'date-fns';
import { useTasksStore } from '../store/tasks';
import api from '../services/api';

const props = defineProps({
  task: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['cancel', 'saved']);
const tasksStore = useTasksStore();
const form = ref(null);
const loading = ref(false);
const dateMenu = ref(false);
const users = ref([]);

const isEdit = computed(() => !!props.task);

const priorityOptions = [
  { text: 'Low', value: 'low' },
  { text: 'Medium', value: 'medium' },
  { text: 'High', value: 'high' }
];

const statusOptions = [
  { text: 'Open', value: 'open' },
  { text: 'In Progress', value: 'in_progress' },
  { text: 'Completed', value: 'completed' }
];

const taskData = ref({
  title: '',
  description: '',
  priority: 'medium',
  status: 'open',
  dueDate: null,
  assigneeId: null
});

const formattedDueDate = computed(() => {
  if (!taskData.value.dueDate) return '';
  return format(new Date(taskData.value.dueDate), 'MMM d, yyyy');
});

watch(() => props.task, (newTask) => {
  if (newTask) {
    taskData.value = {
      title: newTask.title || '',
      description: newTask.description || '',
      priority: newTask.priority || 'medium',
      status: newTask.status || 'open',
      dueDate: newTask.dueDate || null,
      assigneeId: newTask.assigneeId || null
    };
  }
}, { immediate: true });

onMounted(async () => {
  try {
    const response = await api.get('/users');
    users.value = response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
});

const submitForm = async () => {
  const { valid } = await form.value.validate();
  
  if (!valid) return;
  
  loading.value = true;
  
  try {
    let result;
    
    if (isEdit.value) {
      result = await tasksStore.updateTask(props.task.id, taskData.value);
    } else {
      result = await tasksStore.createTask(taskData.value);
    }
    
    if (result.success) {
      emit('saved', result.task);
    }
  } catch (error) {
    console.error('Error saving task:', error);
  } finally {
    loading.value = false;
  }
};
</script> 