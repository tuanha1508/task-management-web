<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from './components/layout/AppHeader.vue';
import AppSidebar from './components/layout/AppSidebar.vue';
import AppFooter from './components/layout/AppFooter.vue';

const route = useRoute();
const router = useRouter();
const drawer = ref(true);

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

// Determine if navigation components should be hidden
const hideNavigation = computed(() => {
  return route.meta.hideNav === true;
});
</script>

<template>
  <v-app class="app-container">
    <!-- Only show navigation components if not on introduction, login, or register pages -->
    <template v-if="!hideNavigation">
      <AppHeader @toggle-drawer="toggleDrawer" />
      <AppSidebar v-model="drawer" />
    </template>
    
    <v-main :class="{ 'pa-0 full-width-height': hideNavigation }">
      <v-container fluid :class="{ 'pa-0 full-width-height': hideNavigation }">
        <router-view />
      </v-container>
    </v-main>
    
    <template v-if="!hideNavigation">
      <AppFooter />
    </template>
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

/* Full width and height for v-app and containers */
.app-container {
  width: 100%;
  height: 100%;
  max-width: 100% !important;
  max-height: 100% !important;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.full-width-height {
  width: 100%;
  height: 100%;
  max-width: 100% !important;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* Apply full height to container when needed */
.fill-height {
  height: 100%;
}
</style>
