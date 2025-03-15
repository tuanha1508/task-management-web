import type { RouteRecordRaw } from 'vue-router'

// Define routes
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Introduction',
    component: () => import('./views/Introduction.vue'),
    meta: { 
      requiresAuth: false,
      hideNav: true // This will help us hide navigation for the intro page
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('./views/Home.vue'),
    meta: { 
      requiresAuth: true // Will require auth to access
    }
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('./views/Tasks.vue'),
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/task/:id',
    name: 'TaskDetail',
    component: () => import('./views/TaskDetail.vue'),
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('./views/Profile.vue'),
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/Login.vue'),
    meta: { 
      requiresAuth: false,
      hideNav: true 
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('./views/Register.vue'),
    meta: { 
      requiresAuth: false,
      hideNav: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('./views/NotFound.vue')
  }
]

export default routes 