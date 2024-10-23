import { ref, watch, nextTick, onMounted } from 'vue'
import { Sortable } from "sortablejs";
import reorderLayerArray from "./reorder-layers-array";

export default function useSortable(layers, componentRoot, openItems) {
  const treeViewRootSelector = '.v-treeview'
  const treeViewChildSelector = '.v-treeview-node__children'
  const parentIdsSelector = 'data-parent-ids'
  const handleSelector = '.sortable-handle'
  const callbacks = []

  const isMounted = ref(false)
  let sortInstances = []

  const config = {
    animation: 150,
    onUpdate: handleOrderUpdate
  }

  function registerCallback(fn) {
    callbacks.push(fn)
  }

  function handleOrderUpdate(event) {
    const { oldDraggableIndex, newDraggableIndex, item: $item } = event;

    const $handle = $item.querySelector(handleSelector);
    let parentIds = $handle.getAttribute(parentIdsSelector);
    if (parentIds === '') {
      parentIds = []
    } else {
      parentIds = parentIds.split(',')
    }

    const reorderdLayers = reorderLayerArray(layers.value, parentIds, oldDraggableIndex, newDraggableIndex)
    callbacks.forEach(fn => fn(reorderdLayers))
  }

  watch(
    [openItems, isMounted],
    async ([openItems, isMounted]) => {
      if (openItems === [] || isMounted === false) return

      await nextTick()
      sortInstances.forEach(instance => instance.destroy())
      sortInstances = []

      const $rootEl = componentRoot.value.querySelector(treeViewRootSelector);
      const $childEls = componentRoot.value.querySelectorAll(treeViewChildSelector);
      const $sortableEls = [$rootEl, ...$childEls];

      $sortableEls.forEach(el => {
        if (el) {
          sortInstances.push(new Sortable(el, config))
        }
      });
    }
  )

  onMounted(async () => {
    isMounted.value = true  
  })

  return {
    onSortingChange: registerCallback
  }
}