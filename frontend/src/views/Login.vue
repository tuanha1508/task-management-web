<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);
const error = ref('');

const rules = {
  email: [
    (v: string) => !!v || 'Email is required',
    (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
  ],
  password: [
    (v: string) => !!v || 'Password is required',
    (v: string) => v.length >= 6 || 'Password must be at least 6 characters'
  ]
};

const login = async () => {
  if (!email.value || !password.value) return;
  
  isLoading.value = true;
  error.value = '';
  
  try {
    // In a real app, this would be an API call to authenticate
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    // For demo purposes, we'll just accept any valid email/password
    console.log('Logging in with:', { email: email.value, password: '********', rememberMe: rememberMe.value });
    
    // Store authentication status
    localStorage.setItem('isAuthenticated', 'true');
    
    // Store user info (in a real app, this would come from the API)
    localStorage.setItem('user', JSON.stringify({
      email: email.value,
      name: email.value.split('@')[0],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.value.split('@')[0])}&background=random`
    }));
    
    // Redirect to dashboard page after successful login
    router.push('/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    error.value = 'Invalid email or password';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          
          <v-card-text>
            <v-alert
              v-if="error"
              type="error"
              class="mb-4"
              density="compact"
            >
              {{ error }}
            </v-alert>
            
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="email"
                label="Email"
                prepend-inner-icon="mdi-email"
                type="email"
                variant="outlined"
                :rules="rules.email"
                required
              ></v-text-field>
              
              <v-text-field
                v-model="password"
                label="Password"
                prepend-inner-icon="mdi-lock"
                type="password"
                variant="outlined"
                :rules="rules.password"
                required
              ></v-text-field>
              
              <v-checkbox
                v-model="rememberMe"
                label="Remember me"
                hide-details
                class="mt-2"
              ></v-checkbox>
            </v-form>
          </v-card-text>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            
            <v-btn
              color="primary"
              :loading="isLoading"
              :disabled="isLoading || !email || !password"
              @click="login"
              size="large"
              class="px-6"
            >
              Login
            </v-btn>
          </v-card-actions>
          
          <v-card-text class="text-center">
            <router-link to="/forgot-password" class="text-decoration-none">
              Forgot password?
            </router-link>
            
            <div class="mt-3">
              Don't have an account?
              <router-link to="/register" class="text-decoration-none font-weight-bold">
                Sign up
              </router-link>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template> 