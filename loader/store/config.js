const config = {
  namespaced: true,
  state: () => ({
    language: "cn",
  }),
  mutations: {
    updateLanguage(state, newLanguage) {
      localStorage.setItem("language", newLanguage);
      state.language = newLanguage;
    },
  },
};
export default config;
