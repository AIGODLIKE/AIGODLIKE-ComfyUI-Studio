import config from "./config.js";
let store = null;
if (typeof Vuex === "undefined") {
} else {
  store = new Vuex.Store({
    modules: {
      config,
    },
  });
}
export default store;
