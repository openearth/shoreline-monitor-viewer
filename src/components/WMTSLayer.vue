<template></template>

<script setup>
import { watch, onUnmounted } from "vue";

const props = defineProps({
  map: Object,
  layerName: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  opacity: {
    type: Number,
    default: 1,
  },
});

const baseUrl = "https://nl2120.openearth.nl/geoserver/gwc/service/wmts";

// Convert WMTS to XYZ tile format for Mapbox GL JS
function getWMTSTileUrl(layerName) {
  return `${baseUrl}?service=WMTS&request=GetTile&version=1.0.0&layer=${layerName}&style=&tilematrixset=EPSG:900913&tilematrix=EPSG:900913:{z}&tilerow={y}&tilecol={x}&format=image/png`;
}

const sourceId = `wmts-${props.layerName.replace(":", "-")}`;
const layerId = `${sourceId}-layer`;

// Add WMTS layer to map
watch(
  () => props.map,
  (map) => {
    if (!map || !map.isStyleLoaded()) return;

    // Remove existing layer and source if they exist
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }

    // Add new WMTS source
    map.addSource(sourceId, {
      type: "raster",
      tiles: [getWMTSTileUrl(props.layerName)],
      tileSize: 256,
    });

    // Add raster layer
    map.addLayer({
      id: layerId,
      type: "raster",
      source: sourceId,
      paint: {
        "raster-opacity": props.opacity,
      },
      layout: {
        visibility: props.visible ? "visible" : "none",
      },
    });

    console.log(`🗺️ WMTS layer added: ${props.layerName}`);
  },
  { immediate: true }
);

// Watch visibility changes
watch(
  () => props.visible,
  (visible) => {
    if (!props.map || !props.map.getLayer(layerId)) return;

    props.map.setLayoutProperty(
      layerId,
      "visibility",
      visible ? "visible" : "none"
    );
  }
);

// Watch opacity changes
watch(
  () => props.opacity,
  (opacity) => {
    if (!props.map || !props.map.getLayer(layerId)) return;

    props.map.setPaintProperty(layerId, "raster-opacity", opacity);
  }
);

// Cleanup on unmount
onUnmounted(() => {
  if (!props.map) return;

  if (props.map.getLayer(layerId)) {
    props.map.removeLayer(layerId);
  }
  if (props.map.getSource(sourceId)) {
    props.map.removeSource(sourceId);
  }
});
</script>
