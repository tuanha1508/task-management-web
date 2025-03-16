<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const error = ref('');
const isPageVisible = ref(false); // For page transition animation

onMounted(() => {
  // Trigger the enter animation after component is mounted
  setTimeout(() => {
    isPageVisible.value = true;
  }, 50);
});

// Handle navigation to login page with animation
const navigateToLogin = (event: Event) => {
  event.preventDefault();
  isPageVisible.value = false;
  setTimeout(() => {
    router.push('/login');
  }, 500); // Match the animation duration
};

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
    
    // Animate before redirecting
    isPageVisible.value = false;
    setTimeout(() => {
      // Redirect to login page after successful registration
      router.push('/login');
    }, 500);
  } catch (err) {
    console.error('Registration error:', err);
    error.value = 'Registration failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="register-container">
    <!-- Video Background - using an import reference for proper Vite handling -->
    <video autoplay muted loop id="background-video" class="background-video">
      <!-- The src will be handled at runtime when the video is actually added -->
      <source src="/videos/task-management-bg.mp4" type="video/mp4">
    </video>
    
    <!-- Static background that shows if video fails to load -->
    <div class="static-background"></div>
    
    <!-- Dark overlay for better readability -->
    <div class="video-overlay"></div>
    
    <div class="register-glow"></div>
    <div class="register-wrapper">
      <div class="register-card" :class="{ 'page-visible': isPageVisible }">
        <div class="app-title">TaskMaster</div>
        
        <h1>Create Account</h1>
        <p class="description">Join our platform to manage tasks, collaborate with your team, and boost productivity</p>
        
        <div v-if="error" class="error-alert">
          {{ error }}
        </div>
        
        <form @submit.prevent="register" class="register-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input 
              id="name"
              v-model="name" 
              type="text" 
              placeholder="Ex: John Smith"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email"
              v-model="email" 
              type="email" 
              placeholder="Ex: john.smith@example.com"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password"
              v-model="password" 
              type="password" 
              placeholder="At least 6 characters"
              required
            />
          </div>
          
          <div class="form-group" style="margin-bottom: 1rem;">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword"
              v-model="confirmPassword" 
              type="password" 
              placeholder="Repeat password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            class="register-button" 
            :disabled="isLoading || !name || !email || !password || password !== confirmPassword"
            :class="{ 'button-loading': isLoading }"
          >
            <span v-if="!isLoading">Create Account</span>
            <span v-else class="loading-spinner"></span>
          </button>
        </form>
        
        <div class="social-login">
          <a href="#" @click.prevent class="social-icon facebook">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#1877F2" d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </a>
          <a href="#" @click.prevent class="social-icon google">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"/>
              <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987z"/>
              <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21z"/>
              <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067z"/>
            </svg>
          </a>
          <a href="#" @click.prevent class="social-icon apple">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#fff" d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42zm2.52 7.44a4.51 4.51 0 0 1 2.16-3.81 4.66 4.66 0 0 0-3.66-2c-1.56-.16-3 .91-3.83.91-.83 0-2-.89-3.3-.87a4.92 4.92 0 0 0-4.14 2.53C2.93 12.45 4.24 17 6 19.47c.8 1.21 1.8 2.58 3.12 2.53 1.25-.05 1.73-.8 3.25-.8s2 .8 3.29.77c1.36 0 2.22-1.23 3.06-2.44a10.93 10.93 0 0 0 1.38-2.83 4.38 4.38 0 0 1-2.64-3.95z"/>
            </svg>
          </a>
        </div>
        
        <div class="login-link">
          Already have an account? <a href="/login" @click="navigateToLogin">Sign in</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Nunito', sans-serif;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  margin: 0;
  background-color: transparent; /* Remove background color as we'll use video */
}

/* Static background as fallback */
.static-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  z-index: -1; /* Behind video */
}

/* Background video */
.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;  
  z-index: 0;
}

/* Dark overlay to ensure text readability */
.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* Dark semi-transparent overlay */
  z-index: 1;
}

/* Purple glow effect */
.register-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(138, 43, 226, 0.2) 0%, rgba(0, 0, 0, 0) 70%);
  pointer-events: none;
  z-index: 1;
}

/* Fix the register page from overflowing the viewport */
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #000;
}

.register-wrapper {
  width: 100%;
  max-width: 460px; /* Slightly wider to accommodate the larger form */
  z-index: 2;
  position: relative;
}

.register-card {
  background: rgba(24, 24, 27, 0.4);
  backdrop-filter: blur(15px);
  border-radius: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
  overflow: hidden;
  padding: 1.5rem;
  animation: none; /* Remove previous animation */
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  
  /* Initial state for enter/leave animations */
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.register-card.page-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.app-title {
  text-align: center;
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.8rem;
  letter-spacing: -0.2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.3rem 0;
  color: #ffffff;
  text-align: center;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.description {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.8rem;
  text-align: center;
  margin: 0 0 1rem 0;
  line-height: 1.3;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}

.error-alert {
  background: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
  padding: 0.6rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  animation: fadeIn 0.3s ease;
  text-align: center;
}

.register-form {
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 0.7rem;
  opacity: 0;
  transform: translateX(-10px);
  animation: fadeInRight 0.5s forwards;
  animation-delay: calc(0.1s * var(--i, 1));
}

.form-group:nth-child(1) { --i: 1; }
.form-group:nth-child(2) { --i: 2; }
.form-group:nth-child(3) { --i: 3; }
.form-group:nth-child(4) { --i: 4; }

@keyframes fadeInRight {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

label {
  display: block;
  margin-bottom: 0.2rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 0.75rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}

input {
  width: 100%;
  padding: 0.7rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(10, 10, 10, 0.7);
  border-radius: 12px;
  color: white;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-family: 'Nunito', sans-serif;
}

input:focus {
  outline: none;
  border-color: rgba(138, 43, 226, 0.5);
  box-shadow: 0 0 0 2px rgba(138, 43, 226, 0.2);
}

input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.register-button {
  width: 100%;
  padding: 0.7rem;
  background: rgba(138, 43, 226, 0.8);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  font-family: 'Nunito', sans-serif;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
  opacity: 0;
  animation: fadeIn 0.5s forwards;
  animation-delay: 0.6s;
}

.register-button:hover:not(:disabled) {
  background: rgba(138, 43, 226, 1);
}

.register-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-loading {
  pointer-events: none;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 0.8rem;
  opacity: 0;
  animation: fadeIn 0.5s forwards;
  animation-delay: 0.7s;
}

.social-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.social-icon:hover {
  transform: translateY(-3px);
}

.social-icon svg {
  width: 18px;
  height: 18px;
}

.login-link {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  opacity: 0;
  animation: fadeIn 0.5s forwards;
  animation-delay: 0.7s;
}

.login-link a {
  position: relative;
  color: rgba(138, 43, 226, 0.8);
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
  transition: all 0.3s ease;
}

.login-link a:hover {
  color: rgba(138, 43, 226, 1);
}

.login-link a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: rgba(138, 43, 226, 1);
  transition: width 0.3s ease;
}

.login-link a:hover::after {
  width: 100%;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive styles */
@media (max-width: 500px) {
  .register-wrapper {
    max-width: 90%;
  }
  
  .register-card {
    padding: 1.5rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
}
</style> 