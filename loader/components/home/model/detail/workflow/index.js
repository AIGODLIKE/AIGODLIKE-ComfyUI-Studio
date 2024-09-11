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
      note_selected: "",
      note_key: "",
      note_value: "",
      notes: [
        {
          name: "Note1",
          content: "This is a note",
        },
        {
          name: "Note2",
          content: "This is another note",
        },
        {
          name: "Note3",
          content: "This is a third note",
        },
        {
          name: "Note4",
          content: "This is a fourth note",
        },
        {
          name: "Note5",
          content: "This is a fifth note",
        },
        {
          name: "Note6",
          content: "This is a sixth note",
        },
        {
          name: "Note7",
          content: "This is a seventh note",
        },
        {
          name: "Note8",
          content: "This is an eighth note",
        },
        {
          name: "Note9",
          content: "This is a ninth note",
        },
        {
          name: "Note10",
          content: "This is a tenth note",
        },
        {
          name: "Note11",
          content: "This is an eleventh note",
        }
      ],
      isShowForm: false,
      saveType: "workflow",
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

        // note
        let notes = [];
        for (let key in model?.notes || {}) {
          notes.push({ name: key, content: model.notes[key].content || ""});
        }
        // notes 按 ascii 排序
        notes.sort((a, b) => a.name.localeCompare(b.name));
        this.notes = notes;
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    filterList() {
      return this.list.filter((x) => x.name.includes(this.value));
    },
    filterNoteList() {
      return this.notes.filter((x) => x.name?.includes(this.note_value));
    }
  },
  mounted() {
    this.handleSearch();
    this.handleNoteSearch();
  },
  methods: {
    // Enter key for search
    handleKeyDown(e) {
      if (e.key === "Enter") {
        this.handleSearch();
        this.handleNoteSearch();
      }
    },
    // Click to search
    handleSearch() {
      this.key = this.value;
    },
    // Click to search
    handleNoteSearch() {
      this.note_key = this.note_value;
    },
    // Click add workflow
    displayForm(flag, type) {
      this.isShowForm = flag;
      this.saveType = type;
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
    selectNote(item) {
      this.note_selected = item.name;
      this.$nextTick(() => {
        (this.$refs.textarea || []).forEach((textarea) => {
          this.autoContentResize({ target: textarea });
        });
      });
    },
    saveContent(item) {
      this.saveNote(item.name);
    },
    autoContentResize(event) {
      const textarea = event.target;
      if(textarea?.type !== "textarea")
        return
      textarea.style.height = 'auto'; // 先重置高度
      textarea.style.height = `${textarea.scrollHeight}px`; // 然后设置成内容的滚动高度
    },
    saveNote(name) {
      // 随机生成
      if (!name) name = `note-${Math.random().toString(36).substring(2, 10)}`;
      var node = this.node;
      var data = this.notes.filter((item) => item.name === name)?.[0] || { name: name, content: "" };
      var request = new XMLHttpRequest();
      // request.timeout = 500; // 超时
      request.open("post", "/cs/save_note", true);
      request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      request.onload = () => {
        if (request.status != 200) return;
        var resp = JSON.parse(request.responseText);
        if (resp?.saved) {
          node.CSupdateModelConfig(this.model.name);
          this.$message(name + " " + this.$t("home.modelDetail.workflow.saveNoteSuccess"));
        } else {
          this.$message(name + " " + this.$t("home.modelDetail.workflow.saveNoteFail"));
        }
      };
      let mtype = node.CSgetModelWidgetType();
      let body = { mtype: mtype, mname: this.model?.name, data, name };
      request.send(JSON.stringify(body));
    },
    // Copy note
    copyNote(item) {
      navigator.clipboard.writeText(item.content);
    },
    // Delete note
    deleteNote(index, item) {
      // 异步, 且取消超时等待
      var request = new XMLHttpRequest();
      // request.timeout = 500; // 超时
      request.open("post", "/cs/remove_note", true);
      request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      request.onload = () => {
        if (request.status != 200) return;
        var resp = JSON.parse(request.responseText);
        if (resp?.removed) {
          this.node.CSupdateModelConfig(this.model.name);
          this.$message(item.name + " " + this.$t("home.modelDetail.workflow.deleteNoteSuccess"));
        } else {
          this.$message(item.name + " " + this.$t("home.modelDetail.workflow.deleteNoteFail"));
        }
      };
      let mtype = this.node.CSgetModelWidgetType();
      let body = { mtype: mtype, mname: this.model?.name, note: item, name: item.name };
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
                <button @click="displayForm(true, 'workflow')">{{$t('home.modelDetail.workflow.addWorkflowButtonText')}}</button>
              </div>
              <div class="workflow_notes">
                <div class="search_area">
                  <div class="search">
                    <input type="value" v-model="note_value" :placeholder="$t('home.head.search')" @keydown="handleKeyDown($event)" />
                    <span @click="handleNoteSearch"><em class="iconfont icon-search"></em></span>
                  </div>
                  <div v-if="note_key" class="search_key">
                    <p>{{$t('home.searchValue')}} : {{this.note_key}}</p>
                  </div>
                </div>

                <div v-if="notes.length > 0 && filterNoteList.length > 0" class="note_list">
                  <div v-for="(item,index) in filterNoteList" :key="index" :class="['note_item', { selected: item.name === note_selected }]" @click="selectNote(item)">
                    <div class="note_header">
                      <span class="name">{{item.name}}</span>
                      <div class="option">
                        <em class="iconfont icon-copy" @click.stop="copyNote(item)" :title="$t('home.modelDetail.workflow.copyNote')"></em>
                        <em class="iconfont icon-delete" @click.stop="deleteNote(index,item)" :title="$t('home.modelDetail.workflow.delete')"></em>
                      </div>
                    </div>
                    <textarea
                      v-if="item.name === note_selected" 
                      v-model="item.content"
                      @input="autoContentResize($event)"
                      @blur="saveContent(item)"
                      class="note-content-editor"
                      ref="textarea"
                      >
                    </textarea>
                  </div>
                </div>
                <div v-else-if="list.length > 0 && filterNoteList.length === 0" class="empty_note">
                    {{$t('noResult')}}
                </div>
                <div v-else-if="notes.length === 0" class="empty_note">
                 {{ $t('home.modelDetail.workflow.noNoteTip')}}
                </div>
                <button @click="displayForm(true, 'note')">{{$t('home.modelDetail.workflow.addNoteButtonText')}}</button>
              </div>
              <WorkflowForm v-show="isShowForm" @saveWorkflow="saveWorkflow" @saveNote="saveNote" :saveType="saveType" @displayForm="displayForm" />
             </div>`,
};
