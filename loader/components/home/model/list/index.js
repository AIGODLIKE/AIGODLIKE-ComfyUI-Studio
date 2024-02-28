import { getLevelInf } from "../../../../static/js/public.js";

export default {
  props: ["curList", "selectedModel", "column"],
  data() {
    return {
      defaultCover: "./static/image/default.jpg",
    };
  },
  mounted() {},
  methods: {
    // Use selected items
    useModel(model) {
      this.$emit("useModel", model);
    },
    // Change selected items
    changeModel(model) {
      this.$emit("changeSelectedModel", model);
    },
    // Obtain color values based on level
    levelInf(level) {
      return getLevelInf(level).color || "#808080";
    },
  },
  template: `
              <div class="model_list" :style="{'--column':column}">
                  <div v-for="(item,index) in curList" :key = index class="model_item" :class="{'selected':item === selectedModel }" @click="changeModel(item)" @dblclick="useModel(item)" >
                      <div class="img_container" :style="{'--height': (73.05 - (column * 0.55)) / column + 'vw' }">
                         <img :src="item.cover || defaultCover" alt="cover" />
                      </div>
                      <div class="model_des" :style="{'--height':6 / column * 3 + 'vw'}">
                          <div class="level" :style="{'background':levelInf(item.level)}">{{item.level}}</div>
                          <div class="text_des">
                              <p :title="item.name">{{item.name}}</p>
                              <p :title="item.type">{{item.type}}</p>
                          </div>
                      </div> 
                  </div>
              </div>
  `,
};
