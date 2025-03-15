<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTaskStore } from '../../stores/taskStore';
import type { TaskFormData } from '../../types/task';

const props = defineProps<{
  showDialog: boolean;
}>();

const emit = defineEmits(['update:showDialog']);

const router = useRouter();
const taskStore = useTaskStore();

// Form fields
const formData = ref<TaskFormData>({
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: new Date().toISOString().split('T')[0], // Today's date as default
  assigneeId: 1, // Default assignee (current user in a real app)
  tags: []
});

// Validation
const rules = {
  title: [(v: string) => !!v || 'Title is required'],
  description: [(v: string) => !!v || 'Description is required'],
  dueDate: [(v: string) => !!v || 'Due date is required']
};

// Mock users for assignee selection (in a real app, this would come from a user store or API)
const users = ref([
  { id: 1, name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 2, name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: 3, name: 'Robert Johnson', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: 4, name: 'Emily Brown', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
]);

// Tag input
const newTag = ref('');
const addTag = () => {
  if (newTag.value.trim() && !formData.value.tags.includes(newTag.value.trim())) {
    formData.value.tags.push(newTag.value.trim());
    newTag.value = '';
  }
};

const removeTag = (index: number) => {
  formData.value.tags.splice(index, 1);
};

// Loading state for form submission
const isSubmitting = ref(false);
const formError = ref<string | null>(null);

// Form submission
const createTask = async () => {
  isSubmitting.value = true;
  formError.value = null;
  
  try {
    const newTask = await taskStore.createTask(formData.value);
    
    if (newTask) {
      // Close dialog and reset form
      closeDialog();
      
      // Navigate to the new task
      router.push(`/task/${newTask.id}`);
    } else {
      formError.value = 'Failed to create task. Please try again.';
    }
  } catch (error) {
    console.error('Error creating task:', error);
    formError.value = 'An unexpected error occurred. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};

// Reset form when closing dialog
const closeDialog = () => {
  // Reset form
  formData.value = {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    assigneeId: 1,
    tags: []
  };
  
  // Clear error message
  formError.value = null;
  
  // Close dialog
  emit('update:showDialog', false);
};

// Watch for dialog state changes
const dialog = computed({
  get: () => props.showDialog,
  set: (value) => emit('update:showDialog', value)
});
</script>

<template>
  <v-dialog
    v-model="dialog"
    max-width="800"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5">
        Create New Task
      </v-card-title>
      
      <v-card-text>
        <v-alert
          v-if="formError"
          type="error"
          density="compact"
          class="mb-4"
        >
          {{ formError }}
        </v-alert>
        
        <v-form @submit.prevent="createTask">
          <v-text-field
            v-model="formData.title"
            label="Title"
            variant="outlined"
            :rules="rules.title"
            required
          ></v-text-field>
          
          <v-textarea
            v-model="formData.description"
            label="Description"
            variant="outlined"
            rows="4"
            :rules="rules.description"
            required
          ></v-textarea>
          
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="formData.status"
                label="Status"
                :items="[
                  { title: 'Pending', value: 'pending' },
                  { title: 'In Progress', value: 'in-progress' },
                  { title: 'Completed', value: 'completed' }
                ]"
                variant="outlined"
              ></v-select>
            </v-col>
            
            <v-col cols="12" sm="6">
              <v-select
                v-model="formData.priority"
                label="Priority"
                :items="[
                  { title: 'Low', value: 'low' },
                  { title: 'Medium', value: 'medium' },
                  { title: 'High', value: 'high' }
                ]"
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.dueDate"
                label="Due Date"
                type="date"
                variant="outlined"
                :rules="rules.dueDate"
                required
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" sm="6">
              <v-select
                v-model="formData.assigneeId"
                label="Assignee"
                :items="users.map(user => ({ title: user.name, value: user.id }))"
                variant="outlined"
                item-title="title"
                item-value="value"
              ></v-select>
            </v-col>
          </v-row>
          
          <!-- Tags Input -->
          <div class="mb-4">
            <label class="text-subtitle-1 mb-2 d-block">Tags</label>
            
            <div class="d-flex align-center mb-2">
              <v-text-field
                v-model="newTag"
                label="Add a tag"
                variant="outlined"
                density="comfortable"
                hide-details
                class="mr-2"
                @keyup.enter="addTag"
              ></v-text-field>
              
              <v-btn
                color="primary"
                @click="addTag"
                :disabled="!newTag.trim()"
              >
                Add
              </v-btn>
            </div>
            
            <div class="mt-2">
              <v-chip
                v-for="(tag, index) in formData.tags"
                :key="index"
                class="mr-2 mb-2"
                closable
                @click:close="removeTag(index)"
              >
                {{ tag }}
              </v-chip>
              
              <span v-if="formData.tags.length === 0" class="text-disabled">
                No tags added yet
              </span>
            </div>
          </div>
        </v-form>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        
        <v-btn
          variant="text"
          @click="closeDialog"
          :disabled="isSubmitting"
        >
          Cancel
        </v-btn>
        
        <v-btn
          color="primary"
          @click="createTask"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          Create Task
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template> 