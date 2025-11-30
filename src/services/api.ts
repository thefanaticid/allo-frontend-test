/**
 * API Service for SpaceX Rockets
 */

import axios from 'axios'
import type { Rocket, CustomRocket, NewRocketForm } from '@/types/rocket'

const API_BASE_URL = 'https://api.spacexdata.com/v4'
const SPACEX_API_KEY = import.meta.env.VITE_SPACEX_API_KEY || ''
const LOCAL_STORAGE_KEY = 'spacex-custom-rockets'

// Check if API key is available
export const hasApiKey = (): boolean => {
  return SPACEX_API_KEY.length > 0
}

// Create axios instance for read operations
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Create axios instance for write operations (with API key)
const apiClientWithAuth = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'spacex-key': SPACEX_API_KEY,
  },
})

// Query API response interface
export interface QueryResponse<T> {
  docs: T[]
  totalDocs: number
  offset: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

// Query options interface
export interface QueryOptions {
  select?: Record<string, number> | string
  sort?: Record<string, number | string> | string
  offset?: number
  page?: number
  limit?: number
  pagination?: boolean
}

// Filter parameters
export interface RocketQueryParams {
  search?: string
  country?: string
}

// Payload for creating/updating rocket via API
export interface RocketPayload {
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch: number
  country: string
  first_flight: string
}

// ============================================
// Local Storage Operations (Fallback)
// ============================================

export const localStorageApi = {
  /**
   * Get all custom rockets from local storage
   */
  getCustomRockets(): CustomRocket[] {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      console.error('Failed to parse custom rockets from localStorage')
      return []
    }
  },

  /**
   * Save custom rockets to local storage
   */
  saveCustomRockets(rockets: CustomRocket[]): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rockets))
  },

  /**
   * Add a new custom rocket to local storage
   */
  addCustomRocket(form: NewRocketForm): CustomRocket {
    const rockets = this.getCustomRockets()
    const newRocket: CustomRocket = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: form.name,
      description: form.description,
      flickr_images: form.imageUrl ? [form.imageUrl] : [],
      cost_per_launch: form.cost_per_launch || 0,
      country: form.country,
      first_flight: form.first_flight,
      isCustom: true,
    }
    rockets.push(newRocket)
    this.saveCustomRockets(rockets)
    return newRocket
  },

  /**
   * Update a custom rocket in local storage
   */
  updateCustomRocket(id: string, form: NewRocketForm): CustomRocket | null {
    const rockets = this.getCustomRockets()
    const index = rockets.findIndex((r) => r.id === id)
    
    if (index === -1) return null

    const updatedRocket: CustomRocket = {
      ...rockets[index],
      name: form.name,
      description: form.description,
      flickr_images: form.imageUrl ? [form.imageUrl] : rockets[index].flickr_images,
      cost_per_launch: form.cost_per_launch || 0,
      country: form.country,
      first_flight: form.first_flight,
    }

    rockets[index] = updatedRocket
    this.saveCustomRockets(rockets)
    return updatedRocket
  },

  /**
   * Delete a custom rocket from local storage
   */
  deleteCustomRocket(id: string): boolean {
    const rockets = this.getCustomRockets()
    const filtered = rockets.filter((r) => r.id !== id)
    
    if (filtered.length === rockets.length) return false
    
    this.saveCustomRockets(filtered)
    return true
  },

  /**
   * Get a single custom rocket by ID
   */
  getCustomRocketById(id: string): CustomRocket | null {
    const rockets = this.getCustomRockets()
    return rockets.find((r) => r.id === id) || null
  },
}

// ============================================
// SpaceX API Operations
// ============================================

export const rocketApi = {
  /**
   * Get all rockets
   */
  async getAllRockets(): Promise<Rocket[]> {
    const response = await apiClient.get<Rocket[]>('/rockets')
    return response.data
  },

  /**
   * Query rockets with filters using POST /rockets/query
   * Uses MongoDB-style query syntax
   */
  async queryRockets(params: RocketQueryParams): Promise<Rocket[]> {
    // Build MongoDB query
    const query: Record<string, unknown> = {}

    // Search filter - use $or for searching in multiple fields with regex
    if (params.search) {
      const searchRegex = { $regex: params.search, $options: 'i' }
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
      ]
    }

    // Country filter - exact match
    if (params.country) {
      query.country = params.country
    }

    const options: QueryOptions = {
      pagination: false, // Return all matching docs
      sort: { name: 1 }, // Sort by name ascending
    }

    const response = await apiClient.post<QueryResponse<Rocket>>('/rockets/query', {
      query,
      options,
    })

    return response.data.docs
  },

  /**
   * Get single rocket by ID
   */
  async getRocketById(id: string): Promise<Rocket> {
    const response = await apiClient.get<Rocket>(`/rockets/${id}`)
    return response.data
  },

  /**
   * Get all unique countries from rockets
   */
  async getCountries(): Promise<string[]> {
    const response = await apiClient.post<QueryResponse<{ country: string }>>('/rockets/query', {
      query: {},
      options: {
        select: { country: 1 },
        pagination: false,
      },
    })

    const countries = [...new Set(response.data.docs.map((r) => r.country))]
    return countries.sort()
  },

  // ============================================
  // Write Operations (Requires API Key)
  // ============================================

  /**
   * Create a new rocket via API
   * Requires spacex-key header
   */
  async createRocket(payload: RocketPayload): Promise<Rocket> {
    if (!hasApiKey()) {
      throw new Error('API key not configured. Using local storage instead.')
    }

    const response = await apiClientWithAuth.post<Rocket>('/rockets', payload)
    return response.data
  },

  /**
   * Update a rocket via API
   * Requires spacex-key header
   */
  async updateRocket(id: string, payload: Partial<RocketPayload>): Promise<Rocket> {
    if (!hasApiKey()) {
      throw new Error('API key not configured. Using local storage instead.')
    }

    const response = await apiClientWithAuth.patch<Rocket>(`/rockets/${id}`, payload)
    return response.data
  },

  /**
   * Delete a rocket via API
   * Requires spacex-key header
   */
  async deleteRocket(id: string): Promise<void> {
    if (!hasApiKey()) {
      throw new Error('API key not configured. Using local storage instead.')
    }

    await apiClientWithAuth.delete(`/rockets/${id}`)
  },
}

export default apiClient
