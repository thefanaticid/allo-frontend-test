/**
 * Pinia Store for Rockets
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { rocketApi } from '@/services/api'
import type { Rocket, CustomRocket, RocketItem, RocketFilters, NewRocketForm } from '@/types/rocket'

export const useRocketStore = defineStore('rockets', () => {
  // State
  const rockets = ref<Rocket[]>([])
  const customRockets = ref<CustomRocket[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<RocketFilters>({
    search: '',
    country: '',
  })

  // Getters
  const allRockets = computed<RocketItem[]>(() => {
    return [...rockets.value, ...customRockets.value]
  })

  const countries = computed(() => {
    const countrySet = new Set<string>()
    allRockets.value.forEach((rocket) => {
      if (rocket.country) {
        countrySet.add(rocket.country)
      }
    })
    return Array.from(countrySet).sort()
  })

  const filteredRockets = computed<RocketItem[]>(() => {
    let result = allRockets.value

    // Filter by search term
    if (filters.value.search) {
      const searchLower = filters.value.search.toLowerCase()
      result = result.filter(
        (rocket) =>
          rocket.name.toLowerCase().includes(searchLower) ||
          rocket.description.toLowerCase().includes(searchLower)
      )
    }

    // Filter by country
    if (filters.value.country) {
      result = result.filter((rocket) => rocket.country === filters.value.country)
    }

    return result
  })

  const hasError = computed(() => error.value !== null)
  const isEmpty = computed(() => !isLoading.value && !hasError.value && filteredRockets.value.length === 0)

  // Actions
  async function fetchRockets() {
    isLoading.value = true
    error.value = null

    try {
      const data = await rocketApi.getAllRockets()
      rockets.value = data
    } catch (err) {
      console.error('Failed to fetch rockets:', err)
      error.value = err instanceof Error ? err.message : 'Failed to fetch rockets. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchRocketById(id: string): Promise<RocketItem | null> {
    // Check if it's a custom rocket first
    const customRocket = customRockets.value.find((r) => r.id === id)
    if (customRocket) {
      return customRocket
    }

    // Check if we already have it in the store
    const existingRocket = rockets.value.find((r) => r.id === id)
    if (existingRocket) {
      return existingRocket
    }

    // Fetch from API
    isLoading.value = true
    error.value = null

    try {
      const rocket = await rocketApi.getRocketById(id)
      return rocket
    } catch (err) {
      console.error('Failed to fetch rocket:', err)
      error.value = err instanceof Error ? err.message : 'Failed to fetch rocket details.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  function addCustomRocket(form: NewRocketForm) {
    const newRocket: CustomRocket = {
      id: `custom-${Date.now()}`,
      name: form.name,
      description: form.description,
      flickr_images: form.imageUrl ? [form.imageUrl] : [],
      cost_per_launch: form.cost_per_launch || 0,
      country: form.country,
      first_flight: form.first_flight,
      isCustom: true,
    }

    customRockets.value.push(newRocket)
    return newRocket
  }

  function setFilters(newFilters: Partial<RocketFilters>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function clearFilters() {
    filters.value = { search: '', country: '' }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    rockets,
    customRockets,
    isLoading,
    error,
    filters,
    // Getters
    allRockets,
    countries,
    filteredRockets,
    hasError,
    isEmpty,
    // Actions
    fetchRockets,
    fetchRocketById,
    addCustomRocket,
    setFilters,
    clearFilters,
    clearError,
  }
})
