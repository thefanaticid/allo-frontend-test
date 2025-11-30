<template>
  <div class="error-state">
    <div class="error-illustration">
      <!-- Broken Rocket SVG -->
      <svg
        viewBox="0 0 200 200"
        class="error-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Background circle -->
        <circle cx="100" cy="100" r="80" fill="rgba(239, 68, 68, 0.1)" />
        
        <!-- Broken rocket pieces -->
        <g class="rocket-piece-1" transform="rotate(-15 100 100)">
          <path
            d="M100 40 L115 70 L115 95 L85 95 L85 70 Z"
            fill="url(#errorRocketGradient)"
          />
          <circle cx="100" cy="75" r="8" fill="#06b6d4" opacity="0.6" />
        </g>
        
        <g class="rocket-piece-2" transform="rotate(10 100 120)">
          <path
            d="M85 100 L115 100 L110 130 L90 130 Z"
            fill="url(#errorRocketGradient)"
          />
        </g>
        
        <!-- Smoke/explosion particles -->
        <g class="particles">
          <circle cx="70" cy="90" r="6" fill="#94a3b8" opacity="0.5" class="particle" />
          <circle cx="130" cy="85" r="4" fill="#94a3b8" opacity="0.4" class="particle" />
          <circle cx="75" cy="120" r="5" fill="#94a3b8" opacity="0.3" class="particle" />
          <circle cx="125" cy="115" r="7" fill="#94a3b8" opacity="0.4" class="particle" />
          <circle cx="90" cy="140" r="4" fill="#94a3b8" opacity="0.3" class="particle" />
          <circle cx="110" cy="145" r="5" fill="#94a3b8" opacity="0.4" class="particle" />
        </g>
        
        <!-- Warning icon -->
        <g transform="translate(135, 45)">
          <circle cx="0" cy="0" r="20" fill="#ef4444" />
          <text x="0" y="7" fill="white" font-size="24" font-weight="bold" text-anchor="middle">!</text>
        </g>
        
        <defs>
          <linearGradient id="errorRocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#64748b" />
            <stop offset="100%" style="stop-color:#475569" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    
    <div class="error-content">
      <h3 class="error-title">{{ title }}</h3>
      <p class="error-message text-medium-emphasis">{{ message }}</p>
      
      <v-btn
        v-if="showRetry"
        color="primary"
        size="large"
        class="mt-6"
        @click="$emit('retry')"
      >
        <v-icon start>mdi-refresh</v-icon>
        {{ retryText }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  title?: string
  message?: string
  showRetry?: boolean
  retryText?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Houston, we have a problem!',
  message: 'Something went wrong while fetching data. Please try again.',
  showRetry: true,
  retryText: 'Try Again',
})

defineEmits<{
  retry: []
}>()
</script>

<style scoped lang="scss">
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 32px;
  text-align: center;
}

.error-illustration {
  width: 200px;
  height: 200px;
  margin-bottom: 24px;
}

.error-svg {
  width: 100%;
  height: 100%;
}

.rocket-piece-1 {
  animation: shake-1 2s ease-in-out infinite;
  transform-origin: center;
}

.rocket-piece-2 {
  animation: shake-2 2s ease-in-out infinite;
  transform-origin: center;
}

.particle {
  animation: float-particle 3s ease-in-out infinite;
}

.particle:nth-child(2) { animation-delay: 0.5s; }
.particle:nth-child(3) { animation-delay: 1s; }
.particle:nth-child(4) { animation-delay: 1.5s; }
.particle:nth-child(5) { animation-delay: 2s; }
.particle:nth-child(6) { animation-delay: 2.5s; }

@keyframes shake-1 {
  0%, 100% { transform: rotate(-15deg) translateX(0); }
  25% { transform: rotate(-17deg) translateX(-3px); }
  75% { transform: rotate(-13deg) translateX(3px); }
}

@keyframes shake-2 {
  0%, 100% { transform: rotate(10deg) translateX(0); }
  25% { transform: rotate(12deg) translateX(2px); }
  75% { transform: rotate(8deg) translateX(-2px); }
}

@keyframes float-particle {
  0%, 100% { 
    opacity: 0.3;
    transform: translateY(0) scale(1);
  }
  50% { 
    opacity: 0.6;
    transform: translateY(-5px) scale(1.1);
  }
}

.error-content {
  max-width: 400px;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ef4444;
  margin-bottom: 12px;
}

.error-message {
  font-size: 1rem;
  line-height: 1.6;
}
</style>
