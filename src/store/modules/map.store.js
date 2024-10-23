export default {
  namespaced: true,

  state: () => ({
    wmsLayers: [],
  }),

  mutations: {
    setWmsLayers(state, payload) {
      state.wmsLayers = payload
    },
  },
}
