export default {
  data() {
    return {
      value: "",
      isAddModel: false,
      list: [
        {
          name: " Checkpoint Loader",
          modelList: [
            { name: "Q.ckpt" },
            { name: "c.ckpt" },
            { name: "d.ckpt" },
          ],
        },
        {
          name: " BBCF Loader",
          modelList: [
            { name: "Q.ckpt" },
            { name: "c.ckpt" },
            { name: "d.ckpt" },
          ],
        },
      ],
      selectedData: {},
    };
  },
  methods: {
    // Delete blocked model names
    deleteModel(data, index) {
      data.modelList.splice(index, 1);
    },
    // Enter to trigger the add masking model event
    handleKeyDown(e) {
      if (e.key === "Enter") {
        this.addName();
      }
    },
    // Open the masked model input box
    editInput(index) {
      this.selectedData = this.list[index];
      this.isAddModel = true;
      this.$nextTick(() => {
        this.$refs.modelInput.focus();
      });
    },
    // Add shielding model name
    addName() {
      if (!this.value) {
        this.$message({
          type: "error",
          message: this.$t("messages.fileNameError"),
        });
        return;
      }
      if (this.selectedData.modelList.find((x) => x.name === this.value)) {
        this.$message({
          type: "error",
          message: this.$t("messages.fileNameExists"),
        });
        return;
      }
      this.selectedData.modelList.push({ name: this.value });
      this.value = "";
      this.selectedData = {};
      this.isAddModel = false;
    },
    // Turn off blocking model input boxes
    cancelEdit() {
      this.value = "";
      this.selectedData = {};
      this.isAddModel = false;
    },
  },
  template: `<div class="model_shield setting_items">
                <h1>{{$t("settings.modelShield.title")}}</h1>
                <p>{{$t("settings.modelShield.describe")}}<p>
                <div class="shield_table">
                    <div class="title">
                        <div class="loader_name">{{$t("settings.modelShield.loaderName")}}</div>
                        <div class="shield_Model">{{$t("settings.modelShield.shieldingModel")}}</div>
                    </div>
                    <div class="list">
                        <div v-for="(loader,loaderIndex) in list" :key="loaderIndex" class="list_item">
                            <div class="item_name">{{loader.name}}</div>
                            <div class="shield_model_list">
                                <div class="list_area">
                                    <div v-for="(model,modelIndex) in loader.modelList" :key="model.name" class="model">
                                        {{ model.name }}
                                    <em class="iconfont icon-close"  @click="deleteModel(loader,modelIndex)"></em>
                                    </div>
                                    <div class="add_icon" @click="editInput(loaderIndex)">
                                        <em class="iconfont icon-add"></em>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="isAddModel" class="model_input">
                    <div class="input_area">
                        <p class="loader_name">{{selectedData.name || loader名称 }}</p>
                        <div class="input_box">
                            <input ref="modelInput" type="text" v-model="value" maxlength="32"  @keydown="handleKeyDown($event)" :placeholder="$t('settings.modelShield.blockInputBoxText')" focus />
                            <div class="button_group">
                                <button @click="addName">{{$t('settings.modelShield.confirmText')}}</button>
                                <button @click="cancelEdit">{{$t('settings.modelShield.cancelText')}}</button>
                            </div>
                        </div>
                     
                    </div>
                </div>
            </div>`,
};
