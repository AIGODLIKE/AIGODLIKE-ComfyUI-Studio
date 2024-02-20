export default {
  name: "BasicInf",
  props: {
    model: {
      default: () => {
        return {};
      },
      type: Object,
    },
  },

  data() {
    return {
      tagValue: "",
      isEditTagInput: false,
    };
  },

  methods: {
    //Timestamp conversion
    timestampConversion(timeStamp) {
      const date = new Date(Number(timeStamp));
      return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ": " + date.getMinutes();
    },
    // Delete tag
    deleteTag(index) {
      this.$emit("deleteTag", index);
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
    // Enter event for tag input box
    handleKeyDown(e) {
      if (e.key === "Enter") {
        this.createTag();
      }
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
  },
  filters: {
    // 保留小数位数->str
    numberRound(num, decimal = 2) {
      return Math.round(num * Math.pow(10, decimal)) / Math.pow(10, decimal);
    },
  },
  template: `<div class="basic_inf">
                <div class="model_inf">
                  <div class="size inf_item">
                    <span>{{$t("home.modelDetail.basicInf.size")}}</span>
                    <span>{{(model?.size || 0) | numberRound}} MB</span>
                  </div>
                  <div class="type inf_item">
                    <span>{{$t("home.modelDetail.basicInf.type")}}</span>
                    <span>{{model?.type || '未知'}}</span>
                  </div>
                  <div class="create_time inf_item">
                    <span>{{$t("home.modelDetail.basicInf.creationTime")}}</span>
                    <span>{{ timestampConversion(model?.creationTime)  || null}}</span>
                  </div>
                  <div class="modify_time inf_item">
                    <span>{{$t("home.modelDetail.basicInf.modificationTime")}}</span>
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
             </div>`,
};
