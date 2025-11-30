/**
 * TypeScript interfaces for SpaceX Rocket API
 */

export interface RocketDimensions {
  meters: number | null
  feet: number | null
}

export interface RocketMass {
  kg: number
  lb: number
}

export interface RocketPayloadWeight {
  id: string
  name: string
  kg: number
  lb: number
}

export interface RocketEngine {
  isp: {
    sea_level: number
    vacuum: number
  }
  thrust_sea_level: RocketDimensions
  thrust_vacuum: RocketDimensions
  number: number
  type: string
  version: string
  layout: string | null
  engine_loss_max: number | null
  propellant_1: string
  propellant_2: string
  thrust_to_weight: number
}

export interface RocketFirstStage {
  thrust_sea_level: RocketDimensions
  thrust_vacuum: RocketDimensions
  reusable: boolean
  engines: number
  fuel_amount_tons: number
  burn_time_sec: number | null
}

export interface RocketSecondStage {
  thrust: RocketDimensions
  payloads: {
    composite_fairing: {
      height: RocketDimensions
      diameter: RocketDimensions
    }
    option_1: string
  }
  reusable: boolean
  engines: number
  fuel_amount_tons: number
  burn_time_sec: number | null
}

export interface RocketLandingLegs {
  number: number
  material: string | null
}

// Main Rocket interface from SpaceX API
export interface Rocket {
  id: string
  name: string
  type: string
  active: boolean
  stages: number
  boosters: number
  cost_per_launch: number
  success_rate_pct: number
  first_flight: string
  country: string
  company: string
  height: RocketDimensions
  diameter: RocketDimensions
  mass: RocketMass
  payload_weights: RocketPayloadWeight[]
  first_stage: RocketFirstStage
  second_stage: RocketSecondStage
  engines: RocketEngine
  landing_legs: RocketLandingLegs
  flickr_images: string[]
  wikipedia: string
  description: string
}

// Custom rocket (added by user)
export interface CustomRocket {
  id: string
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch: number
  country: string
  first_flight: string
  isCustom: true
}

// Combined type for display
export type RocketItem = Rocket | CustomRocket

// Form data for adding new rocket
export interface NewRocketForm {
  name: string
  description: string
  imageUrl: string
  cost_per_launch: number | null
  country: string
  first_flight: string
}

// Filter state
export interface RocketFilters {
  search: string
  country: string
}
