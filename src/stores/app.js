// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    panelIsCollapsed: true,
    acceptedLegal: typeof window === 'undefined'
      ? false
      : window.localStorage.getItem('acceptedLegal') === 'true',
  }),
  actions: {
    acceptLegal () {
      this.acceptedLegal = true
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('acceptedLegal', 'true')
      }
    },
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
