import hoverMenu from "../../public/hoverMenu.js";
import IconRenderer from "../../public/iconRenderer.js";
// import { app } from "/scripts/app.js";
const ext = {
  is_rendering: false,
  name: "ComfyUI-Studio.head",
  async register() {
    try {
      const { app } = await import("/scripts/app.js");
      app.registerExtension(ext);
    } catch (error) {
      // console.error(error);
    }
  },
};
ext.register();

export default {
  props: {
    allList: {
      default: () => {
        return [];
      },
      type: Array,
    },
  },
  components: { HoverMenu: hoverMenu },
  data() {
    return {
      value: "",
      search: {
        key: "",
        sort: "",
        level: "",
      },
    };
  },
  computed: {
    language() {
      return this.$store.state.config.language;
    },
  },
  methods: {
    // Change sorting method
    changeSort(value) {
      const data = this.$t("home.head.categoryList")[value].value;
      this.search.sort = data;
      this.search.key = "";
      this.$emit("changeSearchParameter", this.search);
    },
    // Filter list based on level
    changeLevel(value) {
      const data = this.$t("home.head.rateList")[value].value;
      this.search.key = "";
      this.search.level = data;
      this.$emit("changeSearchParameter", this.search);
    },
    // Change the quantity that can be displayed in a row
    changeColumn(value) {
      const data = this.$t("home.head.sizeList")[value].value;
      this.$emit("changeColumn", data);
    },
    // Enter key for search
    handleKeyDown(e) {
      if (e.key === "Enter") {
        this.handleSearch();
      }
    },
    // Click to search
    handleSearch() {
      this.search.key = this.value;
      this.$emit("changeSearchParameter", this.search);
      this.value = "";
    },
    // One click rendering
    rendering() {
      this.$confirmBox({
        describe: this.$t("home.head.renderAllThumbnails"),
        refuseText: this.$t("confirmBox.refuseText"),
        acceptText: this.$t("confirmBox.acceptText"),
        accept: () => {
          let renderer = this.renderer;
          if (this.renderer?.rendering) {
            alert(this.$t("home.head.renderingAlert"));
            return;
          }
          const curList = this.$store.state.prop.curModelList;

          renderer?.render(this.node, curList);
        },
        refuse: () => {},
      });
    },
    // Close the entire page
    closePage() {
      let renderer = this.renderer;
      if (!renderer?.rendering) {
        window.parent.postMessage({ type: "close_loader_page" }, "*");
        return;
      }
      this.$confirmBox({
        describe: this.$t("home.head.closePageConfirm"),
        refuseText: this.$t("confirmBox.refuseText"),
        acceptText: this.$t("confirmBox.acceptText"),
        accept: () => {
          // 点击确认调用
          let renderer = this.renderer;
          renderer?.stop();
          window.parent.postMessage({ type: "close_loader_page" }, "*");
        },
        refuse: () => {
          // 点击取消调用
        },
      });
    },
  },
  template: `<div class="head">
                <div class="left">
                    <span class="title">{{$t("home.head.title")}}</span>
                    <div class="search">
                        <input type="value" v-model="value" :placeholder="$t('home.head.search')"   @keydown="handleKeyDown($event)" />
                        <span @click="handleSearch"><em class="iconfont icon-search"></em></span>
                    </div>
                    <HoverMenu icon="icon-exchange" :list="$t('home.head.categoryList')" @changeValue= "changeSort" />
                    <HoverMenu icon="icon-medal" class="space" :list="$t('home.head.rateList')" @changeValue= "changeLevel" />
                    <HoverMenu icon="" :list="$t('home.head.sizeList')" @changeValue= "changeColumn" />
                    <div class="block"></div>
                    <button class="render_button" @click="rendering">{{$t("home.head.renderText")}}</button>
                </div>
                <div class="right">
                    <button class="close_button" type="button" @click="closePage"><em class="iconfont icon-close2"></em></button>
                </div>
            </div>`,
};
