const config = {
  namespaced: true,
  state: () => ({
    language: "cn",
    windowing: localStorage.getItem("windowing") || "full",
  }),
  mutations: {
    updateLanguage(state, newLanguage) {
      localStorage.setItem("language", newLanguage);
      state.language = newLanguage;
    },
    updateWindowing(state, value) {
      localStorage.setItem("windowing", value);
      if (value === "full") {
        document.getElementById("loader_page").classList.remove("windowing");
      } else {
        document.getElementById("loader_page").classList.add("windowing");
      }
      state.windowing = value;
    },
  },
};
export default config;
