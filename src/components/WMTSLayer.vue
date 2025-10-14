<template>
</template>

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
  layerType: {
    type: String,
    default: "fill",
    validator: (value) => ["fill", "line", "circle", "symbol"].includes(value),
  },
  sourceLayer: {
    type: String,
    default: null,
  },
  onFeatureClick: {
    type: Function,
    default: () => {},
  },
  baseUrl: String
});



// Convert WMTS to XYZ tile format for Mapbox GL JS (Vector Tiles)
function getWMTSTileUrl(layerName) {
  return `${props.baseUrl}?service=WMTS&request=GetTile&version=1.0.0&layer=${layerName}&style=&tilematrixset=EPSG:900913&tilematrix=EPSG:900913:{z}&tilerow={y}&tilecol={x}&format=application/vnd.mapbox-vector-tile`;
}

const sourceId = `wmts-${props.layerName.replace(":", "-")}`;
const layerId = `${sourceId}-layer`;

// Add WMTS layer to map
watch(
  () => props.map,
  (map) => {
    if (!map || !map.isStyleLoaded()) return;

    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }

    map.addSource(sourceId, {
      type: "vector",
      tiles: [getWMTSTileUrl(props.layerName)],
      minZoom: 0,
      maxZoom: 22,
    });

    // Add vector layer
    const layerConfig = {
      id: layerId,
      type: props.layerType,
      source: sourceId,
      "source-layer": sourceId,
      layout: {
        visibility: props.visible ? "visible" : "none",
      },
    };

    // Add source-layer if specified
    if (props.sourceLayer) {
      layerConfig["source-layer"] = props.sourceLayer;
    }

    // Configure paint properties based on layer type
    if (props.layerType === "fill") {
      layerConfig.paint = {
        "fill-opacity": props.opacity,
        "fill-color": "#007cbf",
      };
    } else if (props.layerType === "line") {
      layerConfig.paint = {
        "line-opacity": props.opacity,
        "line-color": "#007cbf",
        "line-width": 3,
      };
    } else if (props.layerType === "circle") {
      layerConfig.paint = {
        "circle-opacity": props.opacity,
        "circle-color": "#007cbf",
        "circle-radius": 5,
      };
    }

    map.addLayer(layerConfig);

    map.on("click", layerId, async (e) => {
      if (e.features && e.features.length > 0) {
        props.onFeatureClick(e.features);
      }
    });

    map.on("mouseenter", layerId, () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", layerId, () => {
      map.getCanvas().style.cursor = "";
    });

    console.log(
      `🗺️ WMTS vector layer added: ${props.layerName} (${props.layerType})`
    );
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

    // Set appropriate opacity property based on layer type
    if (props.layerType === "fill") {
      props.map.setPaintProperty(layerId, "fill-opacity", opacity);
    } else if (props.layerType === "line") {
      props.map.setPaintProperty(layerId, "line-opacity", opacity);
    } else if (props.layerType === "circle") {
      props.map.setPaintProperty(layerId, "circle-opacity", opacity);
    }
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
