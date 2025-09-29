<template>
  <div class="layer-control">
    <v-card>
      <v-card-title class="text-subtitle-2">
        <v-icon left small>mdi-layers</v-icon>
        Lagen
      </v-card-title>
      <v-card-text class="pa-2">
        <div class="layer-item">
          <v-checkbox
            v-model="gctrVisible"
            density="compact"
            hide-details
            label="GCTR"
          />
          <v-slider
            v-model="gctrOpacity"
            :disabled="!gctrVisible"
            density="compact"
            hide-details
            max="1"
            min="0"
            step="0.1"
            thumb-label
            class="opacity-slider"
          />
        </div>

        <div class="layer-item">
          <v-checkbox
            v-model="shorelinesVisible"
            density="compact"
            hide-details
            label="Shorelines"
          />
          <v-slider
            v-model="shorelinesOpacity"
            :disabled="!shorelinesVisible"
            density="compact"
            hide-details
            max="1"
            min="0"
            step="0.1"
            thumb-label
            class="opacity-slider"
          />
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Layer visibility and opacity controls
const gctrVisible = ref(true);
const gctrOpacity = ref(0.8);
const shorelinesVisible = ref(true);
const shorelinesOpacity = ref(0.8);

// Expose the reactive values for parent component
defineExpose({
  gctrVisible,
  gctrOpacity,
  shorelinesVisible,
  shorelinesOpacity,
});
</script>

<style scoped>
.layer-control {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  min-width: 250px;
}

.layer-item {
  margin-bottom: 12px;
}

.layer-item:last-child {
  margin-bottom: 0;
}

.opacity-slider {
  margin-top: 4px;
  margin-left: 32px;
}
</style>
