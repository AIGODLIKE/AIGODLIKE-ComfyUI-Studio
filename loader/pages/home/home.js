import Head from "../../components/home/head/index.js";
import Classification from "../../components/home/classification/index.js";
import Model from "../../components/home/model/index.js";
import Foot from "../../components/home/foot/index.js";

export default {
  name: "Home",
  components: {
    Head,
    Classification,
    Model,
    Foot,
  },
  data() {
    let l = [];
    let node = window._node;
    let selectedWidget = null;
    if (node) {
      l = node.CSgetModelLists();
      selectedWidget = node.CSgetSelModelWidget();
    }
    return {
      allList: l,
      selectedWidget,
      searchParameter: {
        key: "",
        sort: "",
        level: "",
        tags: [],
      },
      column: 0,
    };
  },
  watch: {
    allList: {
      handler(newValue) {
        this.$emit("updateTag", newValue);
      },
      immediate: true,
      deep: true,
    }
  },
  mounted() {
    const language = localStorage.getItem("language") || "cn";
    this.$i18n.locale = language;
    this.$store.commit("config/updateLanguage", language);
  },
  methods: {
    // Change the quantity displayed in a row
    changeColumn(value) {
      this.column = value;
    },
    // Change filtering criteria
    changeSearchParameter(value) {
      this.searchParameter = {
        ...this.searchParameter,
        ...value,
      };
    },
  },
  template: `<div class="home_page">
               <div class="content">
                <Head  @changeSearchParameter="changeSearchParameter" @changeColumn="changeColumn" :allList="allList" />
                <Classification @changeSearchParameter="changeSearchParameter" />
                <Model :column="column" :allList="allList" :selectedWidget="selectedWidget" :search-parameter="searchParameter" />
              </div>
              <Foot :allList="allList" />
             </div>`,
};
