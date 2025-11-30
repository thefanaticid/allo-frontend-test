<template>
  <div class="rockets-page">
    <!-- Hero Section -->
    <HeroSection :rocket-count="rocketStore.allRockets.length" />
    
    <!-- Main Content -->
    <v-container class="rockets-content py-8">
      <!-- Section Header -->
      <div class="section-header mb-6">
        <div class="d-flex align-center justify-space-between flex-wrap gap-4">
          <div>
            <h2 class="section-title">
              <v-icon color="primary" class="mr-2">mdi-rocket</v-icon>
              All Rockets
            </h2>
            <p class="section-subtitle text-medium-emphasis mt-1">
              Browse and explore SpaceX's incredible fleet of rockets
            </p>
          </div>
          
          <v-btn
            color="primary"
            size="large"
            class="add-rocket-btn"
            @click="showAddDialog = true"
          >
            <v-icon start>mdi-plus</v-icon>
            Add Rocket
          </v-btn>
        </div>
      </div>
      
      <!-- Filter Section -->
      <RocketFilter
        :filters="rocketStore.filters"
        :countries="rocketStore.countries"
        @update:filters="rocketStore.setFilters"
      />
      
      <!-- Loading State -->
      <LoadingState
        v-if="rocketStore.isLoading"
        title="Launching..."
        subtitle="Fetching rocket data from SpaceX"
      />
      
      <!-- Error State -->
      <ErrorState
        v-else-if="rocketStore.hasError"
        :message="rocketStore.error || 'Failed to load rockets'"
        @retry="retryFetch"
      />
      
      <!-- Empty State -->
      <EmptyState
        v-else-if="rocketStore.isEmpty"
        title="No rockets found"
        message="Try adjusting your search or filters to find what you're looking for."
      >
        <template #action>
          <v-btn
            v-if="rocketStore.filters.search || rocketStore.filters.country"
            color="primary"
            variant="tonal"
            @click="rocketStore.clearFilters"
          >
            <v-icon start>mdi-filter-remove</v-icon>
            Clear Filters
          </v-btn>
        </template>
      </EmptyState>
      
      <!-- Rockets Grid -->
      <transition-group
        v-else
        name="rocket-grid"
        tag="div"
        class="rockets-grid"
      >
        <div
          v-for="(rocket, index) in rocketStore.filteredRockets"
          :key="rocket.id"
          class="rocket-grid-item"
          :style="{ '--animation-delay': `${index * 0.1}s` }"
        >
          <RocketCard
            :rocket="rocket"
            @click="navigateToDetail(rocket.id)"
          />
        </div>
      </transition-group>
      
      <!-- Results count -->
      <div
        v-if="!rocketStore.isLoading && !rocketStore.hasError && rocketStore.filteredRockets.length > 0"
        class="results-count text-center mt-8"
      >
        <v-chip color="primary" variant="tonal">
          Showing {{ rocketStore.filteredRockets.length }} of {{ rocketStore.allRockets.length }} rockets
        </v-chip>
      </div>
    </v-container>
    
    <!-- Floating Add Button (Mobile) -->
    <v-fab
      class="fab-add d-md-none"
      icon="mdi-plus"
      color="primary"
      size="large"
      app
      appear
      @click="showAddDialog = true"
    />
    
    <!-- Add Rocket Dialog -->
    <AddRocketDialog
      v-model="showAddDialog"
      @submit="handleAddRocket"
    />
    
    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccessSnackbar"
      color="success"
      timeout="3000"
      location="bottom"
    >
      <v-icon start>mdi-check-circle</v-icon>
      Rocket added successfully!
    </v-snackbar>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rockets'
import type { NewRocketForm } from '@/types/rocket'

// Components
import HeroSection from '@/components/layout/HeroSection.vue'
import RocketFilter from '@/components/rockets/RocketFilter.vue'
import RocketCard from '@/components/rockets/RocketCard.vue'
import AddRocketDialog from '@/components/rockets/AddRocketDialog.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const router = useRouter()
const rocketStore = useRocketStore()

// State
const showAddDialog = ref(false)
const showSuccessSnackbar = ref(false)

// Lifecycle
onMounted(() => {
  // Initialize store - fetches countries and rockets
  rocketStore.initialize()
})

// Methods
function retryFetch() {
  rocketStore.fetchRockets()
}

function navigateToDetail(id: string) {
  router.push(`/rockets/${id}`)
}

function handleAddRocket(form: NewRocketForm) {
  rocketStore.addCustomRocket(form)
  showSuccessSnackbar.value = true
}
</script>

<style scoped lang="scss">
.rockets-page {
  min-height: 100vh;
}

.rockets-content {
  max-width: 1400px;
}

.section-header {
  .section-title {
    font-size: 1.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
}

.add-rocket-btn {
  @media (max-width: 960px) {
    display: none;
  }
}

.rockets-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;
  
  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 960px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.rocket-grid-item {
  animation: slide-up 0.5s ease-out backwards;
  animation-delay: var(--animation-delay, 0s);
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Grid transition animations
.rocket-grid-enter-active,
.rocket-grid-leave-active {
  transition: all 0.4s ease;
}

.rocket-grid-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.rocket-grid-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.rocket-grid-move {
  transition: transform 0.4s ease;
}

.fab-add {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
}

.results-count {
  opacity: 0.8;
}
</style>
