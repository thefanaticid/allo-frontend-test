/**
 * API Service for SpaceX Rockets
 */

import axios from 'axios'
import type { Rocket } from '@/types/rocket'

const API_BASE_URL = 'https://api.spacexdata.com/v4'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
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
}

export default apiClient
