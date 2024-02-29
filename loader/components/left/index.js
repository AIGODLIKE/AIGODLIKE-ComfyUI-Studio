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
      rotationList: [
        {
          value: 0,
          icon: "icon-home",
          name: "All",
          type: "All",
        },
        {
          value: 1,
          icon: "icon-checkpoint",
          name: "Checkpoint",
          type: "checkpoints",
        },
        {
          value: 2,
          icon: "icon-vae",
          name: "VAE",
          type: "vae",
        },
        {
          value: 3,
          icon: "icon-clip-version",
          name: "CLIP Vision",
          type: "clip_vision",
        },
        {
          value: 4,
          icon: "icon-gligen",
          name: "GLIGEN",
          type: "gligen",
        },
        {
          value: 5,
          icon: "icon-control",
          name: "ControlNET",
          type: "controlnet",
        },
        {
          value: 6,
          icon: "icon-lora",
          name: "LoRA",
          type: "loras",
        },
        {
          value: 7,
          icon: "icon-style-model",
          name: "StyleModel",
          type: "style_models",
        },
        {
          value: 8,
          icon: "icon-upscale",
          name: "Upscale",
          type: "upscale_models",
        },
        {
          value: 9,
          icon: "icon-hyper",
          name: "HyperNetwork",
          type: "hypernetworks",
        },
        {
          value: 10,
          icon: "icon-clip",
          name: "CLIP",
          type: "clip",
        },
        {
          value: 11,
          icon: "icon-unet",
          name: "UNET",
          type: "unet",
        },
        {
          value: 12,
          icon: "icon-diffuser",
          name: "Diffuser",
          type: "diffusers",
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
    rotationIcon() {
      let icon = this.rotationList.find((x) => x.type === this.node?.CSgetModelWidgetType());
      if (!icon) {
        icon = this.rotationList[0];
      }
      return icon;
    },
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
