import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProfileView from '../views/ProfileView.vue'
import SettingsView from '../views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',
     name: 'home', 
     component: HomeView },
    { path: '/login/:id?', 
    name: 'login',
    component: LoginView },
    { path: '/register/:id?',
     name: 'register',
     component: RegisterView },
    // Dashboard Routes
    { 
      path: '/dashboard', 
      name: 'dashboard', 
      component: DashboardView 
    },
    { 
      path: '/profile', 
      name: 'profile', 
      component: ProfileView 
    },
    { 
      path: '/settings', 
      name: 'settings', 
      component: SettingsView 
    }
  ]
})

export default router