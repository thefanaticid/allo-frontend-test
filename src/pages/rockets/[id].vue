<template>
  <div class="rocket-detail-page">
    <!-- Back Navigation -->
    <v-container class="py-4">
      <v-btn
        variant="text"
        color="primary"
        class="back-btn"
        @click="goBack"
      >
        <v-icon start>mdi-arrow-left</v-icon>
        Back to Rockets
      </v-btn>
    </v-container>
    
    <!-- Loading State -->
    <LoadingState
      v-if="isLoading"
      title="Loading rocket..."
      subtitle="Fetching rocket details"
    />
    
    <!-- Error State -->
    <ErrorState
      v-else-if="hasError"
      :message="errorMessage"
      @retry="loadRocket"
    />
    
    <!-- Rocket Detail Content -->
    <template v-else-if="rocket">
      <!-- Hero Image Section -->
      <div class="detail-hero">
        <div class="hero-background-gradient" />
        
        <v-container>
          <v-row align="center">
            <v-col cols="12" md="6" order="2" order-md="1">
              <div class="rocket-info">
                <!-- Custom Badge -->
                <v-chip
                  v-if="isCustomRocket"
                  color="secondary"
                  class="mb-4"
                >
                  <v-icon start size="16">mdi-star</v-icon>
                  Custom Rocket
                </v-chip>
                
                <h1 class="rocket-name gradient-text">{{ rocket.name }}</h1>
                
                <p class="rocket-description text-medium-emphasis mt-4">
                  {{ rocket.description }}
                </p>
                
                <!-- Quick Stats -->
                <div class="quick-stats mt-6">
                  <div class="stat-card glass-card">
                    <v-icon color="primary" size="28">mdi-map-marker</v-icon>
                    <div class="stat-info">
                      <span class="stat-label">Country</span>
                      <span class="stat-value">{{ rocket.country }}</span>
                    </div>
                  </div>
                  
                  <div class="stat-card glass-card">
                    <v-icon color="success" size="28">mdi-calendar-check</v-icon>
                    <div class="stat-info">
                      <span class="stat-label">First Flight</span>
                      <span class="stat-value">{{ formatDate(rocket.first_flight) }}</span>
                    </div>
                  </div>
                  
                  <div class="stat-card glass-card">
                    <v-icon color="warning" size="28">mdi-currency-usd</v-icon>
                    <div class="stat-info">
                      <span class="stat-label">Cost Per Launch</span>
                      <span class="stat-value">{{ formatCurrency(rocket.cost_per_launch) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
            
            <v-col cols="12" md="6" order="1" order-md="2">
              <!-- Image Gallery -->
              <div class="image-gallery">
                <v-carousel
                  v-if="rocket.flickr_images && rocket.flickr_images.length > 0"
                  height="400"
                  show-arrows="hover"
                  hide-delimiter-background
                  cycle
                  :interval="5000"
                  class="gallery-carousel"
                >
                  <v-carousel-item
                    v-for="(image, index) in rocket.flickr_images"
                    :key="index"
                    :src="image"
                    cover
                  >
                    <template #placeholder>
                      <div class="d-flex align-center justify-center fill-height">
                        <v-progress-circular
                          indeterminate
                          color="primary"
                        />
                      </div>
                    </template>
                  </v-carousel-item>
                </v-carousel>
                
                <!-- Fallback if no images -->
                <div v-else class="no-image-placeholder">
                  <v-icon size="80" color="medium-emphasis">mdi-rocket-outline</v-icon>
                  <p class="text-medium-emphasis mt-4">No images available</p>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
      
      <!-- Additional Details (only for API rockets) -->
      <v-container v-if="!isCustomRocket && fullRocket" class="py-8">
        <h2 class="section-title mb-6">
          <v-icon color="primary" class="mr-2">mdi-chart-box</v-icon>
          Technical Specifications
        </h2>
        
        <v-row>
          <!-- Dimensions Card -->
          <v-col cols="12" md="4">
            <v-card class="spec-card glass-card h-100">
              <v-card-title class="d-flex align-center gap-2">
                <v-icon color="info" class="mr-2">mdi-ruler</v-icon>
                Dimensions
              </v-card-title>
              <v-card-text>
                <div class="spec-item">
                  <span class="spec-label">Height</span>
                  <span class="spec-value">{{ fullRocket.height?.meters || 'N/A' }} m</span>
                </div>
                <v-divider class="my-3" />
                <div class="spec-item">
                  <span class="spec-label">Diameter</span>
                  <span class="spec-value">{{ fullRocket.diameter?.meters || 'N/A' }} m</span>
                </div>
                <v-divider class="my-3" />
                <div class="spec-item">
                  <span class="spec-label">Mass</span>
                  <span class="spec-value">{{ formatNumber(fullRocket.mass?.kg) }} kg</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <!-- Performance Card -->
          <v-col cols="12" md="4">
            <v-card class="spec-card glass-card h-100">
              <v-card-title class="d-flex align-center gap-2">
                <v-icon color="success" class="mr-2">mdi-speedometer</v-icon>
                Performance
              </v-card-title>
              <v-card-text>
                <div class="spec-item">
                  <span class="spec-label">Stages</span>
                  <span class="spec-value">{{ fullRocket.stages || 'N/A' }}</span>
                </div>
                <v-divider class="my-3" />
                <div class="spec-item">
                  <span class="spec-label">Boosters</span>
                  <span class="spec-value">{{ fullRocket.boosters || 0 }}</span>
                </div>
                <v-divider class="my-3" />
                <div class="spec-item">
                  <span class="spec-label">Success Rate</span>
                  <span class="spec-value">{{ fullRocket.success_rate_pct || 0 }}%</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <!-- Status Card -->
          <v-col cols="12" md="4">
            <v-card class="spec-card glass-card h-100">
              <v-card-title class="d-flex align-center gap-2">
                <v-icon color="warning" class="mr-2">mdi-information</v-icon>
                Status
              </v-card-title>
              <v-card-text>
                <div class="spec-item">
                  <span class="spec-label">Active</span>
                  <v-chip
                    :color="fullRocket.active ? 'success' : 'error'"
                    size="small"
                  >
                    {{ fullRocket.active ? 'Yes' : 'No' }}
                  </v-chip>
                </div>
                <v-divider class="my-3" />
                <div class="spec-item">
                  <span class="spec-label">Company</span>
                  <span class="spec-value">{{ fullRocket.company || 'SpaceX' }}</span>
                </div>
                <v-divider class="my-3" />
                <div class="spec-item">
                  <span class="spec-label">Type</span>
                  <span class="spec-value text-capitalize">{{ fullRocket.type || 'N/A' }}</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        
        <!-- Wikipedia Link -->
        <div v-if="fullRocket.wikipedia" class="text-center mt-8">
          <v-btn
            color="primary"
            variant="tonal"
            size="large"
            :href="fullRocket.wikipedia"
            target="_blank"
          >
            <v-icon start>mdi-wikipedia</v-icon>
            Learn More on Wikipedia
            <v-icon end>mdi-open-in-new</v-icon>
          </v-btn>
        </div>
      </v-container>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rockets'
import type { RocketItem, Rocket } from '@/types/rocket'

// Components
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const rocketStore = useRocketStore()

// State
const rocket = ref<RocketItem | null>(null)
const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref('')

// Computed
const isCustomRocket = computed(() => {
  return rocket.value && 'isCustom' in rocket.value && rocket.value.isCustom
})

const fullRocket = computed(() => {
  if (isCustomRocket.value) return null
  return rocket.value as Rocket
})

// Lifecycle
onMounted(() => {
  loadRocket()
})

// Methods
async function loadRocket() {
  const id = route.params.id as string
  
  if (!id) {
    hasError.value = true
    errorMessage.value = 'Invalid rocket ID'
    isLoading.value = false
    return
  }
  
  isLoading.value = true
  hasError.value = false
  
  try {
    const result = await rocketStore.fetchRocketById(id)
    
    if (result) {
      rocket.value = result
    } else {
      hasError.value = true
      errorMessage.value = 'Rocket not found'
    }
  } catch (error) {
    hasError.value = true
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load rocket'
  } finally {
    isLoading.value = false
  }
}

function goBack() {
  router.push('/')
}

function formatDate(dateString: string): string {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

function formatCurrency(amount: number): string {
  if (!amount) return 'N/A'
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount)
}

function formatNumber(num: number | undefined): string {
  if (!num) return 'N/A'
  return new Intl.NumberFormat('en-US').format(num)
}
</script>

<style scoped lang="scss">
.rocket-detail-page {
  min-height: 100vh;
  padding-bottom: 60px;
}

.back-btn {
  font-weight: 600;
}

.detail-hero {
  position: relative;
  padding: 40px 0 60px;
  overflow: hidden;
}

.hero-background-gradient {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.rocket-info {
  position: relative;
  z-index: 1;
}

.rocket-name {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  line-height: 1.2;
}

.rocket-description {
  font-size: 1.125rem;
  line-height: 1.8;
  max-width: 600px;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 16px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.6);
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
}

.image-gallery {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(99, 102, 241, 0.2);
}

.gallery-carousel {
  border-radius: 24px;
  
  :deep(.v-carousel__controls) {
    background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
    padding-bottom: 8px;
  }
}

.no-image-placeholder {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(17, 24, 39, 0.7);
  border-radius: 24px;
  border: 2px dashed rgba(99, 102, 241, 0.3);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
}

.spec-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
  
  :deep(.v-card-title) {
    font-size: 1rem;
    font-weight: 700;
    padding: 20px 20px 0;
  }
  
  :deep(.v-card-text) {
    padding: 20px;
  }
}

.spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spec-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
}

.spec-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}
</style>
