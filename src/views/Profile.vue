<script setup lang="ts">
import { ref } from 'vue';

// Mock user data - will be replaced with real user data from API
const user = ref({
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  role: 'Developer',
  department: 'Engineering',
  joinedDate: '2023-01-15',
  bio: 'Full-stack developer with expertise in Vue.js and Node.js. Passionate about building user-friendly applications and solving complex problems.'
});

// Form fields for editing profile
const editForm = ref({
  name: user.value.name,
  email: user.value.email,
  role: user.value.role,
  department: user.value.department,
  bio: user.value.bio
});

const isEditing = ref(false);
const isLoading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// Toggle edit mode
const toggleEdit = () => {
  if (isEditing.value) {
    // Cancel editing - reset form
    editForm.value = {
      name: user.value.name,
      email: user.value.email,
      role: user.value.role,
      department: user.value.department,
      bio: user.value.bio
    };
  }
  
  isEditing.value = !isEditing.value;
  successMessage.value = '';
  errorMessage.value = '';
};

// Save profile changes
const saveProfile = async () => {
  isLoading.value = true;
  successMessage.value = '';
  errorMessage.value = '';
  
  try {
    // In a real app, this would be an API call to update the profile
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    // Update local user data
    user.value = {
      ...user.value,
      name: editForm.value.name,
      email: editForm.value.email,
      role: editForm.value.role,
      department: editForm.value.department,
      bio: editForm.value.bio
    };
    
    successMessage.value = 'Profile updated successfully';
    isEditing.value = false;
  } catch (err) {
    console.error('Error updating profile:', err);
    errorMessage.value = 'Failed to update profile. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

// Task statistics - will be replaced with real data from API
const taskStats = ref({
  total: 24,
  completed: 14,
  inProgress: 7,
  pending: 3
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <!-- Profile Card -->
        <v-card class="mb-4">
          <v-card-text class="text-center">
            <v-avatar size="150" class="mb-4">
              <v-img :src="user.avatar" :alt="user.name"></v-img>
            </v-avatar>
            
            <h2 class="text-h5 font-weight-bold">{{ user.name }}</h2>
            <p class="text-subtitle-1 text-medium-emphasis">{{ user.role }}</p>
            <p class="text-subtitle-2 text-medium-emphasis">{{ user.department }}</p>
            
            <v-divider class="my-4"></v-divider>
            
            <div class="d-flex align-center mb-2">
              <v-icon icon="mdi-email" class="mr-2" size="small"></v-icon>
              <span>{{ user.email }}</span>
            </div>
            
            <div class="d-flex align-center">
              <v-icon icon="mdi-calendar" class="mr-2" size="small"></v-icon>
              <span>Joined {{ user.joinedDate }}</span>
            </div>
          </v-card-text>
        </v-card>
        
        <!-- Task Statistics -->
        <v-card>
          <v-card-title>Task Statistics</v-card-title>
          
          <v-card-text>
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-format-list-checks" color="primary"></v-icon>
                </template>
                <v-list-item-title>Total Tasks</v-list-item-title>
                <template v-slot:append>
                  <v-chip>{{ taskStats.total }}</v-chip>
                </template>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-check-circle" color="success"></v-icon>
                </template>
                <v-list-item-title>Completed</v-list-item-title>
                <template v-slot:append>
                  <v-chip color="success">{{ taskStats.completed }}</v-chip>
                </template>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-progress-clock" color="warning"></v-icon>
                </template>
                <v-list-item-title>In Progress</v-list-item-title>
                <template v-slot:append>
                  <v-chip color="warning">{{ taskStats.inProgress }}</v-chip>
                </template>
              </v-list-item>
              
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-clock" color="error"></v-icon>
                </template>
                <v-list-item-title>Pending</v-list-item-title>
                <template v-slot:append>
                  <v-chip color="error">{{ taskStats.pending }}</v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="8">
        <!-- Profile Information -->
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Profile Information</span>
            
            <v-btn
              :color="isEditing ? 'error' : 'primary'"
              :icon="isEditing ? 'mdi-close' : 'mdi-pencil'"
              size="small"
              @click="toggleEdit"
              :disabled="isLoading"
            ></v-btn>
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-card-text>
            <v-alert
              v-if="successMessage"
              type="success"
              class="mb-4"
              density="compact"
            >
              {{ successMessage }}
            </v-alert>
            
            <v-alert
              v-if="errorMessage"
              type="error"
              class="mb-4"
              density="compact"
            >
              {{ errorMessage }}
            </v-alert>
            
            <v-form v-if="isEditing">
              <v-text-field
                v-model="editForm.name"
                label="Full Name"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              
              <v-text-field
                v-model="editForm.email"
                label="Email"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              
              <v-text-field
                v-model="editForm.role"
                label="Role"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              
              <v-text-field
                v-model="editForm.department"
                label="Department"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              
              <v-textarea
                v-model="editForm.bio"
                label="Bio"
                variant="outlined"
                rows="4"
                class="mb-4"
              ></v-textarea>
              
              <div class="d-flex justify-end">
                <v-btn
                  variant="text"
                  class="mr-2"
                  @click="toggleEdit"
                  :disabled="isLoading"
                >
                  Cancel
                </v-btn>
                
                <v-btn
                  color="primary"
                  @click="saveProfile"
                  :loading="isLoading"
                  :disabled="isLoading"
                >
                  Save Changes
                </v-btn>
              </div>
            </v-form>
            
            <div v-else>
              <h3 class="text-h6 mb-2">Bio</h3>
              <p class="text-body-1 mb-6">{{ user.bio }}</p>
              
              <v-row>
                <v-col cols="12" sm="6">
                  <h3 class="text-h6 mb-2">Full Name</h3>
                  <p class="text-body-1 mb-4">{{ user.name }}</p>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <h3 class="text-h6 mb-2">Email</h3>
                  <p class="text-body-1 mb-4">{{ user.email }}</p>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <h3 class="text-h6 mb-2">Role</h3>
                  <p class="text-body-1 mb-4">{{ user.role }}</p>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <h3 class="text-h6 mb-2">Department</h3>
                  <p class="text-body-1 mb-4">{{ user.department }}</p>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template> 