<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const forceLogout = () => {
  // Clear authentication data
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('user');
  
  // Redirect to the introduction page
  router.push('/');
};
</script>

<template>
  <v-footer app color="primary" class="text-center d-flex justify-space-between pa-4" dark>
    <div>
      &copy; {{ new Date().getFullYear() }} Task Management System
    </div>
    
    <div>
      <a href="#" @click.prevent="forceLogout" class="text-white text-decoration-none">
        Debug: Force Logout
      </a>
    </div>
  </v-footer>
</template> 