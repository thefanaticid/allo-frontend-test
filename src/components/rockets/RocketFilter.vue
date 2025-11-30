<template>
  <div class="rocket-filter">
    <v-row align="center" :dense="$vuetify.display.smAndDown">
      <!-- Search Input -->
      <v-col cols="12" sm="6" md="5">
        <v-text-field
          v-model="searchValue"
          label="Search rockets"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          class="filter-input"
          bg-color="surface-light"
          @update:model-value="debouncedSearch"
        >
          <template #clear>
            <v-icon @click="clearSearch">mdi-close-circle</v-icon>
          </template>
        </v-text-field>
      </v-col>
      
      <!-- Country Filter -->
      <v-col cols="12" sm="4" md="4">
        <v-select
          v-model="countryValue"
          :items="countryOptions"
          label="Filter by country"
          prepend-inner-icon="mdi-earth"
          clearable
          hide-details
          class="filter-input"
          bg-color="surface-light"
          @update:model-value="emitFilters"
        >
          <template #clear>
            <v-icon @click="clearCountry">mdi-close-circle</v-icon>
          </template>
        </v-select>
      </v-col>
      
      <!-- Clear All Button -->
      <v-col cols="12" sm="2" md="3" class="d-flex justify-end">
        <v-btn
          v-if="hasActiveFilters"
          variant="tonal"
          color="secondary"
          @click="clearAll"
        >
          <v-icon start>mdi-filter-remove</v-icon>
          <span class="d-none d-md-inline">Clear Filters</span>
          <span class="d-md-none">Clear</span>
        </v-btn>
      </v-col>
    </v-row>
    
    <!-- Active Filters Chips -->
    <v-slide-y-transition>
      <div v-if="hasActiveFilters" class="active-filters mt-4">
        <span class="text-medium-emphasis text-caption mr-2">Active filters:</span>
        <v-chip
          v-if="searchValue"
          closable
          size="small"
          color="primary"
          variant="tonal"
          class="mr-2"
          @click:close="clearSearch"
        >
          Search: {{ searchValue }}
        </v-chip>
        <v-chip
          v-if="countryValue"
          closable
          size="small"
          color="secondary"
          variant="tonal"
          @click:close="clearCountry"
        >
          Country: {{ countryValue }}
        </v-chip>
      </div>
    </v-slide-y-transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import type { RocketFilters } from '@/types/rocket'

interface Props {
  filters: RocketFilters
  countries: string[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:filters': [filters: RocketFilters]
}>()

// Local state
const searchValue = ref(props.filters.search)
const countryValue = ref(props.filters.country)

// Debounce timer
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Computed
const countryOptions = computed(() => {
  return props.countries.map((country) => ({
    title: country,
    value: country,
  }))
})

const hasActiveFilters = computed(() => {
  return !!searchValue.value || !!countryValue.value
})

// Methods
function debouncedSearch() {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    emitFilters()
  }, 300)
}

function emitFilters() {
  emit('update:filters', {
    search: searchValue.value || '',
    country: countryValue.value || '',
  })
}

function clearSearch() {
  searchValue.value = ''
  emitFilters()
}

function clearCountry() {
  countryValue.value = ''
  emitFilters()
}

function clearAll() {
  searchValue.value = ''
  countryValue.value = ''
  emitFilters()
}

// Watch for external filter changes
watch(
  () => props.filters,
  (newFilters) => {
    searchValue.value = newFilters.search
    countryValue.value = newFilters.country
  },
  { deep: true }
)
</script>

<style scoped lang="scss">
.rocket-filter {
  padding: 16px 0;
}

.filter-input {
  :deep(.v-field) {
    border: 1px solid rgba(99, 102, 241, 0.2);
    transition: all 0.3s ease;
  }
  
  :deep(.v-field:hover) {
    border-color: rgba(99, 102, 241, 0.4);
  }
  
  :deep(.v-field--focused) {
    border-color: rgb(var(--v-theme-primary));
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  }
}

.active-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}
</style>
