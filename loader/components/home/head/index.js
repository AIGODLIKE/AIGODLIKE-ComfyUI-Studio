import hoverMenu from "../../public/hoverMenu.js";
import { api } from "/scripts/api.js";
// import { app } from "/scripts/app.js";
class CallBack {
  constructor(app) {
    this.finished = true;
    this.cb = null;
    api.addEventListener("executed", this.eventListener.bind(this, app));
  }
  eventListener(app, { detail }) {
    this._callBack(detail);
  }
  async _callBack(detail) {
    if (this.cb) {
      const images = detail?.output?.images;
      if (!images || !images.length) return;
      let name = encodeURIComponent(images[0].filename);
      let type = images[0].type;
      let subfolder = encodeURIComponent(images[0].subfolder);
      // let fmt = app.getPreviewFormatParam();
      // const src1 = api.apiURL(`/view?filename=${name}&type=${type}&subfolder=${subfolder}${fmt}`);

      const src = [`/view?filename=${name}`, `type=${type}`, `subfolder=${subfolder}`,].join('&');
      await this.cb(src, name);
    }
    this.finished = true;
  }
  async waitForOneLoop() {
    while (this.finished !== true) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    this.finished = false;
  }
}
const ext = {
  is_rendering: false,
  name: "ComfyUI-Studio.thumbnail",
  async setup(app) {
    app.CScbProxy = new CallBack(app);
  },
  async register() {
    try {
      const { app } = await import("/scripts/app.js");
      app.registerExtension(ext);
    } catch (error) {
      // console.error(error);
    }
  }
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
      if (!this.allList.length) {
        return;
      }

      async function fetch_workflow(mtype) {
        try {
          const body = new FormData();
          body.append("mtype", mtype);
          api.api_base = "";
          let resp = await api.fetchApi("/cs/fetch_workflow", { method: "POST", body });
          let json = await resp.json();
          return json;
        } catch (error) {
          alert(error);
        }
      }
      async function fetch_image(src, name) {
        return new Promise((resolve, reject) => {
          var blob = null;
          var xhr = new XMLHttpRequest();
          xhr.open("GET", src);
          xhr.setRequestHeader('Accept', 'image/jpeg');
          xhr.responseType = "blob";
          xhr.onload = () => {
            blob = xhr.response;
            let file = new File([blob], name, { type: "image/png" });
            resolve(file);
          };
          xhr.onerror = (e) => {
            reject(e)
          };
          xhr.send();
        });
      }
      async function rendering(modelList) {
        let workflow = null;
        let inputNode = null;
        let outputNode = null;
        let comfyWindow = window.parent;
        for await (let model of modelList) {
          // init
          if (!workflow) {
            workflow = await fetch_workflow(model.mtype);
            await comfyWindow.app.loadGraphData(workflow);
            // 需要找到输入节点(用于替换model) + 输出节点(用于上传缩略图)
            for (let i = 0; i < comfyWindow.graph._nodes.length; i++) {
              {
                let node = comfyWindow.graph._nodes[i];
                // force update
                if (node.widgets) {
                  for (const widget of node.widgets) {
                    if (widget.afterQueued) {
                      widget.afterQueued();
                    }
                  }
                }
                if (node.properties?.["CSInput"]) {
                  inputNode = node;
                }
                // if (node.properties?.["CSOutput"] && node.comfyClass == "PreviewImage") {
                //   outputNode = node;
                // }
              }
            }
            console.log("Input Node: ", inputNode.title);
            // console.log("Output Node: ", outputNode.title);
          }
          inputNode.CSsetModelWidget(model.name);
          await comfyWindow.app.CScbProxy.waitForOneLoop();
          comfyWindow.app.CScbProxy.cb = async (src, name) => {
            console.log(model.name, src);
            // 从src 读取image 为File 对象
            const file = await fetch_image(src, name);
            // 如果 读图报错 则不上传缩略图
            if (!file) {
              return;
            }
            try {
              const body = new FormData();
              body.append("image", file);
              body.append("type", model.type);
              body.append("mtype", model.mtype);
              body.append("name", model.name);
              api.api_base = "";
              await api.fetchApi("/cs/upload_thumbnail", { method: "POST", body });
              model.cover = src;
            } catch (error) {
              alert(error);
            }
          }
          comfyWindow.app.queuePrompt(1);
          break;
        }
        window.focus();
      }

      rendering(this.allList);

    },
    // Close the entire page
    closePage() {
      window.parent.postMessage({ type: "close_loader_page" }, "*");
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
