<template>
  <MapboxMap
    style="height: 100%"
    access-token="pk.eyJ1IjoiZ2xvYmFsLWRhdGEtdmlld2VyIiwiYSI6ImNqdG9lYWQ3NTFsNWk0M3Fqb2Q5dXBpeWUifQ.3DvxuGByM33VNa59rDogWw"
    map-style="mapbox://styles/mapbox/streets-v11"
    :center="[0, 25]"
    :zoom="1.6" />
</template>

<script>
import { MapboxMap } from '@studiometa/vue-mapbox-gl';


export default {
  components: {
    MapboxMap
  },
}
</script>

<style scoped>
</style>
