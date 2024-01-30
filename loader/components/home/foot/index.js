export default {
  props: {
    allList: {
      default: () => {
        return [];
      },
      type: Array,
    },
    footShow: {
      default: false,
      type: Boolean,
    }
  },
  watch: {
    allList: {
      handler(newValue) {
        this.updateCount(newValue);
      },
      immediate: true,
      deep: true,
    },
    footShow: {
      handler(newValue) {
        if (newValue) {
          this.show();
        } else {
          this.hide();
        }
      },
      immediate: true,
      deep: true,
    }
  },
  data() {
    let renderer = window.parent.app.CSIconRender;
    if (renderer) {
      renderer.progress_value_setter = (value) => {
        this.progress = value * 100;
      };
    }
    return {
        modelCount: 9999999,
        noThumbnailCount: 0,
        progress: 0,
    };
  },
  methods: {
    // hide the footer
    hide() {
    },
    // show the footer
    show() {
    },
    // Update the model count / preview count
    updateCount(allList) {
      this.modelCount = allList.length;
      this.noThumbnailCount = allList.filter((item) => !item.cover).length;
    },
    // Make span text
    makeSpanText() {
      let fmt = this.$t("home.foot.text", { modelCount: this.modelCount, noThumbnailCount: this.noThumbnailCount });
      return fmt;
    },
    // Get the percentage of models without thumbnails
    getWithThumbnailPercent() {
      return (1 - this.noThumbnailCount / this.modelCount) * 100;
    },
  },
  template: `<div class="foot">
                <span>{{makeSpanText()}}</span>
                <div class="progress">
                    <div class="value" :style="{'width':progress + '%'}"></div>
                </div>
             </div>`,
};
