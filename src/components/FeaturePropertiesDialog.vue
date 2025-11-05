<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <div style="position: relative; height: 400px;">
        <iframe
          v-if="timeseriesDataUrl"
          frameborder="0"
          height="400px"
          :src="timeseriesDataUrl"
          width="100%"
          @load="iframeLoaded = true"
        />
        <div v-if="!iframeLoaded" style="position: absolute; top: 0; left: 0; height: 400px; right: 0; bottom: 0; display: flex; justify-content: center; align-items: center; width: 100%;">
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
  import { computed } from 'vue'
  import getTimeSeries from '@/lib/get-timeseries-data'
  import Spinner from '@/components/Spinner.vue'

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
