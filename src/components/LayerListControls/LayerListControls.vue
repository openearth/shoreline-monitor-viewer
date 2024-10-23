<template>
  <div v-if="layersAreProvided" ref="root">
    <v-treeview
      v-model:open="openItems"
      selectable
      :items="layersWithParents"
      @input="setSelectedIds"
      :open-all="true"
    >
      <template v-slot:label="{ item, selected }">
        <div class="d-flex align-center">
          <span
            class="sortable-handle"
            :data-id="item.id"
            :data-parent-ids="item.parentIds.toString()"
          >{{ item.name }}</span>
          <v-btn
            v-if="item.layer && selected"
            icon
            class="ml-auto"
            @click="setActiveLegend(item.id)"
          >
            <v-icon>
              mdi-card-bulleted{{
                item.id === activeLegend ? '' : '-off'
              }}-outline
            </v-icon>
          </v-btn>
        </div>
      </template>
    </v-treeview>
  </div>
</template>

<script>
import { watch, ref, toRefs, computed } from 'vue'
import addIndex from './add-index'
import findInTree from './find-in-tree'
import addParentIdToLayers from './add-parent-id-to-layers'
import useLegend from './useLegend'
import useSelected from './useSelected'
import useSortable from './useSortable'
import { VTreeview } from 'vuetify/labs/VTreeview'

const deleteIndex = item => {
  delete item.index
  return item
}

export default {
  components: {
    VTreeview,
  },
  props: { layers: Array },
  setup(props, context) {
    const root = ref(null)
    const openItems = ref([])
    const { layers } = toRefs(props)
    const layersWithParents = computed(() => addParentIdToLayers(layers.value))
    const layersAreProvided = computed(() => layersWithParents.value.length > 0)
    const { setSelectedIds, selectedIds } = useSelected()
    const { activeLegend, setActiveLegend } = useLegend(selectedIds)
    const { onSortingChange } = useSortable(layers, root, openItems)

    const sortedSelectedLayers = computed(() => {
      const withIndex = addIndex(layers.value)
      return selectedIds.value
        .map(id => findInTree(withIndex, 'id', id))
        .sort((a, b) => b.index - a.index)
        .map(deleteIndex)
    })

    onSortingChange(sortedLayers => context.emit('layer-sorting-change', sortedLayers))
    watch(activeLegend, newActiveLegend => context.emit('legend-change', newActiveLegend))
    watch(sortedSelectedLayers, sortedSelected => context.emit('active-layers-change', sortedSelected))

    return { root, openItems, layersAreProvided, activeLegend, setActiveLegend, setSelectedIds, layersWithParents }
  },
}
</script>

<style>
.sortable-handle {
  cursor: grab;
}
</style>