import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// @ts-ignore
import 'vuetify/styles'
// Commenting out Material Design Icons font to avoid 403 errors
// We're using custom elements instead of icons in the introduction page
// import '@mdi/font/css/materialdesignicons.css'
import './style.css'
import App from './App.vue'
import routes from './router'

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light'
  },
  // Disable defaultSet to avoid loading Material Design Icons
  icons: {
    defaultSet: 'none',
  }
})

// Create Router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Auth guard for protected routes
router.beforeEach((to, _from, next) => {
  // For now, we'll use localStorage to check if the user is logged in
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  console.log('Route navigation:', { to: to.path, isAuthenticated });
  
  // Check if the route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    // If not authenticated, redirect to login
    console.log('Redirecting to login: route requires auth but user is not authenticated');
    next({ name: 'Login' });
  } else if (to.path === '/login' && isAuthenticated) {
    // If already authenticated and trying to access login page, redirect to dashboard
    console.log('Redirecting to dashboard: user is authenticated and trying to access login page');
    next({ name: 'Dashboard' });
  } else if (to.path === '/' && isAuthenticated) {
    // If already authenticated and trying to access introduction page, redirect to dashboard
    console.log('Redirecting to dashboard: user is authenticated and trying to access introduction page');
    next({ name: 'Dashboard' });
  } else {
    // Otherwise, allow navigation
    console.log('Allowing navigation');
    next();
  }
});

// Create Pinia instance
const pinia = createPinia()

// Create and mount the app
const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(vuetify)
app.mount('#app')
