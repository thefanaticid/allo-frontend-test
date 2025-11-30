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

export const rocketApi = {
  /**
   * Get all rockets
   */
  async getAllRockets(): Promise<Rocket[]> {
    const response = await apiClient.get<Rocket[]>('/rockets')
    return response.data
  },

  /**
   * Get single rocket by ID
   */
  async getRocketById(id: string): Promise<Rocket> {
    const response = await apiClient.get<Rocket>(`/rockets/${id}`)
    return response.data
  },
}

export default apiClient
