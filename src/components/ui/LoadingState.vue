<template>
  <div class="loading-state">
    <div class="stars-container">
      <div v-for="i in 20" :key="i" class="star" :style="getStarStyle(i)" />
    </div>
    
    <div class="loading-content">
      <!-- Rocket SVG Animation -->
      <div class="rocket-loader">
        <svg
          viewBox="0 0 100 150"
          class="rocket-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Rocket body -->
          <path
            d="M50 10 L65 50 L65 100 L60 110 L40 110 L35 100 L35 50 Z"
            fill="url(#rocketGradient)"
            class="rocket-body"
          />
          <!-- Window -->
          <circle cx="50" cy="55" r="10" fill="#06b6d4" opacity="0.8" />
          <circle cx="50" cy="55" r="6" fill="#0a0e17" />
          <!-- Fins -->
          <path d="M35 90 L20 115 L35 105 Z" fill="#8b5cf6" />
          <path d="M65 90 L80 115 L65 105 Z" fill="#8b5cf6" />
          <!-- Flame -->
          <g class="flame">
            <ellipse cx="50" cy="125" rx="12" ry="20" fill="url(#flameGradient)" />
            <ellipse cx="50" cy="130" rx="8" ry="15" fill="#fbbf24" />
            <ellipse cx="50" cy="133" rx="4" ry="10" fill="#fef3c7" />
          </g>
          <!-- Gradient definitions -->
          <defs>
            <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#6366f1" />
              <stop offset="100%" style="stop-color:#4f46e5" />
            </linearGradient>
            <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#f59e0b" />
              <stop offset="100%" style="stop-color:#ef4444" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div class="loading-text">
        <h3 class="gradient-text">{{ title }}</h3>
        <p class="text-medium-emphasis">{{ subtitle }}</p>
      </div>
      
      <!-- Loading dots -->
      <div class="loading-dots">
        <span v-for="i in 3" :key="i" class="dot" :style="{ animationDelay: `${i * 0.2}s` }" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  title?: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Launching...',
  subtitle: 'Fetching rocket data from SpaceX',
})

function getStarStyle(index: number) {
  const random = (min: number, max: number) => Math.random() * (max - min) + min
  return {
    left: `${random(0, 100)}%`,
    top: `${random(0, 100)}%`,
    width: `${random(2, 4)}px`,
    height: `${random(2, 4)}px`,
    animationDelay: `${random(0, 3)}s`,
    animationDuration: `${random(1, 3)}s`,
  }
}
</script>

<style scoped lang="scss">
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  position: relative;
  overflow: hidden;
}

.stars-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.star {
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: twinkle 2s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  z-index: 1;
}

.rocket-loader {
  width: 80px;
  height: 120px;
  animation: float 2s ease-in-out infinite;
}

.rocket-svg {
  width: 100%;
  height: 100%;
}

.flame {
  animation: flicker 0.1s ease-in-out infinite alternate;
  transform-origin: center top;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes flicker {
  0% { transform: scaleY(1) scaleX(1); }
  100% { transform: scaleY(1.1) scaleX(0.9); }
}

.loading-text {
  text-align: center;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 0.875rem;
  }
}

.loading-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite;
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}
</style>
