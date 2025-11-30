/**
 * Pinia Store for Rockets
 */

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { rocketApi } from '@/services/api'
import type { Rocket, CustomRocket, RocketItem, RocketFilters, NewRocketForm } from '@/types/rocket'

export const useRocketStore = defineStore('rockets', () => {
  // State
  const rockets = ref<Rocket[]>([])
  const customRockets = ref<CustomRocket[]>([])
  const allCountries = ref<string[]>([])
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

  // Countries from API + custom rockets
  const countries = computed(() => {
    const countrySet = new Set<string>(allCountries.value)
    customRockets.value.forEach((rocket) => {
      if (rocket.country) {
        countrySet.add(rocket.country)
      }
    })
    return Array.from(countrySet).sort()
  })

  // Filtered rockets - combines API results with custom rockets filter
  const filteredRockets = computed<RocketItem[]>(() => {
    // API rockets are already filtered by server
    let result: RocketItem[] = [...rockets.value]

    // Filter custom rockets on client-side
    let filteredCustom = customRockets.value

    if (filters.value.search) {
      const searchLower = filters.value.search.toLowerCase()
      filteredCustom = filteredCustom.filter(
        (rocket) =>
          rocket.name.toLowerCase().includes(searchLower) ||
          rocket.description.toLowerCase().includes(searchLower)
      )
    }

    if (filters.value.country) {
      filteredCustom = filteredCustom.filter((rocket) => rocket.country === filters.value.country)
    }

    return [...result, ...filteredCustom]
  })

  const hasError = computed(() => error.value !== null)
  const isEmpty = computed(() => !isLoading.value && !hasError.value && filteredRockets.value.length === 0)

  // Actions
  
  /**
   * Fetch rockets using Query API with current filters
   */
  async function fetchRockets() {
    isLoading.value = true
    error.value = null

    try {
      // Use Query API with filters
      const data = await rocketApi.queryRockets({
        search: filters.value.search || undefined,
        country: filters.value.country || undefined,
      })
      rockets.value = data
    } catch (err) {
      console.error('Failed to fetch rockets:', err)
      error.value = err instanceof Error ? err.message : 'Failed to fetch rockets. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch all countries for filter dropdown
   */
  async function fetchCountries() {
    try {
      const countries = await rocketApi.getCountries()
      allCountries.value = countries
    } catch (err) {
      console.error('Failed to fetch countries:', err)
      // Non-critical error, just log it
    }
  }

  /**
   * Initialize store - fetch countries and rockets
   */
  async function initialize() {
    await fetchCountries()
    await fetchRockets()
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

  // Debounce timer for filter changes
  let filterDebounceTimer: ReturnType<typeof setTimeout> | null = null

  function setFilters(newFilters: Partial<RocketFilters>) {
    filters.value = { ...filters.value, ...newFilters }
    
    // Debounce API calls when filters change
    if (filterDebounceTimer) {
      clearTimeout(filterDebounceTimer)
    }
    
    filterDebounceTimer = setTimeout(() => {
      fetchRockets()
    }, 300)
  }

  function clearFilters() {
    filters.value = { search: '', country: '' }
    fetchRockets()
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
    initialize,
    fetchRockets,
    fetchCountries,
    fetchRocketById,
    addCustomRocket,
    setFilters,
    clearFilters,
    clearError,
  }
})
