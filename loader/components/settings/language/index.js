export default {
  data() {
    return {
      languageList: [
        {
          name: "简体中文",
          value: "cn",
        },
        {
          name: "ENGLISH",
          value: "en",
        },
        {
          name: "繁体中文",
          value: "tc",
        },
      ],
      selectedLanguage: "cn",
    };
  },
  computed: {
    language() {
      return this.$store.state.config.language;
    },
  },
  methods: {
    // Change language
    changeLanguage(language) {
      this.$i18n.locale = language;
      this.$store.commit("config/updateLanguage", language);
    },
  },
  template: `<div class="language setting_items">
               <h1>{{$t("settings.language.title")}}</h1>
               <p>{{$t("settings.language.describe")}}<p>
               <div class="language_list">
                <div v-for="item in languageList" :key="item.value" class="language_item" :class="{'selected':language === item.value}" @click="changeLanguage(item.value)">
                    {{item.name}}</div>
               </div>
            </div>`,
};
