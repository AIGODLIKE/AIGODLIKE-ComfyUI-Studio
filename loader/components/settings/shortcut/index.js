export default {
  data() {
    return {
      shortcutList: [
        {
          name: "LeftClick",
          value: "click",
        },
        {
          name: "Shift + LeftClick",
          value: "shift_click",
        },
      ],
      selectedShortcut: "click"
    };
  },
  computed: {
    shortcut() {
      return this.$store.state.config.shortcut;
    },
  },
  methods: {
    // Change shortcut
    changeShortcut(shortcut) {
      this.$store.commit("config/updateShortcut", shortcut);
    },
  },
  template: `<div class="shortcut setting_items">
               <h1>{{$t("settings.shortcut.title")}}</h1>
               <p>{{$t("settings.shortcut.describe")}}<p>
               <div class="shortcut_list">
                <div v-for="item in shortcutList" :key="item.value" class="shortcut_item" :class="{'selected':shortcut === item.value}" @click="changeShortcut(item.value)">
                    {{item.name}}</div>
               </div>
            </div>`,
};
