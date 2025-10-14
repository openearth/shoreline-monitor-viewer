<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-toolbar-title>Shoreline Monitor Application</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <map-component />
      <div class="app-panel" :class="{ collapsed: panelIsCollapsed }">
        <v-btn
          class="app-panel__minimize"
          flat
          icon
          title="Minimaliseer"
          @click="onClick"
        >
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
        <div class="details d-flex flex-row">
          <div class="details__column details__table">
            <h3 class="text-h6">
              Details meetlocatie {{ locationsStore.activeLocation?.properties?.locatie_id || '...' }}
            </h3>
            <v-table>
              <tbody>
                <tr>
                  <td>Naam</td>
                  <td>{{ locationsStore.activeLocation?.properties?.locatie_id || '...' }}</td>
                </tr>
                <tr>
                  <td>Coördinaten (EPSG:4326)</td>
                  <td>
                    {{ locationsStore.activeLocation?.geometry?.coordinates?.[0].toFixed(6) }},
                    {{ locationsStore.activeLocation?.geometry?.coordinates?.[1].toFixed(6) }}
                  </td>
                </tr>
                <tr>
                  <td>Beschikbare peilfilters</td>
                  <td>
                    <v-select
                      v-model="selectedPeilfilterId"
                      dense
                      hide-details
                      :items="peilfilterOptions"
                      outlined
                      style="max-width: 200px"
                    />
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>

          <div class="details__column details__chart">
            <TimeSeriesChart :peilfilter-id="selectedPeilfilterId" />
          </div>
        </div>
      </div>
    </v-main>
  </v-app>
</template>
<script setup>

  import { computed, ref, watch } from 'vue'
  import TimeSeriesChart from '@/components/TimeSeriesChart.vue'
  import { useAppStore } from '@/stores/app'
  import { useLocationsStore } from '@/stores/locations'

  const appStore = useAppStore()
  const locationsStore = useLocationsStore()

  const panelIsCollapsed = computed(() => appStore.panelIsCollapsed)

  function onClick () {
    appStore.collapsePanel()
  }

  const selectedPeilfilterId = ref(null)

  const peilfilterOptions = computed(() => {
    const ids = locationsStore.activeLocation?.properties?.peilfilter_ids
    if (!ids) return []
    return ids.split(',').map(id => id.trim())
  })

  // Update selectedPeilfilterId when activeLocation changes
  watch(() => locationsStore.activeLocation, newLocation => {
    if (newLocation) {
      const options = peilfilterOptions.value
      selectedPeilfilterId.value = options.length > 0 ? options[0] : null
    } else {
      selectedPeilfilterId.value = null
    }
  }, { immediate: true })

</script>

<style scoped>

.app-panel {
  position: fixed;
  z-index: 2;
  bottom: 0;
  width: 100%;
  height: 50vh;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 -2px 8px 0px rgba(0, 0, 0, .3);
  transition: transform 0.3s ease;
}

.app-panel.collapsed {
  transform: translateY(100%);
}

.app-panel__minimize {
  position: absolute;
  top: 0;
  right: 0;
  margin: 8px;
  z-index: 1;
}

.details {
  display: flex;
  gap: 24px;
  height: 100%;
  padding: 24px 0;
  overflow: hidden;
}

.details__column {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 24px;
  overflow: auto;
}

.details__column .text-h6 {
  margin-bottom: 16px;
}

.details__table {
  flex: 0 0 auto;
  width: 400px;
}

.details__chart {
  flex: 1 1 0;
  overflow: hidden;
  position: relative;
}

</style>
