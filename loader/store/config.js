const config = {
  namespaced: true,
  state: () => ({
    language: "cn",
    shortcut: "click",
    windowing: localStorage.getItem("windowing") || "full",
  }),
  mutations: {
    updateLanguage(state, newLanguage) {
      localStorage.setItem("language", newLanguage);
      state.language = newLanguage;
    },
    updateShortcut(state, newShortcut) {
      localStorage.setItem("shortcut", newShortcut);
      state.shortcut = newShortcut;
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
