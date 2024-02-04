const prop = {
  namespaced: true,
  state: () => ({
    nodeId: null,
    renderer: null,
  }),
  mutations: {
    setNodeId(state, nodeId) {
      state.nodeId = nodeId;
    },
    setRenderer(state, renderer) {
      state.renderer = renderer;
    },
  },
};
export default prop;
