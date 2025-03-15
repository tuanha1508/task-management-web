<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';

const router = useRouter();
const displayText = ref('');
const typingComplete = ref(false);
const fullText = "Master";

// When the Introduction page loads, check if we're on the root path and force logout
// This ensures that the Introduction page is always visible to non-authenticated users
onMounted(() => {
  // If we're at the root path (introduction page), clear any existing auth
  if (window.location.pathname === '/') {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  }
  
  // Simple typing animation that types out the text character by character once
  let charIndex = 0;
  const typingInterval = setInterval(() => {
    if (charIndex < fullText.length) {
      displayText.value += fullText.charAt(charIndex);
      charIndex++;
    } else {
      // Animation complete
      clearInterval(typingInterval);
      typingComplete.value = true;
      
      // Show feature lines and button after typing completes
      setTimeout(() => {
        const featureLines = document.querySelector('.feature-lines');
        const aboutButton = document.querySelector('.about-button-container');
        
        if (featureLines) featureLines.classList.add('show');
        if (aboutButton) aboutButton.classList.add('show');
      }, 300);
    }
  }, 150);
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
          <span class="solid-text">Task</span>
          <span class="typing-container">
            <span class="typing-text">{{ displayText }}</span>
            <span class="cursor" :class="{ 'cursor-hidden': typingComplete }"></span>
          </span>
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
  background: linear-gradient(135deg, #050505 0%, #0a0a0a 50%, #050505 100%);
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
  font-family: 'Nunito', sans-serif;
}

/* Navigation header */
.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 7%;
  border-bottom: none;
  width: 100%;
  box-sizing: border-box;
  background-color: rgba(5, 5, 5, 0.7);
  position: relative;
  z-index: 10;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 0 0 16px 16px;
}

.logo {
  display: flex;
  align-items: center;
  background: transparent;
  padding: 0;
  border: none;
}

.blue-square {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #9733EE, #DA22FF);
  border-radius: 8px;
  margin-right: 10px;
  box-shadow: 0 0 15px rgba(218, 34, 255, 0.3);
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.2px;
  font-family: 'Nunito', sans-serif;
  border-radius: 30px;
}

.nav-links {
  display: flex;
  gap: 2.5rem;
  background: rgba(10, 10, 10, 0.5);
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.nav-link {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  font-size: 0.9rem;
  letter-spacing: 0.2px;
  transition: color 0.3s ease;
  padding: 0.3rem 0.8rem;
  border-radius: 50px;
  font-family: 'Nunito', sans-serif;
}

.nav-link:hover {
  color: #DA22FF;
  background: rgba(218, 34, 255, 0.1);
}

/* Hero section */
.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10% 5%;
  width: 100%;
  box-sizing: border-box;
  position: relative;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 20%;
  left: 50%;
  width: 40vw;
  height: 40vh;
  background: radial-gradient(circle, rgba(218, 34, 255, 0.03) 0%, transparent 70%);
  transform: translateX(-50%);
  z-index: 1;
  pointer-events: none;
}

.hero-title {
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  z-index: 2;
  background: transparent;
  padding: 0;
  border: none;
  box-shadow: none;
  backdrop-filter: none;
}

.hero-title h1 {
  font-size: 6.5rem;
  font-weight: 700;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: baseline;
  flex-wrap: nowrap;
  position: relative;
  letter-spacing: -1.5px;
  font-family: 'IBM Plex Sans', sans-serif;
}

.solid-text {
  color: #ffffff;
  white-space: nowrap;
  display: inline-block;
  font-family: 'IBM Plex Sans', sans-serif;
}

.typing-container {
  display: inline-block;
  position: relative;
  height: 6.5rem;
  min-width: 450px;
  overflow: visible;
  vertical-align: baseline;
  margin-left: 5px;
}

.typing-text {
  background: linear-gradient(90deg, #FF0080, #DA22FF, #9733EE, #7C4DFF);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke-width: 0;
  font-size: 6.5rem;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: -1.5px;
  animation: gradientFlow 8s ease infinite;
  font-family: 'IBM Plex Sans', sans-serif;
}

@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.cursor {
  display: inline-block;
  width: 4px;
  height: 80%;
  background-color: #FF0080;
  margin-left: 2px;
  vertical-align: bottom;
  animation: blink 0.8s step-end infinite, cursorGradient 8s linear infinite;
  border-radius: 4px;
}

.cursor-hidden {
  display: none;
}

@keyframes blink {
  from, to { opacity: 0; }
  50% { opacity: 1; }
}

@keyframes cursorGradient {
  0% { background-color: #FF0080; }
  25% { background-color: #DA22FF; }
  50% { background-color: #9733EE; }
  75% { background-color: #7C4DFF; }
  100% { background-color: #FF0080; }
}

.feature-lines {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin: 3rem 0 5rem 0;
  width: 100%;
  max-width: 800px;
  opacity: 0;
  transition: opacity 0.8s ease;
  position: relative;
  z-index: 2;
  background: transparent;
  padding: 0.5rem 0;
  border-radius: 0;
  box-shadow: none;
  border: none;
}

.feature-lines.show {
  opacity: 1;
}

.line {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  flex-grow: 1;
  max-width: 100px;
}

.feature-lines span {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.2px;
  padding: 0.6rem 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  background: rgba(15, 15, 15, 0.7);
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  font-family: 'Nunito', sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.about-button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 6rem;
  opacity: 0;
  transition: opacity 0.8s ease, transform 0.8s ease;
  transform: translateY(20px);
  position: relative;
  z-index: 2;
}

.about-button-container.show {
  opacity: 1;
  transform: translateY(0);
}

.about-button {
  background: linear-gradient(90deg, #9733EE, #DA22FF);
  color: #fff;
  border: none;
  padding: 1.2rem 3rem;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: 700;
  border-radius: 50px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 20px rgba(218, 34, 255, 0.2);
  position: relative;
  overflow: hidden;
  font-family: 'Nunito', sans-serif;
}

.about-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.about-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(218, 34, 255, 0.3);
}

.about-button:hover::before {
  transform: translateX(100%);
}

/* Product showcase */
.product-showcase {
  display: flex;
  justify-content: center;
  gap: 5%;
  padding: 8% 7%;
  background: linear-gradient(to bottom, #080808, #030303);
  width: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 3;
  border-radius: 30px 30px 0 0;
}

.product-showcase::before {
  content: '';
  position: absolute;
  top: 0;
  left: 5%;
  right: 5%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  border-radius: 100%;
}

.showcase-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 350px;
  padding: 3rem 2.5rem;
  background: linear-gradient(145deg, rgba(15, 15, 15, 0.5), rgba(5, 5, 5, 0.9));
  border: 1px solid rgba(255, 255, 255, 0.03);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.7);
  border-radius: 24px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.showcase-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(218, 34, 255, 0.1), transparent);
}

.showcase-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(218, 34, 255, 0.1);
}

.showcase-icon {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  padding: 1.5rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.showcase-icon .blue-square {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #9733EE, #DA22FF);
  border-radius: 14px;
  box-shadow: 0 5px 15px rgba(218, 34, 255, 0.2);
}

.showcase-content {
  text-align: center;
  width: 100%;
}

.showcase-content h3 {
  margin-bottom: 1rem;
  font-weight: 700;
  font-size: 1.5rem;
  color: #ffffff;
  letter-spacing: 0;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  display: inline-block;
  border-radius: 50px;
  font-family: 'Nunito', sans-serif;
}

.showcase-content p {
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  font-size: 1rem;
  padding: 0.5rem 0;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  font-family: 'Nunito', sans-serif;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .hero-title h1, .typing-text {
    font-size: 5rem;
  }
  
  .typing-container {
    height: 5rem;
    min-width: 320px;
  }
  
  .product-showcase {
    flex-wrap: wrap;
    gap: 3rem;
  }
  
  .hero-title {
    padding: 1.5rem 2rem;
  }
  
  .feature-lines {
    padding: 1rem 1.5rem;
  }
}

@media (max-width: 768px) {
  .hero-title h1, .typing-text {
    font-size: 3.5rem;
  }
  
  .typing-container {
    height: 3.5rem;
    min-width: 230px;
  }
  
  .feature-lines {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem;
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
    gap: 2.5rem;
    border-radius: 20px 20px 0 0;
  }
  
  .hero-title {
    padding: 1rem 1.5rem;
  }
  
  .about-button {
    padding: 1rem 2rem;
  }
  
  .logo {
    padding: 0.4rem 0.8rem;
  }
}
</style> 