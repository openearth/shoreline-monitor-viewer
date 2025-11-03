<template>
  <div class="map-wrapper">
    <mapbox-map
      v-model:map="mapInstance"
      :access-token="accessToken"
      :center="[2.5, 52.0]"
      map-style="mapbox://styles/mapbox/light-v11"
      :zoom="5.5"
      @mb-created="onMapCreated"
    >
      <MapLayer v-for="layer in mapboxLayers" :key="layer.id" :layer="layer" />
      <!-- <WMTSLayer
        :base-url="baseUrl"
        layer-name="shoreline-monitor:gctr"
        layer-type="line"
        :map="mapInstance"
        :opacity="0.8"
        source-layer="gctr"
        :visible="true"
        @feature-click="onFeatureClick"
      /> -->

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

/*   function onFeatureClick (features) {
    showDialogFeature.value = features[0]
    showDialog.value = true
  } */

</script>

<style>
.map-wrapper,
.map-wrapper .mapboxgl-map {
  width: 100%;
  height: 100%;
}
</style>
