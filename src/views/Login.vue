<template>
    <v-container class="fill-height">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="elevation-12">
            <v-card-title class="text-center py-4">
              <h1 class="text-h5">Login</h1>
            </v-card-title>
            
            <v-card-text>
              <v-form @submit.prevent="login" ref="form">
                <v-text-field
                  v-model="username"
                  label="Username"
                  prepend-icon="mdi-account"
                  :rules="[v => !!v || 'Username is required']"
                  required
                ></v-text-field>
                
                <v-text-field
                  v-model="password"
                  label="Password"
                  prepend-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                  :rules="[v => !!v || 'Password is required']"
                  required
                ></v-text-field>
                
                <v-alert
                  v-if="error"
                  type="error"
                  variant="tonal"
                  class="mb-4"
                >
                  {{ error }}
                </v-alert>
              </v-form>
            </v-card-text>
            
            <v-card-actions class="px-4 pb-4">
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                variant="elevated"
                size="large"
                block
                @click="login"
                :loading="loading"
              >
                Login
              </v-btn>
            </v-card-actions>
            
            <v-card-text class="text-center pt-0">
              Don't have an account?
              <router-link to="/register">Register</router-link>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../store/auth'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const username = ref('')
  const password = ref('')
  const showPassword = ref(false)
  const loading = ref(false)
  const error = ref('')
  const form = ref(null)
  
  const login = async () => {
    // Form validation
    const isValid = await form.value?.validate()
    if (!isValid?.valid) return
    
    loading.value = true
    error.value = ''
    
    try {
      const result = await authStore.login(username.value, password.value)
      
      if (result.success) {
        router.push('/')
      } else {
        error.value = result.message
      }
    } catch (err) {
      error.value = 'Failed to login. Please try again.'
    } finally {
      loading.value = false
    }
  }
  </script>