<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

defineEmits(['toggle-drawer']);

const router = useRouter();
const searchQuery = ref('');
const isAuthenticated = ref(false);
const user = ref<any>(null);

// Check authentication status on component mount
onMounted(() => {
  checkAuthStatus();
});

const checkAuthStatus = () => {
  isAuthenticated.value = localStorage.getItem('isAuthenticated') === 'true';
  
  if (isAuthenticated.value) {
    try {
      const userJson = localStorage.getItem('user');
      user.value = userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      user.value = null;
    }
  }
};

const navigateToHome = () => {
  if (isAuthenticated.value) {
    router.push('/dashboard');
  } else {
    router.push('/');
  }
};

const navigateToLogin = () => {
  router.push('/login');
};

const navigateToRegister = () => {
  router.push('/register');
};

const navigateToProfile = () => {
  router.push('/profile');
};

const navigateToDashboard = () => {
  router.push('/dashboard');
};

const logout = () => {
  // Clear authentication data
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('user');
  
  // Redirect to introduction page
  router.push('/');
};
</script>

<template>
  <v-app-bar color="primary" app>
    <v-app-bar-nav-icon @click="$emit('toggle-drawer')"></v-app-bar-nav-icon>
    
    <v-toolbar-title class="text-h6 font-weight-bold">
      <v-btn
        text
        @click="navigateToHome"
        class="text-decoration-none text-white pa-0"
        style="text-transform: none; letter-spacing: normal;"
      >
        Task Management
      </v-btn>
    </v-toolbar-title>
    
    <v-spacer></v-spacer>
    
    <v-text-field
      v-if="isAuthenticated"
      v-model="searchQuery"
      density="compact"
      variant="solo"
      label="Search tasks"
      prepend-inner-icon="mdi-magnify"
      hide-details
      class="mx-4"
      style="max-width: 300px;"
    ></v-text-field>
    
    <v-spacer></v-spacer>
    
    <!-- User is not authenticated -->
    <template v-if="!isAuthenticated">
      <v-btn variant="text" @click="navigateToLogin">
        Login
      </v-btn>
      
      <v-btn color="secondary" @click="navigateToRegister">
        Register
      </v-btn>
    </template>
    
    <!-- User is authenticated -->
    <template v-else>
      <v-btn icon class="mr-2">
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar size="36">
              <v-img :src="user?.avatar || 'https://ui-avatars.com/api/?name=User'" :alt="user?.name || 'User'"></v-img>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="navigateToDashboard">
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item>
          <v-list-item @click="navigateToProfile">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template> 