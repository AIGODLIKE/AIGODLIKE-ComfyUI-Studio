export default {
  props: {
    allList: {
      default: () => {
        return [];
      },
      type: Array,
    },
  },
  watch: {
    allList: {
      handler(newValue) {
        this.updateCount(newValue);
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      modelCount: 9999999,
      noThumbnailCount: 0,
    };
  },
  computed: {
    progress() {
      return this.renderer?.progress_value;
    },
  },
  methods: {
    // Update the model count / preview count
    updateCount(allList) {
      this.modelCount = allList.length;
      this.noThumbnailCount = allList.filter((item) => !item.cover).length;
    },
    // Make span text
    makeSpanText() {
      let fmt = this.$t("home.foot.text", { modelCount: this.modelCount, noThumbnailCount: this.noThumbnailCount, taskIndex: this.renderer?.task_index, taskCount: this.renderer?.task_count});
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
