import config from "./config.js";
import prop from "./prop.js";
let store = null;
if (typeof Vuex === "undefined") {
} else {
  store = new Vuex.Store({
    modules: {
      config,
      prop,
    },
  });
}
export default store;
