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
      rotationIcon: {},
      rotationList: [
        {
          value: 0,
          icon: "icon-home",
          name: "All",
        },
        {
          value: 1,
          icon: "icon-checkpoint",
          name: "Checkpoint",
        },
        {
          value: 2,
          icon: "icon-vae",
          name: "VAE",
        },
        {
          value: 3,
          icon: "icon-clip-version",
          name: "CLIP Vision",
        },
        {
          value: 4,
          icon: "icon-gligen",
          name: "GLIGEN",
        },
        {
          value: 5,
          icon: "icon-control",
          name: "ControlNET",
        },
        {
          value: 6,
          icon: "icon-lora",
          name: "LoRA",
        },
        {
          value: 7,
          icon: "icon-style-model",
          name: "StyleModel",
        },
        {
          value: 8,
          icon: "icon-upscale",
          name: "Upscale",
        },
        {
          value: 9,
          icon: "icon-hyper",
          name: "HyperNetwork",
        },
        {
          value: 10,
          icon: "icon-clip",
          name: "CLIP",
        },
        {
          value: 11,
          icon: "icon-unet",
          name: "UNET",
        },
        {
          value: 12,
          icon: "icon-diffuser",
          name: "Diffuser",
        },
      ],
    };
  },
  watch: {
    $route: {
      handler(newRoute) {
        const pathList = [
          {
            path: "/home",
            value: 0,
          },
          {
            path: "/settings",
            value: 1,
          },
        ];
        this.selectedIndex = -1;
        for (const item of pathList) {
          if (newRoute.path.includes(item.path)) {
            this.selectedIndex = item.value;
          }
        }
      },
      immediate: true,
    },
  },
  computed: {
    language() {
      return this.$store.state.config.language;
    },
  },
  created() {
    this.rotationIcon = this.rotationList.find((x) => x.value === 0);
  },
  methods: {
    jumpPage(page) {
      this.$router.push(page);
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
                    <li class="item" :class="{selected:selectedIndex === 0}"
                        @click="jumpPage('/home')" :title="rotationIcon.name">
                        <em class="iconfont" :class="rotationIcon.icon"></em>
                        <span>{{rotationIcon.name}}</span>
                    </li>
                    <li class="item" :class="{selected:selectedIndex === 1}" @click="jumpPage('/settings')">
                      <em class ="iconfont icon-setting"></em>
                    </li>
                </ul>
                <div class="language">
                  <span v-if="language === 'cn'"  @click="changeLanguage('tc')">简</span>
                  <span v-if="language === 'tc'"  @click="changeLanguage('en')">繁</span>
                  <span v-if="language === 'en'"  @click="changeLanguage('cn')">EN</span>
                </div>
            </div>`,
});
