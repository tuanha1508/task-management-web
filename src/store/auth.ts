import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  
  actions: {
    async login(username: string, password: string) {
      try {
        const response = await axios.post(`${API_URL}/auth/login`, {
          username,
          password
        })
        
        const { access_token, user } = response.data
        
        this.token = access_token
        this.user = user
        
        localStorage.setItem('token', access_token)
        
        return { success: true }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Login failed' 
        }
      }
    },
    
    async register(userData) {
      try {
        await axios.post(`${API_URL}/auth/register`, userData)
        return { success: true }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Registration failed' 
        }
      }
    },
    
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    }
  }
})