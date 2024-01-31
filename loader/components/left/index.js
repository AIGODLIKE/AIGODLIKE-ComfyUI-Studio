// fake vue: avoid pre load error
if (typeof Vue === "undefined") {
  var Vue = {
    component: function () {},
    prototype: {
      $message: function () {},
    },
  };
}

Vue.component("Left", {
  props: ["title"],
  data() {
    return {
      selectedIndex: 0,
      list: [
        {
          icon: "icon-home",
          path: "/home",
        },
        {
          icon: "icon-setting",
          path: "/settings",
        },
      ],
    };
  },
  computed: {
    language() {
      return this.$store.state.config.language;
    },
  },
  methods: {
    // Change the selected menu
    changeMenu(item, index) {
      this.selectedIndex = index;
      this.$router.push(item.path);
    },
    // Change language
    changeLanguage(language) {
      this.$i18n.locale = language;
      this.$store.commit("config/updateLanguage", language);
    },
  },
  template: `<div class="left_menu">
                <img class="item" src="./static/image/logo.webp">
                <ul>
                    <li v-for="(item,index) in list" :key=index class="item" :class="{selected:index === selectedIndex}"
                        @click="changeMenu(item,index)">
                        <em class ="iconfont" :class="item.icon"></em>
                    </li>
                </ul>
                <div class="language">
                  <span v-if="language === 'cn'"  @click="changeLanguage('tc')">简</span>
                  <span v-if="language === 'tc'"  @click="changeLanguage('en')">繁</span>
                  <span v-if="language === 'en'"  @click="changeLanguage('cn')">EN</span>
                </div>
            </div>`,
});
