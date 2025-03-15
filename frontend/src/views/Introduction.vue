<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter();

// When the Introduction page loads, check if we're on the root path and force logout
// This ensures that the Introduction page is always visible to non-authenticated users
onMounted(() => {
  // If we're at the root path (introduction page), clear any existing auth
  if (window.location.pathname === '/') {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  }
});

const navigateToLogin = () => {
  router.push('/login');
};

const navigateToRegister = () => {
  router.push('/register');
};

const navigateToAbout = () => {
  // Scroll to features section
  const featuresSection = document.getElementById('features-section');
  if (featuresSection) {
    featuresSection.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<template>
  <div class="introduction-container">
    <!-- Navigation header -->
    <header class="nav-header">
      <div class="logo">
        <div class="blue-square"></div>
        <span class="logo-text">TaskMaster</span>
      </div>
      
      <div class="nav-links">
        <a href="#" class="nav-link">HOME</a>
        <a href="#features-section" class="nav-link">FEATURES</a>
        <a href="#" class="nav-link" @click.prevent="navigateToLogin">LOGIN</a>
        <a href="#" class="nav-link" @click.prevent="navigateToRegister">REGISTER</a>
      </div>
    </header>
    
    <!-- Main hero section -->
    <div class="hero-section">
      <div class="hero-title">
        <h1>
          <span class="solid-text">Task</span><span class="outlined-text">Master</span>
        </h1>
      </div>
      
      <!-- Feature lines -->
      <div class="feature-lines">
        <div class="line"></div>
        <span>Organize</span>
        <div class="line"></div>
        <span>Collaborate</span>
        <div class="line"></div>
        <span>Achieve</span>
        <div class="line"></div>
      </div>
      
      <!-- About button -->
      <div class="about-button-container">
        <button 
          class="about-button"
          @click="navigateToAbout"
        >
          ABOUT MORE
        </button>
      </div>
    </div>
    
    <!-- Product showcase section -->
    <div id="features-section" class="product-showcase">
      <div class="showcase-item">
        <div class="showcase-icon">
          <div class="blue-square"></div>
        </div>
        <div class="showcase-content">
          <h3>Task Management</h3>
          <p>Create, organize, and prioritize tasks with ease</p>
        </div>
      </div>
      
      <div class="showcase-item">
        <div class="showcase-icon">
          <div class="blue-square"></div>
        </div>
        <div class="showcase-content">
          <h3>Team Collaboration</h3>
          <p>Work together seamlessly across your organization</p>
        </div>
      </div>
      
      <div class="showcase-item">
        <div class="showcase-icon">
          <div class="blue-square"></div>
        </div>
        <div class="showcase-content">
          <h3>Analytics Dashboard</h3>
          <p>Track progress and measure team performance</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.introduction-container {
  width: 100vw;
  min-height: 100vh;
  max-width: 100vw;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

/* Navigation header */
.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5%;
  border-bottom: 1px solid #f0f0f0;
  width: 100%;
  box-sizing: border-box;
}

.logo {
  display: flex;
  align-items: center;
}

.blue-square {
  width: 24px;
  height: 24px;
  background-color: #1976d2;
  margin-right: 10px;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
}

.nav-link:hover {
  color: #1976d2;
}

/* Hero section */
.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 7% 5%;
  width: 100%;
  box-sizing: border-box;
}

.hero-title {
  margin-bottom: 2rem;
  text-align: center;
}

.hero-title h1 {
  font-size: 6rem;
  font-weight: 900;
  margin: 0;
  padding: 0;
}

.solid-text {
  color: #212121;
}

.outlined-text {
  -webkit-text-fill-color: white;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
}

.feature-lines {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 2rem 0 4rem 0;
  width: 100%;
  max-width: 800px;
}

.line {
  height: 1px;
  background-color: #333;
  flex-grow: 1;
}

.feature-lines span {
  font-size: 1rem;
  padding: 0 0.5rem;
}

.about-button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 4rem;
}

.about-button {
  background-color: #000;
  color: #fff;
  border: none;
  padding: 0.75rem 2rem;
  letter-spacing: 1px;
  font-size: 0.9rem;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: 500;
}

/* Product showcase */
.product-showcase {
  display: flex;
  justify-content: center;
  gap: 5%;
  padding: 5%;
  background-color: #f8f8f8;
  width: 100%;
  box-sizing: border-box;
}

.showcase-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 350px;
  padding: 2rem;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.showcase-icon {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.showcase-content {
  text-align: center;
  width: 100%;
}

.showcase-content h3 {
  margin-bottom: 0.5rem;
  font-weight: bold;
  font-size: 1.5rem;
}

.showcase-content p {
  color: #555;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .hero-title h1 {
    font-size: 4rem;
  }
  
  .product-showcase {
    flex-wrap: wrap;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .hero-title h1 {
    font-size: 3rem;
  }
  
  .feature-lines {
    flex-direction: column;
    gap: 1rem;
  }
  
  .feature-lines .line {
    width: 50%;
    height: 1px;
  }
  
  .nav-links {
    display: none;
  }
  
  .product-showcase {
    flex-direction: column;
    align-items: center;
  }
}
</style> 