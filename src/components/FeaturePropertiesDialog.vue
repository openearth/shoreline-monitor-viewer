<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <div>
        <iframe v-if="timeseriesDataUrl" :src="timeseriesDataUrl" width="100%" height="400px" frameborder="0" />
        <v-skeleton v-if="loading" type="table-row" />
      </div>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="closeDialog">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from "vue";
import getTimeSeries from "@/lib/get-timeseries-data";

const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
  feature: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue"]);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const loading = ref(false);
const timeseriesDataUrl = ref(null);

watch(() => props.feature, fetchGraph, { immediate: true });

async function fetchGraph() {
  loading.value = true;
  if (!props.feature) return;

  const result  = await getTimeSeries(props.feature.id);
  timeseriesDataUrl.value = result.url;
  loading.value = false;
}

const closeDialog = () => {
  dialog.value = false;
};
</script>
