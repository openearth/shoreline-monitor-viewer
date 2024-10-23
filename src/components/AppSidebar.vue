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
        "id": "chw2-vector",
        "name": "chw2-vector",
        "children": [
          {
            "id": "coastal_flooding",
            "name": "coastal_flooding",
            "layer": "chw2-vector:coast_segments_flooding",
            "url": "https://coastalhazardwheel.avi.deltares.nl/geoserver/ows"
          },
          {
            "id": "coast_segments_erosion",
            "name": "coast_segments_erosion",
            "layer": "chw2-vector:coast_segments_erosion",
            "url": "https://coastalhazardwheel.avi.deltares.nl/geoserver/ows"
          },
          {
            "id": 'macroinvertebraten_uit_aquadesk_api',
            "name": 'Macroinvertebraten uit Aquadesk API',
            "layer": 'wie_ddecoapi:macroinvertebrates',
            "url": 'https://rwsprojectarchief.openearth.nl/geoserver/ows'
          },
        ]
      }
    ]
  }),
  methods: {
    ...mapMutations(['map/setWmsLayers']),

    onActiveLayerChange(event) {
      this['map/setWmsLayers'](event)
    },

    onLayerSortingChange(sortedLayers) {
      this.layers = sortedLayers;
    },
  }
};


</script>