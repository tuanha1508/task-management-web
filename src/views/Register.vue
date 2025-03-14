<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const error = ref('');

const rules = {
  name: [
    (v: string) => !!v || 'Name is required',
    (v: string) => v.length >= 2 || 'Name must be at least 2 characters'
  ],
  email: [
    (v: string) => !!v || 'Email is required',
    (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
  ],
  password: [
    (v: string) => !!v || 'Password is required',
    (v: string) => v.length >= 6 || 'Password must be at least 6 characters'
  ],
  confirmPassword: [
    (v: string) => !!v || 'Please confirm your password',
    (v: string) => v === password.value || 'Passwords do not match'
  ]
};

const register = async () => {
  if (!name.value || !email.value || !password.value || password.value !== confirmPassword.value) return;
  
  isLoading.value = true;
  error.value = '';
  
  try {
    // In a real app, this would be an API call to register
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    // For demo purposes, we'll just log the registration
    console.log('Registering with:', { name: name.value, email: email.value, password: '********' });
    
    // Redirect to login page after successful registration
    router.push('/login');
  } catch (err) {
    console.error('Registration error:', err);
    error.value = 'Registration failed. Please try again.';
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
            <v-toolbar-title>Create an Account</v-toolbar-title>
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
            
            <v-form @submit.prevent="register">
              <v-text-field
                v-model="name"
                label="Full Name"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                :rules="rules.name"
                required
              ></v-text-field>
              
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
              
              <v-text-field
                v-model="confirmPassword"
                label="Confirm Password"
                prepend-inner-icon="mdi-lock-check"
                type="password"
                variant="outlined"
                :rules="rules.confirmPassword"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            
            <v-btn
              color="primary"
              :loading="isLoading"
              :disabled="isLoading || !name || !email || !password || password !== confirmPassword"
              @click="register"
              size="large"
              class="px-6"
            >
              Register
            </v-btn>
          </v-card-actions>
          
          <v-card-text class="text-center">
            Already have an account?
            <router-link to="/login" class="text-decoration-none font-weight-bold">
              Sign in
            </router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template> 