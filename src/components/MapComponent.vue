<template>
  <div class="map-wrapper">
    <mapbox-map
      v-model:map="mapInstance"
      :access-token="accessToken"
      :center="[0,0]"
      map-style="mapbox://styles/mapbox/light-v11"
      :zoom="1"
      @mb-created="onMapCreated"
    >
      <MapLayer v-for="layer in mapboxLayers" :key="layer.id" :layer="layer" @click="onFeatureClick" />

      <FeaturePropertiesDialog
        v-model="showDialog"
        :feature="showDialogFeature"
      />
    </mapbox-map>
  </div>
</template>

<script setup>
  import { MapboxMap } from '@studiometa/vue-mapbox-gl'
  import { computed, ref } from 'vue'
  import { useMapStore } from '@/stores/map'

  const mapStore = useMapStore()
  const mapboxLayers = computed(() => mapStore.mapboxLayers)

  const accessToken = import.meta.env.VITE_MAPBOX_TOKEN
  const mapInstance = ref(null)
  const showDialogFeature = ref(null)
  const showDialog = ref(false)

  // const baseUrl = import.meta.env.VITE_WMTS_URL

  function onMapCreated (map) {
    mapInstance.value = map
  }
  // was the previous click event of the layer
  function onFeatureClick (features) {
    showDialogFeature.value = features
    showDialog.value = true
  }

</script>

<style>
.map-wrapper,
.map-wrapper .mapboxgl-map {
  width: 100%;
  height: 100%;
}
</style>
