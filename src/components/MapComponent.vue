<script setup>
import { MapboxMap } from "@studiometa/vue-mapbox-gl";
import { ref } from "vue";
import WMTSLayer from "@/components/WMTSLayer.vue";

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
      :center="[5.1, 52.07]"
      map-style="mapbox://styles/mapbox/light-v11"
      :zoom="10.5"
      @mb-created="onMapCreated"
    >
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
