export default {
  data() {
    return {
      windowList: [
        {
          name: "全屏",
          value: "full",
        },
        {
          name: "窗口化",
          value: "noFull",
        },
      ],
    };
  },
  computed: {
    windowing() {
      return this.$store.state.config.windowing;
    },
  },
  methods: {
    // Change window
    changeWindow(value) {
      this.$store.commit("config/updateWindowing", value);
    },
  },
  template: `<div class="setting_items">
               <h1>{{$t("settings.window.title") || '标题'}}</h1>
               <p>{{$t("settings.window.describe") || '描述'}}<p>
               <div class="window_list">
                <div v-for="item in $t('settings.window.list')" :key="item.value" class="window_item" :class="{'selected':windowing === item.value}" @click="changeWindow(item.value)">
                    {{item.name}}</div>
               </div>
            </div>`,
};
