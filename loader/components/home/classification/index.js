export default {
  props: {
    allList: {
      default: () => {
        return [];
      },
      type: Array,
    },
  },
  data() {
    return {
      list: [],
      isExpand: false,
      tags: [],
      selectedList: [],
    };
  },
  watch: {
    allList: {
      handler(list) {
        this.updateTag(list);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // update tag
    updateTag(allList) {
      if (!allList) return;

      let tags = new Set();

      for (let i = 0; i < allList.length; i++) {
        let model = allList[i];
        for (let j = 0; j < model.tags.length; j++) {
          tags.add(model.tags[j]);
        }
      }

      this.list = Array.from(tags).map((x) => {
        return { name: x };
      });
    },
    // Select all tags
    selectAll() {
      this.selectedList = [];
      this.tags = [];
      this.$emit("changeSearchParameter", { key: "", tags: this.tags });
    },
    // Select a single tag
    selectClassify(event, index) {
      const existIndex = this.selectedList.findIndex((x) => x === index);
      if (event.ctrlKey) {
        if (existIndex != -1) {
          this.selectedList.splice(existIndex, 1);
          const tagIndex = this.tags.findIndex((x) => x === this.list[index].name);
          this.tags.splice(tagIndex, 1);
        } else {
          this.selectedList.push(index);
          this.tags.push(this.list[index].name);
        }
        this.$emit("changeSearchParameter", { key: "", tags: this.tags });
        return;
      }
      // 无ctrl: 单选, 当已存在时取消所有, 若当前已选多项时单击先取消所有再选择当前
      if (this.tags.length > 1 || existIndex == -1) {
        this.selectedList = [index];
        this.tags = [this.list[index].name];
      } else {
        this.selectedList = [];
        this.tags = [];
      }

      this.$emit("changeSearchParameter", { key: "", tags: this.tags });
    },
    handleContextMenu(event, index) {
      const existIndex = this.selectedList.findIndex((x) => x === index);
      // 按ctrl: 加选, 当已存在时仅取消当前
      if (event.ctrlKey) {
        if (existIndex != -1) {
          this.selectedList.splice(existIndex, 1);
          const tagIndex = this.tags.findIndex((x) => x === this.list[index].name);
          this.tags.splice(tagIndex, 1);
        } else {
          this.selectedList.push(index);
          this.tags.push(this.list[index].name);
        }
        this.$emit("changeSearchParameter", { key: "", tags: this.tags });
      }
      return false;
    },
    handleSelectStart() {
      return false;
    },
    // Expand tag list
    expandClassify() {
      this.isExpand = !this.isExpand;
    },
  },
  template: `<div ref="classification" class="classification" :class="{classification_expand:isExpand}">
                <div class="item all" :class="{selected_classify: selectedList.length === 0}" @click="selectAll">ALL</div>
                <div class="block"></div>
                <div v-for="(item,index) in list" :key="index" ref="item" class="item" :class="{selected_classify: selectedList.includes(index)}" @click="selectClassify($event, index)" @contextmenu.prevent="handleContextMenu($event, index)" @selectstart.prevent="handleSelectStart" >
                  {{item.name}}
                </div>
                <div class="expand_icon" :class="{rotate_em:isExpand}" @click="expandClassify"><em class="iconfont icon-double-arrow-bottom"></em></div>
            </div>
`,
};
