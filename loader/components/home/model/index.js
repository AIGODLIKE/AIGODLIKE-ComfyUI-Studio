import ModelList from "./list/index.js";
import ModelDetail from "./detail/index.js";
import { api } from "/scripts/api.js";
async function update_config(model, key, old_data) {
  try {
    const body = new FormData();
    body.append("data", JSON.stringify(model));
    body.append("old_data", JSON.stringify(old_data));
    body.append("key", key);
    api.api_base = "";
    api.fetchApi("/cs/update_config", { method: "POST", body });
  } catch (error) {
    alert(error);
  }
}

export default {
  components: { ModelList, ModelDetail },
  props: {
    allList: {
      default: () => {
        return [];
      },
      type: Array,
    },
    selectedWidget: {
      default: null,
      type: String,
    },
    column: {
      default: 0,
      type: Number,
    },
    searchParameter: {
      default: () => {
        return {};
      },
      type: Object,
    },
  },
  watch: {
    searchParameter: {
      handler(newValue) {
        this.filterList(newValue);
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      curList: [],
      selectedModel: null,
    };
  },
  methods: {
    // Use model
    useModel(model) {
      let node = window._node;
      if (node) {
        node.CSsetModelWidget(model.name);
        window.parent.postMessage({ type: "close_loader_page" }, "*");
      }
    },
    // Change name
    modifyName(value) {
      let old_data = this.selectedModel.name;
      this.selectedModel.name = value;
      update_config(this.selectedModel, "name", old_data);
    },
    // Change level
    changeLevel(level) {
      let old_data = this.selectedModel.level;
      this.selectedModel.level = level;
      update_config(this.selectedModel, "level", old_data);
    },
    // Add tag
    addTag(value) {
      let old_data = this.selectedModel.tags;
      this.selectedModel.tags.push(value);
      update_config(this.selectedModel, "tags", old_data);
    },
    // Delete tag
    deleteTag(index) {
      let old_data = this.selectedModel.tags;
      this.selectedModel.tags.splice(index, 1);
      update_config(this.selectedModel, "tags", old_data);
    },
    // Modify cover
    modifyCover(coverSrc) {
      this.selectedModel.cover = coverSrc;
    },
    // Change selected items
    changeSelectedModel(model) {
      this.selectedModel = model;
    },
    // Filter and filter all data based on criteria
    filterList(searchParameter) {
      const newList = this.allList.filter((x) => {
        const key = x.name.includes(searchParameter.key);
        const level =
          searchParameter.level === 0 || x.level === searchParameter.level;
        const tag =
          searchParameter.tags.length === 0 ||
          x.tags.find((tagItem) => searchParameter.tags.includes(tagItem));
        let node = window._node;
        if (node) {
          let filters = node.CSgetModelFilters(true);
          if (filters?.includes(x.name)) {
            return false;
          }
        }
        return key && level && tag;
      });
      this.sortList(searchParameter.sort, newList);
      this.curList = newList;
      this.selectedModel = false;
      if (this.selectedWidget === null) {
        this.selectedModel = this.curList[0] || false;
        return;
      }
      for (let i = 0; i < this.curList.length; i++) {
        if (this.curList[i].name === this.selectedWidget) {
          this.selectedModel = this.curList[i] || false;
          return;
        }
      }
      // selectedWidget 可能不在 curList 中(被屏蔽了)
      this.selectedModel = this.curList[0] || false;
    },
    // Sort data based on conditions
    sortList(orderValue, newList) {
      switch (orderValue) {
        case 0:
          newList.sort((a, b) => b.creationTime - a.creationTime);
          break;
        case 1:
          newList.sort((a, b) => a.creationTime - b.creationTime);
          break;
        case 2:
          newList.sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
          break;
        case 3:
          newList.sort((a, b) => b.name.localeCompare(a.name, "zh-CN"));
          break;
        case 4:
          newList.sort((a, b) => {
            if (a.level === "S" && b.level !== "S") {
              return 1;
            } else if (a.level !== "S" && b.level === "S") {
              return -1;
            }
            return b.level.localeCompare(a.level, "zh-CN");
          });
          break;
        case 5:
          newList.sort((a, b) => {
            if (a.level === "S" && b.level !== "S") {
              return -1;
            } else if (a.level !== "S" && b.level === "S") {
              return 1;
            }
            return a.level.localeCompare(b.level, "zh-CN");
          });
          break;
        case 6:
          newList.sort((a, b) => a.size - b.size);
          break;
        case 7:
          newList.sort((a, b) => b.size - a.size);
          break;
      }
    },
  },
  template: `
            <div class="model_display">
                <ModelList v-if="curList.length > 0" :curList="curList" :selected-model="selectedModel" :column="column" @changeSelectedModel="changeSelectedModel" @useModel="useModel" />
                <ModelDetail :model="selectedModel" @modifyCover="modifyCover" @changeLevel="changeLevel" @modifyName="modifyName" @addTag="addTag" @deleteTag="deleteTag"  @useModel="useModel" />
                <div v-if="curList.length === 0" class="empty">
                  <p v-if="searchParameter.key">{{$t('home.searchValue')}}: {{searchParameter.key}}</p>
                  {{$t('noResult')}}
                </div>
            </div>
`,
};
