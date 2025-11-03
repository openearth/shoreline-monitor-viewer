// stores/map.js
import { defineStore } from 'pinia'
import layersConfig from '@/data/layers-config.json'
import buildMapboxLayer from '@/lib/build-mapbox-layer'

export const useMapStore = defineStore('map', {
  state: () => ({
    layersConfig,
    mapboxLayers: [],
  }),
  actions: {
    initializeMapboxLayers () {
      this.mapboxLayers = this.layersConfig
        .map(layerConfig => buildMapboxLayer(layerConfig))
        .filter(layer => layer != null)
    },
  },
})
