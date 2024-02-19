import WorkflowForm from "../workflow/form/index.js";

export default {
  name: "Workflow",
  components: { WorkflowForm },
  data() {
    return {
      value: "",
      key: "",
      list: [
        {
          name: "人物生成",
        },
        {
          name: "人物生成2",
        },
        {
          name: "人物生成3",
        },
        {
          name: "人物生成4",
        },
        {
          name: "基础功能",
        },
      ],
      filterList: [],
      isShowForm: false,
    };
  },

  mounted() {
    this.handleSearch();
  },
  methods: {
    // Enter key for search
    handleKeyDown(e) {
      if (e.key === "Enter") {
        this.handleSearch();
      }
    },
    // Click to search
    handleSearch() {
      this.key = this.value;
      this.filterList = this.list.filter((x) => x.name.includes(this.value));
    },
    // Click add workflow
    displayForm(flag) {
      this.isShowForm = flag;
    },
    // Copy workflow
    async copyText(item) {
      await navigator.clipboard.writeText(item.name);
      this.$message("复制成功");
    },
    // Delete workflow
    deleteItem(index, item) {
      this.filterList.splice(index, 1);
      const targetIndex = this.list.findIndex((x) => x === item);
      this.list.splice(targetIndex, 1);
    },
  },
  template: `<div class="workflow">
              <div class="workflow_content">
                <div class="search_area">
                  <div class="search">
                    <input type="value" v-model="value" :placeholder="$t('home.head.search')"   @keydown="handleKeyDown($event)" />
                    <span @click="handleSearch"><em class="iconfont icon-search"></em></span>
                  </div>
                  <div v-if="key" class="search_key">
                    <p>{{$t('home.searchValue')}} : {{this.key}}</p>
                  </div>
                </div>
            
                <div v-if="list.length > 0 && filterList.length > 0" class="workflow_list">
                  <div v-for="(item,index) in filterList" :key="index" class="workflow_item">
                    <span class="name">{{item.name}}</span>
                    <div class="option">
                      <em class="iconfont icon-copy" @click="copyText(item)" :title="$t('home.modelDetail.workflow.copyText')"></em>
                      <em class="iconfont icon-delete" @click="deleteItem(index,item)" :title="$t('home.modelDetail.workflow.delete')"></em>
                    </div>
                  </div>
                </div>
                <div v-else-if="list.length > 0 && filterList.length === 0" class="empty_list">
                    {{$t('noResult')}}
                </div>
                <div v-else-if="list.length === 0" class="empty_list">
                 {{ $t('home.modelDetail.workflow.noWorkflowTip')}}
                </div>
                <button @click="displayForm(true)">{{$t('home.modelDetail.workflow.addWorkflowButtonText')}}</button>
              </div>
              <WorkflowForm v-show="isShowForm" @displayForm="displayForm" />
             </div>`,
};
