<template>
  <MapboxLayer
    v-if="layer"
    :id="layer.id"
    :options="layer"
    @mb-click="onLayerClicked"
    @mb-mouseenter="onMouseenter"
    @mb-mouseleave="onMouseleave"
  />
</template>
<script>
  import { MapboxLayer, useMap } from '@studiometa/vue-mapbox-gl'

  import { unref } from 'vue'

  export default {
    components: {
      MapboxLayer,
    },
    props: {
      layer: {
        type: Object,
        default: () => {},
      },
    },
    mounted () {
      const { map } = useMap()
      this.map = map
    },
    methods: {
      onLayerClicked (e) {
        this.$emit('click', e.features[0])
      },
      onMouseenter () {
        unref(this.map).getCanvas().style.cursor = 'pointer'
      },
      onMouseleave () {
        unref(this.map).getCanvas().style.cursor = ''
      },
    },
  }
</script>
