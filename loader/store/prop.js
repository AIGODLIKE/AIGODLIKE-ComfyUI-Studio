const prop = {
  namespaced: true,
  state: () => ({
    nodeId: null,
    renderer: null,
    curModelList: null,
  }),
  mutations: {
    setNodeId(state, nodeId) {
      state.nodeId = nodeId;
    },
    setRenderer(state, renderer) {
      state.renderer = renderer;
    },
    setCurModelList(state, curModelList) {
      state.curModelList = curModelList;
    },
  },
};
export default prop;
