<template>
  <v-dialog v-model="dialog" width="65vw">
    <v-card>
      <div class="dialog-scroll" style="position: relative; height: 460px; width: 100%;">
        <div class="dialog-inner">
          <iframe
            v-if="timeseriesDataUrl"
            class="px-5 py-2"
            frameborder="0"
            height="580px"
            :src="timeseriesDataUrl"
            width="95%"
            @load="iframeLoaded = true"
          />
        </div>
        <div v-if="!iframeLoaded" style="position: absolute; top: 0; left: 0; height: 600px; right: 0; bottom: 0; display: flex; justify-content: center; align-items: center; width: 100%;">
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
.dialog-scroll {
  overflow-x: hidden;
  overflow-y: hidden;
}

.dialog-inner {
  width: 90vw;
}
</style>
