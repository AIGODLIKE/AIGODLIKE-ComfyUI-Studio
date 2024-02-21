import WorkflowForm from "../workflow/form/index.js";
export default {
  name: "Workflow",
  props: ["model"],
  components: { WorkflowForm },
  data() {
    return {
      value: "",
      key: "",
      list: [],
      isShowForm: false,
    };
  },
  watch: {
    model: {
      handler(model) {
        let list = [];
        if (model?.workflows?.length > 0) {
          // workflows 是一个 array<str>
          for (let i = 0; i < model.workflows.length; i++) {
            let wk = model.workflows[i]; // 以.json结尾
            list.push({ name: wk.replace(/\.json$/, ""), workflow: wk });
          }
        }
        // list 按 ascii 排序
        list.sort((a, b) => a.name.localeCompare(b.name));
        this.list = list;
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    filterList() {
      return this.list.filter((x) => x.name.includes(this.value));
    },
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
    },
    // Click add workflow
    displayForm(flag) {
      this.isShowForm = flag;
    },
    saveWorkflow(name) {
      // 随机生成
      if (!name) name = `wk-${Math.random().toString(36).substring(2, 10)}`;
      var node = this.node;
      var data = window.parent.app.graph.serialize();
      var request = new XMLHttpRequest();
      // request.timeout = 500; // 超时
      request.open("post", "/cs/save_workflow", true);
      request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      request.onload = () => {
        if (request.status != 200) return;
        var resp = JSON.parse(request.responseText);
        if (resp?.saved) {
          node.CSupdateModelConfig(this.model.name);
          this.$message(name + " " + this.$t("home.modelDetail.workflow.saveSuccess"));
        } else {
          this.$message(name + " " + this.$t("home.modelDetail.workflow.saveFail"));
        }
      };
      // request.ontimeout = () => {
      //   this.$message(name + " " + this.$t("home.modelDetail.workflow.saveTimeout"));
      // };
      let mtype = node.CSgetModelWidgetType();
      let body = { mtype: mtype, mname: this.model?.name, data, name };
      request.send(JSON.stringify(body));
    },
    // Copy workflow
    copyWorkflow(item) {
      var request = new XMLHttpRequest();
      request.timeout = 500; // 超时
      request.open("post", "/cs/fetch_workflow", true);
      request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      request.onload = async () => {
        if (request.status != 200) return;
        var resp = JSON.parse(request.responseText);
        if (resp) {
          await navigator.clipboard.writeText(request.responseText);
          this.$message(item.name + " " + this.$t("home.modelDetail.workflow.copySuccess"));
        } else {
          this.$message(item.name + " " + this.$t("home.modelDetail.workflow.copyFail"));
        }
      };
      request.ontimeout = () => {
        this.$message(item.name + " " + this.$t("home.modelDetail.workflow.copyTimeout"));
      };
      let mtype = this.node.CSgetModelWidgetType();
      let body = { mtype: mtype, mname: this.model?.name, workflow: item.workflow, name: item.name };
      request.send(JSON.stringify(body));
    },
    // Delete workflow
    deleteWorkflow(index, item) {
      // 异步, 且取消超时等待
      var request = new XMLHttpRequest();
      // request.timeout = 500; // 超时
      request.open("post", "/cs/remove_workflow", true);
      request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      request.onload = () => {
        if (request.status != 200) return;
        var resp = JSON.parse(request.responseText);
        if (resp?.removed) {
          this.node.CSupdateModelConfig(this.model.name);
          this.$message(item.name + " " + this.$t("home.modelDetail.workflow.deleteSuccess"));
        } else {
          this.$message(item.name + " " + this.$t("home.modelDetail.workflow.deleteFail"));
        }
      };
      // request.ontimeout = () => {
      //   this.$message(item.name + " " + this.$t("home.modelDetail.workflow.deleteTimeout"));
      // };
      let mtype = this.node.CSgetModelWidgetType();
      let body = { mtype: mtype, mname: this.model?.name, workflow: item.workflow, name: item.name };
      request.send(JSON.stringify(body));
    },
    // Import
    importWorkflow(item) {
      var request = new XMLHttpRequest();
      request.timeout = 500; // 超时
      request.open("post", "/cs/fetch_workflow", true);
      request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      request.onload = async () => {
        if (request.status != 200) return;
        var resp = JSON.parse(request.responseText);
        if (resp) {
          try {
            if (resp.hasOwnProperty("workflow")) resp = resp.workflow;
            await window.parent.app.loadGraphData(resp);
            this.$message(item.name + " " + this.$t("home.modelDetail.workflow.importSuccess"));
          } catch (e) {
            this.$message(item.name + " " + this.$t("home.modelDetail.workflow.importFail") + `: ${e}`);
          }
        } else {
          this.$message(item.name + " " + this.$t("home.modelDetail.workflow.importFail"));
        }
      };
      request.ontimeout = () => {
        this.$message(item.name + " " + this.$t("home.modelDetail.workflow.importTimeout"));
      };
      let mtype = this.node.CSgetModelWidgetType();
      let body = { mtype: mtype, mname: this.model?.name, workflow: item.workflow, name: item.name };
      request.send(JSON.stringify(body));
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
                      <em class="iconfont icon-import" @click="importWorkflow(item)" :title="$t('home.modelDetail.workflow.importText')"></em>
                      <em class="iconfont icon-copy" @click="copyWorkflow(item)" :title="$t('home.modelDetail.workflow.copyText')"></em>
                      <em class="iconfont icon-delete" @click="deleteWorkflow(index,item)" :title="$t('home.modelDetail.workflow.delete')"></em>
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
              <WorkflowForm v-show="isShowForm" @saveWorkflow="saveWorkflow" @displayForm="displayForm" />
             </div>`,
};
