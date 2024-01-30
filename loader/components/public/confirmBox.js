const styleInnerHtml = `
@keyframes confirmEnter {
	0% {
		opacity: 0;
		height: 0;
	}

	100% {
		opacity: 1;
		height: 10.8vw;
	}
}

.confirm_mask_box {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	z-index: 9999;
	background: #1818186b;
	display: flex;
	justify-content: center;
	align-items: center;
}

.confirm_mask_box .confirm_area {
	width: 100%;
	background: #1a1b1c;
	padding: 2vw;
	height: 10.8vw;
  min-height:165px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 3px 1px #ffffff50;
	overflow: hidden;
	animation: confirmEnter 0.2s forwards;
}

.confirm_mask_box .confirm_area .describe {
  font-size: 1.2em;
	font-weight: bold;
	color: #ffffff;
}

.confirm_mask_box .confirm_area .button_group {
	display: flex;
	margin-top: 2vw;
}

.confirm_mask_box .confirm_area .button_group .button_item {
	height: 2.2vw;
	min-height: 40px;
	background: #383838;
	transition: 0.2s;
	display: flex;
	justify-content: space-between;
	align-items: center;
	white-space: nowrap;
	cursor: pointer;
}

.confirm_mask_box .confirm_area .button_group .button_item .icon {
	width: 1.5vw;
	height: 1.5vw;
  min-height:23px;
  min-width:23px;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: 0.2s;
	border-radius: 50%;
}
.confirm_mask_box .confirm_area .button_group .button_item .icon em {
  font-size:1rem;
}
.confirm_mask_box .confirm_area .button_group .button_item .text {
	font-size: 1rem;
}

.confirm_mask_box .confirm_area .button_group .accept {
	border-radius: 2vw 0 0 2vw;
	padding: 0 1vw 0 0.5vw;
}

.confirm_mask_box .confirm_area .button_group .accept .icon {
	margin-right: 1.5vw;
	background: #43cf7c;
}

.confirm_mask_box .confirm_area .button_group .accept:hover {
	background: #43cf7c;
	color: #ffffff;
}

.confirm_mask_box .confirm_area .button_group .accept:hover .icon {
	background: #383838;
}

.confirm_mask_box .confirm_area .button_group .refuse {
	border-radius: 0 2vw 2vw 0;
	padding: 0 0.5vw 0 1vw;
}

.confirm_mask_box .confirm_area .button_group .refuse .icon {
	margin-left: 1.5vw;
	background: #ff5733;
}

.confirm_mask_box .confirm_area .button_group .refuse:hover {
	background: #ff5733;
	color: #ffffff;
}

.confirm_mask_box .confirm_area .button_group .refuse:hover .icon {
	background: #383838;
}

  
`;

export default {
  name: "ConfirmBox",
  data() {
    return {
      accept: null,
      refuse: null,
      describe: "你确定要退出当前操作吗",
    };
  },
  mounted() {
    const style = document.createElement("style");
    style.innerHTML = styleInnerHtml;
    this.$refs.confimrBox.appendChild(style);
  },
  methods: {
    determine() {
      this.accept && this.accept();
      this.$destroy();
      this.$el.parentNode.removeChild(this.$el);
    },
    cancel() {
      this.refuse && this.refuse();
      this.$destroy();
      this.$el.parentNode.removeChild(this.$el);
    },
  },
  template: `  <div ref="confimrBox" class="confirm_mask_box">
  <div
    class="confirm_area"
  >
    <div class="describe" v-html="describe"></div>
    <div class="button_group">
        <div class="accept button_item"  @click="determine">
            <span class="icon"> <em class="iconfont icon-yes"></span>
            <span class="text">确认</span>
        </div>
        <div class="refuse button_item" @click="cancel">
          <span class="text">取消</span>
          <span class="icon"> <em class="iconfont  icon-no"></span>
        </div>
    </div>
  </div>
</div>`,
};
