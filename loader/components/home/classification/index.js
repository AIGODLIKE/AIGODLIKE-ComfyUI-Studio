export default {
  data() {
    return {
      list: [],
      isExpand: false,
      tags: [],
      selectedList: [],
    };
  },
  created() {
    // let index = 0;
    // const list = [
    //   "模",
    //   "型",
    //   "你",
    //   "是",
    //   "上",
    //   "就",
    //   "和",
    //   "发",
    //   "人",
    //   "有",
    //   "怕",
    // ];
    // while (index !== 30) {
    //   const randomLength = Math.floor(Math.random() * 8) + 1;
    //   let str = "";
    //   let strIndex = 0;
    //   while (strIndex < randomLength) {
    //     const randomPos = Math.floor(Math.random() * 11);
    //     str += list[randomPos];
    //     strIndex++;
    //   }
    //   this.list.push({
    //     name: str,
    //   });
    //   index++;
    // }
    let node = window._node;
    if (node) {
      let modelLists = node.CSgetModelLists();
      if (modelLists) {
        this.updateTag(modelLists);
      }
    }
    this.$parent.$on("updateTag", this.updateTag);
  },
  methods: {
    // update tag
    updateTag(list) {
      if (!list)
        return;

      let tags = new Set();
      
      for (let i = 0; i < list.length; i++) {
        let model = list[i];
        for (let j = 0; j < model.tags.length; j++) {
          tags.add(model.tags[j]);
        }
      }

      this.list = Array.from(tags).map((x) => { return { name: x } });
    },
    // Select all tags
    selectAll() {
      this.selectedList = [];
      this.tags = [];
      this.$emit("changeSearchParameter", { key: "", tags: this.tags });
    },
    // Select a single tag
    selectClassify(index) {
      const existIndex = this.selectedList.findIndex((x) => x === index);
      if (existIndex != -1) {
        this.selectedList.splice(existIndex, 1);
        const tagIndex = this.tags.findIndex(
          (x) => x === this.list[index].name
        );
        this.tags.splice(tagIndex, 1);
      } else {
        this.selectedList.push(index);
        this.tags.push(this.list[index].name);
      }
      this.$emit("changeSearchParameter", { key: "", tags: this.tags });
    },
    // Expand tag list
    expandClassify() {
      this.isExpand = !this.isExpand;
    },
  },
  template: `<div ref="classification" class="classification" :class="{classification_expand:isExpand}">
                <div class="item all" :class="{selected_classify: selectedList.length === 0}" @click="selectAll">ALL</div>
                <div class="block"></div>
                <div v-for="(item,index) in list" :key="index" ref="item" class="item" :class="{selected_classify: selectedList.includes(index)}" @click="selectClassify(index)">
                  {{item.name}}
                </div>
                <div class="expand_icon" :class="{rotate_em:isExpand}" @click="expandClassify"><em class="iconfont icon-double-arrow-bottom"></em></div>
            </div>
`,
};
