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
      <div class="map-info" :class="{ collapsed: infoCollapsed }">
        <div v-if="!infoCollapsed" class="map-info__panel">
          <div class="map-info__header">
            <span class="map-info__title">Long-term Shoreline Changes (1984-2024)</span>
            <button
              class="map-info__close"
              type="button"
              title="Hide information"
              @click="infoCollapsed = true"
            >
              <span class="mdi mdi-window-minimize" aria-hidden="true"></span>
            </button>
          </div>
          <p class="map-info__body">
            The bars represent the erosion/accretion along coasts, every 100m, over the period 1984-2024. Green bars indicate where the shoreline has advanced (natural accretion, land reclamation, nourishments). Red bars indicate retreating (eroding) shorelines, based on a linear fit through annual shoreline positions. If you zoom in, you can click on a profile to see a time series chart and transect characteristics. More information can be found on <a href="https://shorelinemonitor.earth" target="_blank" rel="noopener">https://shorelinemonitor.earth</a>
          </p>
          <img src="/legend-static.png" alt="Legend: Retreat to Advance" class="map-info__legend" />
        </div>
        <button
          v-else
          class="map-info__toggle mapboxgl-ctrl"
          type="button"
          title="Show information"
          @click="infoCollapsed = false"
        >
          <span class="mdi mdi-information-outline" aria-hidden="true"></span>
        </button>
      </div>
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
  const infoCollapsed = ref(false)

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

.map-info {
  position: absolute;
  right: 10px;
  bottom: 160px;
  z-index: 1000;
  max-width: 280px;
}

.map-info.collapsed {
  bottom: 160px;
}

.map-info__panel {
  background: rgba(255, 255, 255);
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  padding: 12px 12px 14px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.map-info__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  gap: 8px;
}

.map-info__title {
  font-weight: 600;
  font-size: 14px;
}

.map-info__close {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 4px 6px;
}

.map-info__body {
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
}

.map-info__legend {
  width: 90%;
  height: auto;
  margin-top: 8px;
  display: block;
  margin-inline: auto;
}

.map-info__toggle {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  background-color: white;
  outline: 0;
  border: 0;
  border-radius: 4px;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  font-weight: 700;
  cursor: pointer;
}

.map-info__toggle:hover {
  background-color: #f2f2f2;
}

.map-info__toggle .mdi {
  font-size: 22px;
  line-height: 1;
}
</style>
