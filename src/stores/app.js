// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    panelIsCollapsed: true,
  }),
  actions: {
    collapsePanel () {
      this.panelIsCollapsed = true
    },
    expandPanel () {
      this.panelIsCollapsed = false
    },
    togglePanel () {
      this.panelIsCollapsed = !this.panelIsCollapsed
    },
  },
})
