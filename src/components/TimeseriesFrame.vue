<template>
  <div class="timeseries-frame">
    <iframe
      v-if="url"
      class="timeseries-iframe"
      frameborder="0"
      :src="url"
      @load="loaded = true"
    />
    <div v-if="!loaded" class="timeseries-spinner">
      <Spinner />
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import Spinner from '@/components/Spinner.vue'
  import getTimeSeries from '@/lib/get-timeseries-data'

  const props = defineProps({
    profileId: {
      type: [Number, String],
      required: true,
    },
  })

  const url = ref(null)
  const loaded = ref(false)

  // The parent mounts a new instance per profile, so a late response only updates a discarded instance
  getTimeSeries(props.profileId).then(result => {
    url.value = result.url
  })
</script>

<style scoped>
.timeseries-frame {
  position: relative;
  width: 100%;
  height: 100%;
}

.timeseries-iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

.timeseries-spinner {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
