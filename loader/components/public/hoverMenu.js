const styleInnerHtml = `
.hover_menu {
  cursor: pointer;
  position: relative;
  padding: 0.5vw 0.9vw;
  background: #383838;
  border-radius: 0.4vw;
  transition: 0.3s;
  font-weight:bold;
}
.hover_menu .default_value {
  cursor: pointer;
  width: 100%;
  height: 100%;
}
.hover_menu:hover {
  background: #2a82e4;
}
.hover_menu:hover ul {
  max-height: 500px;
  background: #383838;
  box-shadow:0 0 3px 1px #383838;
}
.hover_menu .default_value em {
  margin-right: 0.3vw;
  font-size: 1rem;
}
.hover_menu ul {
  max-height: 0;
  overflow: hidden;
  position: absolute;
  right: 0;
  bottom: 0;
  transform: translateY(102%);
  padding: 0.3vw 0.3vw;
  display: grid;
  grid-gap: 0.2vw;
  background: #38383800;
  border-radius: 0.36vw;
  transition: max-height 0.3s, background 0.3s;
}
.hover_menu ul li {
  cursor: pointer;
  color: #ffffff;
  padding: 0.2vw 0.8vw;
  transition: background 0.3s;
  border-radius: 0.3vw;
  white-space:nowrap;
  display:flex;
  justify-content: flex-end;
}
.hover_menu ul li:hover {
  background: #1f1f1f;
}
  `;
export default {
  props: {
    icon: {
      default: "",
      type: String,
    },
    value: {
      default: 0,
      type: Number,
    },
    list: {
      default: () => {
        return [];
      },
      type: Array,
    },
    fontSize: {
      default: "1rem",
      type: String,
    },
  },
  data() {
    return {
      index: 0,
      isExpand: false,
    };
  },
  watch: {
    value(newValue) {
      this.selectItem(newValue);
    },
  },
  mounted() {
    const style = document.createElement("style");
    style.innerHTML = styleInnerHtml;
    this.$refs.hoverMenu.appendChild(style);
    this.selectItem(this.value);
  },
  methods: {
    selectItem(index) {
      this.index = index;
      this.$emit("changeValue", index);
    },
  },
  template: `<div ref="hoverMenu" class="hover_menu" :style="{fontSize: fontSize}">
                <div class="default_value">
                    <em v-if="icon" class="iconfont" :class="icon"></em> 
                    {{list[index]?.name || ''}}
                </div>
                <ul >
                    <li v-for="(item,index) in list" :key="index" @click="selectItem(index)">
                       {{item.name}}
                    </li>
                </ul>
            </div>`,
};
