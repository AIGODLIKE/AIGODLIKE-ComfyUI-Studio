import NoteForm from "../note/form/index.js";
export default {
  name: "Note",
  props: ["model"],
  components: { NoteForm },
  data() {
    return {
      value: "",
      key: "",
      list: [],
      note_selected: "",
      note_key: "",
      note_value: "",
      notes: [],
      isShowForm: false,
    };
  },
  watch: {
    model: {
      handler(model) {
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
    filterNoteList() {
      return this.notes.filter((x) => x.name?.includes(this.note_value));
    }
  },
  mounted() {
    this.handleNoteSearch();
  },
  methods: {
    // Enter key for search
    handleKeyDown(e) {
      if (e.key === "Enter") {
        this.handleNoteSearch();
      }
    },
    // Click to search
    handleNoteSearch() {
      this.note_key = this.note_value;
    },
    // Click add note
    displayForm(flag) {
      this.isShowForm = flag;
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
    cancelSelect(){
      this.note_selected = null;
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
          this.$message(name + " " + this.$t("home.modelDetail.note.saveNoteSuccess"));
        } else {
          this.$message(name + " " + this.$t("home.modelDetail.note.saveNoteFail"));
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
          this.$message(item.name + " " + this.$t("home.modelDetail.note.deleteNoteSuccess"));
        } else {
          this.$message(item.name + " " + this.$t("home.modelDetail.note.deleteNoteFail"));
        }
      };
      let mtype = this.node.CSgetModelWidgetType();
      let body = { mtype: mtype, mname: this.model?.name, note: item, name: item.name };
      request.send(JSON.stringify(body));
    },
  },
  template: `<div class="note">
              <div class="notes">
                <div class="search_area">
                  <div class="search">
                    <input type="value" v-model="note_value" :placeholder="$t('home.head.search')" @keydown="handleKeyDown($event)" />
                    <span @click="handleNoteSearch"><em class="iconfont icon-search"></em></span>
                  </div>
                  <div v-if="note_key" class="search_key">
                    <p>{{$t('home.searchValue')}} : {{this.note_key}}</p>
                  </div>
                </div>

                <div v-if="notes.length > 0 && filterNoteList.length > 0" class="note_list" @click="cancelSelect">
                  <div v-for="(item,index) in filterNoteList" :key="index" :class="['note_item', { selected: item.name === note_selected }]" @click.stop="selectNote(item)">
                    <div class="note_header">
                      <span class="name">{{item.name}}</span>
                      <div class="option">
                        <em class="iconfont icon-copy" @click.stop="copyNote(item)" :title="$t('home.modelDetail.note.copyNote')"></em>
                        <em class="iconfont icon-delete" @click.stop="deleteNote(index,item)" :title="$t('home.modelDetail.note.delete')"></em>
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
                 {{ $t('home.modelDetail.note.noNoteTip')}}
                </div>
                <button @click="displayForm(true)">{{$t('home.modelDetail.note.addNoteButtonText')}}</button>
              </div>
              <NoteForm v-show="isShowForm" @saveNote="saveNote" @displayForm="displayForm" />
             </div>`,
};
