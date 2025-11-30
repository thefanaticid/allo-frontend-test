<template>
  <v-card
    class="rocket-card glass-card"
    :ripple="false"
    @click="$emit('click')"
  >
    <!-- Image Container -->
    <div class="rocket-image-container">
      <v-img
        :src="imageUrl"
        :alt="rocket.name"
        cover
        height="220"
        class="rocket-image"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular
              indeterminate
              color="primary"
              size="40"
            />
          </div>
        </template>
        <template #error>
          <div class="d-flex align-center justify-center fill-height bg-surface-light">
            <v-icon size="64" color="medium-emphasis">mdi-rocket-outline</v-icon>
          </div>
        </template>
      </v-img>
      
      <!-- Overlay gradient -->
      <div class="image-overlay" />
      
      <!-- Custom badge -->
      <v-chip
        v-if="isCustom"
        class="custom-badge"
        color="secondary"
        size="small"
      >
        <v-icon start size="14">mdi-star</v-icon>
        Custom
      </v-chip>
      
      <!-- Country badge -->
      <v-chip
        class="country-badge"
        color="primary"
        size="small"
        variant="flat"
      >
        <v-icon start size="14">mdi-map-marker</v-icon>
        {{ rocket.country }}
      </v-chip>
    </div>
    
    <!-- Content -->
    <v-card-text class="rocket-content">
      <h3 class="rocket-name">{{ rocket.name }}</h3>
      <p class="rocket-description text-medium-emphasis">
        {{ truncatedDescription }}
      </p>
    </v-card-text>
    
    <!-- Action hint -->
    <div class="card-action-hint">
      <span class="text-primary">View Details</span>
      <v-icon color="primary" size="18">mdi-arrow-right</v-icon>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { RocketItem } from '@/types/rocket'

interface Props {
  rocket: RocketItem
}

const props = defineProps<Props>()

defineEmits<{
  click: []
}>()

const imageUrl = computed(() => {
  if (props.rocket.flickr_images && props.rocket.flickr_images.length > 0) {
    return props.rocket.flickr_images[0]
  }
  return ''
})

const isCustom = computed(() => {
  return 'isCustom' in props.rocket && props.rocket.isCustom
})

const truncatedDescription = computed(() => {
  const maxLength = 120
  if (props.rocket.description.length <= maxLength) {
    return props.rocket.description
  }
  return props.rocket.description.substring(0, maxLength).trim() + '...'
})
</script>

<style scoped lang="scss">
.rocket-card {
  cursor: pointer;
  overflow: hidden;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), transparent, rgba(139, 92, 246, 0.3));
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
}

.rocket-image-container {
  position: relative;
  overflow: hidden;
}

.rocket-image {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  
  .rocket-card:hover & {
    transform: scale(1.05);
  }
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 50%,
    rgba(10, 14, 23, 0.8) 100%
  );
  pointer-events: none;
}

.custom-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
}

.country-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
}

.rocket-content {
  flex: 1;
  padding: 20px;
}

.rocket-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.3;
}

.rocket-description {
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
}

.card-action-hint {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid rgba(99, 102, 241, 0.1);
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  
  span {
    font-size: 0.875rem;
    font-weight: 600;
  }
  
  .rocket-card:hover & {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
