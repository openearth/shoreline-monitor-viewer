<template>
  <v-container fluid class="pa-0 full-height">
    <v-row no-gutters class="full-height">
      <v-col cols="12" md="6" class="left-pane">
        <map-component />
      </v-col>
      <v-col cols="12" md="6" class="right-pane">
        <!-- Advanced tools will be added here -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { onMounted } from 'vue'
  import { useMapStore } from '@/stores/map'

  const mapStore = useMapStore()

  onMounted(() => {
    mapStore.initializeMapboxLayers()
  })
</script>

<style scoped>
.full-height {
  height: calc(100vh - 64px);
}

.left-pane,
.right-pane {
  height: 100%;
}
</style>
