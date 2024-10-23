<template>
  <v-navigation-drawer
    clipped
    app
    permanent
    width="360"
  >
  <layer-list-controls
      :layers="layers"
      @active-layers-change="onActiveLayerChange"
      @layer-sorting-change="onLayerSortingChange"
    />
  </v-navigation-drawer>
</template>

<script>

import { mapMutations } from 'vuex'
import LayerListControls from './LayerListControls';

export default {
  components: {
    LayerListControls,
  },
  data: () => ({
    layers: [
      {
        id: "chw2-vector",
        title: "Test group",
        children: [
          {
            id: "coastal_flooding",
            title: "Coastal flooding (chw)",
            layer: "chw2-vector:coast_segments_flooding",
            url: "https://coastalhazardwheel.avi.deltares.nl/geoserver/ows"
          },
          {
            id: "coast_segments_erosion",
            title: "Coast erosion (chw)",
            layer: "chw2-vector:coast_segments_erosion",
            url: "https://coastalhazardwheel.avi.deltares.nl/geoserver/ows"
          },
          {
            id: 'macroinvertebraten_uit_aquadesk_api',
            title: 'Macroinvertebraten uit Aquadesk API',
            layer: 'wie_ddecoapi:macroinvertebrates',
            url: 'https://rwsprojectarchief.openearth.nl/geoserver/ows'
          },
        ]
      }
    ]
  }),
  methods: {
    ...mapMutations("map", ["setWmsLayers"]),

    onActiveLayerChange(event) {
      this.setWmsLayers(event)
    },

    onLayerSortingChange(sortedLayers) {
      this.layers = sortedLayers;
    },
  }
};


</script>