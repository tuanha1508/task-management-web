<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from './components/layout/AppHeader.vue';
import AppSidebar from './components/layout/AppSidebar.vue';
import AppFooter from './components/layout/AppFooter.vue';

const drawer = ref(true);
const toggleDrawer = () => {
  drawer.value = !drawer.value;
};
</script>

<template>
  <v-app>
    <AppHeader @toggle-drawer="toggleDrawer" />
    
    <AppSidebar v-model="drawer" />
    
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
    
    <AppFooter />
  </v-app>
</template>

<style>
/* Global styles */
:root {
  --primary-color: #1976d2;
  --secondary-color: #424242;
  --accent-color: #82b1ff;
  --error-color: #ff5252;
}
</style>
