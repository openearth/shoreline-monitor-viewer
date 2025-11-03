<script setup>
import { MapboxMap, MapboxGeocoder } from "@studiometa/vue-mapbox-gl";
import { ref } from "vue";
import WMTSLayer from "@/components/WMTSLayer.vue";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

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
</script>

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
    </mapbox-map>
  </div>
</template>

<style>
.map-wrapper,
.map-wrapper .mapboxgl-map {
  width: 100%;
  height: 100%;
}
</style>
