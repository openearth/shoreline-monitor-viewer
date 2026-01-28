<template>
  <v-dialog v-model="dialog" width="60vw">
    <v-card>
      <div class="dialog-scroll" style="position: relative; height: 460px; width: 100%;">
        <div class="dialog-inner">
          <iframe
            v-if="timeseriesDataUrl"
            frameborder="0"
            height="500px"
            :src="timeseriesDataUrl"
            width="100%"
            @load="iframeLoaded = true"
          />
        </div>
        <div v-if="!iframeLoaded" style="position: absolute; top: 0; left: 0; height: 600px; right: 0; bottom: 0; display: flex; justify-content: center; align-items: center; width: 100%;">
          <Spinner />
        </div>
      </div>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="text" @click="closeDialog">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'
  import Spinner from '@/components/Spinner.vue'
  import getTimeSeries from '@/lib/get-timeseries-data'

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: null,
    },
    feature: {
      type: Object,
      default: () => ({}),
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const dialog = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })

  const timeseriesDataUrl = ref(null)
  const iframeLoaded = ref(false)

  watch(() => props.feature, () => {
    iframeLoaded.value = false
    fetchGraph()
  }, { immediate: true })

  async function fetchGraph () {
    if (!props.feature) return

    const result = await getTimeSeries(props.feature.id)
    timeseriesDataUrl.value = result.url
  }

  function closeDialog () {
    dialog.value = false
  }
</script>

<style scoped>
.dialog-scroll {
  overflow-x: hidden;
  overflow-y: hidden;
}

.dialog-inner {
  width: 90vw;
}
</style>
