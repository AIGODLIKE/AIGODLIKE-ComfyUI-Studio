const config = {
  namespaced: true,
  state: () => ({
    language: localStorage.getItem("CS.language") || "cn",
    shortcut: localStorage.getItem("CS.shortcut") || "click",
    windowing: localStorage.getItem("CS.windowing") || "full",
  }),
  mutations: {
    updateLanguage(state, newLanguage) {
      localStorage.setItem("CS.language", newLanguage);
      state.language = newLanguage;
    },
    updateShortcut(state, newShortcut) {
      localStorage.setItem("CS.shortcut", newShortcut);
      state.shortcut = newShortcut;
    },
    updateWindowing(state, value) {
      localStorage.setItem("CS.windowing", value);
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
