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
    return {
      searchParameter: {
        key: "",
        sort: "",
        level: "",
        tags: [],
      },
      column: 0,
    };
  },
  computed: {
    allList() {
      if (this.node) {
        return this.node.CSgetModelLists();
      }
      return [];
    },
    selectedWidget() {
      return this.node?.CSgetSelModelWidget();
    },
    rendering(){
      return this.renderer?.rendering;
    }
  },
  watch: {
    allList: {
      handler(newValue) {
        this.$emit("updateTag", newValue);
      },
      immediate: true,
      deep: true,
    },
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
                <Head  @changeSearchParameter="changeSearchParameter" @changeColumn="changeColumn" :all-list="allList" />
                <Classification @changeSearchParameter="changeSearchParameter" />
                <Model :column="column" :all-list="allList" :selected-widget="selectedWidget" :search-parameter="searchParameter" />
              </div>
              <Foot :all-list="allList" v-show="rendering"/>
             </div>`,
};
