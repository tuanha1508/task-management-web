<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// We'll use a dynamic import approach when the actual video is added
// const videoSrc = new URL('../assets/videos/task-management-bg.mp4', import.meta.url).href;

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
  <div class="login-container">
    <!-- Video Background - using an import reference for proper Vite handling -->
    <video autoplay muted loop id="background-video" class="background-video">
      <!-- The src will be handled at runtime when the video is actually added -->
      <source src="/videos/task-management-bg.mp4" type="video/mp4">
    </video>
    
    <!-- Static background that shows if video fails to load -->
    <div class="static-background"></div>
    
    <!-- Dark overlay for better readability -->
    <div class="video-overlay"></div>
    
    <div class="login-glow"></div>
    <div class="login-wrapper">
      <div class="login-card">
        <div class="app-title">TaskMaster</div>
        
        <h1>Log In</h1>
        <p class="description">Access your account to review tasks, manage your submissions, and engage with your team</p>
        
        <div v-if="error" class="error-alert">
          {{ error }}
        </div>
        
        <form @submit.prevent="login" class="login-form">
          <div class="form-group">
            <label for="email">Username</label>
            <input 
              id="email"
              v-model="email" 
              type="email" 
              placeholder="Ex: katie.sims@example.com"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password"
              v-model="password" 
              type="password" 
              placeholder="Enter password"
              required
            />
          </div>
          
          <div class="forgot-password">
            <router-link to="/forgot-password">
              Forgot password
            </router-link>
          </div>
          
          <button 
            type="submit" 
            class="login-button" 
            :disabled="isLoading"
            :class="{ 'button-loading': isLoading }"
          >
            <span v-if="!isLoading">Sign in</span>
            <span v-else class="loading-spinner"></span>
          </button>
        </form>
        
        <div class="social-login">
          <a href="#" @click.prevent class="social-icon facebook">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#1877F2" d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </a>
          <a href="#" @click.prevent class="social-icon apple">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#fff" d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42zm2.52 7.44a4.51 4.51 0 0 1 2.16-3.81 4.66 4.66 0 0 0-3.66-2c-1.56-.16-3 .91-3.83.91-.83 0-2-.89-3.3-.87a4.92 4.92 0 0 0-4.14 2.53C2.93 12.45 4.24 17 6 19.47c.8 1.21 1.8 2.58 3.12 2.53 1.25-.05 1.73-.8 3.25-.8s2 .8 3.29.77c1.36 0 2.22-1.23 3.06-2.44a10.93 10.93 0 0 0 1.38-2.83 4.38 4.38 0 0 1-2.64-3.95z"/>
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
        </div>
        
        <div class="signup-link">
          Already have an account? <router-link to="/register">Sign up</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
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
.login-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(138, 43, 226, 0.2) 0%, rgba(0, 0, 0, 0) 70%);
  pointer-events: none;
  z-index: 1;
}

/* Fix the login page from overflowing the viewport */
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #000;
}

.login-wrapper {
  width: 100%;
  max-width: 420px;
  z-index: 2;
  position: relative;
}

.login-card {
  background: rgba(24, 24, 27, 0.4); /* Increased transparency from 0.7 to 0.4 */
  backdrop-filter: blur(15px); /* Increased blur effect for better readability */
  border-radius: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
  overflow: hidden;
  padding: 1.5rem;
  animation: cardAppear 0.5s ease forwards;
  border: 1px solid rgba(255, 255, 255, 0.15); /* Slightly more visible border */
}

.app-title {
  text-align: center;
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 1.2rem;
  letter-spacing: -0.2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); /* Added text shadow for better readability */
}

@keyframes cardAppear {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

h1 {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #ffffff;
  text-align: center;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); /* Added text shadow for better readability */
}

.description {
  color: rgba(255, 255, 255, 0.85); /* Increased opacity for better visibility */
  font-size: 0.85rem;
  text-align: center;
  margin: 0 0 1.5rem 0;
  line-height: 1.4;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4); /* Added text shadow for better readability */
}

.error-alert {
  background: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
  padding: 0.8rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.85rem;
  animation: fadeIn 0.3s ease;
  text-align: center;
}

.login-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.3rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 0.8rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4); /* Added text shadow for better readability */
}

input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(10, 10, 10, 0.7); /* Kept input slightly more opaque for readability */
  border-radius: 12px;
  color: white;
  font-size: 0.9rem;
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

.forgot-password {
  text-align: right;
  margin: 0.2rem 0 1.2rem;
}

.forgot-password a {
  color: rgba(138, 43, 226, 0.8);
  text-decoration: none;
  font-size: 0.8rem;
  transition: color 0.3s ease;
}

.forgot-password a:hover {
  color: rgba(138, 43, 226, 1);
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 0.8rem;
  background: rgba(138, 43, 226, 0.8);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  font-family: 'Nunito', sans-serif;
  letter-spacing: 0.5px;
  margin-bottom: 1.2rem;
}

.login-button:hover:not(:disabled) {
  background: rgba(138, 43, 226, 1);
}

.login-button:disabled {
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
  margin-bottom: 1.2rem;
}

.social-icon {
  width: 36px;
  height: 36px;
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
  width: 20px;
  height: 20px;
}

.signup-link {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
}

.signup-link a {
  color: rgba(138, 43, 226, 0.8);
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
  transition: color 0.3s ease;
}

.signup-link a:hover {
  color: rgba(138, 43, 226, 1);
  text-decoration: underline;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive styles */
@media (max-width: 500px) {
  .login-wrapper {
    max-width: 90%;
  }
  
  .login-card {
    padding: 1.5rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
}
</style> 