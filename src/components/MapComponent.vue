<template>
  <div class="map-wrapper">
    <mapbox-map
      :key="activeStyleUri"
      v-model:map="mapInstance"
      :access-token="accessToken"
      :map-style="activeStyleUri"
      @mb-created="onMapCreated"
      @mb-moveend="onMoveEnd"
      @mb-zoomend="onMoveEnd"
    >
      <MapLayer v-for="layer in mapboxLayers" :key="layer.id" :layer="layer" @click="onFeatureClick" />
      <MapPaintControl />
      <MapboxGeocoder />

      <FeaturePropertiesDialog
        v-model="showDialog"
        :feature="showDialogFeature"
      />

      <MapboxNavigationControl position="bottom-right" />
      <div class="map-controls">
        <BasemapControl v-model:active-style="activeStyleTitle" :styles="MAP_BASELAYERS" />
      </div>
    </mapbox-map>
  </div>
</template>

<script setup>
  import { MapboxGeocoder, MapboxMap, MapboxNavigationControl } from '@studiometa/vue-mapbox-gl'
  import { computed, ref } from 'vue'
  import { MAP_BASELAYER_DEFAULT, MAP_BASELAYERS } from '@/lib/constants'
  import { useMapStore } from '@/stores/map'
  import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

  const mapStore = useMapStore()
  const mapboxLayers = computed(() => mapStore.mapboxLayers)

  const accessToken = import.meta.env.VITE_MAPBOX_TOKEN
  const mapInstance = ref(null)
  const showDialogFeature = ref(null)
  const showDialog = ref(false)

  const activeStyleTitle = ref(MAP_BASELAYER_DEFAULT.title)
  const activeStyleUri = computed(() => MAP_BASELAYERS.find(style => style.title === activeStyleTitle.value).uri)

  function onMapCreated (map) {
    mapInstance.value = map

    _boundingBox.value && map.fitBounds(_boundingBox.value, { duration: 0 })
  }

  function onFeatureClick (features) {
    showDialogFeature.value = features
    showDialog.value = true
  }

  const _boundingBox = ref(null)

  function onMoveEnd (e) {
    _boundingBox.value = e.target.getBounds()
  }
</script>

<style>
.map-wrapper,
.map-wrapper .mapboxgl-map {
  width: 100%;
  height: 100%;
  position: relative;
}

.map-controls {
  position: absolute;
  bottom: 120px;
  right: 10px;
  z-index: 1000;
}
</style>
