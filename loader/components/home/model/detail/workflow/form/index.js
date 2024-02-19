export default {
  name: "WorkflowForm",
  data() {
    return {
      value: "",
    };
  },
  mounted() {},
  methods: {
    cancel() {
      this.$emit("displayForm", false);
    },
    determine() {
      this.$emit("displayForm", false);
    },
    clearInput() {
      this.value = "";
    },
  },
  template: `
            <div class="form">
              <div class="form_content">
                <p>{{$t("home.modelDetail.workflow.form.title")}}</p>
                <div class="input_area">
                  <input type="text" v-model="value" />
                  <span class="clear" :class="{'show_clear': value.length > 0}" @click="clearInput"><em class="iconfont icon-close"></em> </span>
                </div>
                <div class="button_group">
                  <div class="accept button_item" @click="determine">
                    <span class="icon"><em class="iconfont icon-yes"></span>
                    <span class="text">{{$t("home.modelDetail.workflow.form.confirmText")}}</span>
                  </div>
                  <div class="refuse button_item" @click="cancel">
                    <span class="text">{{$t("home.modelDetail.workflow.form.cancelText")}}</span>
                    <span class="icon"><em class="iconfont icon-no"></span>
                  </div>
                </div>
              </div>
            </div>
  `,
};
