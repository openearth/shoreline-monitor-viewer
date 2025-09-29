<template>

</template>

<script setup>
  import { computed, watch } from 'vue'
  import { useAppStore } from '@/stores/app'
  import { useLocationsStore } from '@/stores/locations'

  const props = defineProps({
    map: Object,
  })

  const locationsStore = useLocationsStore()
  const appStore = useAppStore()
  const sourceId = 'locations-source'
  const layerId = 'locations-layer'

  const geojson = computed(() => ({
    type: 'FeatureCollection',
    features: locationsStore.locations,
  }))

  const panelIsCollapsed = computed(() => appStore.panelIsCollapsed)

  watch(
    () => locationsStore.locations,
    locations => {
      const map = props.map
      const sourceId = 'locations-source'
      const layerId = 'locations-layer'

      if (!map || !map.isStyleLoaded() || locations.length === 0) return

      const geojson = {
        type: 'FeatureCollection',
        features: locations,
      }

      if (map.getSource(sourceId)) {
        map.getSource(sourceId).setData(geojson)
        console.log('🔄 Locations layer updated')
      } else {
        if (map.getLayer(layerId)) return
        map.addSource(sourceId, { type: 'geojson', data: geojson })
        map.addLayer({
          id: layerId,
          type: 'circle',
          source: sourceId,
          paint: {
            'circle-color': '#fff',
            'circle-radius': 5,
            'circle-stroke-width': 5,
            'circle-stroke-color': '#008fc5',
          },
        })
        console.log('🗺️ Locations layer added')

        map.addSource('active-location', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] },
        })
        map.addLayer({
          id: 'active-location-layer',
          type: 'circle',
          source: 'active-location',
          paint: {
            'circle-color': '#fff',
            'circle-radius': 5,
            'circle-stroke-width': 5.5,
            'circle-stroke-color': '#ff0000',
          },
        })
      }

      map.on('click', 'locations-layer', e => {
        const feature = e.features?.[0]
        if (feature) {
          console.log('Location clicked:', feature.properties)
          locationsStore.setActiveLocation(feature)
          appStore.expandPanel()

          const coords = feature.geometry.coordinates
          const canvas = map.getCanvas()
          const offsetY = canvas.height * 0.25

          map.flyTo({
            center: coords,
            zoom: 12.5,
            speed: 1.2,
            offset: [0, -offsetY],
          })
        }
      })

      map.on('mouseenter', 'locations-layer', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'locations-layer', () => {
        map.getCanvas().style.cursor = ''
      })
    },
    { immediate: true },
  )

  watch(
    () => locationsStore.activeLocation,
    activeLocation => {
      const map = props.map
      if (!map || !map.getSource('active-location')) return

      if (activeLocation) {
        const plainFeature = JSON.parse(JSON.stringify(activeLocation))
        map.getSource('active-location').setData({
          type: 'FeatureCollection',
          features: [plainFeature],
        })
      } else {
        map.getSource('active-location').setData({
          type: 'FeatureCollection',
          features: [],
        })
      }
    },
    { immediate: true },
  )
</script>
