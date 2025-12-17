<template>
  <v-container fluid class="pa-0 full-height">
    <v-row no-gutters class="full-height">
      <v-col cols="12" md="5" class="left-pane">
        <map-component
          :enable-feature-dialog="false"
          @feature-selected="onFeatureSelected"
        />
      </v-col>
      <v-col cols="12" md="7" class="right-pane">
        <div class="panel">
          <div class="panel__header">
            <div class="text-subtitle-1 font-weight-medium">Transect stats</div>
            <div v-if="selectedId" class="text-caption text-medium-emphasis">ID: {{ selectedId }}</div>
          </div>
          <div class="panel__body panel__center" v-if="loading">
            <Spinner />
          </div>
          <div class="panel__body panel__error" v-else-if="error">
            {{ error }}
          </div>
          <div class="panel__body panel__iframe" v-else-if="statsUrl">
            <iframe
              :src="statsUrl"
              frameborder="0"
              width="100%"
              height="100%"
              @load="onIframeLoad"
            />
            <div v-if="!iframeLoaded" class="panel__overlay">
              <Spinner />
            </div>
          </div>
          <div class="panel__body text-medium-emphasis" v-else>
            Click a transect on the map to load statistics.
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { useMapStore } from '@/stores/map'
  import getStatsData from '@/lib/get-stats-data'
  import Spinner from '@/components/Spinner.vue'

  const mapStore = useMapStore()
  const statsUrl = ref('')
  const loading = ref(false)
  const error = ref('')
  const selectedId = ref('')
  const iframeLoaded = ref(false)

  onMounted(() => {
    mapStore.initializeMapboxLayers()
  })

  async function onFeatureSelected (feature) {
    if (!feature || !feature.id) return

    selectedId.value = feature.id
    statsUrl.value = ''
    error.value = ''
    loading.value = true
    iframeLoaded.value = false

    try {
      const response = await getStatsData(feature.id)
      const payload = typeof response === 'object' ? response : JSON.parse(response)
      statsUrl.value = payload?.url || ''
      if (!statsUrl.value) {
        throw new Error('Stats response did not include a url')
      }
    } catch (err) {
      error.value = 'Failed to load stats'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  function onIframeLoad () {
    iframeLoaded.value = true
  }
</script>

<style scoped>
.full-height {
  height: calc(100vh - 64px);
}

.left-pane,
.right-pane {
  height: 100%;
  background: #f8f9fb;
  padding: 16px;
  overflow: hidden;
}

.panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel__header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding-bottom: 8px;
}

.panel__body {
  flex: 1 1 auto;
  overflow: hidden;
  font-family: 'Roboto', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 14px;
  line-height: 1.4;
}

.panel__center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel__error {
  color: #b00020;
}

.panel__iframe {
  position: relative;
  padding: 0;
  overflow: hidden;
}

.panel__iframe iframe {
  width: calc(100% / 0.85);
  height: calc(100% / 0.85);
  transform: scale(0.85);
  transform-origin: top left;
  border: 0;
}

.panel__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
}
</style>
