import { getLevelInf } from "../../../../static/js/public.js";
import { api } from "/scripts/api.js";
import IconRenderer from "../../../public/iconRenderer.js";
const ext = {
  is_rendering: false,
  name: "ComfyUI-Studio.model.detail",
  async setup(app) {
    if (!app.CSIconRender) {
      app.CSIconRender = new IconRenderer(app);
    }
  },
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
  props: ["model"],
  data() {
    return {
      list: [],
      levelList: [],
      tagValue: "",
      isReadonly: true,
      selectedLevel: "D",
      isEditTagInput: false,
    };
  },
  created() {
    this.getLevelColor();
  },
  watch: {
    model: {
      handler(newValue) {
        this.selectedLevel = newValue.level;
      },
      deep: true,
    },
  },
  methods: {
    // Click to trigger name modification
    editName() {
      this.isReadonly = false;
      this.$nextTick(() => {
        this.$refs.nameInput.focus();
      });
    },
    nameInputKeyDown(e) {
      if (e.key === "Enter") {
        this.changeName(e);
      } else if (e.key === "Escape") {
        this.isReadonly = true;
        e.preventDefault();
        e.stopPropagation();
      }
    },
    // Submit a new name
    changeName(e) {
      e.preventDefault();
      this.isReadonly = true;
      const value = this.$refs.nameInput.value;
      if (value) {
        this.$emit("modifyName", this.model, value);
      }
    },
    // Trigger when the name input box blur
    blurInput() {
      this.isReadonly = true;
    },
    // Change level
    changeLevel(levelInf) {
      this.selectedLevel = levelInf.value;
      this.$emit("changeLevel", levelInf.value);
    },
    // Obtain the corresponding color based on the current level
    getLevelColor() {
      const list = ["S", "A", "B", "C", "D"];
      list.forEach((item) => {
        this.levelList.push(getLevelInf(item));
      });
      this.selectedLevel = this.model.level;
    },
    // Create a tag
    createTag() {
      if (this.checkTagLegality()) {
        this.$emit("addTag", this.tagValue);
        this.tagValue = "";
        this.isEditTagInput = false;
      }
    },
    // Legality of detecting tags
    checkTagLegality() {
      if (this.tagValue === "") {
        return false;
      }
      if (this.model.tags.find((x) => x === this.tagValue)) {
        this.$message({
          type: "error",
          message: this.$t("messages.tagExists"),
        });
        return false;
      }
      return true;
    },
    // Enter event for tag input box
    handleKeyDown(e) {
      if (e.key === "Enter") {
        this.createTag();
      }
    },
    // Delete tag
    deleteTag(index) {
      this.$emit("deleteTag", index);
    },
    // Click to use
    useModel() {
      this.$emit("useModel", this.model);
    },
    // Focus event of tag input box
    editTagInput() {
      if (!this.isEditTagInput) {
        this.isEditTagInput = true;
        this.$nextTick(() => {
          const tagInput = this.$refs.tagInput;
          tagInput.focus();
        });
      }
    },
    // Blur event of tag input box
    tagInputBlur() {
      if (this.checkTagLegality()) {
        this.$emit("addTag", this.tagValue);
      }
      this.tagValue = "";
      this.isEditTagInput = false;
    },
    //Timestamp conversion
    timestampConversion(timeStamp) {
      const date = new Date(Number(timeStamp));
      return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ": " + date.getMinutes();
    },
    // Rendering an image
    renderPic() {
      if (this.model) {
        let renderer = window.parent.app.CSIconRender;
        renderer.render(window._node, [this.model]);
      }
    },
    // Click to trigger the image acquisition event
    modifyCover() {
      document.getElementById("file_input").click();
    },
    // Change cover image path
    inputCover(e) {
      const file = e.target.files[0];
      const isImage = file.type.startsWith("image");
      if (!isImage) {
        this.$message({ type: "error", message: "请选择图片格式文件" });
        return;
      }
      if (file) {
        try {
          const body = new FormData();
          body.append("image", file);
          body.append("type", this.model.type);
          body.append("mtype", this.model.mtype);
          body.append("name", this.model.name);
          api.api_base = "";
          api.fetchApi("/cs/upload_thumbnail", { method: "POST", body });
        } catch (error) {
          alert(error);
        }
        const filepath = URL.createObjectURL(file);
        this.$emit("modifyCover", filepath);
      }
    },
  },
  filters: {
    // 保留小数位数->str
    numberRound(num, decimal = 2) {
      return Math.round(num * Math.pow(10, decimal)) / Math.pow(10, decimal);
    },
  },
  template: `
            <div v-if="model" class="model_detail">
              <div class="img_container">
                <img :src="model.cover" />
                <div class="option_group">
                  <span class="icon_container" @click="renderPic"><em class="iconfont icon-camera"></em></span>
                  <span class="block"></span>
                  <span class="icon_container" @click="modifyCover"><em class="iconfont icon-upload"></em></span>
                  <input type="file" id="file_input" accept="image/*" @change="inputCover($event)" />
                </div>
              </div>
              <div v-if="isReadonly" class="model_name" @click="editName" title="点击修改"><p>{{model.name}}</p></div>
              <div v-else class="name_input">
                <input ref="nameInput" type="value" :value="model.name" @blur="blurInput"  @keydown="nameInputKeyDown"/>
                <span @mousedown="changeName($event)"><em class="iconfont icon-edit"></em></span> 
              </div>
              <div class="level_group">
                <span v-for="(item, index) in levelList" :key="index" class="level_item" :class="{selected:selectedLevel === item.value}" :style="{'--color':item.color}" @click="changeLevel(item)">{{item.value}}</span>
              </div>
              <div class="model_inf">
                <p>{{$t("home.modelDetail.title")}}</p>
                <div class="size inf_item">
                  <span>{{$t("home.modelDetail.size")}}</span>
                  <span>{{(model?.size || 0) | numberRound}} MB</span>
                </div>
                <div class="type inf_item">
                  <span>{{$t("home.modelDetail.type")}}</span>
                  <span>{{model?.type || '未知'}}</span>
                </div>
                <div class="create_time inf_item">
                  <span>{{$t("home.modelDetail.creationTime")}}</span>
                  <span>{{ timestampConversion(model?.creationTime)  || null}}</span>
                </div>
                <div class="modify_time inf_item">
                  <span>{{$t("home.modelDetail.modificationTime")}}</span>
                  <span>{{ timestampConversion(model?.modifyTime) || null}}</span>
                </div>
              </div>
              <div class="classify_input_container">
                <div class="classify_input">
                  <div v-for="(item, index) in model.tags" :key="item" class="tag">
                  {{ item }}
                 <em class="iconfont icon-close"  @click="deleteTag(index)"></em>
                </div>
                <div class="tag_input" @click="editTagInput" :class="{expand:isEditTagInput}">
                  <input
                    v-if="isEditTagInput"
                    ref="tagInput"
                    v-model="tagValue"
                    type="text"
                    placeholder="Enter"
                    maxlength="16"
                    @keydown="handleKeyDown($event)"
                    @blur="tagInputBlur"
                  />
                  <em class="iconfont icon-add"></em>
                </div>
                
                </div>
              </div>
              <button class="use_button" @click="useModel">{{$t("home.modelDetail.buttonText")}}</button>
          </div>
  `,
};
