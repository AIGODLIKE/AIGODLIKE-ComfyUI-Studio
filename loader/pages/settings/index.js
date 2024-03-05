import Language from "../../components/settings/language/index.js";
import ModelShield from "../../components/settings/modelShielding/index.js";
import windowing from "../../components/settings/windowing/index.js";

export default {
  name: "Settings",
  components: {
    Language,
    ModelShield,
    windowing,
  },
  data() {
    return {};
  },
  methods: {},
  template: `<div class="settings_page">
              <div class="content_wrapper">
                <div class="content">
                  <Language />
                  <ModelShield />
                  <windowing />
                </div>
              </div>
              <div class="foot"></div>
            </div>`,
};
