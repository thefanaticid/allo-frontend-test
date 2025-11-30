<template>
  <div class="empty-state">
    <div class="empty-illustration">
      <!-- Empty Space SVG -->
      <svg
        viewBox="0 0 200 200"
        class="empty-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Space background -->
        <circle cx="100" cy="100" r="80" fill="rgba(99, 102, 241, 0.05)" />
        
        <!-- Planet -->
        <circle cx="100" cy="100" r="45" fill="url(#planetGradient)" class="planet" />
        <ellipse cx="100" cy="100" rx="65" ry="12" fill="none" stroke="url(#ringGradient)" stroke-width="4" class="ring" />
        
        <!-- Stars -->
        <g class="stars">
          <circle cx="40" cy="50" r="2" fill="white" opacity="0.8" />
          <circle cx="160" cy="40" r="3" fill="white" opacity="0.6" />
          <circle cx="30" cy="140" r="2" fill="white" opacity="0.7" />
          <circle cx="170" cy="130" r="2" fill="white" opacity="0.5" />
          <circle cx="50" cy="170" r="2" fill="white" opacity="0.6" />
          <circle cx="150" cy="165" r="3" fill="white" opacity="0.7" />
        </g>
        
        <!-- Search/Question mark -->
        <g transform="translate(130, 55)">
          <circle cx="0" cy="0" r="22" fill="rgba(99, 102, 241, 0.8)" />
          <text x="0" y="8" fill="white" font-size="26" font-weight="bold" text-anchor="middle">?</text>
        </g>
        
        <defs>
          <linearGradient id="planetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1e293b" />
            <stop offset="100%" style="stop-color:#0f172a" />
          </linearGradient>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#6366f1" />
            <stop offset="50%" style="stop-color:#8b5cf6" />
            <stop offset="100%" style="stop-color:#6366f1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    
    <div class="empty-content">
      <h3 class="gradient-text">{{ title }}</h3>
      <p class="text-medium-emphasis">{{ message }}</p>
      
      <slot name="action" />
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  title?: string
  message?: string
}

withDefaults(defineProps<Props>(), {
  title: 'No rockets found',
  message: 'Try adjusting your search or filter to find what you\'re looking for.',
})
</script>

<style scoped lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 32px;
  text-align: center;
}

.empty-illustration {
  width: 200px;
  height: 200px;
  margin-bottom: 24px;
}

.empty-svg {
  width: 100%;
  height: 100%;
}

.planet {
  animation: rotate-planet 20s linear infinite;
  transform-origin: center;
}

.ring {
  animation: rotate-ring 15s linear infinite;
  transform-origin: center;
}

.stars circle {
  animation: twinkle 2s ease-in-out infinite;
  
  &:nth-child(2) { animation-delay: 0.3s; }
  &:nth-child(3) { animation-delay: 0.6s; }
  &:nth-child(4) { animation-delay: 0.9s; }
  &:nth-child(5) { animation-delay: 1.2s; }
  &:nth-child(6) { animation-delay: 1.5s; }
}

@keyframes rotate-planet {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rotate-ring {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}

.empty-content {
  max-width: 400px;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 12px;
  }
  
  p {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 24px;
  }
}
</style>
