// stores/locations.js
import { defineStore } from 'pinia'
import getLocationsData from '@/lib/get-locations-data'

export const useLocationsStore = defineStore('locations', {
  state: () => ({
    locations: [],
    activeLocation: null,
  }),
  actions: {
    async fetchLocations () {
      try {
        const { features } = await getLocationsData()
        this.locations = features
      } catch (error) {
        console.error('Failed to fetch locations:', error)
      }
    },
    setActiveLocation (feature) {
      this.activeLocation = feature

      // Convert to plain object for logging
      const plainFeature = JSON.parse(JSON.stringify(feature))
      console.log('this.activeLocation (plain)', plainFeature)
    },
  },
})
