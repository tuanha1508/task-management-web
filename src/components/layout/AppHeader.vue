<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

defineEmits(['toggle-drawer']);

const router = useRouter();
const searchQuery = ref('');

const navigateToLogin = () => {
  router.push('/login');
};

const navigateToRegister = () => {
  router.push('/register');
};

const navigateToProfile = () => {
  router.push('/profile');
};
</script>

<template>
  <v-app-bar color="primary" app>
    <v-app-bar-nav-icon @click="$emit('toggle-drawer')"></v-app-bar-nav-icon>
    
    <v-toolbar-title class="text-h6 font-weight-bold">
      <router-link to="/" class="text-decoration-none text-white">
        Task Management
      </router-link>
    </v-toolbar-title>
    
    <v-spacer></v-spacer>
    
    <v-text-field
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
    <v-btn variant="text" @click="navigateToLogin">
      Login
    </v-btn>
    
    <v-btn color="secondary" @click="navigateToRegister">
      Register
    </v-btn>
    
    <!-- User is authenticated (we'll add v-if logic later) -->
    <!-- 
    <v-btn icon>
      <v-icon>mdi-bell</v-icon>
    </v-btn>
    
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-avatar size="36">
            <v-img src="https://randomuser.me/api/portraits/men/85.jpg" alt="User Avatar"></v-img>
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="navigateToProfile">
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    -->
  </v-app-bar>
</template> 