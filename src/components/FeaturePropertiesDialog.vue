<template>
  <v-dialog v-model="dialog" width="65vw">
    <v-card>
      <div class="dialog-frame">
        <iframe
          v-if="timeseriesDataUrl"
          class="timeseries-iframe"
          frameborder="0"
          :src="timeseriesDataUrl"
          @load="iframeLoaded = true"
        />
        <div v-if="!iframeLoaded" class="dialog-spinner">
          <Spinner />
        </div>
      </div>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="text" @click="feedbackDialog = true">
          Submit your feedback
        </v-btn>
        <v-btn color="primary" variant="text" @click="closeDialog">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="feedbackDialog" width="480">
      <v-card>
        <FeedbackForm :feature="props.feature" :profile-id="props.feature?.id ?? null" />

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" variant="text" @click="feedbackDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'
  import FeedbackForm from '@/components/FeedbackForm.vue'
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
  const feedbackDialog = ref(false)

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
.dialog-frame {
  position: relative;
  width: 100%;
  height: 520px;
}

.timeseries-iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

.dialog-spinner {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
