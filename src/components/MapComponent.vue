<script setup>
import { MapboxMap, MapboxGeocoder, MapboxNavigationControl } from "@studiometa/vue-mapbox-gl";
import { ref, computed } from "vue";
import WMTSLayer from "@/components/WMTSLayer.vue";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { MAP_BASELAYERS, MAP_BASELAYER_DEFAULT } from '@/lib/constants'

const accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
const mapInstance = ref(null);
const showDialogFeature = ref(null);
const showDialog = ref(false);

const baseUrl = import.meta.env.VITE_WMTS_URL;

function onMapCreated(map) {
  mapInstance.value = map;
}

function onFeatureClick(features) {
  showDialogFeature.value = features[0];
  showDialog.value = true;
}

const activeStyleTitle = ref(MAP_BASELAYER_DEFAULT.title)
const activeStyleUri = computed(() => MAP_BASELAYERS.find(style => style.title === activeStyleTitle.value).uri)
</script>

<template>
  <div class="map-wrapper">
    <mapbox-map
      :key="activeStyleUri"
      v-model:map="mapInstance"
      :access-token="accessToken"
      :center="[2.5, 52.0]"
      :map-style="activeStyleUri"
      :zoom="5.5"
      @mb-created="onMapCreated"
    >
      <MapboxGeocoder />


      <WMTSLayer
        :map="mapInstance"
        layer-name="shoreline-monitor:gctr"
        :visible="true"
        :opacity="0.8"
        layer-type="line"
        source-layer="gctr"
        :base-url="baseUrl"
        @feature-click="onFeatureClick"
      />

      <FeaturePropertiesDialog
        v-model="showDialog"
        :feature="showDialogFeature"
      />

      <MapboxNavigationControl :show-compass="false" position="bottom-right" />

      <div class="map-controls">
        <BasemapControl :styles="MAP_BASELAYERS" v-model:active-style="activeStyleTitle" />
      </div>

    </mapbox-map>
  </div>
</template>

<style>
.map-wrapper,
.map-wrapper .mapboxgl-map {
  width: 100%;
  height: 100%;
  position: relative;
}

.map-controls {
  position: absolute;
  bottom: 90px;  
  right: 10px;  
  z-index: 1000;
}
</style>
