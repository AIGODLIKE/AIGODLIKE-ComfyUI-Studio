// import { api } from "/scripts/api.js";

function getApi() {
  const api = window.comfyAPI.api.api;
  api.api_base = "";
  return api;
}

async function update_filter(filter, loader, old_data) {
  try {
    const body = new FormData();
    body.append("data", JSON.stringify(filter));
    body.append("old_data", JSON.stringify(old_data));
    body.append("loader", loader);
    const api = getApi();
    api.fetchApi("/cs/update_filter", { method: "POST", body });
  } catch (error) {
    alert(error);
  }
}
export default {
  data() {
    return {
      list: [],
      value: "",
      isAddModel: false,
      selectedData: {},
    };
  },
  watch: {
    nodeId: {
      handler() {
        this.list = this.node?.CSgetModelFilters() || [];
      },
      immediate: true,
    },
  },
  methods: {
    // Delete blocked model names
    deleteModel(data, index) {
      let old_data = [...data.modelList];
      data.modelList.splice(index, 1);
      update_filter(data.modelList, data.name, old_data);
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
      let old_data = [...this.selectedData.modelList];
      this.selectedData.modelList.push(this.value);
      update_filter(this.selectedData.modelList, this.selectedData.name, old_data);
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
                                    <div v-for="(model,modelIndex) in loader.modelList" :key="model" class="model">
                                        {{ model }}
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
                            <input ref="modelInput" type="text" v-model="value" maxlength="256"  @keydown="handleKeyDown($event)" :placeholder="$t('settings.modelShield.blockInputBoxText')" focus />
                            <div class="button_group">
                                <button @click="addName">{{$t('settings.modelShield.confirmText')}}</button>
                                <button @click="cancelEdit">{{$t('settings.modelShield.cancelText')}}</button>
                            </div>
                        </div>
                     
                    </div>
                </div>
            </div>`,
};
