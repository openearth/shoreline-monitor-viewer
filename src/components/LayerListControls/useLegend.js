/** @typedef {import('./useSelected').SelectedIds} */
/** @typedef {{ value: String }} ActiveLegend */

import { ref, watch } from 'vue'
import last from './last'

export default function useLegend(selectedIds) {

  /** @type {ActiveLegend} */
  const activeLegend = ref('')

  /**
   * Set the active legend to a new value, or clear it when the same value is 
   * provided
   * @param {String} id 
   */
  function setActiveLegend(id) {
    activeLegend.value = activeLegend.value === id
      ? ''
      : id
  }

  /**
   * Handler for when `selectedIds` change.
   * @param {SelectedIds} newSelectedIds
   */
  function handleSelectedIdsChange(newSelectedIds) {
    if (newSelectedIds.includes(activeLegend.value)) return

    const lastSelectedId = last(newSelectedIds)
    setActiveLegend(lastSelectedId)
  }

  watch(selectedIds, handleSelectedIdsChange)

  return {
    activeLegend,
    setActiveLegend,
  }
}