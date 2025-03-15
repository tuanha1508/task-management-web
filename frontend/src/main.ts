import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// @ts-ignore
import 'vuetify/styles'
// Import our custom MDI icons CSS (with local font files) instead of from node_modules
import './styles/mdi-icons.css'
import './style.css'
import App from './App.vue'
import routes from './router'

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light'
  }
  // No custom icons configuration needed when using the default MDI font
})

// Create Router instance
const router = createRouter({
  history: createWebHistory('/'),
  routes
})

// Create Pinia instance
const pinia = createPinia()

// Create and mount the app - IMPORTANT: Router must be installed before Vuetify
const app = createApp(App)
app.use(router) // Install router first
app.use(pinia)
app.use(vuetify)

// Mount the app and signal when it's ready
app.mount('#app')

// Helper function to signal the app is ready (but will be handled by the loading screen)
const signalAppReady = () => {
  // The loading screen in index.html will handle the timing
  console.log('Vue app initialized and router ready');
  window.dispatchEvent(new CustomEvent('app-initialized'));
}

// Ensure we're on the Introduction page, then signal ready
router.isReady().then(() => {
  console.log('Router is ready, navigating to Introduction page');
  // Always navigate to the Introduction page first
  router.replace('/').then(() => {
    console.log('Navigation complete');
    signalAppReady();
  }).catch(err => {
    console.error('Navigation error:', err);
    signalAppReady(); // Signal ready anyway
  });
});

// Auth guard for protected routes
router.beforeEach((to, from, next) => {
  // For now, we'll use localStorage to check if the user is logged in
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  console.log('Route navigation:', { 
    to: to.path, 
    from: from.path,
    toName: to.name,
    fromName: from.name,
    isAuthenticated,
    time: new Date().toISOString()
  });
  
  // Check if the route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    // If not authenticated, redirect to login
    console.log('Redirecting to login: route requires auth but user is not authenticated');
    next({ name: 'Login' });
  } else if (to.path === '/login' && isAuthenticated) {
    // If already authenticated and trying to access login page, redirect to dashboard
    console.log('Redirecting to dashboard: user is authenticated and trying to access login page');
    next({ name: 'Dashboard' });
  } else {
    // For all other routes, including root path (/), allow navigation
    // Removed the redirection from introduction to dashboard
    console.log('Allowing navigation to:', to.path);
    next();
  }
});
