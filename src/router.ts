import type { RouteRecordRaw } from 'vue-router'

// Define routes
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('./views/Tasks.vue')
  },
  {
    path: '/task/:id',
    name: 'TaskDetail',
    component: () => import('./views/TaskDetail.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('./views/Profile.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('./views/Register.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('./views/NotFound.vue')
  }
]

export default routes 