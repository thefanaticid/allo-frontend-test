<template>
  <div class="hero-section">
    <!-- Animated Background -->
    <div class="hero-background">
      <!-- Stars -->
      <div class="stars-layer stars-small" />
      <div class="stars-layer stars-medium" />
      <div class="stars-layer stars-large" />
      
      <!-- Gradient orbs -->
      <div class="gradient-orb orb-1" />
      <div class="gradient-orb orb-2" />
      <div class="gradient-orb orb-3" />
    </div>
    
    <!-- Content -->
    <v-container class="hero-content">
      <v-row align="center" justify="center">
        <v-col cols="12" md="7" class="text-center text-md-start">
          <div class="hero-badge mb-4">
            <v-chip color="primary" variant="tonal" size="small">
              <v-icon start size="14">mdi-rocket-launch</v-icon>
              SpaceX Rockets Explorer
            </v-chip>
          </div>
          
          <h1 class="hero-title mb-4">
            Explore the
            <span class="gradient-text">Universe</span>
            of Rockets
          </h1>
          
          <p class="hero-subtitle text-medium-emphasis mb-6">
            Discover the incredible engineering behind SpaceX's revolutionary rockets.
            From Falcon 1 to Starship, explore the vehicles pushing humanity towards the stars.
          </p>
          
          <div class="hero-stats d-flex gap-6 justify-center justify-md-start flex-wrap">
            <div class="stat-item">
              <span class="stat-value gradient-text">{{ rocketCount }}</span>
              <span class="stat-label text-medium-emphasis">Rockets</span>
            </div>
            <div class="stat-divider d-none d-sm-block" />
            <div class="stat-item">
              <span class="stat-value gradient-text">{{ activeCount }}</span>
              <span class="stat-label text-medium-emphasis">Active</span>
            </div>
            <div class="stat-divider d-none d-sm-block" />
            <div class="stat-item">
              <span class="stat-value gradient-text">{{ sinceYear }}</span>
              <span class="stat-label text-medium-emphasis">Since</span>
            </div>
          </div>
        </v-col>
        
        <v-col cols="12" md="5" class="d-none d-md-flex justify-center">
          <div class="hero-illustration">
            <!-- Rocket SVG Illustration -->
            <svg
              viewBox="0 0 300 400"
              class="rocket-illustration"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!-- Background glow -->
              <defs>
                <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.3" />
                  <stop offset="100%" style="stop-color:#6366f1;stop-opacity:0" />
                </radialGradient>
                <linearGradient id="heroRocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#e2e8f0" />
                  <stop offset="50%" style="stop-color:#cbd5e1" />
                  <stop offset="100%" style="stop-color:#94a3b8" />
                </linearGradient>
                <linearGradient id="heroFlame" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#6366f1" />
                  <stop offset="50%" style="stop-color:#f59e0b" />
                  <stop offset="100%" style="stop-color:#ef4444" />
                </linearGradient>
              </defs>
              
              <!-- Glow circle -->
              <circle cx="150" cy="180" r="140" fill="url(#heroGlow)" class="glow-circle" />
              
              <!-- Rocket body -->
              <g class="rocket-group">
                <!-- Main body -->
                <path
                  d="M150 40 C150 40 180 80 180 140 L180 280 L165 300 L135 300 L120 280 L120 140 C120 80 150 40 150 40"
                  fill="url(#heroRocketBody)"
                  stroke="#64748b"
                  stroke-width="2"
                />
                
                <!-- Nose cone highlight -->
                <path
                  d="M150 40 C150 40 160 60 165 90 L155 90 C150 60 150 40 150 40"
                  fill="white"
                  opacity="0.3"
                />
                
                <!-- Window -->
                <circle cx="150" cy="140" r="25" fill="#0f172a" stroke="#6366f1" stroke-width="3" />
                <circle cx="150" cy="140" r="18" fill="#1e293b" />
                <circle cx="150" cy="140" r="12" fill="#06b6d4" opacity="0.6" />
                <circle cx="145" cy="135" r="4" fill="white" opacity="0.6" />
                
                <!-- SpaceX logo area -->
                <rect x="130" y="180" width="40" height="50" fill="#1e293b" rx="4" />
                <text x="150" y="210" fill="#e2e8f0" font-size="10" font-weight="bold" text-anchor="middle">SPACE</text>
                <text x="150" y="222" fill="#e2e8f0" font-size="8" text-anchor="middle">X</text>
                
                <!-- Left fin -->
                <path
                  d="M120 250 L80 320 L120 290 Z"
                  fill="#6366f1"
                  stroke="#4f46e5"
                  stroke-width="2"
                />
                
                <!-- Right fin -->
                <path
                  d="M180 250 L220 320 L180 290 Z"
                  fill="#6366f1"
                  stroke="#4f46e5"
                  stroke-width="2"
                />
                
                <!-- Landing legs -->
                <line x1="130" y1="300" x2="110" y2="350" stroke="#64748b" stroke-width="4" stroke-linecap="round" />
                <line x1="170" y1="300" x2="190" y2="350" stroke="#64748b" stroke-width="4" stroke-linecap="round" />
                
                <!-- Engine bells -->
                <ellipse cx="140" cy="310" rx="8" ry="12" fill="#475569" />
                <ellipse cx="160" cy="310" rx="8" ry="12" fill="#475569" />
                
                <!-- Flames -->
                <g class="flame-group">
                  <ellipse cx="140" cy="345" rx="10" ry="25" fill="url(#heroFlame)" opacity="0.9" />
                  <ellipse cx="160" cy="345" rx="10" ry="25" fill="url(#heroFlame)" opacity="0.9" />
                  <ellipse cx="140" cy="350" rx="6" ry="18" fill="#fbbf24" />
                  <ellipse cx="160" cy="350" rx="6" ry="18" fill="#fbbf24" />
                  <ellipse cx="140" cy="352" rx="3" ry="12" fill="#fef3c7" />
                  <ellipse cx="160" cy="352" rx="3" ry="12" fill="#fef3c7" />
                </g>
              </g>
              
              <!-- Orbiting particles -->
              <g class="particles">
                <circle cx="80" cy="100" r="3" fill="#6366f1" class="particle" />
                <circle cx="220" cy="120" r="2" fill="#8b5cf6" class="particle" />
                <circle cx="60" cy="200" r="2" fill="#06b6d4" class="particle" />
                <circle cx="240" cy="220" r="3" fill="#6366f1" class="particle" />
              </g>
            </svg>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  rocketCount?: number
  activeCount?: number
  sinceYear?: number
}

