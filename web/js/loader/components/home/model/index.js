import ModelList from "./list/index.js";
import ModelDetail from "./detail/index.js";

export default {
  components: { ModelList, ModelDetail },
  props: {
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
      allList: [
        {
          cover: "https://t7.baidu.com/it/u=737555197,308540855&fm=193&f=GIF",
          level: "S",
          name: "了",
          type: "CKPT",
          tags: ["asdasd", "asddasd", "asdas1d", "模", "人"],
          creationTime: 1703733395793,
          modifyTime: 1703733395793,
          size: 2,
        },
        {
          cover: "https://t7.baidu.com/it/u=737555197,308540855&fm=193&f=GIF",
          level: "A",
          name: "吗",
          type: "CKPT",
          tags: ["英雄联盟", "无中生有", "过河拆桥", "是"],
          creationTime: 1703670683694,
          modifyTime: 1703670678694,
          size: 5,
        },
        {
          cover: "https://t7.baidu.com/it/u=737555197,308540855&fm=193&f=GIF",
          level: "B",
          name: "去",
          type: "CKPT",
          tags: ["DFFS", "111", "3D", "你"],
          creationTime: 1703670690694,
          modifyTime: 1703670678694,
          size: 1,
        },
        {
          cover: "https://t7.baidu.com/it/u=737555197,308540855&fm=193&f=GIF",
          level: "D",
          name: "哦",
          type: "CKPT",
          tags: ["2D", "无中生有", "过河拆桥", "和", "型"],
          creationTime: 1703670695726,
          modifyTime: 1703670678694,
          size: 7,
        },
        {
          cover: "https://t7.baidu.com/it/u=737555197,308540855&fm=193&f=GIF",
          level: "C",
          name: "怕",
          type: "CKPT",
          tags: ["英雄联盟", "无中生有", "过河拆桥", "发", "是", "怕"],
          creationTime: 1703670704326,
          modifyTime: 1703670678694,
          size: 6,
        },
      ],
      list: [],
      selectedModel: null,
    };
  },
  methods: {
    // Change name
    modifyName(value) {
      this.selectedModel.name = value;
    },
    // Change level
    changeLevel(level) {
      this.selectedModel.level = level;
    },
    // Add tag
    addTag(value) {
      this.selectedModel.tags.push(value);
    },
    // Delete tag
    deleteTag(index) {
      this.selectedModel.tags.splice(index, 1);
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
        return key && level && tag;
      });
      this.sortList(searchParameter.sort, newList);
      this.list = newList;
      this.selectedModel = this.list[0] || false;
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
                <ModelList v-if="list.length >0" :list="list" :selected-model="selectedModel" :column="column" @changeSelectedModel="changeSelectedModel" />
                <ModelDetail :model="selectedModel" @modifyCover="modifyCover" @changeLevel="changeLevel" @modifyName="modifyName" @addTag="addTag" @deleteTag="deleteTag" />
                <div v-if="list.length === 0" class="empty">
                  <p v-if="searchParameter.key">{{$t('home.searchValue')}}: {{searchParameter.key}}</p>
                  {{$t('noResult')}}
                </div>
            </div>
`,
};
