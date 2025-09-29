<script setup>
import { MapboxMap } from "@studiometa/vue-mapbox-gl";
import { ref } from "vue";
import WMTSLayer from "@/components/WMTSLayer.vue";
import { useLocationsStore } from "@/stores/locations";

const accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
const locationsStore = useLocationsStore();
const mapInstance = ref(null);

function onMapCreated(map) {
  console.log("📍 Map instance created", map);
  mapInstance.value = map;
  // Fetch locations after creation
  locationsStore.fetchLocations().then(() => {
    console.log("✅ Fetched locations", locationsStore.locations.length);
  });
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
        layer-name="shorelinemonitor:gctr"
        :visible="true"
        :opacity="0.8"
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