withDefaults(defineProps<Props>(), {
  rocketCount: 0,
  activeCount: 0,
  sinceYear: 2002,
})
</script>

<style scoped lang="scss">
.hero-section {
  position: relative;
  min-height: 500px;
  padding: 60px 0 40px;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

// Animated stars
.stars-layer {
  position: absolute;
  inset: 0;
  background-repeat: repeat;
}

.stars-small {
  background-image: radial-gradient(1px 1px at 20px 30px, white, transparent),
                    radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.8), transparent),
                    radial-gradient(1px 1px at 50px 160px, rgba(255,255,255,0.6), transparent),
                    radial-gradient(1px 1px at 90px 40px, white, transparent),
                    radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.7), transparent);
  background-size: 200px 200px;
  animation: twinkle-stars 4s ease-in-out infinite;
}

.stars-medium {
  background-image: radial-gradient(2px 2px at 150px 50px, white, transparent),
                    radial-gradient(2px 2px at 100px 150px, rgba(255,255,255,0.8), transparent),
                    radial-gradient(2px 2px at 70px 100px, rgba(255,255,255,0.6), transparent);
  background-size: 250px 250px;
  animation: twinkle-stars 5s ease-in-out infinite reverse;
}

.stars-large {
  background-image: radial-gradient(3px 3px at 80px 120px, rgba(99, 102, 241, 0.8), transparent),
                    radial-gradient(3px 3px at 180px 80px, rgba(139, 92, 246, 0.6), transparent);
  background-size: 300px 300px;
  animation: twinkle-stars 6s ease-in-out infinite;
}

@keyframes twinkle-stars {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

// Gradient orbs
.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.4;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.4), transparent);
  top: -100px;
  right: -100px;
  animation: float-orb 8s ease-in-out infinite;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent);
  bottom: -50px;
  left: -50px;
  animation: float-orb 10s ease-in-out infinite reverse;
}

.orb-3 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.3), transparent);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse-orb 6s ease-in-out infinite;
}

@keyframes float-orb {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, -20px); }
}

@keyframes pulse-orb {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.5; }
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-block;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.125rem;
  line-height: 1.7;
  max-width: 500px;
  
  @media (max-width: 960px) {
    margin-left: auto;
    margin-right: auto;
  }
}

.hero-stats {
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    @media (min-width: 960px) {
      align-items: flex-start;
    }
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: 800;
  }
  
  .stat-label {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .stat-divider {
    width: 1px;
    height: 40px;
    background: rgba(99, 102, 241, 0.3);
  }
}

.hero-illustration {
  width: 100%;
  max-width: 300px;
}

.rocket-illustration {
  width: 100%;
  height: auto;
}

.glow-circle {
  animation: pulse-glow 3s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.05); }
}

.rocket-group {
  animation: float-rocket 4s ease-in-out infinite;
  transform-origin: center;
}

@keyframes float-rocket {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.flame-group {
  animation: flicker 0.1s ease-in-out infinite alternate;
  transform-origin: center top;
}

@keyframes flicker {
  0% { transform: scaleY(1) scaleX(1); opacity: 0.9; }
  100% { transform: scaleY(1.15) scaleX(0.95); opacity: 1; }
}

.particle {
  animation: orbit 8s linear infinite;
  transform-origin: 150px 200px;
  
  &:nth-child(2) { animation-delay: -2s; animation-duration: 10s; }
  &:nth-child(3) { animation-delay: -4s; animation-duration: 12s; }
  &:nth-child(4) { animation-delay: -6s; animation-duration: 9s; }
}

@keyframes orbit {
  from { transform: rotate(0deg) translateX(20px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
}
</style>
